from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.ai import AIAnalysisResponse
from app.services.ai_service import ai_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Pattern Analysis"])

@router.post("/analyze", response_model=AIAnalysisResponse)
def run_ai_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Multimodal AI Pattern Analysis Engine:
    - Combines user's food records, activity, sleep, and self-reports
    - Correlates cross-domain signals
    - Returns structured patterns, actionable guidance, and medical disclaimers
    """
    return ai_service.analyze_user_wellness(db, current_user.id)
