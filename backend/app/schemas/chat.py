from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class ChatMessageBase(BaseModel):
    role: str = Field(description="'user' or 'model'")
    content: str = Field(description="The text content of the message")
    image_url: Optional[str] = Field(default=None, description="Optional path to an uploaded image")

class ChatMessageResponse(ChatMessageBase):
    id: str
    session_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatSessionResponse(BaseModel):
    id: str
    farm_id: str
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = []
    
    class Config:
        from_attributes = True
