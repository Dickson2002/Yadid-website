import csv
import io
import json
from datetime import datetime, timezone

from sqlalchemy import select, func, extract
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.poem import Poem, PoemStatus
from app.models.collection import Collection
from app.models.activity import ActivityLog
from app.models.subscriber import Subscriber


async def get_dashboard_stats(db: AsyncSession) -> dict:
    total = await db.scalar(select(func.count(Poem.id)))
    pub = await db.scalar(
        select(func.count(Poem.id)).where(Poem.status == PoemStatus.published)
    )
    drf = await db.scalar(
        select(func.count(Poem.id)).where(Poem.status == PoemStatus.draft)
    )
    views = await db.scalar(select(func.coalesce(func.sum(Poem.views), 0)))
    subs = await db.scalar(select(func.count(Subscriber.id)))

    return {
        "total_poems": total or 0,
        "published": pub or 0,
        "drafts": drf or 0,
        "total_views": views or 0,
        "subscribers": subs or 0,
        "views_change": 0,
    }


async def get_active_manuscripts(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        select(Poem).order_by(Poem.updated_at.desc()).limit(10)
    )
    poems = result.scalars().all()
    output = []
    for p in poems:
        now = datetime.now(timezone.utc)
        diff = now - p.updated_at
        if diff.days == 0:
            hours = int(diff.total_seconds() / 3600)
            last = f"{hours} hour(s) ago" if hours else "Just now"
        elif diff.days == 1:
            last = "Yesterday"
        else:
            last = f"{diff.days} day(s) ago"

        output.append({
            "id": str(p.id),
            "title": p.title,
            "last_edited": last,
            "status": p.status.value,
            "icon": "article" if p.status == PoemStatus.published else "history_edu",
        })
    return output


async def get_activity_feed(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        select(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(20)
    )
    activities = result.scalars().all()
    return [
        {
            "id": str(a.id),
            "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "message": a.message,
            "type": a.activity_type.value,
        }
        for a in activities
    ]


async def get_monthly_growth(db: AsyncSession) -> list[dict]:
    current_year = datetime.now(timezone.utc).year
    result = await db.execute(
        select(
            extract("month", Poem.date).label("month"),
            func.count(Poem.id).label("count"),
        )
        .where(extract("year", Poem.date) == current_year)
        .group_by(extract("month", Poem.date))
        .order_by(extract("month", Poem.date))
    )
    rows = result.all()
    months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]
    counts = {int(row[0]): row[1] for row in rows}
    return [
        {"month": months[i], "count": counts.get(i + 1, 0)}
        for i in range(12)
        if counts.get(i + 1, 0) > 0
    ]


def _escape_csv(val: str | None) -> str:
    if val is None:
        return ""
    s = str(val)
    if "," in s or '"' in s or "\n" in s:
        s = '"' + s.replace('"', '""') + '"'
    return s


async def export_ledger_csv(db: AsyncSession) -> str:
    output = io.StringIO()
    writer = csv.writer(output)

    now = datetime.now(timezone.utc)

    # --- Summary ---
    stats = await get_dashboard_stats(db)
    writer.writerow([f"# Vault Ledger — {now.strftime('%Y-%m-%d %H:%M:%S UTC')}"])
    writer.writerow(["#"])
    writer.writerow(["# Summary"])
    writer.writerow(["Total Poems", stats["total_poems"]])
    writer.writerow(["Published", stats["published"]])
    writer.writerow(["Drafts", stats["drafts"]])
    writer.writerow(["Total Views", stats["total_views"]])
    writer.writerow(["Subscribers", stats["subscribers"]])
    writer.writerow([])

    # --- Poems ---
    writer.writerow(["# Poems"])
    writer.writerow([
        "Title", "Slug", "Author", "Excerpt", "Date", "Tags",
        "Collection", "Status", "Views", "Created", "Updated",
    ])
    poems_result = await db.execute(
        select(Poem).options(selectinload(Poem.collection)).order_by(Poem.date.desc())
    )
    for p in poems_result.scalars().all():
        writer.writerow([
            _escape_csv(p.title),
            _escape_csv(p.slug),
            _escape_csv(p.author),
            _escape_csv(p.excerpt),
            p.date.strftime("%Y-%m-%d"),
            _escape_csv("; ".join(json.loads(p.tags))),
            _escape_csv(p.collection.title if p.collection else ""),
            p.status.value,
            p.views,
            p.created_at.strftime("%Y-%m-%d"),
            p.updated_at.strftime("%Y-%m-%d"),
        ])
    writer.writerow([])

    # --- Collections ---
    writer.writerow(["# Collections"])
    writer.writerow(["Title", "Slug", "Description", "Poems", "Created", "Updated"])
    collections_result = await db.execute(
        select(Collection).options(selectinload(Collection.poems)).order_by(Collection.title)
    )
    for c in collections_result.scalars().all():
        writer.writerow([
            _escape_csv(c.title),
            _escape_csv(c.slug),
            _escape_csv(c.description),
            len(c.poems),
            c.created_at.strftime("%Y-%m-%d"),
            c.updated_at.strftime("%Y-%m-%d"),
        ])
    writer.writerow([])

    # --- Activity ---
    writer.writerow(["# Activity"])
    writer.writerow(["Timestamp", "Message", "Type"])
    activities_result = await db.execute(
        select(ActivityLog).order_by(ActivityLog.timestamp.desc())
    )
    for a in activities_result.scalars().all():
        writer.writerow([
            a.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            _escape_csv(a.message),
            a.activity_type.value,
        ])
    writer.writerow([])

    # --- Subscribers ---
    writer.writerow(["# Subscribers"])
    writer.writerow(["Email", "Subscribed At"])
    subs_result = await db.execute(
        select(Subscriber).order_by(Subscriber.created_at.desc())
    )
    for s in subs_result.scalars().all():
        writer.writerow([
            _escape_csv(s.email),
            s.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        ])
    writer.writerow([])

    writer.writerow(["# End of Ledger"])
    return output.getvalue()


async def export_ledger_json(db: AsyncSession) -> dict:
    stats = await get_dashboard_stats(db)

    poems_result = await db.execute(
        select(Poem).options(selectinload(Poem.collection)).order_by(Poem.date.desc())
    )
    poems_data = [
        {
            "id": str(p.id),
            "title": p.title,
            "slug": p.slug,
            "author": p.author,
            "excerpt": p.excerpt,
            "date": p.date.strftime("%Y-%m-%d"),
            "tags": json.loads(p.tags),
            "collection": p.collection.title if p.collection else None,
            "status": p.status.value,
            "views": p.views,
            "created_at": p.created_at.isoformat(),
            "updated_at": p.updated_at.isoformat(),
        }
        for p in poems_result.scalars().all()
    ]

    collections_result = await db.execute(
        select(Collection).options(selectinload(Collection.poems)).order_by(Collection.title)
    )
    collections_data = [
        {
            "id": str(c.id),
            "title": c.title,
            "slug": c.slug,
            "description": c.description,
            "poem_count": len(c.poems),
            "created_at": c.created_at.isoformat(),
            "updated_at": c.updated_at.isoformat(),
        }
        for c in collections_result.scalars().all()
    ]

    activities = await get_activity_feed(db)

    subs_result = await db.execute(
        select(Subscriber).order_by(Subscriber.created_at.desc())
    )
    subscribers_data = [
        {
            "id": str(s.id),
            "email": s.email,
            "created_at": s.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for s in subs_result.scalars().all()
    ]

    return {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "summary": stats,
        "poems": poems_data,
        "collections": collections_data,
        "activities": activities,
        "subscribers": subscribers_data,
    }
