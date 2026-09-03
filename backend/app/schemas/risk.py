from pydantic import BaseModel, Field
from typing import List

class RiskBreakdown(BaseModel):
    heat_stress: int = Field(description="Risk score for heat stress (0-100)")
    drought: int = Field(description="Risk score for drought (0-100)")
    flooding: int = Field(description="Risk score for flooding (0-100)")
    wind_damage: int = Field(description="Risk score for wind damage (0-100)")

class Recommendation(BaseModel):
    priority: int = Field(description="Priority of the recommendation (1 is highest)")
    title: str = Field(description="Short actionable title")
    detail: str = Field(description="Detailed explanation of the action")
    urgency: str = Field(description="Urgency level, e.g., 'immediate', 'within-48-hours'")

class RiskAssessmentOutput(BaseModel):
    risk_score: int = Field(description="Overall composite risk score (0-100)")
    risk_level: str = Field(description="Overall risk level: 'low', 'moderate', 'high', 'critical'")
    risk_breakdown: RiskBreakdown
    growth_stage: str = Field(description="Current growth stage of the crop")
    growth_stage_day: int = Field(description="Current day in the growth stage")
    summary: str = Field(description="A short plain-language summary of the risks")
    mascot_daily_tip: str = Field(description="A friendly, conversational daily tip from a Digital Kisaan Bhai written strictly in 'Roz Marra' Roman Urdu (Hinglish). It should sound like a WhatsApp voice note from a local farmer friend.")
    recommendations: List[Recommendation]

from datetime import datetime
from typing import Any

class RiskAssessmentResponse(BaseModel):
    id: str
    farm_id: str
    assessed_at: datetime
    risk_score: int
    risk_level: str
    risk_breakdown: RiskBreakdown
    recommendations: List[Recommendation]
    weather_snapshot: Any
    growth_stage: str
    mascot_daily_tip: str | None = None
    
    class Config:
        from_attributes = True
