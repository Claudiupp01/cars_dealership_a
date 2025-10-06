# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

print(f"🔍 DATABASE_URL from .env: {DATABASE_URL}")  # Debug print

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not found in .env file!")
    print(f"📂 Current directory: {os.getcwd()}")
    print(f"📄 .env file exists: {os.path.exists('.env')}")
    raise ValueError("DATABASE_URL environment variable is not set")

# Create database engine with connection pooling and timeout settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=5,
    max_overflow=10,
    connect_args={
        "connect_timeout": 10,  # 10 second timeout
    }
)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our database models
Base = declarative_base()

# Dependency to get database session
def get_db():
    """
    This function creates a database session for each request
    and closes it when done
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Test connection on startup
def test_connection():
    """Test database connection"""
    try:
        print("🔄 Testing database connection...")
        connection = engine.connect()
        connection.close()
        print("✅ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False