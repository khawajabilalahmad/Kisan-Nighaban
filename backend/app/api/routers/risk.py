from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import date, datetime, timedelta
from typing import List
import logging
import json

from app.db.session import get_db
from app.models.farm import Farm
from app.models.risk_assessment import RiskAssessment
from app.models.activity import FarmActivity
from app.schemas.risk import RiskAssessmentOutput, RiskAssessmentResponse

from app.services.weather_service import fetch_weather_forecast
from app.services.crop_profiles import CROP_PROFILES, compute_growth_stage
from app.services.ai_service import generate_risk_assessment
from app.fallback.rule_based_risk import calculate_rule_based_risk

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/{farm_id}/assess", response_model=RiskAssessmentOutput)
async def assess_risk(farm_id: str, db: AsyncSession = Depends(get_db)):
    """
    Trigger a new risk assessment for a farm.
    Fetches weather, calculates growth stage, calls AI (with fallback), and saves to DB.
    """
    
    # 1. Fetch Farm
    result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = result.scalar_one_or_none()
    
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    # 2. Fetch Weather Data
    try:
        weather_data = await fetch_weather_forecast(farm.latitude, farm.longitude)
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.error(f"Failed to fetch weather data: {e}")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Weather service unavailable: {str(e)}")

    # 3. Get Crop Profile & Growth Stage
    crop_type_lower = farm.crop_type.lower()
    crop_profile = CROP_PROFILES.get(crop_type_lower)
    if not crop_profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Crop profile for '{farm.crop_type}' not found")
        
    growth_stage = compute_growth_stage(crop_type_lower, farm.sowing_date)
    growth_stage_day = (date.today() - farm.sowing_date).days
    
    # 4. Fetch Recent Activities (Last 5)
    activity_result = await db.execute(
        select(FarmActivity)
        .where(FarmActivity.farm_id == farm_id)
        .order_by(FarmActivity.date_logged.desc())
        .limit(5)
    )
    activities = activity_result.scalars().all()
    recent_activities = [
        {"activity_type": act.activity_type, "description": act.description, "date_logged": act.date_logged.isoformat()}
        for act in activities
    ]
    
    farm_details = {
        "water_source": farm.water_source,
        "soil_type": farm.soil_type
    }

    # 5. Generate Risk Assessment (AI with fallback)
    try:
        assessment_output = generate_risk_assessment(
            crop_type=farm.crop_type,
            crop_profile=crop_profile,
            weather_data=weather_data,
            growth_stage=growth_stage,
            growth_stage_day=growth_stage_day,
            farm_details=farm_details,
            recent_activities=recent_activities
        )
    except Exception as e:
        logger.warning(f"AI assessment failed: {e}. Falling back to rule-based logic.")
        assessment_output = calculate_rule_based_risk(
            crop_type=farm.crop_type,
            crop_profile=crop_profile,
            weather_data=weather_data,
            growth_stage=growth_stage,
            growth_stage_day=growth_stage_day,
            farm_details=farm_details,
            recent_activities=recent_activities
        )

    # 6. Save Assessment to Database
    new_assessment = RiskAssessment(
        farm_id=farm.id,
        risk_score=assessment_output.risk_score,
        risk_level=assessment_output.risk_level,
        risk_breakdown=assessment_output.risk_breakdown.model_dump(),
        recommendations=[rec.model_dump() for rec in assessment_output.recommendations],
        weather_snapshot=weather_data,
        growth_stage=assessment_output.growth_stage,
        mascot_daily_tip=assessment_output.mascot_daily_tip.model_dump() if assessment_output.mascot_daily_tip else None
    )
    
    db.add(new_assessment)
    await db.commit()
    await db.refresh(new_assessment)

    return assessment_output

@router.get("/{farm_id}/latest", response_model=RiskAssessmentResponse)
async def get_latest_risk(farm_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get the latest risk assessment for a specific farm.
    """
    # 1. Fetch Farm
    result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = result.scalar_one_or_none()
    
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    # 2. Fetch Latest Assessment
    result = await db.execute(
        select(RiskAssessment)
        .where(RiskAssessment.farm_id == farm_id)
        .order_by(RiskAssessment.assessed_at.desc())
        .limit(1)
    )
    latest_assessment = result.scalar_one_or_none()
    
    if not latest_assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No risk assessments found for this farm")
        
    return latest_assessment

@router.get("/{farm_id}/history", response_model=List[RiskAssessmentResponse])
async def get_risk_history(farm_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get the risk assessment history for a specific farm over the last 7 days.
    """
    # 1. Fetch Farm
    result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = result.scalar_one_or_none()
    
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    # 2. Fetch Assessments from the last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    result = await db.execute(
        select(RiskAssessment)
        .where(RiskAssessment.farm_id == farm_id)
        .where(RiskAssessment.assessed_at >= seven_days_ago)
        .order_by(RiskAssessment.assessed_at.desc())
    )
    
    history = result.scalars().all()
    
    return history
