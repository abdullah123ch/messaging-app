# Real-Time Chat API

A high-performance, real-time chat application built with FastAPI, WebSockets, and PostgreSQL.

## Features

- User authentication with JWT
- Real-time messaging with WebSockets
- One-on-one and group chats
- Message read receipts
- Typing indicators
- Message history with pagination
- RESTful API for user management

## Tech Stack

- **Backend**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: WebSockets
- **Containerization**: Docker & Docker Compose
- **API Documentation**: Swagger UI & ReDoc

## Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Node.js 16+ (for frontend development)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd realtime-chat/backend
```

### 2. Set up environment variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
POSTGRES_SERVER=db
POSTGRES_USER=chat_user
POSTGRES_PASSWORD=chat_password
POSTGRES_DB=chat_db

# JWT
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days

# CORS (comma-separated list of allowed origins)
BACKEND_CORS_ORIGINS='["http://localhost:3000"]'
```

### 3. Run with Docker Compose (Recommended)

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database
- FastAPI backend
- Database migrations

### 4. Run migrations (if not using Docker Compose)

```bash
alembic upgrade head
```

### 5. Start the development server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── alembic/               # Database migrations
├── app/
│   ├── api/               # API routes
│   ├── core/              # Core functionality
│   ├── crud/              # Database operations
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic models
│   ├── database.py        # Database configuration
│   └── main.py            # FastAPI application
├── tests/                 # Test files
├── .env.example           # Example environment variables
├── .gitignore
├── alembic.ini            # Alembic configuration
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Backend Dockerfile
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Development

### Running Tests

```bash
pytest
```

### Generating Migrations

After making changes to the models, generate a new migration:

```bash
alembic revision --autogenerate -m "Your migration message"
alembic upgrade head
```

### Linting

```bash
flake8 .
black . --check
isort . --check-only
```

## Deployment

### Production

1. Update the `.env` file with production values
2. Build and run with Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
