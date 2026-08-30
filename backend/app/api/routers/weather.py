from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.farm import Farm
from app.services.weather_service import fetch_weather_forecast
from app.services.crop_profiles import compute_growth_stage

router = APIRouter()

@router.get("/{farm_id}")
async def get_farm_weather(farm_id: str, db: AsyncSession = Depends(get_db)):
    # 1. Fetch farm from DB
    result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = result.scalars().first()
    
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
        
    # 2. Fetch weather from Open-Meteo
    try:
        weather_data = await fetch_weather_forecast(farm.latitude, farm.longitude)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching weather data: {str(e)}")
        
    # 3. Compute growth stage
    current_stage = compute_growth_stage(farm.crop_type, farm.sowing_date)
    
    # 4. Return combined data
    return {
        "farm_id": farm.id,
        "crop_type": farm.crop_type,
        "current_growth_stage": current_stage,
        "weather": weather_data
    }
