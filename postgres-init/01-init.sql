-- -- postgres-init/01-init.sql

-- -- Create cars table
-- CREATE TABLE IF NOT EXISTS cars (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     price INTEGER NOT NULL,
--     year INTEGER NOT NULL,
--     mileage INTEGER NOT NULL,
--     image VARCHAR(500),
--     featured BOOLEAN DEFAULT FALSE,
--     description TEXT,
--     engine VARCHAR(100),
--     transmission VARCHAR(100),
--     fuel VARCHAR(50),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Insert sample data
-- INSERT INTO cars (name, price, year, mileage, image, featured, description, engine, transmission, fuel) VALUES
-- ('Mercedes-Benz S-Class', 95000, 2023, 5000, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', true, 'Luxury sedan with cutting-edge technology and comfort', '3.0L V6', 'Automatic', 'Gasoline'),
-- ('BMW M4 Competition', 78000, 2023, 3000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', true, 'High-performance sports coupe with racing DNA', '3.0L Twin-Turbo I6', 'Automatic', 'Gasoline'),
-- ('Audi e-tron GT', 105000, 2023, 2000, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop', false, 'Electric gran turismo combining performance and sustainability', 'Electric', 'Automatic', 'Electric'),
-- ('Porsche 911 Carrera', 115000, 2023, 4000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', true, 'Iconic sports car with timeless design', '3.0L Twin-Turbo Flat-6', 'PDK', 'Gasoline'),
-- ('Tesla Model S Plaid', 89000, 2023, 6000, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop', false, 'Fastest accelerating production car with autopilot', 'Electric Tri-Motor', 'Single-Speed', 'Electric'),
-- ('Range Rover Sport', 92000, 2023, 7000, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', false, 'Luxury SUV with exceptional off-road capability', '3.0L Supercharged V6', 'Automatic', 'Gasoline');

-- -- Create indexes for better performance
-- CREATE INDEX idx_cars_featured ON cars(featured);
-- CREATE INDEX idx_cars_price ON cars(price);
-- CREATE INDEX idx_cars_year ON cars(year);

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('user', 'admin', 'owner');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role user_role DEFAULT 'user' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert a default admin user (password: admin123)
INSERT INTO users (email, username, hashed_password, full_name, role)
SELECT 'admin@elitemotors.com', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqFz7YCq3y', 'Admin User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@elitemotors.com');

-- Insert a default owner user (password: owner123)
INSERT INTO users (email, username, hashed_password, full_name, role)
SELECT 'owner@elitemotors.com', 'owner', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p91IB4wXkECfJKBUGOvVKm3e', 'Owner User', 'owner'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'owner@elitemotors.com');

-- Rest of cars table creation...




-- owner: $2b$12$tf3CqNc364JSoHO2UWuquu/ypOvCBXIiByJ1c/pJFN0JpiE8CUNzG