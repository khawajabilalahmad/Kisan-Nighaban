from sqlalchemy import Column, String, Float, Date, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    crop_type = Column(String, nullable=False)
    sowing_date = Column(Date, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    district = Column(String, nullable=True)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="farms")
    # Relationship to risk assessments
    risk_assessments = relationship("RiskAssessment", back_populates="farm", cascade="all, delete-orphan")
