from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class MessageCreate(BaseModel):
    conversation_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    is_read: bool
    created_at: datetime

    # Вложенные данные
    sender_username: Optional[str] = None

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    real_estate_id: int
    # Продавец определяется автоматически из owner_id объекта


class ConversationResponse(BaseModel):
    id: int
    real_estate_id: int
    buyer_id: int
    seller_id: int
    created_at: datetime
    updated_at: datetime

    # Вложенные данные
    buyer_username: Optional[str] = None
    seller_username: Optional[str] = None
    real_estate_title: Optional[str] = None
    last_message: Optional[str] = None
    unread_count: Optional[int] = 0

    class Config:
        from_attributes = True
