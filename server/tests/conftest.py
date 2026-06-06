import asyncio
from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.database import Base, get_db
from app.main import app
from app.config import settings
from app.models.poem import Poem, PoemStatus
from app.models.collection import Collection
from app.models.admin import Admin
from app.services.auth_service import hash_password

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as db:
        admin = Admin(
            username="testadmin",
            hashed_password=hash_password("testpass"),
            display_name="Test Admin",
            email="test@example.com",
        )
        db.add(admin)

        coll = Collection(
            title="Test Collection",
            slug="test-collection",
            description="A test collection.",
        )
        db.add(coll)
        await db.flush()

        poem = Poem(
            title="Test Poem",
            slug="test-poem",
            author="Test Admin",
            excerpt="A test poem excerpt.",
            content="Test poem content.\n\nSecond line.",
            status=PoemStatus.published,
            views=100,
            collection_id=coll.id,
        )
        db.add(poem)

        poem_draft = Poem(
            title="Draft Poem",
            slug="draft-poem",
            author="Test Admin",
            excerpt="A draft.",
            content="Draft content.",
            status=PoemStatus.draft,
            views=0,
        )
        db.add(poem_draft)
        await db.commit()

    yield

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db():
    async with TestSessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def admin_token(client: AsyncClient) -> str:
    resp = await client.post("/api/admin/login", json={
        "username": "testadmin",
        "password": "testpass",
    })
    return resp.json()["access_token"]


@pytest_asyncio.fixture
async def refresh_token_str(client: AsyncClient) -> str:
    resp = await client.post("/api/admin/login", json={
        "username": "testadmin",
        "password": "testpass",
    })
    return resp.json()["refresh_token"]
