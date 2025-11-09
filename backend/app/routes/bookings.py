from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.models import Booking, RealEstateObject, User
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdate

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать бронирование объекта недвижимости"""
    # Проверяем, что объект существует
    real_estate = db.query(RealEstateObject).filter(RealEstateObject.id == booking.real_estate_id).first()
    if not real_estate:
        raise HTTPException(status_code=404, detail="Объект недвижимости не найден")

    # Нельзя забронировать свой собственный объект
    if real_estate.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя забронировать собственный объект")

    # Создаем бронирование
    db_booking = Booking(
        user_id=current_user.id,
        real_estate_id=booking.real_estate_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        message=booking.message,
        status="pending"
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    # Добавляем вложенные данные
    response = BookingResponse.from_orm(db_booking)
    response.user_username = current_user.username
    response.real_estate_title = real_estate.title

    return response


@router.get("/my", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить свои бронирования"""
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()

    result = []
    for booking in bookings:
        response = BookingResponse.from_orm(booking)
        response.user_username = current_user.username
        if booking.real_estate:
            response.real_estate_title = booking.real_estate.title
        result.append(response)

    return result


@router.get("/property/{property_id}", response_model=List[BookingResponse])
def get_property_bookings(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить бронирования для своего объекта недвижимости"""
    # Проверяем, что это объект текущего пользователя
    real_estate = db.query(RealEstateObject).filter(
        RealEstateObject.id == property_id,
        RealEstateObject.owner_id == current_user.id
    ).first()

    if not real_estate:
        raise HTTPException(status_code=404, detail="Объект не найден или вы не являетесь владельцем")

    bookings = db.query(Booking).filter(Booking.real_estate_id == property_id).all()

    result = []
    for booking in bookings:
        response = BookingResponse.from_orm(booking)
        if booking.user:
            response.user_username = booking.user.username
        response.real_estate_title = real_estate.title
        result.append(response)

    return result


@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Обновить статус бронирования (только владелец объекта или создатель бронирования)"""
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not db_booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    # Проверяем права: владелец объекта может approve/reject, создатель может cancel
    is_owner = db_booking.real_estate.owner_id == current_user.id
    is_booker = db_booking.user_id == current_user.id

    if not (is_owner or is_booker):
        raise HTTPException(status_code=403, detail="Нет прав для изменения этого бронирования")

    # Владелец может approve/reject, создатель может только cancel
    if is_booker and booking_update.status not in ["cancelled"]:
        raise HTTPException(status_code=403, detail="Вы можете только отменить свое бронирование")

    db_booking.status = booking_update.status
    if booking_update.start_date:
        db_booking.start_date = booking_update.start_date
    if booking_update.end_date:
        db_booking.end_date = booking_update.end_date

    db.commit()
    db.refresh(db_booking)

    response = BookingResponse.from_orm(db_booking)
    if db_booking.user:
        response.user_username = db_booking.user.username
    if db_booking.real_estate:
        response.real_estate_title = db_booking.real_estate.title

    return response


@router.get("/", response_model=List[BookingResponse])
def get_all_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Получить все бронирования (только для админов)"""
    bookings = db.query(Booking).all()

    result = []
    for booking in bookings:
        response = BookingResponse.from_orm(booking)
        if booking.user:
            response.user_username = booking.user.username
        if booking.real_estate:
            response.real_estate_title = booking.real_estate.title
        result.append(response)

    return result


@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Удалить бронирование (только для админов)"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    db.delete(booking)
    db.commit()

    return {"message": "Бронирование удалено"}
