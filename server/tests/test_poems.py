import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_list_published_poems(client: AsyncClient):
    resp = await client.get("/api/poems")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["slug"] == "test-poem"


@pytest.mark.anyio
async def test_get_poem_by_slug(client: AsyncClient):
    resp = await client.get("/api/poems/test-poem")
    assert resp.status_code == 200
    assert resp.json()["title"] == "Test Poem"


@pytest.mark.anyio
async def test_get_poem_not_found(client: AsyncClient):
    resp = await client.get("/api/poems/nonexistent")
    assert resp.status_code == 404


@pytest.mark.anyio
async def test_list_all_poems_requires_auth(client: AsyncClient):
    resp = await client.get("/api/poems/all")
    assert resp.status_code == 403


@pytest.mark.anyio
async def test_list_all_poems_authenticated(client: AsyncClient, admin_token: str):
    resp = await client.get(
        "/api/poems/all",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2


@pytest.mark.anyio
async def test_create_poem(client: AsyncClient, admin_token: str):
    resp = await client.post(
        "/api/poems",
        json={
            "title": "New Poem",
            "slug": "new-poem",
            "author": "Test Admin",
            "excerpt": "New excerpt.",
            "content": "New content.",
            "date": "2024-10-01T00:00:00+00:00",
            "tags": ["Test"],
            "status": "draft",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 201
    assert resp.json()["slug"] == "new-poem"


@pytest.mark.anyio
async def test_create_poem_unauthorized(client: AsyncClient):
    resp = await client.post(
        "/api/poems",
        json={
            "title": "Unauthorized",
            "slug": "unauthorized",
            "author": "Hacker",
            "excerpt": "bad",
            "content": "bad",
            "date": "2024-10-01T00:00:00+00:00",
        },
    )
    assert resp.status_code == 403


@pytest.mark.anyio
async def test_update_poem(client: AsyncClient, admin_token: str):
    resp = await client.put(
        "/api/poems/test-poem",
        json={"title": "Updated Title"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated Title"


@pytest.mark.anyio
async def test_delete_poem(client: AsyncClient, admin_token: str):
    resp = await client.delete(
        "/api/poems/test-poem",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 204
    resp2 = await client.get("/api/poems/test-poem")
    assert resp2.status_code == 404


@pytest.mark.anyio
async def test_get_poem_by_id(client: AsyncClient, admin_token: str):
    # First get the poem to know its id
    list_resp = await client.get(
        "/api/poems/all",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    poem_id = list_resp.json()[0]["id"]

    resp = await client.get(
        f"/api/poems/id/{poem_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["id"] == poem_id
