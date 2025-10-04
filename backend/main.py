# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Elite Motors API")

# Enable CORS so your React frontend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class CarSpecs(BaseModel):
    engine: str
    transmission: str
    fuel: str

class Car(BaseModel):
    id: int
    name: str
    price: int
    year: int
    mileage: int
    image: str
    featured: bool
    description: str
    specs: CarSpecs

class ContactMessage(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

# Mock database - replace with real database later
cars_db = [
    {
        "id": 1,
        "name": "Mercedes-Benz S-Class",
        "price": 95000,
        "year": 2023,
        "mileage": 5000,
        "image": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
        "featured": True,
        "description": "Luxury sedan with cutting-edge technology and comfort",
        "specs": {"engine": "3.0L V6", "transmission": "Automatic", "fuel": "Gasoline"}
    },
    {
        "id": 2,
        "name": "BMW M4 Competition",
        "price": 78000,
        "year": 2023,
        "mileage": 3000,
        "image": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
        "featured": True,
        "description": "High-performance sports coupe with racing DNA",
        "specs": {"engine": "3.0L Twin-Turbo I6", "transmission": "Automatic", "fuel": "Gasoline"}
    },
    {
        "id": 3,
        "name": "Audi e-tron GT",
        "price": 105000,
        "year": 2023,
        "mileage": 2000,
        "image": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop",
        "featured": False,
        "description": "Electric gran turismo combining performance and sustainability",
        "specs": {"engine": "Electric", "transmission": "Automatic", "fuel": "Electric"}
    },
    {
        "id": 4,
        "name": "Porsche 911 Carrera",
        "price": 115000,
        "year": 2023,
        "mileage": 4000,
        "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
        "featured": True,
        "description": "Iconic sports car with timeless design",
        "specs": {"engine": "3.0L Twin-Turbo Flat-6", "transmission": "PDK", "fuel": "Gasoline"}
    },
    {
        "id": 5,
        "name": "Tesla Model S Plaid",
        "price": 89000,
        "year": 2023,
        "mileage": 6000,
        "image": "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
        "featured": False,
        "description": "Fastest accelerating production car with autopilot",
        "specs": {"engine": "Electric Tri-Motor", "transmission": "Single-Speed", "fuel": "Electric"}
    },
    {
        "id": 6,
        "name": "Range Rover Sport",
        "price": 92000,
        "year": 2023,
        "mileage": 7000,
        "image": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
        "featured": False,
        "description": "Luxury SUV with exceptional off-road capability",
        "specs": {"engine": "3.0L Supercharged V6", "transmission": "Automatic", "fuel": "Gasoline"}
    }
]

# API Endpoints

@app.get("/")
def read_root():
    return {"message": "Welcome to Elite Motors API", "version": "1.0"}

@app.get("/api/cars", response_model=List[Car])
def get_all_cars():
    """Get all cars in inventory"""
    return cars_db

@app.get("/api/cars/featured", response_model=List[Car])
def get_featured_cars():
    """Get only featured cars"""
    return [car for car in cars_db if car["featured"]]

@app.get("/api/cars/{car_id}", response_model=Car)
def get_car_by_id(car_id: int):
    """Get a specific car by ID"""
    car = next((car for car in cars_db if car["id"] == car_id), None)
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@app.post("/api/contact")
def submit_contact_form(message: ContactMessage):
    """Submit a contact form message"""
    # In production, you would save this to a database or send an email
    print(f"New contact message from {message.name}: {message.message}")
    return {
        "success": True,
        "message": "Thank you for your message! We'll get back to you soon."
    }

@app.post("/api/cars", response_model=Car)
def add_car(car: Car):
    """Add a new car to inventory (admin only in production)"""
    cars_db.append(car.dict())
    return car

@app.put("/api/cars/{car_id}", response_model=Car)
def update_car(car_id: int, car: Car):
    """Update an existing car (admin only in production)"""
    for i, existing_car in enumerate(cars_db):
        if existing_car["id"] == car_id:
            cars_db[i] = car.dict()
            return car
    raise HTTPException(status_code=404, detail="Car not found")

@app.delete("/api/cars/{car_id}")
def delete_car(car_id: int):
    """Delete a car from inventory (admin only in production)"""
    for i, car in enumerate(cars_db):
        if car["id"] == car_id:
            cars_db.pop(i)
            return {"success": True, "message": "Car deleted successfully"}
    raise HTTPException(status_code=404, detail="Car not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)