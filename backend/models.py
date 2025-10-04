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