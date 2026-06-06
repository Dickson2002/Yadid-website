from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.admin import LoginRequest, TokenResponse, RefreshRequest, AdminResponse
from app.services import auth_service

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    admin = await auth_service.authenticate_admin(db, data.username, data.password)
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    admin_id_str = str(admin.id)
    access_token = auth_service.create_access_token(admin_id_str)
    refresh_token, expires_at = auth_service.create_refresh_token(admin_id_str)
    await auth_service.store_refresh_token(
        db, admin_id_str, refresh_token, expires_at
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    data: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await auth_service.rotate_refresh_token(db, data.refresh_token)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or revoked refresh token",
        )

    access_token, new_refresh, _ = result
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh,
    )


@router.get("/me", response_model=AdminResponse)
async def get_me(
    admin: Admin = Depends(get_current_admin),
):
    return admin


@router.post("/reset")
async def reset_archive(
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    await auth_service.wipe_all_data(db)
    return {"ok": True}
