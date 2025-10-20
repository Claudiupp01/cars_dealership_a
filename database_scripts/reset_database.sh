#!/bin/bash
# reset_database.sh - Quick database reset (no prompts)

set -e

echo "🔄 Resetting database to backup.sql state..."

# Check if backup.sql exists
if [ ! -f "backup.sql" ]; then
    echo "❌ backup.sql not found!"
    exit 1
fi

# Terminate all connections to the database
echo "🔌 Disconnecting active connections..."
docker exec -i carsales_postgres psql -U caruser -d postgres -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'carsales_db' AND pid <> pg_backend_pid();
" 2>/dev/null || true

# Drop and recreate
echo "🗑️  Dropping database..."
docker exec -i carsales_postgres psql -U caruser -d postgres -c "DROP DATABASE IF EXISTS carsales_db;"

echo "📦 Creating fresh database..."
docker exec -i carsales_postgres psql -U caruser -d postgres -c "CREATE DATABASE carsales_db;"

# Restore
docker exec -i carsales_postgres psql -U caruser -d carsales_db < backup.sql 2>&1 | grep -v "ERROR:\|NOTICE:" || true

# Verify
CAR_COUNT=$(docker exec -i carsales_postgres psql -U caruser -d carsales_db -t -c "SELECT COUNT(*) FROM cars;" 2>/dev/null | xargs)
USER_COUNT=$(docker exec -i carsales_postgres psql -U caruser -d carsales_db -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs)

echo "✅ Database reset complete!"
echo "   Cars: ${CAR_COUNT}"
echo "   Users: ${USER_COUNT}"