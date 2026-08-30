import asyncio
from backend.app.database import engine, Base
from backend.app.models.farm import Farm
from backend.app.models.risk_assessment import RiskAssessment

async def init_models():
    async with engine.begin() as conn:
        # Create all tables in the database
        print("Creating database tables...")
        await conn.run_sync(Base.metadata.create_all)
        print("Done!")

if __name__ == "__main__":
    asyncio.run(init_models())
