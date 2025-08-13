#!/bin/bash

# Exit on error
set -e

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Run migrations
echo "Running database migrations..."
docker-compose exec backend alembic upgrade head

echo "Database migrations completed successfully!"
