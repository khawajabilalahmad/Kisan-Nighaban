import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.risk import RiskAssessmentOutput

# Initialize the Gemini client
# Note: Ensure GEMINI_API_KEY is set in your .env file
client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

def generate_risk_assessment(crop_type: str, crop_profile: dict, weather_data: dict, growth_stage: str, growth_stage_day: int) -> RiskAssessmentOutput:
    """
    Calls the Gemini API to assess climate risk based on crop profile and weather forecast.
    """
    if not client:
        raise ValueError("GEMINI_API_KEY is not configured.")

    # Construct the prompt
    prompt = f"""
    You are an expert agronomist providing actionable advice to farmers.
    
    Crop: {crop_type.capitalize()}
    Current Growth Stage: {growth_stage} (Day {growth_stage_day})
    
    Crop Profile & Thresholds:
    {json.dumps(crop_profile, indent=2)}
    
    7-Day Weather Forecast & Current Conditions:
    {json.dumps(weather_data, indent=2)}
    
    Based on the crop's thresholds and the provided weather forecast, calculate the climate risk.
    Analyze the risks for heat stress, drought, flooding, and wind damage.
    Provide an overall risk score (0-100) and actionable recommendations to mitigate these risks.
    """

    # Call Gemini API requesting structured JSON output conforming to RiskAssessmentOutput
    response = client.models.generate_content(
        model='gemini-3.1-flash-lite',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=RiskAssessmentOutput,
        ),
    )
    
    # The response.text is a JSON string matching the RiskAssessmentOutput schema
    # Parse it into the Pydantic model and return
    assessment_data = json.loads(response.text)
    return RiskAssessmentOutput(**assessment_data)
