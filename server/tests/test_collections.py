import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_list_collections(client: AsyncClient):
    resp = await client.get("/api/collections")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["slug"] == "test-collection"
    assert data[0]["poem_count"] == 1


@pytest.mark.anyio
async def test_get_collection(client: AsyncClient):
    resp = await client.get("/api/collections/test-collection")
    assert resp.status_code == 200
    assert resp.json()["title"] == "Test Collection"


@pytest.mark.anyio
async def test_get_collection_not_found(client: AsyncClient):
    resp = await client.get("/api/collections/nonexistent")
    assert resp.status_code == 404
