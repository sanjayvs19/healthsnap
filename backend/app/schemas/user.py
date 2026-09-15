from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    goals: Optional[List[str]] = None
    settings: Optional[Dict[str, Any]] = None
