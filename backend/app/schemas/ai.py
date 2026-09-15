from pydantic import BaseModel
from typing import List, Optional

class AIPattern(BaseModel):
    id: str
    title: str
    tags: List[str]
    signalIcons: List[str]
    correlation: str
    summary: str
    detail: str
    type: str = "observation"
    color: str = "emerald"

class AIGuidance(BaseModel):
    id: str
    title: str
    category: str
    icon: str
    description: str
    actionLabel: str
    completed: bool = False
    streak: str = "3 days"

class AIAnalysisResponse(BaseModel):
    patterns: List[AIPattern]
    guidance: List[AIGuidance]
    disclaimer: str = "HealthSnap provides wellness awareness information and does not provide medical diagnosis."
