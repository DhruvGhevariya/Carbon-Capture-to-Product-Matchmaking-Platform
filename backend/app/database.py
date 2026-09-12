from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import settings

# Determine database engine parameters
connect_args = {}
database_url = settings.DATABASE_URL

# Support fallback to SQLite if postgres is not configured in development
if database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    database_url,
    echo=settings.DEBUG,
    future=True,
    connect_args=connect_args
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields an asynchronous database session.
    Automatically closes session after request lifecycle.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """
    Initializes database tables based on registered SQLAlchemy models.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
