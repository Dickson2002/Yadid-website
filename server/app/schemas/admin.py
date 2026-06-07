from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., max_length=100)
    password: str = Field(..., max_length=255)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UpdateAdminRequest(BaseModel):
    current_password: str = Field(..., max_length=255)
    username: str | None = Field(None, max_length=100)
    password: str | None = Field(None, max_length=255)


class AdminResponse(BaseModel):
    id: UUID
    username: str
    display_name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}
