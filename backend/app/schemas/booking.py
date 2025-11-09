from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BookingBase(BaseModel):
    real_estate_id: int
    start_date: datetime
    end_date: datetime
    message: Optional[str] = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    status: str  # pending, approved, rejected, cancelled
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    # Вложенные данные для удобства фронтенда
    user_username: Optional[str] = None
    real_estate_title: Optional[str] = None

    class Config:
        from_attributes = True
