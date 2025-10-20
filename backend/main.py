# backend/main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
from database import engine, get_db, Base, test_connection
from pydantic import BaseModel
import sys

from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import auth

# Test database connection BEFORE creating tables
print("=" * 50)
print("Starting Elite Motors API...")
print("=" * 50)

if not test_connection():
    print("\nCannot start server - database connection failed")
    print("Make sure Docker PostgreSQL is running:")
    print("   docker-compose up -d")
    print("   docker ps")
    sys.exit(1)

# Create all database tables (INCLUDING users table)
try:
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
except Exception as e:
    print(f"Failed to create tables: {e}")
    sys.exit(1)

# Create FastAPI app
app = FastAPI(title="Elite Motors API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= AUTHENTICATION ENDPOINTS =============

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: str = None

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: str
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

@app.post("/api/auth/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if email already exists
    if db.query(models.User).filter(models.User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists
    if db.query(models.User).filter(models.User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    hashed_password = auth.get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role='user'  # Changed to string
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user.to_dict()

@app.post("/api/auth/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get JWT token"""
    # Find user by email or username
    user = db.query(models.User).filter(
        (models.User.email == form_data.username) | 
        (models.User.username == form_data.username)
    ).first()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Create access token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict()
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_active_user)):
    """Get current logged-in user info"""
    return current_user.to_dict()

# Pydantic models for request/response validation
class CarSpecs(BaseModel):
    engine: str
    transmission: str
    fuel: str

class CarCreate(BaseModel):
    name: str
    price: int
    year: int
    mileage: int
    image: str
    featured: bool = False
    description: str
    specs: CarSpecs
    color: str = None  # NEW: Add color field (optional)

class CarResponse(BaseModel):
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
    return {
        "message": "Welcome to Elite Motors API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/cars", response_model=List[CarResponse])
def get_all_cars(db: Session = Depends(get_db)):
    """Get all cars from database - PUBLIC endpoint"""
    cars = db.query(models.Car).all()
    return [car.to_dict() for car in cars]

@app.post("/api/cars", response_model=CarResponse)
def create_car(
    car: CarCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_owner)
):
    """Add a new car (Owner or Admin only)"""
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
        fuel=car.specs.fuel,
        color=car.color  # NEW: Add color
    )
    
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    
    return db_car.to_dict()

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

@app.put("/api/cars/{car_id}", response_model=CarResponse)
def update_car(
    car_id: int,
    car: CarCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_owner)
):
    """Update an existing car (Owner or Admin only)"""
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
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
    db_car.color = car.color  # NEW: Update color
    
    db.commit()
    db.refresh(db_car)
    
    return db_car.to_dict()

@app.delete("/api/cars/{car_id}")
def delete_car(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_owner)
):
    """Delete a car (Owner or Admin only)"""
    db_car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if db_car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    
    db.delete(db_car)
    db.commit()
    
    return {"success": True, "message": "Car deleted successfully"}

@app.post("/api/seed")
def seed_database(db: Session = Depends(get_db)):
    """Populate database with sample cars"""
    existing_cars = db.query(models.Car).count()
    if existing_cars > 0:
        return {"message": f"Database already has {existing_cars} cars"}
    
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
            "fuel": "Gasoline",
            "color": "Black"  # NEW
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
            "fuel": "Gasoline",
            "color": "Blue"  # NEW
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
            "fuel": "Gasoline",
            "color": "Silver"  # NEW
        },
        {
            "name": "Tesla Model S Plaid",
            "price": 89000,
            "year": 2023,
            "mileage": 6000,
            "image": "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
            "featured": False,
            "description": "Fastest accelerating production car with autopilot",
            "engine": "Electric Tri-Motor",
            "transmission": "Single-Speed",
            "fuel": "Electric",
            "color": "White"  # NEW
        },
        {
            "name": "Audi e-tron GT",
            "price": 105000,
            "year": 2023,
            "mileage": 2000,
            "image": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop",
            "featured": True,
            "description": "Electric gran turismo combining performance and sustainability",
            "engine": "Electric Twin Motor",
            "transmission": "Single-Speed",
            "fuel": "Electric",
            "color": "Gray"  # NEW
        },
        {
            "name": "Range Rover Sport",
            "price": 92000,
            "year": 2023,
            "mileage": 7000,
            "image": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
            "featured": False,
            "description": "Luxury SUV with exceptional off-road capability",
            "engine": "3.0L Supercharged V6",
            "transmission": "Automatic",
            "fuel": "Gasoline",
            "color": "Green"  # NEW
        }
    ]
    
    for car_data in sample_cars:
        db_car = models.Car(**car_data)
        db.add(db_car)
    
    db.commit()
    
    return {"message": f"Added {len(sample_cars)} cars to database"}

# ============= ADMIN ENDPOINTS =============

class RoleUpdate(BaseModel):
    role: str

@app.put("/api/admin/users/{user_id}/role")
def update_user_role(
    user_id: int,
    role_data: RoleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    """Update user role (Admin only)"""
    if role_data.role not in ['user', 'admin', 'owner']:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = role_data.role
    db.commit()
    db.refresh(user)
    
    return user.to_dict()

@app.get("/api/admin/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    """Get all users (Admin only)"""
    users = db.query(models.User).all()
    return [user.to_dict() for user in users]

@app.delete("/api/admin/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_admin)
):
    """Delete a user (Admin only)"""
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    username = user.username
    db.delete(user)
    db.commit()
    
    return {"success": True, "message": f"User {username} deleted successfully"}

# ============= USER ENDPOINTS =============

class FavoriteCreate(BaseModel):
    car_id: int

class TestDriveCreate(BaseModel):
    car_id: int
    preferred_date: str
    preferred_time: str
    phone: str
    message: str = ""

class ContactInquiryCreate(BaseModel):
    name: str
    email: str
    phone: str = ""
    subject: str = ""
    message: str

@app.get("/api/user/favorites")
def get_user_favorites(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Get current user's favorite cars"""
    favorites = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id
    ).all()
    
    result = []
    for fav in favorites:
        car = db.query(models.Car).filter(models.Car.id == fav.car_id).first()
        if car:
            result.append({
                "favorite_id": fav.id,
                "car": car.to_dict(),
                "added_at": fav.created_at.isoformat() if fav.created_at else None
            })
    
    return result

@app.post("/api/user/favorites")
def add_favorite(
    favorite: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Add a car to favorites"""
    existing = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.car_id == favorite.car_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Car already in favorites")
    
    car = db.query(models.Car).filter(models.Car.id == favorite.car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    new_favorite = models.Favorite(
        user_id=current_user.id,
        car_id=favorite.car_id
    )
    
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    
    return {"success": True, "message": "Car added to favorites"}

@app.delete("/api/user/favorites/{car_id}")
def remove_favorite(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Remove a car from favorites"""
    favorite = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.car_id == car_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"success": True, "message": "Car removed from favorites"}

@app.get("/api/user/test-drives")
def get_user_test_drives(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Get current user's test drive requests"""
    test_drives = db.query(models.TestDrive).filter(
        models.TestDrive.user_id == current_user.id
    ).order_by(models.TestDrive.created_at.desc()).all()
    
    result = []
    for td in test_drives:
        car = db.query(models.Car).filter(models.Car.id == td.car_id).first()
        if car:
            result.append({
                **td.to_dict(),
                "car": car.to_dict()
            })
    
    return result

@app.post("/api/user/test-drives")
def request_test_drive(
    test_drive: TestDriveCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Request a test drive"""
    car = db.query(models.Car).filter(models.Car.id == test_drive.car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    new_test_drive = models.TestDrive(
        user_id=current_user.id,
        car_id=test_drive.car_id,
        preferred_date=test_drive.preferred_date,
        preferred_time=test_drive.preferred_time,
        phone=test_drive.phone,
        message=test_drive.message,
        status='pending'
    )
    
    db.add(new_test_drive)
    db.commit()
    db.refresh(new_test_drive)
    
    return {"success": True, "message": "Test drive request submitted successfully"}

@app.post("/api/contact")
def submit_contact_inquiry(inquiry: ContactInquiryCreate, db: Session = Depends(get_db)):
    """Submit a contact inquiry"""
    new_inquiry = models.ContactInquiry(
        user_id=None,
        name=inquiry.name,
        email=inquiry.email,
        phone=inquiry.phone,
        subject=inquiry.subject,
        message=inquiry.message
    )
    
    db.add(new_inquiry)
    db.commit()
    
    return {"success": True, "message": "Your message has been sent. We'll get back to you soon!"}

if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 50)
    print("🚀 Starting server on http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("=" * 50 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)