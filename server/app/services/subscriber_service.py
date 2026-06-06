from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.subscriber import Subscriber


async def get_subscribers(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        select(Subscriber).order_by(Subscriber.created_at.desc())
    )
    return [
        {
            "id": str(s.id),
            "email": s.email,
            "created_at": s.created_at.isoformat(),
        }
        for s in result.scalars().all()
    ]
