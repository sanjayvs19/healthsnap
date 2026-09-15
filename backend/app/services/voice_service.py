from typing import Optional, Dict, Any
from fastapi import HTTPException, UploadFile, status

ALLOWED_AUDIO_TYPES = ["audio/webm", "audio/wav", "audio/mp3", "audio/mpeg", "audio/ogg", "audio/x-m4a", "audio/m4a"]
MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

class VoiceTranscriptionService:
    """
    Clean abstraction for Speech-To-Text and wellness signal extraction.
    Can be connected to Whisper or cloud STT models.
    """

    @staticmethod
    async def validate_audio(file: UploadFile) -> bytes:
        content = await file.read()
        if len(content) > MAX_AUDIO_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Audio file size exceeds maximum limit of 15MB."
            )
        if len(content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded audio file is empty."
            )
        return content

    @staticmethod
    def extract_wellness_markers(transcript_text: str) -> Dict[str, Any]:
        """
        Parses text for subjective health awareness signals.
        Non-diagnostic: maps user expressions to general wellness indicators.
        """
        lower = transcript_text.lower()
        
        # Sleep cue
        is_poor_sleep = any(w in lower for w in ["sleep", "tired", "insomnia", "woke up", "exhausted", "restless"])
        # Activity cue
        is_workout = any(w in lower for w in ["run", "jog", "workout", "gym", "walk", "stretch", "exercise"])
        # Stress / Tension cue
        is_stress = any(w in lower for w in ["headache", "pain", "stress", "tense", "tight", "anxious", "pressure"])

        mood = "Good"
        feeling = "Good"
        energy = "Moderate"
        severity = "Mild"

        if is_stress:
            mood = "Stressed"
            feeling = "Stressed"
            severity = "Moderate"
        elif is_poor_sleep:
            mood = "Tired"
            feeling = "Tired"
            energy = "Low"
            severity = "Moderate"
        elif is_workout:
            mood = "Energized"
            feeling = "Great"
            energy = "High"

        # General non-clinical wellness guidance
        if is_workout:
            guidance = "Solid physical activity! Gentle stretching and replenishing electrolytes support natural muscle recovery."
        elif is_stress:
            guidance = "Tension and prolonged focus often coincide with mild fatigue. Consider drinking 400ml water and resting your eyes."
        elif is_poor_sleep:
            guidance = "Your wellness signals suggest rest debt. Consider an early wind-down routine and reducing evening blue light."
        else:
            guidance = "Wellness observations recorded. Keep monitoring your daily signals and maintaining balance."

        return {
            "transcription": transcript_text,
            "understanding": {
                "sleep": "Poor / Disrupted" if is_poor_sleep else "Normal",
                "energy": energy,
                "mood": mood,
                "stressLevel": "Moderate" if is_stress else "Low"
            },
            "feeling": feeling,
            "severity": severity,
            "guidance": guidance,
            "disclaimer": "Voice analysis provides subjective wellness logging and does not constitute medical diagnosis."
        }

voice_service = VoiceTranscriptionService()
