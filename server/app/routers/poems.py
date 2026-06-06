from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.poem import PoemCreate, PoemUpdate, PoemResponse
from app.services import poem_service

router = APIRouter()


@router.get("", response_model=list[PoemResponse])
async def list_poems(db: AsyncSession = Depends(get_db)):
    poems = await poem_service.get_published_poems(db)
    return poems


@router.get("/all", response_model=list[PoemResponse])
async def list_all_poems(
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    poems = await poem_service.get_all_poems(db)
    return poems


@router.get("/{slug}", response_model=PoemResponse)
async def get_poem(slug: str, db: AsyncSession = Depends(get_db)):
    poem = await poem_service.get_poem_by_slug(db, slug)
    if poem is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Poem not found")
    return poem


@router.post("/{slug}/view", status_code=status.HTTP_204_NO_CONTENT)
async def record_view(
    slug: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    ip = request.client.host if request.client else "unknown"
    await poem_service.record_view_by_slug(db, slug, ip)


@router.get("/id/{poem_id}", response_model=PoemResponse)
async def get_poem_by_id(
    poem_id: str,
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    poem = await poem_service.get_poem_by_id(db, poem_id)
    if poem is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Poem not found")
    return poem


@router.post("", response_model=PoemResponse, status_code=status.HTTP_201_CREATED)
async def create_poem(
    data: PoemCreate,
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    poem = await poem_service.create_poem(db, data.model_dump())
    return poem


@router.put("/{poem_id}", response_model=PoemResponse)
async def update_poem(
    poem_id: str,
    data: PoemUpdate,
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    poem = await poem_service.update_poem(
        db, poem_id, data.model_dump(exclude_unset=True)
    )
    if poem is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Poem not found")
    return poem


@router.delete("/{poem_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_poem(
    poem_id: str,
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    deleted = await poem_service.delete_poem(db, poem_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Poem not found")
