from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

import os
from dotenv import load_dotenv

load_dotenv()

# We will read the database URL from environment variables
# For Supabase, ensure it uses postgresql+asyncpg://
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite+aiosqlite:///./kisan_nighaban.db")

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
