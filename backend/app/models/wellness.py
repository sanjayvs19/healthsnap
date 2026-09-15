from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class WellnessRecord(Base):
    __tablename__ = "wellness_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Integer, default=78)
    max_score = Column(Integer, default=100)
    status = Column(String(50), default="Good")
    trend = Column(String(100), default="+4 pts vs last week")
    activity_subscore = Column(Integer, default=80)
    sleep_subscore = Column(Integer, default=72)
    nutrition_subscore = Column(Integer, default=82)
    journal_subscore = Column(Integer, default=78)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="wellness_records")
