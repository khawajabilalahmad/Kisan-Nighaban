from sqlalchemy import Column, String, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class FarmActivity(Base):
    __tablename__ = "farm_activities"

    id = Column(String, primary_key=True, default=generate_uuid)
    farm_id = Column(String, ForeignKey("farms.id"), nullable=False)
    activity_type = Column(String, nullable=False) # e.g. "watered", "fertilized", "pest_control", "harvested"
    description = Column(Text, nullable=True) # Optional context from farmer
    date_logged = Column(DateTime, default=func.now())
    
    # Relationship back to Farm
    farm = relationship("Farm", back_populates="activities")
