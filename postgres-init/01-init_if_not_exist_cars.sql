-- postgres-init/01-init.sql

-- Create cars table (idempotent)
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

-- Insert sample data only if table is empty
INSERT INTO cars (name, price, year, mileage, image, featured, description, engine, transmission, fuel)
SELECT * FROM (VALUES
    ('Mercedes-Benz S-Class', 95000, 2023, 5000, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', true, 'Luxury sedan with cutting-edge technology and comfort', '3.0L V6', 'Automatic', 'Gasoline'),
    ('BMW M4 Competition', 78000, 2023, 3000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', true, 'High-performance sports coupe with racing DNA', '3.0L Twin-Turbo I6', 'Automatic', 'Gasoline'),
    ('Porsche 911 Carrera', 115000, 2023, 4000, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', true, 'Iconic sports car with timeless design', '3.0L Twin-Turbo Flat-6', 'PDK', 'Gasoline')
) AS v(name, price, year, mileage, image, featured, description, engine, transmission, fuel)
WHERE NOT EXISTS (SELECT 1 FROM cars LIMIT 1);

-- Create indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars(featured);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);