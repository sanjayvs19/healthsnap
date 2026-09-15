import os
import json
from typing import List

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "HealthSnap")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "healthsnap_super_secret_jwt_key_for_development_replace_in_production_32bytes")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # MongoDB Configuration
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE", "healthsnap")
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        raw = os.getenv("FRONTEND_CORS_ORIGINS", os.getenv("CORS_ORIGINS", '["http://localhost:3000","http://127.0.0.1:3000"]'))
        try:
            if raw.startswith("["):
                return json.loads(raw)
            return [o.strip() for o in raw.split(",") if o.strip()]
        except Exception:
            return ["http://localhost:3000", "http://127.0.0.1:3000"]

settings = Settings()

