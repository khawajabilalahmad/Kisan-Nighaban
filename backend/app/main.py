import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import engine, Base
from app.api.routers import farms, weather, risk, auth, activities

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Cleanup
    await engine.dispose()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

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
app.include_router(activities.router, prefix="/api", tags=["Activities"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(risk.router, prefix="/api/risk", tags=["Risk Assessment"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running!"}