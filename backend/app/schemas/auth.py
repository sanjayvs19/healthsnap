from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserSignUp(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str = Field(..., min_length=8, max_length=200)
    new_password: str = Field(..., min_length=6, max_length=128)

from typing import Optional, List, Dict, Any, Union

class UserResponse(BaseModel):
    id: Union[str, int]
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    goals: List[str] = []
    settings: Dict[str, Any] = {}
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
