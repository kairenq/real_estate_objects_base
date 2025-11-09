from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    real_estate_id = Column(Integer, ForeignKey("real_estate_objects.id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Один пользователь не может добавить один и тот же объект дважды
    __table_args__ = (UniqueConstraint('user_id', 'real_estate_id', name='_user_property_uc'),)

    # Relationships
    user = relationship("User", back_populates="favorites")
    real_estate = relationship("RealEstateObject", back_populates="favorites")
