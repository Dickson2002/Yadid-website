import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.collection import CollectionCreate, CollectionUpdate, CollectionResponse
from app.services import collection_service

router = APIRouter()


@router.get("", response_model=list[CollectionResponse])
async def list_collections(db: AsyncSession = Depends(get_db)):
    return await collection_service.get_collections(db)


@router.post("", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
async def create_collection(
    data: CollectionCreate,
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return await collection_service.create_collection(db, data.model_dump())


@router.put("/{collection_id:uuid}", response_model=CollectionResponse)
async def update_collection(
    collection_id: uuid.UUID,
    data: CollectionUpdate,
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    c = await collection_service.update_collection(
        db, str(collection_id), data.model_dump(exclude_unset=True)
    )
    if c is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )
    return c


@router.delete("/{collection_id:uuid}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(
    collection_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    deleted = await collection_service.delete_collection(db, str(collection_id))
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )


@router.get("/{slug}", response_model=CollectionResponse)
async def get_collection(slug: str, db: AsyncSession = Depends(get_db)):
    c = await collection_service.get_collection_by_slug(db, slug)
    if c is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )
    return c
