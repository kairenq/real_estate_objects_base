from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FavoriteCreate(BaseModel):
    real_estate_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    real_estate_id: int
    created_at: datetime

    # Вложенные данные для удобства
    real_estate_title: Optional[str] = None
    real_estate_price: Optional[float] = None
    real_estate_city: Optional[str] = None

    class Config:
        from_attributes = True
