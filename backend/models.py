# backend/models.py - ENHANCED VERSION
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
from database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Car(Base):
    """
    Enhanced Car model with color field
    """
    __tablename__ = "cars"

    # Existing columns
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    mileage = Column(Integer, nullable=False)
    image = Column(String(500))
    featured = Column(Boolean, default=False)
    description = Column(Text)
    
    # Specifications
    engine = Column(String(100))
    transmission = Column(String(100))
    fuel = Column(String(50))
    
    # NEW: Color field
    color = Column(String(50), nullable=True)  # e.g., "Black", "White", "Silver"
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        """
        Converts the database object to a dictionary
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
            "color": self.color,  # NEW: Include color in response
            "specs": {
                "engine": self.engine,
                "transmission": self.transmission,
                "fuel": self.fuel
            },
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# Keep all your other models (User, Favorite, TestDrive, ContactInquiry) as they are

class User(Base):
    """User model for authentication"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default='user', nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "full_name": self.full_name,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
    
class Favorite(Base):
    """User's favorite cars"""
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    car_id = Column(Integer, ForeignKey('cars.id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "car_id": self.car_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class TestDrive(Base):
    """Test drive requests"""
    __tablename__ = "test_drives"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    car_id = Column(Integer, ForeignKey('cars.id', ondelete='CASCADE'), nullable=False)
    preferred_date = Column(String(100))
    preferred_time = Column(String(100))
    phone = Column(String(50))
    message = Column(Text)
    status = Column(String(50), default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "car_id": self.car_id,
            "preferred_date": self.preferred_date,
            "preferred_time": self.preferred_time,
            "phone": self.phone,
            "message": self.message,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ContactInquiry(Base):
    """Contact form submissions"""
    __tablename__ = "contact_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    subject = Column(String(255))
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "subject": self.subject,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }