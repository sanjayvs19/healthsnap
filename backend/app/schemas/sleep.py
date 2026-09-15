from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime

class SleepCreate(BaseModel):
    record_date: Optional[date] = None
    hours: float = Field(..., ge=0, le=24)
    duration_str: Optional[str] = None
    quality: str = "Good"
    efficiency: int = 85
    deep_sleep: Optional[str] = "1h 30m"
    rem_sleep: Optional[str] = "1h 20m"
    light_sleep: Optional[str] = "4h 10m"

class SleepResponse(BaseModel):
    id: int
    user_id: int
    record_date: date
    hours: float
    duration_str: str
    quality: str
    efficiency: int
    deep_sleep: str
    rem_sleep: str
    light_sleep: str
    created_at: datetime

    class Config:
        from_attributes = True

class WeeklySleepItem(BaseModel):
    day: str
    duration: str
    hours: float
    quality: str

class SleepSummaryResponse(BaseModel):
    current: SleepResponse
    weeklyData: List[WeeklySleepItem]
    awarenessMessage: str
