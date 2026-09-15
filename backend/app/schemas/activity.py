from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime

class ActivityCreate(BaseModel):
    record_date: Optional[date] = None
    steps: int = Field(..., ge=0)
    goal: int = 8000
    active_minutes: int = 0
    active_goal: int = 60
    distance_km: float = 0.0
    calories_burned: int = 0

class ActivityResponse(BaseModel):
    id: int
    user_id: int
    record_date: date
    steps: int
    goal: int
    active_minutes: int
    active_goal: int
    distance_km: float
    calories_burned: int
    percent_achieved: int
    created_at: datetime

    class Config:
        from_attributes = True

class WeeklyActivityItem(BaseModel):
    day: str
    steps: int
    activeMin: int

class ActivitySummaryResponse(BaseModel):
    current: ActivityResponse
    weeklyData: List[WeeklyActivityItem]
