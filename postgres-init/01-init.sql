-- postgres-init/01-init.sql

-- Create cars table
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

-- Insert sample data
INSERT INTO cars (name, price, year, mileage, image, featured, description, engine, transmission, fuel) VALUES
('Mercedes-Benz S-Class', 95000, 2023, 5000, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', true, 'Luxury sedan with cutting-edge technology and comfort', '3.0L V6', 'Automatic', 'Gasoline'),
('BMW M4 Competition', 78000, 2023, 3000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', true, 'High-performance sports coupe with racing DNA', '3.0L Twin-Turbo I6', 'Automatic', 'Gasoline'),
('Audi e-tron GT', 105000, 2023, 2000, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop', false, 'Electric gran turismo combining performance and sustainability', 'Electric', 'Automatic', 'Electric'),
('Porsche 911 Carrera', 115000, 2023, 4000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', true, 'Iconic sports car with timeless design', '3.0L Twin-Turbo Flat-6', 'PDK', 'Gasoline'),
('Tesla Model S Plaid', 89000, 2023, 6000, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop', false, 'Fastest accelerating production car with autopilot', 'Electric Tri-Motor', 'Single-Speed', 'Electric'),
('Range Rover Sport', 92000, 2023, 7000, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', false, 'Luxury SUV with exceptional off-road capability', '3.0L Supercharged V6', 'Automatic', 'Gasoline');

-- Create indexes for better performance
CREATE INDEX idx_cars_featured ON cars(featured);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_year ON cars(year);