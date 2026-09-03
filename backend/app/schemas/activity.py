from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ActivityBase(BaseModel):
    activity_type: str = Field(..., example="watered")
    description: Optional[str] = Field(None, example="Watered field for 2 hours via tubewell")

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: str
    farm_id: str
    date_logged: datetime

    class Config:
        from_attributes = True
