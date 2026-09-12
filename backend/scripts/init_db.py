import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url

# Ensure backend root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.config import settings
from app.database import Base
# Import all models so metadata discovers and registers all tables
import app.models


def init_database():
    sync_url_str = settings.sync_database_url
    if not sync_url_str:
        print("[InitDB Failure] SYNC_DATABASE_URL is not set or cannot be derived.")
        sys.exit(1)

    url = make_url(sync_url_str)
    target_db = url.database or "carbonx"

    print(f"[InitDB] Target database: '{target_db}'")
    print(f"[InitDB] Host: '{url.host}', Port: '{url.port}', User: '{url.username}'")

    # Step 1: Connect to maintenance database ('postgres') with AUTOCOMMIT to check/create target database
    if target_db:
        maintenance_url = url.set(database="postgres")
        print(f"[InitDB] Connecting to maintenance database to verify '{target_db}'...")
        try:
            maintenance_engine = create_engine(maintenance_url, isolation_level="AUTOCOMMIT")
            with maintenance_engine.connect() as conn:
                check_sql = text("SELECT 1 FROM pg_database WHERE datname = :dbname")
                result = conn.execute(check_sql, {"dbname": target_db}).scalar()
                if not result:
                    print(f"[InitDB] Database '{target_db}' does not exist. Creating database '{target_db}'...")
                    conn.execute(text(f'CREATE DATABASE "{target_db}"'))
                    print(f"[InitDB] Success: Database '{target_db}' created successfully.")
                else:
                    print(f"[InitDB] Database '{target_db}' already exists.")
            maintenance_engine.dispose()
        except Exception as err:
            print(f"[InitDB Failure] Failed during database check/creation: {err}")
            sys.exit(1)

    # Step 2: Connect to target database and create all SQLAlchemy tables
    print(f"[InitDB] Connecting to '{target_db}' using SYNC_DATABASE_URL to create tables...")
    try:
        target_engine = create_engine(url)
        with target_engine.begin() as conn:
            Base.metadata.create_all(bind=conn)
        target_engine.dispose()
        print(f"[InitDB] Success: All SQLAlchemy tables created successfully in '{target_db}'.")
        print("[InitDB] Database initialization finished successfully!")
    except Exception as err:
        print(f"[InitDB Failure] Failed to create tables in '{target_db}': {err}")
        sys.exit(1)


if __name__ == "__main__":
    init_database()
