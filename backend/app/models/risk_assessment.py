from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(String, primary_key=True, default=generate_uuid)
    farm_id = Column(String, ForeignKey("farms.id"), nullable=False)
    assessed_at = Column(DateTime, default=func.now())
    risk_score = Column(Integer, nullable=False) # 0-100
    risk_level = Column(String, nullable=False) # low, moderate, high, critical
    risk_breakdown = Column(JSON, nullable=False)
    recommendations = Column(JSON, nullable=False)
    weather_snapshot = Column(JSON, nullable=False)
    growth_stage = Column(String, nullable=False)
    mascot_daily_tip = Column(String, nullable=True)

    # Relationship back to farm
    farm = relationship("Farm", back_populates="risk_assessments")
