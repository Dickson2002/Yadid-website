from typing import Literal

from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.analytics import DashboardStats, Manuscript, Activity, MonthlyGrowth
from app.services import analytics_service

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return await analytics_service.get_dashboard_stats(db)


@router.get("/manuscripts", response_model=list[Manuscript])
async def get_manuscripts(
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return await analytics_service.get_active_manuscripts(db)


@router.get("/activity", response_model=list[Activity])
async def get_activity(
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return await analytics_service.get_activity_feed(db)


@router.get("/growth", response_model=list[MonthlyGrowth])
async def get_growth(
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return await analytics_service.get_monthly_growth(db)


@router.get("/export")
async def get_export(
    format: Literal["csv", "json"] = "csv",
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    if format == "json":
        data = await analytics_service.export_ledger_json(db)
        return JSONResponse(
            content=data,
            headers={"Content-Disposition": "attachment; filename=vault-ledger.json"},
        )
    csv = await analytics_service.export_ledger_csv(db)
    return Response(
        content=csv,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=vault-ledger.csv"},
    )
