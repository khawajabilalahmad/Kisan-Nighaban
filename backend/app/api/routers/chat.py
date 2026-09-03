from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import os
import uuid
import json
from datetime import date

from app.db.session import get_db
from app.models.chat import ChatSession, ChatMessage
from app.models.farm import Farm
from app.models.activity import FarmActivity
from app.schemas.chat import ChatSessionResponse, ChatMessageResponse
from app.services.ai_service import generate_chat_reply
from app.services.weather_service import fetch_weather_forecast
from app.services.crop_profiles import compute_growth_stage

router = APIRouter()

UPLOAD_DIR = "uploads/chat_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/{farm_id}/history", response_model=ChatSessionResponse)
async def get_chat_history(farm_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get the chat history for a specific farm.
    If no session exists, creates an empty one.
    """
    # Verify farm
    farm_result = await db.execute(select(Farm).where(Farm.id == farm_id))
    if not farm_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Farm not found")

    # Fetch active session
    session_result = await db.execute(select(ChatSession).where(ChatSession.farm_id == farm_id))
    chat_session = session_result.scalar_one_or_none()

    if not chat_session:
        # Create a new session
        chat_session = ChatSession(farm_id=farm_id)
        db.add(chat_session)
        await db.commit()
        await db.refresh(chat_session)

    # Note: Messages are automatically joined due to relationship setup, but let's make sure it's loaded properly.
    # We will return it, Pydantic's from_attributes will handle the relationship.
    # To avoid lazy load issues in async context, we explicitly load messages
    from sqlalchemy.orm import selectinload
    session_result = await db.execute(
        select(ChatSession)
        .options(selectinload(ChatSession.messages))
        .where(ChatSession.id == chat_session.id)
    )
    full_session = session_result.scalar_one()

    return full_session

@router.post("/{farm_id}/message", response_model=ChatMessageResponse)
async def send_chat_message(
    farm_id: str,
    text: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Send a message to the AI Mascot. Supports text and an optional image upload.
    """
    # 1. Verify Farm & Fetch Context
    farm_result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = farm_result.scalar_one_or_none()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    # 2. Get or Create Session
    session_result = await db.execute(select(ChatSession).where(ChatSession.farm_id == farm_id))
    chat_session = session_result.scalar_one_or_none()
    if not chat_session:
        chat_session = ChatSession(farm_id=farm_id)
        db.add(chat_session)
        await db.commit()
        await db.refresh(chat_session)

    # 3. Handle Image Upload
    image_path = None
    image_url = None
    if image:
        # Secure filename
        ext = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        image_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(image_path, "wb") as f:
            content = await image.read()
            f.write(content)
            
        image_url = f"/static/uploads/chat_images/{filename}"

    # 4. Save User Message to DB
    user_msg = ChatMessage(
        session_id=chat_session.id,
        role="user",
        content=text,
        image_url=image_url
    )
    db.add(user_msg)
    await db.commit()
    
    # 5. Build AI Context (Weather, Activities, Growth Stage)
    # We do this quickly to give the bot context
    try:
        weather_data = await fetch_weather_forecast(farm.latitude, farm.longitude)
    except:
        weather_data = {"error": "Could not fetch current weather."}
        
    activity_result = await db.execute(
        select(FarmActivity)
        .where(FarmActivity.farm_id == farm_id)
        .order_by(FarmActivity.date_logged.desc())
        .limit(3)
    )
    activities = [{"activity": a.activity_type, "desc": a.description} for a in activity_result.scalars().all()]
    
    growth_stage_day = (date.today() - farm.sowing_date).days
    
    farm_context = f"""
    Farm Name: {farm.name}
    Crop: {farm.crop_type} (Sowed {growth_stage_day} days ago)
    Soil: {farm.soil_type}, Water Source: {farm.water_source}
    Recent Activities: {json.dumps(activities)}
    Weather Snapshot: {json.dumps(weather_data.get('daily', {}))}
    """

    # 6. Fetch Short-term History (Last 10 messages)
    history_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == chat_session.id)
        .order_by(ChatMessage.created_at.desc())
        .limit(10)
    )
    # Reverse so they are in chronological order
    history_messages = history_result.scalars().all()[::-1]
    
    chat_history_dicts = []
    for msg in history_messages:
        # Exclude the message we just saved so we don't double count it
        if msg.id != user_msg.id:
            chat_history_dicts.append({"role": msg.role, "content": msg.content})

    # 7. Call Gemini
    try:
        bot_reply_text = generate_chat_reply(
            farm_context=farm_context,
            chat_history=chat_history_dicts,
            user_message=text,
            image_path=image_path
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        bot_reply_text = "Maazrat, mera connection toot gaya hai. Thori der baad koshish karen."

    # 8. Save Model Reply to DB
    model_msg = ChatMessage(
        session_id=chat_session.id,
        role="model",
        content=bot_reply_text
    )
    db.add(model_msg)
    await db.commit()
    await db.refresh(model_msg)

    # Return the mascot's reply
    return model_msg
