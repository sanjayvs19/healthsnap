from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.wellness import router as wellness_router
from app.routes.food import router as food_router
from app.routes.voice import router as voice_router
from app.routes.activity import router as activity_router
from app.routes.sleep import router as sleep_router
from app.routes.ai import router as ai_router
from app.routes.dashboard import router as dashboard_router
from app.routes.reports import router as reports_router

__all__ = [
    "auth_router",
    "users_router",
    "wellness_router",
    "food_router",
    "voice_router",
    "activity_router",
    "sleep_router",
    "ai_router",
    "dashboard_router",
    "reports_router"
]
