from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr = Field(..., example="ali@example.com")
    mobile_number: str = Field(..., example="+923001234567")
    full_name: str = Field(..., example="Ali Khan")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: str
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
