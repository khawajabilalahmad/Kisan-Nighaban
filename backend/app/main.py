import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database import engine, Base
from app.api.routers import farms, weather, analysis, auth, activities, notifications, chat

from app.tasks.scheduler import start_scheduler

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # Start the background proactive analysis scheduler
    start_scheduler()
    
    yield
    # Cleanup
    await engine.dispose()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Mount StaticFiles for image uploads
import os
os.makedirs("uploads", exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(farms.router, prefix="/api/farms", tags=["Farms"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chatbot"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running!"}