import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserResponse
from app.schemas.user import UserProfileUpdate
from app.utils.dependencies import get_current_user
from app.routes.auth import format_user_response

router = APIRouter(prefix="/users", tags=["Users Profile"])

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve the current user's profile"""
    return format_user_response(current_user)

@router.put("/me", response_model=UserResponse)
def update_user_profile(
    profile_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update profile fields (name, goals, settings, avatar)"""
    if profile_data.full_name is not None:
        current_user.full_name = profile_data.full_name.strip()
    if profile_data.avatar_url is not None:
        current_user.avatar_url = profile_data.avatar_url
    if profile_data.goals is not None:
        current_user.goals = json.dumps(profile_data.goals)
    if profile_data.settings is not None:
        current_user.settings = json.dumps(profile_data.settings)

    db.commit()
    db.refresh(current_user)
    return format_user_response(current_user)
