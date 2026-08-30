import asyncio
import uuid
from datetime import date, timedelta
from app.db.session import engine, Base
from app.models.farm import Farm
from app.core.config import settings

async def seed_data():
    print("Initializing database...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Checking for existing data...")
    # This is a basic check. In real scenarios, you'd check if specific seed data exists.
    # We will just insert new records.
    
    demo_farms = [
        Farm(
            id=str(uuid.uuid4()),
            name="Demo Wheat Field - Lahore",
            crop_type="wheat",
            sowing_date=date.today() - timedelta(days=60), # 60 days ago -> Stem-extension/Heading
            latitude=31.5204,
            longitude=74.3587,
            district="Lahore"
        ),
        Farm(
            id=str(uuid.uuid4()),
            name="Demo Cotton Field - Multan",
            crop_type="cotton",
            sowing_date=date.today() - timedelta(days=20), # 20 days ago -> Seedling/Squaring
            latitude=30.1575,
            longitude=71.5249,
            district="Multan"
        ),
        Farm(
            id=str(uuid.uuid4()),
            name="Demo Rice Field - Gujranwala",
            crop_type="rice",
            sowing_date=date.today() - timedelta(days=100), # 100 days ago -> Ripening
            latitude=32.1617,
            longitude=74.1883,
            district="Gujranwala"
        )
    ]
    
    from app.db.session import SessionLocal
    async with SessionLocal() as session:
        for farm in demo_farms:
            session.add(farm)
        await session.commit()
    
    print("Seed data inserted successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
