.PHONY: dev build test clean

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up --build

# Production build
build:
	docker-compose -f docker-compose.prod.yml build

# Start production
prod:
	docker-compose -f docker-compose.prod.yml up -d

# Stop all containers
stop:
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.prod.yml down

# Clean up containers and volumes
clean: stop
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f

# Database migrations
migrate:
	docker-compose -f docker-compose.dev.yml run --rm backend alembic upgrade head

# Run tests
test:
	docker-compose -f docker-compose.dev.yml run --rm backend pytest

# View logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f
