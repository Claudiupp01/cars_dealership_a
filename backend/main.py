# backend/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
from database import engine, get_db, Base
from pydantic import BaseModel

# Create all database tables
# This reads models.py and creates tables in PostgreSQL
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(title="Elite Motors API", version="1.0.0")

# Enable CORS (allows React to connect from different port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class CarSpecs(BaseModel):
    engine: str
    transmission: str
    fuel: str

class CarCreate(BaseModel):
    """Schema for creating a new car"""
    name: str
    price: int
    year: int
    mileage: int
    image: str
    featured: bool = False
    description: str
    specs: CarSpecs

class CarResponse(BaseModel):
    """Schema for car response"""
    id: int
    name: str
    price: int
    year: int
    mileage: int
    image: str
    featured: bool
    description: str
    specs: CarSpecs

    class Config:
        from_attributes = True

# ============= API ENDPOINTS =============

@app.get("/")
def read_root():
    """Homepage endpoint"""
    return {
        "message": "Welcome to Elite Motors API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/cars", response_model=List[CarResponse])
def get_all_cars(db: Session = Depends(get_db)):
    """
    Get all cars from database
    
    - db: Database session (automatically injected by FastAPI)
    """
    cars = db.query(models.Car).all()
    return [car.to_dict() for car in cars]

@app.get("/api/cars/featured", response_model=List[CarResponse])
def get_featured_cars(db: Session = Depends(get_db)):
    """Get only featured cars"""
    cars = db.query(models.Car).filter(models.Car.featured == True).all()
    return [car.to_dict() for car in cars]

@app.get("/api/cars/{car_id}", response_model=CarResponse)
def get_car_by_id(car_id: int, db: Session = Depends(get_db)):
    """Get a specific car by ID"""
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return car.to_dict()

@app.post("/api/cars", response_model=CarResponse)
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    """
    Add a new car to the database
    
    Example request body:
    {
        "name": "BMW M5",
        "price": 85000,
        "year": 2023,
        "mileage": 1000,
        "image": "https://example.com/image.jpg",
        "featured": true,
        "description": "High-performance sedan",
        "specs": {
            "engine": "4.4L V8",
            "transmission": "Automatic",
            "fuel": "Gasoline"
        }
    }
    """
    # Create new car object
    db_car = models.Car(
        name=car.name,
        price=car.price,
        year=car.year,
        mileage=car.mileage,
        image=car.image,
        featured=car.featured,
        description=car.description,
        engine=car.specs.engine,
        transmission=car.specs.transmission,
        fuel=car.specs.fuel
    )
    
    # Add to database
    db.add(db_car)
    db.commit()  # Save changes
    db.refresh(db_car)  # Get the ID that was auto-generated
    
    return db_car.to_dict()

@app.put("/api/cars/{car_id}", response_model=CarResponse)
def update_car(car_id: int, car: CarCreate, db: Session = Depends(get_db)):
    """Update an existing car"""
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Update all fields
    db_car.name = car.name
    db_car.price = car.price
    db_car.year = car.year
    db_car.mileage = car.mileage
    db_car.image = car.image
    db_car.featured = car.featured
    db_car.description = car.description
    db_car.engine = car.specs.engine
    db_car.transmission = car.specs.transmission
    db_car.fuel = car.specs.fuel
    
    db.commit()
    db.refresh(db_car)
    
    return db_car.to_dict()

@app.delete("/api/cars/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db)):
    """Delete a car from database"""
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db.delete(db_car)
    db.commit()
    
    return {"success": True, "message": "Car deleted successfully"}

@app.post("/api/seed")
def seed_database(db: Session = Depends(get_db)):
    """
    Populate database with sample cars
    Call this once to add initial data
    """
    # Check if database already has cars
    existing_cars = db.query(models.Car).count()
    if existing_cars > 0:
        return {"message": "Database already has cars"}
    
    # Sample cars to add
    sample_cars = [
        {
            "name": "Mercedes-Benz S-Class",
            "price": 95000,
            "year": 2023,
            "mileage": 5000,
            "image": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
            "featured": True,
            "description": "Luxury sedan with cutting-edge technology and comfort",
            "engine": "3.0L V6",
            "transmission": "Automatic",
            "fuel": "Gasoline"
        },
        {
            "name": "BMW M4 Competition",
            "price": 78000,
            "year": 2023,
            "mileage": 3000,
            "image": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
            "featured": True,
            "description": "High-performance sports coupe with racing DNA",
            "engine": "3.0L Twin-Turbo I6",
            "transmission": "Automatic",
            "fuel": "Gasoline"
        },
        {
            "name": "Porsche 911 Carrera",
            "price": 115000,
            "year": 2023,
            "mileage": 4000,
            "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
            "featured": True,
            "description": "Iconic sports car with timeless design",
            "engine": "3.0L Twin-Turbo Flat-6",
            "transmission": "PDK",
            "fuel": "Gasoline"
        }
    ]
    
    # Add all sample cars to database
    for car_data in sample_cars:
        db_car = models.Car(**car_data)
        db.add(db_car)
    
    db.commit()
    
    return {"message": f"Added {len(sample_cars)} cars to database"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)