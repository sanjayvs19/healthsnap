from typing import List
from datetime import date, timedelta
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.activity import ActivityRecord
from app.schemas.activity import ActivityCreate, ActivityResponse, ActivitySummaryResponse, WeeklyActivityItem
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/activity", tags=["Activity & Movement"])

@router.post("", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def log_activity(
    activity_in: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log or update daily activity metrics"""
    rec_date = activity_in.record_date or date.today()
    record = db.query(ActivityRecord).filter(
        ActivityRecord.user_id == current_user.id,
        ActivityRecord.record_date == rec_date
    ).first()

    percent = min(100, int((activity_in.steps / max(1, activity_in.goal)) * 100))

    if not record:
        record = ActivityRecord(
            user_id=current_user.id,
            record_date=rec_date,
            steps=activity_in.steps,
            goal=activity_in.goal,
            active_minutes=activity_in.active_minutes,
            active_goal=activity_in.active_goal,
            distance_km=activity_in.distance_km,
            calories_burned=activity_in.calories_burned,
            percent_achieved=percent
        )
        db.add(record)
    else:
        record.steps = activity_in.steps
        record.goal = activity_in.goal
        record.active_minutes = activity_in.active_minutes
        record.active_goal = activity_in.active_goal
        record.distance_km = activity_in.distance_km
        record.calories_burned = activity_in.calories_burned
        record.percent_achieved = percent

    db.commit()
    db.refresh(record)
    return record

@router.get("", response_model=ActivitySummaryResponse)
def get_activity_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve activity summary and weekly movement data"""
    today = date.today()
    record = db.query(ActivityRecord).filter(
        ActivityRecord.user_id == current_user.id,
        ActivityRecord.record_date == today
    ).first()

    if not record:
        # Create baseline record for today
        record = ActivityRecord(
            user_id=current_user.id,
            record_date=today,
            steps=6420,
            goal=8000,
            active_minutes=48,
            active_goal=60,
            distance_km=4.3,
            calories_burned=412,
            percent_achieved=80
        )
        db.add(record)
        db.commit()
        db.refresh(record)

    # 7-day weekly history
    weekly_items = []
    days_map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        past_rec = db.query(ActivityRecord).filter(
            ActivityRecord.user_id == current_user.id,
            ActivityRecord.record_date == d
        ).first()
        day_name = days_map[d.weekday()]
        weekly_items.append(WeeklyActivityItem(
            day=day_name,
            steps=past_rec.steps if past_rec else max(2000, record.steps - (i * 200)),
            activeMin=past_rec.active_minutes if past_rec else max(20, record.active_minutes - (i * 2))
        ))

    return ActivitySummaryResponse(
        current=record,
        weeklyData=weekly_items
    )
