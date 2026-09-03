import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import date

from app.database import AsyncSessionLocal
from app.models.farm import Farm
from app.models.farm_analysis import FarmAnalysis
from app.models.activity import FarmActivity
from app.models.notification import Notification
from app.services.weather_service import fetch_weather_forecast
from app.services.crop_profiles import CROP_PROFILES, compute_growth_stage
from app.services.ai_service import generate_farm_analysis
from app.fallback.rule_based_analysis import calculate_rule_based_analysis

logger = logging.getLogger(__name__)

async def run_daily_farm_analysis():
    """
    Background job that runs daily to analyze all farms and generate proactive notifications.
    """
    logger.info("Starting Daily Proactive Farm Analysis...")
    
    async with AsyncSessionLocal() as db:
        # 1. Fetch all farms
        result = await db.execute(select(Farm))
        farms = result.scalars().all()
        
        for farm in farms:
            try:
                # 2. Fetch Weather Data
                weather_data = await fetch_weather_forecast(farm.latitude, farm.longitude)
                
                # 3. Get Crop Profile & Growth Stage
                crop_type_lower = farm.crop_type.lower()
                crop_profile = CROP_PROFILES.get(crop_type_lower)
                if not crop_profile:
                    continue # Skip if no profile
                    
                growth_stage = compute_growth_stage(crop_type_lower, farm.sowing_date)
                growth_stage_day = (date.today() - farm.sowing_date).days
                
                # 4. Fetch Recent Activities (Last 5)
                activity_result = await db.execute(
                    select(FarmActivity)
                    .where(FarmActivity.farm_id == farm.id)
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
                
                # 5. Generate Farm Analysis
                try:
                    assessment_output = generate_farm_analysis(
                        crop_type=farm.crop_type,
                        crop_profile=crop_profile,
                        weather_data=weather_data,
                        growth_stage=growth_stage,
                        growth_stage_day=growth_stage_day,
                        farm_details=farm_details,
                        recent_activities=recent_activities
                    )
                except Exception as e:
                    logger.warning(f"AI assessment failed for farm {farm.id}: {e}. Falling back.")
                    assessment_output = calculate_rule_based_analysis(
                        crop_type=farm.crop_type,
                        crop_profile=crop_profile,
                        weather_data=weather_data,
                        growth_stage=growth_stage,
                        growth_stage_day=growth_stage_day,
                        farm_details=farm_details,
                        recent_activities=recent_activities
                    )
                
                # 6. Save Assessment to Database
                new_assessment = FarmAnalysis(
                    farm_id=farm.id,
                    health_score=assessment_output.health_score,
                    health_status=assessment_output.health_status,
                    analysis_breakdown=assessment_output.analysis_breakdown.model_dump(),
                    recommendations=[rec.model_dump() for rec in assessment_output.recommendations],
                    weather_snapshot=weather_data,
                    growth_stage=assessment_output.growth_stage,
                    mascot_daily_tip=assessment_output.mascot_daily_tip.model_dump() if assessment_output.mascot_daily_tip else None
                )
                db.add(new_assessment)
                
                # 7. Generate Proactive Notification if Health Score is high (>50)
                # i.e., there is a significant risk that the user needs to know about.
                if assessment_output.health_score > 50:
                    notification = Notification(
                        user_id=farm.owner_id,
                        title=f"Mascot Alert for {farm.name}!",
                        message_en=assessment_output.mascot_daily_tip.en if assessment_output.mascot_daily_tip else "Check your farm analysis.",
                        message_ur=assessment_output.mascot_daily_tip.ur if assessment_output.mascot_daily_tip else "Apne khet ki analysis check karen."
                    )
                    db.add(notification)
                    
            except Exception as e:
                logger.error(f"Error processing farm {farm.id}: {str(e)}")
                continue
                
        # Commit all new assessments and notifications
        await db.commit()
        logger.info("Daily Proactive Farm Analysis Completed.")

# Initialize scheduler
scheduler = AsyncIOScheduler()

def start_scheduler():
    # Run the job every morning at 6:00 AM
    scheduler.add_job(run_daily_farm_analysis, 'cron', hour=6, minute=0)
    scheduler.start()
    logger.info("Proactive Mascot Scheduler started.")
