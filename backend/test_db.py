import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.models.user import User
from app.core.security import get_password_hash

DATABASE_URL = "sqlite+aiosqlite:///./kisan_nighaban.db"
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def test_insert():
    async with async_session() as session:
        try:
            new_user = User(
                email="test_crash@example.com",
                mobile_number="03007777777",
                full_name="Crash Test",
                hashed_password=get_password_hash("password")
            )
            session.add(new_user)
            await session.commit()
            print("Insert succeeded!")
        except Exception as e:
            print(f"Exception during insert: {e}")

asyncio.run(test_insert())
