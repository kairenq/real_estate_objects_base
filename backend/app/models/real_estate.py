from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base


class RealEstateObject(Base):
    __tablename__ = "real_estate_objects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    property_type = Column(String, nullable=False)  # квартира, дом, коммерческая и т.д.
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    area = Column(Float)  # площадь в кв.м
    rooms = Column(Integer)
    floor = Column(Integer)
    total_floors = Column(Integer)
    year_built = Column(Integer)
    images = Column(Text)  # JSON список URL изображений
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Relationships
    owner = relationship("User", backref="properties")
    bookings = relationship("Booking", back_populates="real_estate", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="real_estate", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="real_estate", cascade="all, delete-orphan")
