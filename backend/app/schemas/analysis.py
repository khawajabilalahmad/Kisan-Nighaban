from pydantic import BaseModel, Field
from typing import List

class AnalysisBreakdown(BaseModel):
    heat_stress: int = Field(description="Risk score for heat stress (0-100)")
    drought: int = Field(description="Risk score for drought (0-100)")
    flooding: int = Field(description="Risk score for flooding (0-100)")
    wind_damage: int = Field(description="Risk score for wind damage (0-100)")

class Recommendation(BaseModel):
    priority: int = Field(description="Priority of the recommendation (1 is highest)")
    title: str = Field(description="Short actionable title")
    detail: str = Field(description="Detailed explanation of the action")
    urgency: str = Field(description="Urgency level, e.g., 'immediate', 'within-48-hours'")

class MascotTip(BaseModel):
    en: str = Field(description="The tip written in simple English")
    ur: str = Field(description="The tip written in 'Roz Marra' Roman Urdu (Hinglish)")

class FarmAnalysisOutput(BaseModel):
    health_score: int = Field(description="Overall composite health score (0-100)")
    health_status: str = Field(description="Overall health status: 'low', 'moderate', 'high', 'critical'")
    analysis_breakdown: AnalysisBreakdown
    growth_stage: str = Field(description="Current growth stage of the crop")
    growth_stage_day: int = Field(description="Current day in the growth stage")
    summary: str = Field(description="A short plain-language summary of the farm analysis")
    mascot_daily_tip: MascotTip = Field(description="Friendly, conversational daily tip from the Kisaan Bhai in multiple languages")
    recommendations: List[Recommendation]

from datetime import datetime
from typing import Any

class FarmAnalysisResponse(BaseModel):
    id: str
    farm_id: str
    assessed_at: datetime
    health_score: int
    health_status: str
    analysis_breakdown: AnalysisBreakdown
    recommendations: List[Recommendation]
    weather_snapshot: Any
    growth_stage: str
    mascot_daily_tip: Any | None = None
    
    class Config:
        from_attributes = True
