from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FoodNutrition(BaseModel):
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbohydrates: Optional[float] = None
    fat: Optional[float] = None
    fiber: Optional[float] = None

class FoodAnalysisResponse(BaseModel):
    food_name: str
    category: str
    nutrition: FoodNutrition
    detected_items: List[str] = []
    confidence: Optional[float] = None
    suggestion: Optional[str] = None
    disclaimer: str = "General wellness information only. Does not replace professional dietary advice."

class FoodLogCreate(BaseModel):
    title: str
    category: Optional[str] = "Balanced Meal"
    image_url: Optional[str] = None
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    fiber: Optional[float] = None
    status: Optional[str] = "Nutrient Balanced"
    detected_items: Optional[List[str]] = None
    suggestion: Optional[str] = None

class FoodLogResponse(BaseModel):
    id: int
    user_id: int
    title: str
    category: str
    image_url: Optional[str] = None
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    fiber: Optional[float] = None
    status: str
    detected_items: Optional[List[str]] = []
    suggestion: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
