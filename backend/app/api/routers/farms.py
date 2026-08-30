from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse

router = APIRouter()

@router.post("/", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
async def create_farm(farm_in: FarmCreate, db: AsyncSession = Depends(get_db)):
    new_farm = Farm(**farm_in.model_dump())
    db.add(new_farm)
    await db.commit()
    await db.refresh(new_farm)
    return new_farm

@router.get("/", response_model=List[FarmResponse])
async def read_farms(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Farm).offset(skip).limit(limit))
    farms = result.scalars().all()
    return farms

@router.get("/{farm_id}", response_model=FarmResponse)
async def read_farm(farm_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = result.scalars().first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm

@router.put("/{farm_id}", response_model=FarmResponse)
async def update_farm(farm_id: str, farm_in: FarmUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = result.scalars().first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    update_data = farm_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(farm, field, value)
        
    await db.commit()
    await db.refresh(farm)
    return farm

@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_farm(farm_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = result.scalars().first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    await db.delete(farm)
    await db.commit()
    return None
