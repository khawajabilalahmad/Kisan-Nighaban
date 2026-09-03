from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.activity import FarmActivity
from app.models.farm import Farm
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityResponse
from app.core.security import get_current_user

router = APIRouter()

@router.post("/farms/{farm_id}/activities", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def log_activity(farm_id: str, activity_in: ActivityCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # First verify the farm belongs to the user
    result = await db.execute(select(Farm).where(Farm.id == farm_id, Farm.owner_id == current_user.id))
    farm = result.scalars().first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found or not owned by user")

    new_activity = FarmActivity(**activity_in.model_dump(), farm_id=farm_id)
    db.add(new_activity)
    await db.commit()
    await db.refresh(new_activity)
    return new_activity

@router.get("/farms/{farm_id}/activities", response_model=List[ActivityResponse])
async def read_activities(farm_id: str, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify farm ownership
    result = await db.execute(select(Farm).where(Farm.id == farm_id, Farm.owner_id == current_user.id))
    farm = result.scalars().first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found or not owned by user")

    # Fetch activities, newest first
    result = await db.execute(
        select(FarmActivity)
        .where(FarmActivity.farm_id == farm_id)
        .order_by(FarmActivity.date_logged.desc())
        .offset(skip)
        .limit(limit)
    )
    activities = result.scalars().all()
    return activities
