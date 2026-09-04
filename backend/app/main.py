from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.seed import seed_database
from app.routers import (
    auth_router,
    members_router,
    plans_router,
    payments_router,
    subscriptions_router,
    attendance_router,
    inquiries_router,
    operations_router,
    dashboard_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize database tables and seed initial demo data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers under the /api prefix
api_prefix = settings.API_PREFIX
app.include_router(auth_router, prefix=api_prefix)
app.include_router(members_router, prefix=api_prefix)
app.include_router(plans_router, prefix=api_prefix)
app.include_router(payments_router, prefix=api_prefix)
app.include_router(subscriptions_router, prefix=api_prefix)
app.include_router(attendance_router, prefix=api_prefix)
app.include_router(inquiries_router, prefix=api_prefix)
app.include_router(operations_router, prefix=api_prefix)
app.include_router(dashboard_router, prefix=api_prefix)


@app.get("/")
def root():
    """Root entry point with service metadata and documentation links."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/api/docs",
        "redoc": "/api/redoc",
        "health": "/api/health",
        "message": "GymForce FastAPI Backend is up and running.",
    }
