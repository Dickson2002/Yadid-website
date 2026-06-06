from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class PoemBase(BaseModel):
    title: str = Field(..., max_length=255)
    slug: str = Field(..., max_length=255)
    author: str = Field(..., max_length=255)
    excerpt: str
    content: str
    date: datetime
    tags: list[str] = []
    collection_id: UUID | None = None
    status: str = "draft"
    image: str | None = None


class PoemCreate(PoemBase):
    pass


class PoemUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    author: str | None = None
    excerpt: str | None = None
    content: str | None = None
    date: datetime | None = None
    tags: list[str] | None = None
    collection_id: UUID | None = None
    status: str | None = None
    image: str | None = None


class PoemResponse(PoemBase):
    id: UUID
    views: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
