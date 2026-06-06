import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_login_success(client: AsyncClient):
    resp = await client.post("/api/admin/login", json={
        "username": "testadmin",
        "password": "testpass",
    })
    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body
    assert "refresh_token" in body
    assert body["token_type"] == "bearer"


@pytest.mark.anyio
async def test_login_invalid_password(client: AsyncClient):
    resp = await client.post("/api/admin/login", json={
        "username": "testadmin",
        "password": "wrongpass",
    })
    assert resp.status_code == 401


@pytest.mark.anyio
async def test_login_invalid_username(client: AsyncClient):
    resp = await client.post("/api/admin/login", json={
        "username": "nobody",
        "password": "testpass",
    })
    assert resp.status_code == 401


@pytest.mark.anyio
async def test_get_me(client: AsyncClient, admin_token: str):
    resp = await client.get(
        "/api/admin/me",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["username"] == "testadmin"


@pytest.mark.anyio
async def test_get_me_unauthorized(client: AsyncClient):
    resp = await client.get("/api/admin/me")
    assert resp.status_code == 403


@pytest.mark.anyio
async def test_refresh_token(client: AsyncClient, refresh_token_str: str):
    resp = await client.post("/api/admin/refresh", json={
        "refresh_token": refresh_token_str,
    })
    assert resp.status_code == 200
    body = resp.json()
    assert "access_token" in body
    assert "refresh_token" in body


@pytest.mark.anyio
async def test_refresh_token_invalid(client: AsyncClient):
    resp = await client.post("/api/admin/refresh", json={
        "refresh_token": "garbage-token",
    })
    assert resp.status_code == 401


@pytest.mark.anyio
async def test_refresh_token_revokes_old(client: AsyncClient, refresh_token_str: str):
    resp1 = await client.post("/api/admin/refresh", json={
        "refresh_token": refresh_token_str,
    })
    assert resp1.status_code == 200
    new_refresh = resp1.json()["refresh_token"]

    resp2 = await client.post("/api/admin/refresh", json={
        "refresh_token": refresh_token_str,
    })
    assert resp2.status_code == 401

    resp3 = await client.post("/api/admin/refresh", json={
        "refresh_token": new_refresh,
    })
    assert resp3.status_code == 200
