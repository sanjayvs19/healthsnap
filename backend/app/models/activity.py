from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime, date
from app.database import Base

class ActivityRecord(Base):
    __tablename__ = "activity_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    record_date = Column(Date, default=date.today, index=True)
    steps = Column(Integer, default=0)
    goal = Column(Integer, default=8000)
    active_minutes = Column(Integer, default=0)
    active_goal = Column(Integer, default=60)
    distance_km = Column(Float, default=0.0)
    calories_burned = Column(Integer, default=0)
    percent_achieved = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activity_records")
