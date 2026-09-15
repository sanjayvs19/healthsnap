from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SelfReportCreate(BaseModel):
    feeling: str
    feeling_emoji: Optional[str] = "🙂"
    symptoms: Optional[str] = None
    severity: Optional[str] = "Mild"
    duration: Optional[str] = "1–3 hours"
    energy_level: Optional[str] = None
    mood: Optional[str] = None
    notes: Optional[str] = None
    source: Optional[str] = "manual"
    timestamp: Optional[datetime] = None

class SelfReportResponse(BaseModel):
    id: int
    user_id: int
    feeling: str
    feeling_emoji: str
    symptoms: Optional[str] = None
    severity: str
    duration: str
    energy_level: Optional[str] = None
    mood: Optional[str] = None
    notes: Optional[str] = None
    source: str
    created_at: datetime

    class Config:
        from_attributes = True
