import uuid
from sqlalchemy import Column, String, Float, Date, DateTime
from sqlalchemy.dialects.sqlite import DATETIME
from sqlalchemy.sql import func
from app.db.session import Base

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True, nullable=False)
    crop_type = Column(String, nullable=False)
    sowing_date = Column(Date, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    district = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
