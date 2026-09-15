from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.wellness import WellnessRecord
from app.models.self_report import SelfReport
from app.schemas.wellness import WellnessCreate, WellnessUpdate, WellnessResponse
from app.schemas.self_report import SelfReportCreate, SelfReportResponse
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/wellness", tags=["Wellness Tracking"])

@router.post("", response_model=WellnessResponse, status_code=status.HTTP_201_CREATED)
def create_wellness_record(
    record_in: WellnessCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new wellness record for the authenticated user"""
    record = WellnessRecord(
        user_id=current_user.id,
        score=record_in.score,
        max_score=record_in.max_score,
        status=record_in.status,
        trend=record_in.trend,
        activity_subscore=record_in.activity_subscore,
        sleep_subscore=record_in.sleep_subscore,
        nutrition_subscore=record_in.nutrition_subscore,
        journal_subscore=record_in.journal_subscore,
        notes=record_in.notes
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("", response_model=List[WellnessResponse])
def get_wellness_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all wellness records for the authenticated user"""
    return db.query(WellnessRecord).filter(WellnessRecord.user_id == current_user.id).order_by(WellnessRecord.created_at.desc()).all()

@router.get("/{record_id}", response_model=WellnessResponse)
def get_wellness_record_by_id(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific wellness record (user-isolated)"""
    record = db.query(WellnessRecord).filter(
        WellnessRecord.id == record_id,
        WellnessRecord.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wellness record not found.")
    return record

@router.put("/{record_id}", response_model=WellnessResponse)
def update_wellness_record(
    record_id: int,
    record_in: WellnessUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a specific wellness record"""
    record = db.query(WellnessRecord).filter(
        WellnessRecord.id == record_id,
        WellnessRecord.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wellness record not found.")

    for field, val in record_in.dict(exclude_unset=True).items():
        setattr(record, field, val)

    db.commit()
    db.refresh(record)
    return record

@router.delete("/{record_id}", status_code=status.HTTP_200_OK)
def delete_wellness_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific wellness record"""
    record = db.query(WellnessRecord).filter(
        WellnessRecord.id == record_id,
        WellnessRecord.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wellness record not found.")

    db.delete(record)
    db.commit()
    return {"message": f"Wellness record {record_id} deleted successfully."}

@router.post("/self-report", response_model=SelfReportResponse, status_code=status.HTTP_201_CREATED)
def submit_self_report(
    report_in: SelfReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit subjective wellness self-report:
    - Feeling, symptoms, severity, duration, notes
    - Non-diagnostic: records observations only
    """
    entry = SelfReport(
        user_id=current_user.id,
        feeling=report_in.feeling,
        feeling_emoji=report_in.feeling_emoji or "🙂",
        symptoms=report_in.symptoms or "Routine wellness check-in",
        severity=report_in.severity or "Mild",
        duration=report_in.duration or "1–3 hours",
        energy_level=report_in.energy_level,
        mood=report_in.mood,
        notes=report_in.notes or "No extra notes",
        source=report_in.source or "manual",
        created_at=report_in.timestamp or datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/self-report", response_model=List[SelfReportResponse])
def get_self_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve self-reported wellness logs for authenticated user"""
    return db.query(SelfReport).filter(SelfReport.user_id == current_user.id).order_by(SelfReport.created_at.desc()).all()
