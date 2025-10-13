-- postgres-init/01-init.sql

-- First: Create enum type
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Second: Create users table (no dependencies)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Third: Create cars table (no dependencies)
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    image VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    description TEXT,
    engine VARCHAR(100),
    transmission VARCHAR(100),
    fuel VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars(featured);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);

-- Fourth: Create tables that depend on users and cars
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, car_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_car ON favorites(car_id);

CREATE TABLE IF NOT EXISTS test_drives (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    preferred_date VARCHAR(100),
    preferred_time VARCHAR(100),
    phone VARCHAR(50),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_test_drives_user ON test_drives(user_id);
CREATE INDEX IF NOT EXISTS idx_test_drives_status ON test_drives(status);

CREATE TABLE IF NOT EXISTS contact_inquiries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_user ON contact_inquiries(user_id);

-- Fifth: Insert sample data
INSERT INTO cars (name, price, year, mileage, image, featured, description, engine, transmission, fuel)
SELECT * FROM (VALUES
    ('Mercedes-Benz S-Class', 95000, 2023, 5000, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', true, 'Luxury sedan with cutting-edge technology and comfort', '3.0L V6', 'Automatic', 'Gasoline'),
    ('BMW M4 Competition', 78000, 2023, 3000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', true, 'High-performance sports coupe with racing DNA', '3.0L Twin-Turbo I6', 'Automatic', 'Gasoline'),
    ('Porsche 911 Carrera', 115000, 2023, 4000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', true, 'Iconic sports car with timeless design', '3.0L Twin-Turbo Flat-6', 'PDK', 'Gasoline')
) AS v(name, price, year, mileage, image, featured, description, engine, transmission, fuel)
WHERE NOT EXISTS (SELECT 1 FROM cars LIMIT 1);