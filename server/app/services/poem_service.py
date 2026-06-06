import json
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.poem import Poem, PoemStatus
from app.models.poem_view import PoemView


def _tags_to_str(tags: list[str]) -> str:
    return json.dumps(tags)


def _str_to_tags(value: str) -> list[str]:
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return []


def _poem_to_dict(poem: Poem) -> dict:
    return {
        "id": str(poem.id),
        "title": poem.title,
        "slug": poem.slug,
        "author": poem.author,
        "excerpt": poem.excerpt,
        "content": poem.content,
        "date": poem.date.isoformat(),
        "tags": _str_to_tags(poem.tags),
        "collection_id": str(poem.collection_id) if poem.collection_id else None,
        "status": poem.status.value,
        "views": poem.views,
        "created_at": poem.created_at.isoformat(),
        "updated_at": poem.updated_at.isoformat(),
    }


async def get_published_poems(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        select(Poem)
        .where(Poem.status == PoemStatus.published)
        .order_by(Poem.date.desc())
    )
    return [_poem_to_dict(p) for p in result.scalars().all()]


async def get_all_poems(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        select(Poem).order_by(Poem.date.desc())
    )
    return [_poem_to_dict(p) for p in result.scalars().all()]


async def get_poem_by_slug(db: AsyncSession, slug: str) -> dict | None:
    result = await db.execute(
        select(Poem).where(Poem.slug == slug)
    )
    poem = result.scalar_one_or_none()
    if poem is None:
        return None
    return _poem_to_dict(poem)


async def get_poem_by_id(db: AsyncSession, poem_id: str) -> dict | None:
    result = await db.execute(
        select(Poem).where(Poem.id == uuid.UUID(poem_id))
    )
    poem = result.scalar_one_or_none()
    if poem is None:
        return None
    return _poem_to_dict(poem)


async def increment_views(db: AsyncSession, poem_id: str, ip_address: str) -> None:
    poem_uuid = uuid.UUID(poem_id)

    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    existing = await db.execute(
        select(PoemView).where(
            PoemView.poem_id == poem_uuid,
            PoemView.ip_address == ip_address,
            PoemView.viewed_at >= cutoff,
        )
    )
    if existing.scalar_one_or_none():
        return

    result = await db.execute(
        select(Poem).where(Poem.id == poem_uuid)
    )
    poem = result.scalar_one_or_none()
    if not poem:
        return

    poem.views += 1
    db.add(PoemView(poem_id=poem_uuid, ip_address=ip_address))
    await db.commit()


async def record_view_by_slug(db: AsyncSession, slug: str, ip_address: str) -> str | None:
    result = await db.execute(
        select(Poem).where(Poem.slug == slug)
    )
    poem = result.scalar_one_or_none()
    if poem is None:
        return None
    await increment_views(db, str(poem.id), ip_address)
    return str(poem.id)


async def create_poem(db: AsyncSession, data: dict) -> dict:
    poem = Poem(
        title=data["title"],
        slug=data["slug"],
        author=data.get("author", ""),
        excerpt=data.get("excerpt", ""),
        content=data.get("content", ""),
        date=data.get("date", datetime.now(timezone.utc)),
        tags=_tags_to_str(data.get("tags", [])),
        collection_id=(
            uuid.UUID(data["collection_id"]) if data.get("collection_id") else None
        ),
        status=PoemStatus(data.get("status", "draft")),
    )
    db.add(poem)
    await db.commit()
    await db.refresh(poem)
    return _poem_to_dict(poem)


async def update_poem(db: AsyncSession, poem_id: str, data: dict) -> dict | None:
    result = await db.execute(
        select(Poem).where(Poem.id == uuid.UUID(poem_id))
    )
    poem = result.scalar_one_or_none()
    if poem is None:
        return None

    for key, value in data.items():
        if value is None:
            continue
        if key == "tags":
            poem.tags = _tags_to_str(value)
        elif key == "collection_id":
            poem.collection_id = uuid.UUID(value) if value else None
        elif key == "status":
            poem.status = PoemStatus(value)
        elif hasattr(poem, key):
            setattr(poem, key, value)

    poem.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(poem)
    return _poem_to_dict(poem)


async def delete_poem(db: AsyncSession, poem_id: str) -> bool:
    result = await db.execute(
        select(Poem).where(Poem.id == uuid.UUID(poem_id))
    )
    poem = result.scalar_one_or_none()
    if poem is None:
        return False
    await db.delete(poem)
    await db.commit()
    return True
