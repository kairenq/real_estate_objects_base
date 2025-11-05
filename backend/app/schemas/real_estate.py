from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RealEstateBase(BaseModel):
    title: str
    description: Optional[str] = None
    property_type: str
    address: str
    city: str
    price: float
    area: Optional[float] = None
    rooms: Optional[int] = None
    floor: Optional[int] = None
    total_floors: Optional[int] = None
    year_built: Optional[int] = None


class RealEstateCreate(RealEstateBase):
    pass


class RealEstateUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    price: Optional[float] = None
    area: Optional[float] = None
    rooms: Optional[int] = None
    floor: Optional[int] = None
    total_floors: Optional[int] = None
    year_built: Optional[int] = None
    is_active: Optional[bool] = None


class RealEstateResponse(RealEstateBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True
