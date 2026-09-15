from typing import List
from datetime import date, timedelta
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.sleep import SleepRecord
from app.schemas.sleep import SleepCreate, SleepResponse, SleepSummaryResponse, WeeklySleepItem
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/sleep", tags=["Sleep & Recovery"])

@router.post("", response_model=SleepResponse, status_code=status.HTTP_201_CREATED)
def log_sleep(
    sleep_in: SleepCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log or update daily sleep record"""
    rec_date = sleep_in.record_date or date.today()
    record = db.query(SleepRecord).filter(
        SleepRecord.user_id == current_user.id,
        SleepRecord.record_date == rec_date
    ).first()

    dur_str = sleep_in.duration_str or f"{int(sleep_in.hours)}h {int((sleep_in.hours % 1) * 60):02d}m"

    if not record:
        record = SleepRecord(
            user_id=current_user.id,
            record_date=rec_date,
            hours=sleep_in.hours,
            duration_str=dur_str,
            quality=sleep_in.quality,
            efficiency=sleep_in.efficiency,
            deep_sleep=sleep_in.deep_sleep or "1h 30m",
            rem_sleep=sleep_in.rem_sleep or "1h 20m",
            light_sleep=sleep_in.light_sleep or "4h 10m"
        )
        db.add(record)
    else:
        record.hours = sleep_in.hours
        record.duration_str = dur_str
        record.quality = sleep_in.quality
        record.efficiency = sleep_in.efficiency
        if sleep_in.deep_sleep:
            record.deep_sleep = sleep_in.deep_sleep
        if sleep_in.rem_sleep:
            record.rem_sleep = sleep_in.rem_sleep
        if sleep_in.light_sleep:
            record.light_sleep = sleep_in.light_sleep

    db.commit()
    db.refresh(record)
    return record

@router.get("", response_model=SleepSummaryResponse)
def get_sleep_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve sleep metrics and 7-day sleep logs"""
    today = date.today()
    record = db.query(SleepRecord).filter(
        SleepRecord.user_id == current_user.id,
        SleepRecord.record_date == today
    ).first()

    if not record:
        record = SleepRecord(
            user_id=current_user.id,
            record_date=today,
            hours=6.5,
            duration_str="6h 30m",
            quality="Good",
            efficiency=84,
            deep_sleep="1h 45m",
            rem_sleep="1h 20m",
            light_sleep="3h 25m"
        )
        db.add(record)
        db.commit()
        db.refresh(record)

    weekly_items = []
    days_map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        past_rec = db.query(SleepRecord).filter(
            SleepRecord.user_id == current_user.id,
            SleepRecord.record_date == d
        ).first()
        day_name = days_map[d.weekday()]
        h = past_rec.hours if past_rec else (6.5 + (0.3 * (i % 3)))
        q = past_rec.quality if past_rec else ("Optimal" if h >= 7.5 else "Good" if h >= 6.5 else "Fair")
        weekly_items.append(WeeklySleepItem(
            day=day_name,
            duration=f"{int(h)}h {int((h % 1) * 60):02d}m",
            hours=round(h, 2),
            quality=q
        ))

    awareness_msg = "Your sleep duration has been slightly below your target on several days. Consider establishing a 30-minute wind-down routine."
    if record.hours >= 7.5:
        awareness_msg = "Your recent sleep meets your target range. Keep your bedtime consistent to maintain this recovery rhythm."

    return SleepSummaryResponse(
        current=record,
        weeklyData=weekly_items,
        awarenessMessage=awareness_msg
    )
