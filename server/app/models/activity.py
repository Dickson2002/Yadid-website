import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Text, Uuid, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
import enum


class ActivityType(str, enum.Enum):
    primary = "primary"
    secondary = "secondary"
    tertiary = "tertiary"
    muted = "muted"


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    message: Mapped[str] = mapped_column(Text, nullable=False)
    activity_type: Mapped[ActivityType] = mapped_column(
        SAEnum(ActivityType, name="activity_type"), nullable=False, default=ActivityType.muted
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
