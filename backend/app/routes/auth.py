import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserSignUp, UserLogin, Token, UserResponse
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def format_user_response(user: User) -> UserResponse:
    goals = []
    if user.goals:
        try:
            goals = json.loads(user.goals)
        except Exception:
            goals = []
    
    settings = {}
    if user.settings:
        try:
            settings = json.loads(user.settings)
        except Exception:
            settings = {}

    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        avatar_url=user.avatar_url,
        goals=goals,
        settings=settings,
        created_at=user.created_at
    )

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignUp, db: Session = Depends(get_db)):
    """
    Register a new user account:
    - Checks for duplicate email
    - Securely hashes password
    - Stores user in SQLite database
    - Generates and returns JWT access token + user details
    """
    existing_user = db.query(User).filter(User.email == user_data.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists. Please sign in instead."
        )

    hashed_pw = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email.lower(),
        full_name=user_data.full_name.strip(),
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.email)
    return Token(
        access_token=token,
        token_type="bearer",
        user=format_user_response(new_user)
    )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user credentials:
    - Verifies email and password hash
    - Returns JWT access token + user details
    """
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials and try again.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = create_access_token(subject=user.email)
    return Token(
        access_token=token,
        token_type="bearer",
        user=format_user_response(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user info"""
    return format_user_response(current_user)

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint. Client discards the token.
    """
    return {"message": "Successfully logged out from HealthSnap session."}
