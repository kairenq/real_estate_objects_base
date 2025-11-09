from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    # Relationships
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    buyer_conversations = relationship("Conversation", foreign_keys="Conversation.buyer_id", back_populates="buyer", cascade="all, delete-orphan")
    seller_conversations = relationship("Conversation", foreign_keys="Conversation.seller_id", back_populates="seller", cascade="all, delete-orphan")
    sent_messages = relationship("Message", back_populates="sender")
