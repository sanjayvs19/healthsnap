import os
import logging
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

logger = logging.getLogger("healthsnap.database")

# ==============================================================================
# 1. SQLAlchemy (SQLite / PostgreSQL) Configuration
# ==============================================================================
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./healthsnap.db")

# SQLite on a web service (especially on network-mounted disks) hits
# "database is locked" under concurrency. Enable WAL journaling, a generous
# busy timeout, and use NullPool so we never hold stale pooled connections.
connect_args = {}
pool_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False, "timeout": 30}
    pool_kwargs = {"poolclass": NullPool}
else:
    pool_kwargs = {"pool_pre_ping": True}

engine = create_engine(DATABASE_URL, connect_args=connect_args, **pool_kwargs)

if DATABASE_URL.startswith("sqlite"):

    @event.listens_for(engine, "connect")
    def set_sqlite_pragmas(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA busy_timeout=30000")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    FastAPI dependency that provides an isolated SQLAlchemy database session.
    """
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()


# ==============================================================================
# 2. MongoDB Support (Dual Database / Scalable Storage)
# ==============================================================================
client = None
db = None
users_collection = None
food_collection = None
activity_collection = None
sleep_collection = None
checkins_collection = None
wellness_collection = None
ai_insights_collection = None

try:
    from pymongo import MongoClient, ASCENDING, DESCENDING
    client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
    # Check connection
    client.admin.command('ping')
    db = client[settings.MONGODB_DATABASE]

    users_collection = db["users"]
    food_collection = db["food_records"]
    activity_collection = db["activity_records"]
    sleep_collection = db["sleep_records"]
    checkins_collection = db["checkins"]
    wellness_collection = db["wellness_records"]
    ai_insights_collection = db["ai_insights"]
    logger.info(f"Connected to MongoDB at {settings.MONGODB_URI}")
except Exception as mongo_err:
    logger.info(f"MongoDB not available ({mongo_err}). Using primary SQLite storage.")


def serialize_doc(doc: dict) -> dict:
    """
    Utility to serialize MongoDB BSON documents into JSON-compatible dicts.
    Converts ObjectId to string 'id'.
    """
    if not doc:
        return None
    d = dict(doc)
    if "_id" in d:
        d["id"] = str(d.pop("_id"))
    return d
