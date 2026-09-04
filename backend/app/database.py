import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("gymforce.database")


def create_db_engine():
    """Create SQLAlchemy engine. If configured remote database is unreachable, fallback to SQLite."""
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite"):
        return create_engine(db_url, connect_args={"check_same_thread": False}, echo=False)

    try:
        # Test connection with a short timeout to prevent blocking if network/host is unreachable
        test_engine = create_engine(db_url, connect_args={"connect_timeout": 3}, echo=False)
        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return test_engine
    except Exception as exc:
        print(f"⚠️ [DATABASE] Remote database connection failed ({exc}). Falling back to local SQLite: sqlite:///./gymforce.db")
        return create_engine("sqlite:///./gymforce.db", connect_args={"check_same_thread": False}, echo=False)


engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that provides a database session per request and handles rollback/close."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

