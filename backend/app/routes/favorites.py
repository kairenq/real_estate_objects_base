from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from app.database.database import get_db
from app.routes.auth import get_current_user
from app.models import Favorite, RealEstateObject, User
from app.schemas.favorite import FavoriteCreate, FavoriteResponse

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.post("/", response_model=FavoriteResponse)
def add_to_favorites(
    favorite: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Добавить объект в избранное"""
    # Проверяем, что объект существует
    real_estate = db.query(RealEstateObject).filter(RealEstateObject.id == favorite.real_estate_id).first()
    if not real_estate:
        raise HTTPException(status_code=404, detail="Объект недвижимости не найден")

    # Создаем запись в избранном
    db_favorite = Favorite(
        user_id=current_user.id,
        real_estate_id=favorite.real_estate_id
    )

    try:
        db.add(db_favorite)
        db.commit()
        db.refresh(db_favorite)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Объект уже в избранном")

    # Добавляем вложенные данные
    response = FavoriteResponse.from_orm(db_favorite)
    response.real_estate_title = real_estate.title
    response.real_estate_price = real_estate.price
    response.real_estate_city = real_estate.city

    return response


@router.get("/", response_model=List[FavoriteResponse])
def get_my_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список избранных объектов"""
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()

    result = []
    for fav in favorites:
        response = FavoriteResponse.from_orm(fav)
        if fav.real_estate:
            response.real_estate_title = fav.real_estate.title
            response.real_estate_price = fav.real_estate.price
            response.real_estate_city = fav.real_estate.city
        result.append(response)

    return result


@router.delete("/{real_estate_id}")
def remove_from_favorites(
    real_estate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить объект из избранного"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.real_estate_id == real_estate_id
    ).first()

    if not favorite:
        raise HTTPException(status_code=404, detail="Объект не найден в избранном")

    db.delete(favorite)
    db.commit()

    return {"message": "Объект удален из избранного"}


@router.get("/check/{real_estate_id}")
def check_is_favorite(
    real_estate_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Проверить, находится ли объект в избранном"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.real_estate_id == real_estate_id
    ).first()

    return {"is_favorite": favorite is not None}
