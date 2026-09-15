from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(512), default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80")
    goals = Column(Text, default='["Improve sleep", "Increase activity", "Improve food habits", "Maintain healthy routine"]')  # JSON encoded list
    settings = Column(Text, default='{"notifications": true, "edgeAi": true, "dataSharing": false, "darkMode": false}')  # JSON encoded dict
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    wellness_records = relationship("WellnessRecord", back_populates="user", cascade="all, delete-orphan")
    food_records = relationship("FoodRecord", back_populates="user", cascade="all, delete-orphan")
    activity_records = relationship("ActivityRecord", back_populates="user", cascade="all, delete-orphan")
    sleep_records = relationship("SleepRecord", back_populates="user", cascade="all, delete-orphan")
    self_reports = relationship("SelfReport", back_populates="user", cascade="all, delete-orphan")
