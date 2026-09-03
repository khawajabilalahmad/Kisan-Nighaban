from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class FarmBase(BaseModel):
    name: str = Field(..., example="North Field")
    crop_type: str = Field(..., example="wheat")
    sowing_date: date = Field(..., example="2024-11-01")
    latitude: float = Field(..., example=31.52)
    longitude: float = Field(..., example=74.36)
    district: Optional[str] = Field(None, example="Lahore")
    water_source: Optional[str] = Field(None, example="tubewell")
    soil_type: Optional[str] = Field(None, example="loam")

class FarmCreate(FarmBase):
    pass

class FarmUpdate(BaseModel):
    name: Optional[str] = None
    crop_type: Optional[str] = None
    sowing_date: Optional[date] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    district: Optional[str] = None
    water_source: Optional[str] = None
    soil_type: Optional[str] = None

class FarmResponse(FarmBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
