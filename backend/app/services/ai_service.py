import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.analysis import FarmAnalysisOutput

# Initialize the Gemini client
# Note: Ensure GEMINI_API_KEY is set in your .env file
client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

def generate_farm_analysis(
    crop_type: str, 
    crop_profile: dict, 
    weather_data: dict, 
    growth_stage: str, 
    growth_stage_day: int,
    farm_details: dict,
    recent_activities: list
) -> FarmAnalysisOutput:
    """
    Calls the Gemini API to assess climate risk based on crop profile, weather forecast, and farm activity.
    """
    if not client:
        raise ValueError("GEMINI_API_KEY is not configured.")

    # Construct the prompt
    prompt = f"""
    You are a "Digital Kisaan Bhai" (A friendly, local farmer advisor in Pakistan). 
    Your goal is to provide hyper-localized, actionable advice to a fellow farmer.
    
    Farm Context:
    Crop: {crop_type.capitalize()}
    Current Growth Stage: {growth_stage} (Day {growth_stage_day})
    Water Source: {farm_details.get('water_source', 'Unknown')}
    Soil Type: {farm_details.get('soil_type', 'Unknown')}
    
    Recent Activities by the Farmer:
    {json.dumps(recent_activities, indent=2)}
    
    Crop Profile & Thresholds:
    {json.dumps(crop_profile, indent=2)}
    
    7-Day Weather Forecast & Current Conditions:
    {json.dumps(weather_data, indent=2)}
    
    Task:
    1. Calculate the climate risk for heat stress, drought, flooding, and wind damage based on the weather and crop thresholds.
    2. Provide an overall health score (0-100) and actionable recommendations in English.
    3. Generate a `mascot_daily_tip`. This MUST be provided in two languages:
       - `ur`: "Roz Marra" (everyday) Roman Urdu / Hinglish. It should sound like a WhatsApp voice note from a local farmer friend.
       - `en`: Simple, easy-to-understand English.
       
       For the tip:
       - If there's a risk, warn them casually.
       - If they recently watered (check Recent Activities), tell them they are doing a great job.
       - Consider their soil type (e.g., sandy needs more frequent watering) and water source (tubewell means they can water anytime, canal means they have to wait for their turn).
       - DO NOT use difficult English words or robotic AI language. Keep it natural, friendly, and deeply contextual to their farm.
    """

    # Call Gemini API requesting structured JSON output conforming to FarmAnalysisOutput
    response = client.models.generate_content(
        model='gemini-3.1-flash-lite',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=FarmAnalysisOutput,
        ),
    )
    
    # The response.text is a JSON string matching the FarmAnalysisOutput schema
    # Parse it into the Pydantic model and return
    assessment_data = json.loads(response.text)
    return FarmAnalysisOutput(**assessment_data)
