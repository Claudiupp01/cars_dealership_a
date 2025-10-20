#!/bin/bash
# backup_database.sh - Create a backup of the current database

set -e

echo "💾 Creating database backup..."

# Create backups directory if it doesn't exist
mkdir -p backups

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
docker exec carsales_postgres pg_dump -U caruser carsales_db > "backups/backup_${TIMESTAMP}.sql"

# Also update the main backup.sql file
docker exec carsales_postgres pg_dump -U caruser carsales_db > backup.sql

# Get file size
SIZE=$(ls -lh "backups/backup_${TIMESTAMP}.sql" | awk '{print $5}')

echo "✅ Backup created successfully!"
echo "📁 Location: backups/backup_${TIMESTAMP}.sql"
echo "📊 Size: ${SIZE}"
echo ""
echo "💡 Main backup.sql has also been updated"
echo ""

# Show what's in the backup
echo "📋 Backup contains:"
docker exec -i carsales_postgres psql -U caruser -d carsales_db -c "
SELECT 
    'Cars: ' || COUNT(*) as count FROM cars
UNION ALL
SELECT 'Users: ' || COUNT(*) FROM users
UNION ALL
SELECT 'Favorites: ' || COUNT(*) FROM favorites
UNION ALL
SELECT 'Test Drives: ' || COUNT(*) FROM test_drives
UNION ALL
SELECT 'Contact Inquiries: ' || COUNT(*) FROM contact_inquiries;
"