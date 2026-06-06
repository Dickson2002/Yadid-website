from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.subscriber import Subscriber
from app.schemas.subscriber import SubscribeRequest, SubscriberResponse
from app.services import subscriber_service

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def subscribe(data: SubscribeRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Subscriber).where(Subscriber.email == data.email)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already subscribed",
        )

    subscriber = Subscriber(email=data.email)
    db.add(subscriber)
    await db.commit()
    return {"detail": "Subscribed successfully"}


@router.get("", response_model=list[SubscriberResponse])
async def list_subscribers(
    db: AsyncSession = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    return await subscriber_service.get_subscribers(db)
