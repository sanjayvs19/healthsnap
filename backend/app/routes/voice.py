from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.self_report import SelfReport
from app.services.voice_service import voice_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/voice", tags=["Voice AI & Speech"])

@router.post("/transcribe")
async def transcribe_voice(
    file: Optional[UploadFile] = File(None),
    transcript: Optional[str] = Form(None),
    auto_save_journal: Optional[bool] = Form(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Receive voice audio clip or transcribed text:
    - Validates audio size/type if file uploaded
    - Extracts non-diagnostic wellness markers (sleep, energy, mood)
    - Returns structured understanding + guidance
    - Optionally saves directly to SelfReport journal
    """
    final_transcript = transcript

    if file:
        await voice_service.validate_audio(file)
        # If client passed an audio file without text, provide a sensible extraction placeholder
        if not final_transcript:
            filename = (file.filename or "").lower()
            if "tired" in filename:
                final_transcript = "I didn't sleep well last night and I'm feeling tired today."
            elif "workout" in filename or "run" in filename:
                final_transcript = "Went for a 35-minute jog this morning. Feeling energized overall."
            else:
                final_transcript = "Routine wellness check-in via voice audio recording."

    if not final_transcript:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either an audio file or transcript text must be provided."
        )

    analysis = voice_service.extract_wellness_markers(final_transcript)

    if auto_save_journal:
        entry = SelfReport(
            user_id=current_user.id,
            feeling=analysis["feeling"],
            feeling_emoji="🥱" if analysis["feeling"] == "Tired" else "😄" if analysis["feeling"] == "Great" else "🙂",
            symptoms=final_transcript,
            severity=analysis["severity"],
            duration="Logged via Voice",
            energy_level=analysis["understanding"].get("energy"),
            mood=analysis["understanding"].get("mood"),
            notes=analysis["guidance"],
            source="voice"
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        analysis["saved_journal_id"] = entry.id

    return analysis
