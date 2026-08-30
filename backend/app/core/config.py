from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kisan-Nighaban"
    API_V1_STR: str = "/api/v1"
    
    # SQLite Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./kisan_nighaban.db"
    
    # Weather
    WEATHER_CACHE_TTL: int = 3600
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
