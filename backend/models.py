# backend/models.py
from sqlalchemy import Column, Integer, String, Boolean, Float, Text
from database import Base

class Car(Base):
    """
    This class represents the 'cars' table in the database.
    Each attribute becomes a column in the table.
    """
    __tablename__ = "cars"  # Name of the table in database

    # Columns
    id = Column(Integer, primary_key=True, index=True)  # Auto-incrementing ID
    name = Column(String(255), nullable=False)  # Car name (required)
    price = Column(Integer, nullable=False)  # Price in dollars
    year = Column(Integer, nullable=False)  # Manufacturing year
    mileage = Column(Integer, nullable=False)  # Miles driven
    image = Column(String(500))  # URL to car image
    featured = Column(Boolean, default=False)  # Is this a featured car?
    description = Column(Text)  # Long description
    
    # Specifications stored as separate columns
    engine = Column(String(100))  # Engine type
    transmission = Column(String(100))  # Transmission type
    fuel = Column(String(50))  # Fuel type

    def to_dict(self):
        """
        Converts the database object to a dictionary
        This makes it easy to send as JSON to the frontend
        """
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "year": self.year,
            "mileage": self.mileage,
            "image": self.image,
            "featured": self.featured,
            "description": self.description,
            "specs": {
                "engine": self.engine,
                "transmission": self.transmission,
                "fuel": self.fuel
            }
        }
    
# backend/models.py
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime
from database import Base
from datetime import datetime

# Keep your existing Car model...

class User(Base):
    """User model for authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default='user', nullable=False)  # Changed from Enum to String
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert user to dictionary (without password)"""
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "full_name": self.full_name,
            "role": self.role,  # Already a string now
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }