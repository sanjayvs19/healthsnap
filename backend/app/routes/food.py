import json
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.food import FoodRecord
from app.schemas.food import FoodAnalysisResponse, FoodLogCreate, FoodLogResponse
from app.services.food_service import food_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/food", tags=["Food & Nutrition"])

def format_food_response(food: FoodRecord) -> FoodLogResponse:
    detected = []
    if food.detected_items:
        try:
            detected = json.loads(food.detected_items)
        except Exception:
            detected = [food.detected_items]

    return FoodLogResponse(
        id=food.id,
        user_id=food.user_id,
        title=food.title,
        category=food.category,
        image_url=food.image_url,
        calories=food.calories,
        protein=food.protein,
        carbs=food.carbs,
        fat=food.fat,
        fiber=food.fiber,
        status=food.status,
        detected_items=detected,
        suggestion=food.suggestion,
        created_at=food.created_at
    )

@router.post("/analyze", response_model=FoodAnalysisResponse)
async def analyze_food_plate(
    file: UploadFile = File(...),
    custom_name: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    """
    Upload and analyze food photo:
    - Validates file type and size (< 10MB)
    - Processes image through clean FoodAnalysisService abstraction
    - Returns structured nutrition data and non-diagnostic disclaimer
    """
    return await food_service.analyze_food_image(file, custom_name)

@router.post("", response_model=FoodLogResponse, status_code=status.HTTP_201_CREATED)
def log_meal(
    meal_in: FoodLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save a meal entry to user's food diary"""
    detected_str = None
    if meal_in.detected_items:
        detected_str = json.dumps(meal_in.detected_items)

    food_entry = FoodRecord(
        user_id=current_user.id,
        title=meal_in.title,
        category=meal_in.category or "Balanced Meal",
        image_url=meal_in.image_url,
        calories=meal_in.calories,
        protein=meal_in.protein,
        carbs=meal_in.carbs,
        fat=meal_in.fat,
        fiber=meal_in.fiber,
        status=meal_in.status or "Nutrient Balanced",
        detected_items=detected_str,
        suggestion=meal_in.suggestion
    )
    db.add(food_entry)
    db.commit()
    db.refresh(food_entry)
    return format_food_response(food_entry)

@router.get("", response_model=List[FoodLogResponse])
def get_food_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve meal diary history for authenticated user"""
    records = db.query(FoodRecord).filter(FoodRecord.user_id == current_user.id).order_by(FoodRecord.created_at.desc()).all()
    return [format_food_response(r) for r in records]
