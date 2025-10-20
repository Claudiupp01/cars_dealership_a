#!/bin/bash
# setup_database.sh - Initial database setup for new users

set -e  # Exit on error

echo "🚀 Elite Motors Database Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Step 1: Starting Docker containers...${NC}"
docker-compose up -d

echo -e "\n${YELLOW}Step 2: Waiting for PostgreSQL to be ready...${NC}"
sleep 8

# Check if PostgreSQL is ready
until docker exec carsales_postgres pg_isready -U caruser > /dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo -e "${GREEN}✓ PostgreSQL is ready!${NC}"

# Check if backup.sql exists
if [ ! -f "backup.sql" ]; then
    echo -e "\n${RED}❌ backup.sql not found!${NC}"
    echo "Creating database with empty tables..."
    
    # Database will be created by FastAPI on first run
    echo -e "${YELLOW}💡 Run 'python backend/main.py' to create tables${NC}"
    echo -e "${YELLOW}💡 Then use /api/seed endpoint to add sample cars${NC}"
    exit 0
fi

echo -e "\n${YELLOW}Step 3: Creating database...${NC}"
docker exec -i carsales_postgres psql -U caruser -d postgres -c "DROP DATABASE IF EXISTS carsales_db;" 2>/dev/null || true
docker exec -i carsales_postgres psql -U caruser -d postgres -c "CREATE DATABASE carsales_db;"

echo -e "\n${YELLOW}Step 4: Restoring data from backup.sql...${NC}"
docker exec -i carsales_postgres psql -U caruser -d carsales_db < backup.sql

echo -e "\n${YELLOW}Step 5: Verifying data...${NC}"
CAR_COUNT=$(docker exec -i carsales_postgres psql -U caruser -d carsales_db -t -c "SELECT COUNT(*) FROM cars;" 2>/dev/null | xargs || echo "0")
USER_COUNT=$(docker exec -i carsales_postgres psql -U caruser -d carsales_db -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "0")

echo -e "${GREEN}✓ Cars in database: ${CAR_COUNT}${NC}"
echo -e "${GREEN}✓ Users in database: ${USER_COUNT}${NC}"

echo -e "\n${GREEN}=============================="
echo -e "✅ Database setup complete!"
echo -e "==============================${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Start the backend: cd backend && python main.py"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Open browser: http://localhost:5173"

echo -e "\n${YELLOW}Default login credentials:${NC}"
echo "Admin: admin@elitemotors.com / admin123"
echo "Owner: owner@elitemotors.com / owner123"
echo "User:  user@gmail.com / user123"