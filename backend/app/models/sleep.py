from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime, date
from app.database import Base

class SleepRecord(Base):
    __tablename__ = "sleep_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    record_date = Column(Date, default=date.today, index=True)
    hours = Column(Float, nullable=False, default=7.0)
    duration_str = Column(String(50), default="7h 00m")
    quality = Column(String(50), default="Good")
    efficiency = Column(Integer, default=85)
    deep_sleep = Column(String(50), default="1h 30m")
    rem_sleep = Column(String(50), default="1h 20m")
    light_sleep = Column(String(50), default="4h 10m")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sleep_records")
