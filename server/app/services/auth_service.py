import hashlib
import os
import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.admin import Admin
from app.models.poem import Poem
from app.models.refresh_token import RefreshToken


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_access_token(admin_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return jwt.encode(
        {
            "sub": admin_id,
            "exp": expire,
            "type": "access",
        },
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token(admin_id: str) -> tuple[str, datetime]:
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.refresh_token_expire_days
    )
    raw = str(uuid.uuid4())
    token = jwt.encode(
        {
            "sub": admin_id,
            "jti": raw,
            "exp": expire,
            "type": "refresh",
        },
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    return token, expire


async def authenticate_admin(
    db: AsyncSession, username: str, password: str
) -> Admin | None:
    result = await db.execute(select(Admin).where(Admin.username == username))
    admin = result.scalar_one_or_none()
    if admin is None or not verify_password(password, admin.hashed_password):
        return None
    return admin


async def store_refresh_token(
    db: AsyncSession, admin_id: str, raw_token: str, expires_at: datetime
) -> RefreshToken:
    token_entry = RefreshToken(
        token_hash=hash_token(raw_token),
        admin_id=uuid.UUID(admin_id),
        expires_at=expires_at,
    )
    db.add(token_entry)
    await db.commit()
    return token_entry


async def rotate_refresh_token(
    db: AsyncSession, old_token_str: str
) -> tuple[str, str, str] | None:
    """Verify old refresh token, revoke it, issue new tokens. Returns (access_token, new_refresh_token, new_jti)."""
    try:
        payload = jwt.decode(
            old_token_str,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        if payload.get("type") != "refresh":
            return None
        admin_id = payload.get("sub")
        old_jti = payload.get("jti")
        if not admin_id or not old_jti:
            return None
    except Exception:
        return None

    old_hash = hash_token(old_token_str)
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token_hash == old_hash)
    )
    stored = result.scalar_one_or_none()
    if stored is None or stored.revoked:
        return None

    stored.revoked = True
    await db.commit()

    new_access = create_access_token(admin_id)
    new_refresh, expires_at = create_refresh_token(admin_id)
    raw_jti = str(uuid.uuid4())
    token_entry = RefreshToken(
        token_hash=hash_token(new_refresh),
        admin_id=uuid.UUID(admin_id),
        expires_at=expires_at,
    )
    db.add(token_entry)
    await db.commit()

    return new_access, new_refresh, admin_id


async def update_admin_settings(db: AsyncSession, admin: Admin, data: dict) -> dict:
    if not verify_password(data["current_password"], admin.hashed_password):
        raise ValueError("Current password is incorrect")

    if data.get("username"):
        admin.username = data["username"]
    if data.get("password"):
        admin.hashed_password = hash_password(data["password"])
        await db.execute(
            update(RefreshToken)
            .where(RefreshToken.admin_id == admin.id)
            .values(revoked=True)
        )

    await db.commit()
    await db.refresh(admin)
    return {
        "id": str(admin.id),
        "username": admin.username,
        "display_name": admin.display_name,
        "email": admin.email,
        "created_at": admin.created_at.isoformat(),
    }


async def wipe_all_data(db: AsyncSession) -> None:
    from sqlalchemy import delete as sa_delete
    from app.models.poem_view import PoemView
    from app.models.collection import Collection
    from app.models.activity import ActivityLog
    from app.models.subscriber import Subscriber

    result = await db.execute(select(Poem).where(Poem.image.isnot(None)))
    for poem in result.scalars().all():
        filepath = os.path.join(settings.upload_dir, poem.image)
        try:
            os.remove(filepath)
        except OSError:
            pass

    for model in [PoemView, Poem, Collection, ActivityLog, Subscriber]:
        await db.execute(sa_delete(model))
    await db.commit()
