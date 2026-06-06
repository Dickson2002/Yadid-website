import uuid
from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.collection import Collection
from app.models.poem import Poem


def _collection_to_dict(c: Collection, poem_count: int = 0) -> dict:
    return {
        "id": str(c.id),
        "title": c.title,
        "slug": c.slug,
        "description": c.description,
        "cover_image": c.cover_image,
        "poem_count": poem_count,
        "created_at": c.created_at.isoformat(),
        "updated_at": c.updated_at.isoformat(),
    }


async def get_collections(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        select(Collection).order_by(Collection.title)
    )
    collections = result.scalars().all()

    count_result = await db.execute(
        select(Collection.id, func.count(Poem.id).label("count"))
        .outerjoin(Poem, Poem.collection_id == Collection.id)
        .group_by(Collection.id)
    )
    counts = {str(row[0]): row[1] for row in count_result}

    return [
        _collection_to_dict(c, counts.get(str(c.id), 0))
        for c in collections
    ]


async def get_collection_by_slug(db: AsyncSession, slug: str) -> dict | None:
    result = await db.execute(
        select(Collection).where(Collection.slug == slug)
    )
    c = result.scalar_one_or_none()
    if c is None:
        return None

    count_result = await db.execute(
        select(func.count(Poem.id)).where(Poem.collection_id == c.id)
    )
    poem_count = count_result.scalar() or 0

    return _collection_to_dict(c, poem_count)


async def create_collection(db: AsyncSession, data: dict) -> dict:
    c = Collection(
        title=data["title"],
        slug=data["slug"],
        description=data.get("description", ""),
        cover_image=data.get("cover_image"),
    )
    db.add(c)
    await db.commit()
    await db.refresh(c)
    return _collection_to_dict(c)


async def update_collection(
    db: AsyncSession, collection_id: str, data: dict
) -> dict | None:
    result = await db.execute(
        select(Collection).where(Collection.id == uuid.UUID(collection_id))
    )
    c = result.scalar_one_or_none()
    if c is None:
        return None

    for key, value in data.items():
        if value is not None and hasattr(c, key):
            setattr(c, key, value)

    c.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(c)

    count_result = await db.execute(
        select(func.count(Poem.id)).where(Poem.collection_id == c.id)
    )
    poem_count = count_result.scalar() or 0

    return _collection_to_dict(c, poem_count)


async def delete_collection(db: AsyncSession, collection_id: str) -> bool:
    result = await db.execute(
        select(Collection).where(Collection.id == uuid.UUID(collection_id))
    )
    c = result.scalar_one_or_none()
    if c is None:
        return False
    await db.delete(c)
    await db.commit()
    return True
