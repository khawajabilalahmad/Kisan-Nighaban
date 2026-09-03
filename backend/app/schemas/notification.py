from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    title: str = Field(description="Title of the notification")
    message_en: str = Field(description="Message in English")
    message_ur: str = Field(description="Message in 'Roz Marra' Roman Urdu")
    is_read: bool = Field(default=False)

class NotificationResponse(NotificationBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
