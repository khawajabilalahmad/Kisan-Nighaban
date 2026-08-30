import httpx
import time
from typing import Dict, Any

from app.core.config import settings

# In-memory cache for MVP: {(lat, lon): {"data": weather_data, "timestamp": time.time()}}
_weather_cache = {}

async def fetch_weather_forecast(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Fetches the 7-day weather forecast from Open-Meteo API.
    Uses in-memory caching to reduce API calls.
    """
    cache_key = (round(latitude, 4), round(longitude, 4))
    now = time.time()
    
    # Check cache
    if cache_key in _weather_cache:
        cached_data = _weather_cache[cache_key]
        if now - cached_data["timestamp"] < settings.WEATHER_CACHE_TTL:
            return cached_data["data"]

    # Open-Meteo endpoint (Free, no API key required)
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "wind_speed_10m_max"],
        "current": ["temperature_2m", "relative_humidity_2m", "precipitation", "wind_speed_10m"],
        "timezone": "auto"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
    # Store in cache
    _weather_cache[cache_key] = {
        "data": data,
        "timestamp": now
    }
    
    return data
