import json
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.database import users_collection, serialize_doc, SessionLocal
from app.models.user import User
from app.config import settings
from app.schemas.auth import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

class UserModel(dict):
    """Dictionary subclass supporting dot-notation attribute access for smooth route compatibility"""
    def __getattr__(self, name):
        if name in self:
            return self[name]
        return None
    def __setattr__(self, name, value):
        self[name] = value

def get_current_user(
    token: str = Depends(oauth2_scheme)
) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception

    # 1. Try MongoDB if active
    if users_collection is not None:
        try:
            user_doc = users_collection.find_one({"email": token_data.email.lower()})
            if user_doc:
                serialized = serialize_doc(user_doc)
                return UserModel(serialized)
        except Exception:
            pass

    # 2. Try SQLite database
    db_session = SessionLocal()
    try:
        user_record = db_session.query(User).filter(User.email == token_data.email.lower()).first()
        if user_record:
            return UserModel({
                "id": user_record.id,
                "email": user_record.email,
                "full_name": user_record.full_name,
                "avatar_url": user_record.avatar_url,
                "goals": user_record.goals,
                "settings": user_record.settings,
                "created_at": user_record.created_at
            })
    finally:
        db_session.close()

    raise credentials_exception
