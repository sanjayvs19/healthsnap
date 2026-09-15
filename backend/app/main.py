from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import engine, Base
import app.models  # Ensures all models are registered on Base.metadata
from app.routes import (
    auth_router,
    users_router,
    wellness_router,
    food_router,
    voice_router,
    activity_router,
    sleep_router,
    ai_router,
    dashboard_router,
    reports_router
)

# Initialize database schema tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HealthSnap API",
    description="Backend REST API for HealthSnap — AI-Powered Wellness Awareness Companion. Provides user authentication, wellness tracking, food recognition abstraction, voice processing, and multimodal pattern synthesis.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global custom exception handler to avoid leaking raw Python tracebacks
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred. Please try again later."}
    )

# Include all API Routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(wellness_router, prefix="/api")
app.include_router(food_router, prefix="/api")
app.include_router(voice_router, prefix="/api")
app.include_router(activity_router, prefix="/api")
app.include_router(sleep_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(reports_router, prefix="/api")

@app.get("/", tags=["Health"])
def root():
    return {
        "name": "HealthSnap API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "disclaimer": "HealthSnap is a wellness-awareness application and does not provide medical diagnosis."
    }

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "healthsnap-backend"}
