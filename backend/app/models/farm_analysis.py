from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class FarmAnalysis(Base):
    __tablename__ = "farm_analyses"

    id = Column(String, primary_key=True, default=generate_uuid)
    farm_id = Column(String, ForeignKey("farms.id"), nullable=False)
    assessed_at = Column(DateTime, default=func.now())
    health_score = Column(Integer, nullable=False) # 0-100 (Replaced risk_score)
    health_status = Column(String, nullable=False) # low, moderate, high, critical
    analysis_breakdown = Column(JSON, nullable=False)
    recommendations = Column(JSON, nullable=False)
    weather_snapshot = Column(JSON, nullable=False)
    growth_stage = Column(String, nullable=False)
    mascot_daily_tip = Column(JSON, nullable=True)

    # Relationship back to farm
    farm = relationship("Farm", back_populates="farm_analyses")
