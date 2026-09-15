from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime

class WellnessCreate(BaseModel):
    score: int = Field(..., ge=0, le=100)
    max_score: int = 100
    status: str = "Good"
    trend: str = "+4 pts vs last week"
    activity_subscore: int = 80
    sleep_subscore: int = 72
    nutrition_subscore: int = 82
    journal_subscore: int = 78
    notes: Optional[str] = None

class WellnessUpdate(BaseModel):
    score: Optional[int] = None
    status: Optional[str] = None
    trend: Optional[str] = None
    activity_subscore: Optional[int] = None
    sleep_subscore: Optional[int] = None
    nutrition_subscore: Optional[int] = None
    journal_subscore: Optional[int] = None
    notes: Optional[str] = None

class WellnessResponse(BaseModel):
    id: int
    user_id: int
    score: int
    max_score: int
    status: str
    trend: str
    activity_subscore: int
    sleep_subscore: int
    nutrition_subscore: int
    journal_subscore: int
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
