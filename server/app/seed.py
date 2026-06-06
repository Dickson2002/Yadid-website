"""Seed the database with the admin user only.

Usage:
    python -m app.seed
"""

import asyncio
import uuid

from app.config import settings
from app.database import engine, Base, async_session
from app.models.admin import Admin
from app.services.auth_service import hash_password


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        from sqlalchemy import select

        result = await db.execute(select(Admin).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded. Skipping.")
            return

        admin = Admin(
            id=uuid.UUID("30000000-0000-0000-0000-000000000001"),
            username=settings.admin_username,
            hashed_password=hash_password(settings.admin_password),
            display_name=settings.admin_display_name,
            email=settings.admin_email,
        )
        db.add(admin)
        await db.commit()

    print("Database seeded successfully.")
    print(f"  Admin: {settings.admin_username} / {settings.admin_password}")


def main():
    asyncio.run(seed())


if __name__ == "__main__":
    main()
