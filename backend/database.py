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

# Create database engine
# This is the connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# Create a session factory
# Sessions are used to talk to the database
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