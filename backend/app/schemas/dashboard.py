from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.schemas.auth import UserResponse
from app.schemas.wellness import WellnessResponse
from app.schemas.food import FoodLogResponse
from app.schemas.activity import ActivityResponse, WeeklyActivityItem
from app.schemas.sleep import SleepResponse, WeeklySleepItem
from app.schemas.self_report import SelfReportResponse
from app.schemas.ai import AIPattern, AIGuidance

class DashboardResponse(BaseModel):
    user: UserResponse
    wellnessScore: Dict[str, Any]
    activity: Dict[str, Any]
    sleep: Dict[str, Any]
    foodLogs: List[Dict[str, Any]]
    journalEntries: List[Dict[str, Any]]
    patterns: List[AIPattern]
    guidance: List[AIGuidance]
    notifications: List[Dict[str, Any]]
    disclaimer: str = "HealthSnap is an AI-powered wellness awareness companion. It is not intended to provide medical advice, diagnosis, or treatment."
