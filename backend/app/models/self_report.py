from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class SelfReport(Base):
    __tablename__ = "self_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    feeling = Column(String(50), nullable=False)
    feeling_emoji = Column(String(10), default="🙂")
    symptoms = Column(Text, nullable=True)
    severity = Column(String(50), default="Mild")  # Mild, Moderate, High
    duration = Column(String(50), default="1–3 hours")
    energy_level = Column(String(50), nullable=True)
    mood = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    source = Column(String(50), default="manual")  # manual, voice
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="self_reports")
