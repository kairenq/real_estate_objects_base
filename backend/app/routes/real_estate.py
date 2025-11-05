from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.real_estate import RealEstateObject
from app.schemas.real_estate import RealEstateCreate, RealEstateResponse, RealEstateUpdate
from app.routes.auth import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/api/real-estate", tags=["real-estate"])


@router.get("/", response_model=List[RealEstateResponse])
def get_real_estate_objects(
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Получение списка объектов недвижимости с фильтрами"""
    query = db.query(RealEstateObject).filter(RealEstateObject.is_active == True)

    if city:
        query = query.filter(RealEstateObject.city.ilike(f"%{city}%"))
    if property_type:
        query = query.filter(RealEstateObject.property_type == property_type)
    if min_price is not None:
        query = query.filter(RealEstateObject.price >= min_price)
    if max_price is not None:
        query = query.filter(RealEstateObject.price <= max_price)

    objects = query.offset(skip).limit(limit).all()
    return objects


@router.get("/{object_id}", response_model=RealEstateResponse)
def get_real_estate_object(
    object_id: int,
    db: Session = Depends(get_db)
):
    """Получение объекта недвижимости по ID"""
    obj = db.query(RealEstateObject).filter(RealEstateObject.id == object_id).first()
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Real estate object not found"
        )
    return obj


@router.post("/", response_model=RealEstateResponse, status_code=status.HTTP_201_CREATED)
def create_real_estate_object(
    object_data: RealEstateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Создание нового объекта недвижимости"""
    db_object = RealEstateObject(
        **object_data.model_dump(),
        owner_id=current_user.id
    )
    db.add(db_object)
    db.commit()
    db.refresh(db_object)
    return db_object


@router.put("/{object_id}", response_model=RealEstateResponse)
def update_real_estate_object(
    object_id: int,
    object_update: RealEstateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Обновление объекта недвижимости"""
    obj = db.query(RealEstateObject).filter(RealEstateObject.id == object_id).first()
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Real estate object not found"
        )

    # Проверка прав (владелец или админ)
    if obj.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    # Обновление полей
    update_data = object_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{object_id}")
def delete_real_estate_object(
    object_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Удаление объекта недвижимости"""
    obj = db.query(RealEstateObject).filter(RealEstateObject.id == object_id).first()
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Real estate object not found"
        )

    # Проверка прав (владелец или админ)
    if obj.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    db.delete(obj)
    db.commit()
    return {"message": "Real estate object deleted successfully"}


@router.get("/my/objects", response_model=List[RealEstateResponse])
def get_my_real_estate_objects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Получение объектов недвижимости текущего пользователя"""
    objects = db.query(RealEstateObject).filter(
        RealEstateObject.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return objects
