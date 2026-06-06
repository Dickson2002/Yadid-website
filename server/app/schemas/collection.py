from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CollectionBase(BaseModel):
    title: str = Field(..., max_length=255)
    slug: str = Field(..., max_length=255)
    description: str
    cover_image: str | None = None


class CollectionCreate(CollectionBase):
    pass


class CollectionUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    slug: str | None = Field(None, max_length=255)
    description: str | None = None
    cover_image: str | None = None


class CollectionResponse(CollectionBase):
    id: UUID
    poem_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
