#!/bin/bash

# Exit on error
set -e

# Timestamp for the backup file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Set default values if not set in .env
POSTGRES_USER=${POSTGRES_USER:-chat_user}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-chat_password}
POSTGRES_DB=${POSTGRES_DB:-chat_db}

# Create backup
echo "Creating database backup to $BACKUP_FILE..."
docker-compose exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" > "$BACKUP_FILE"

# Compress the backup
gzip -f "$BACKUP_FILE"

echo "Backup created: ${BACKUP_FILE}.gz"

# Delete backups older than 30 days
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +30 -delete -printf "Deleted old backup: %f\n"
