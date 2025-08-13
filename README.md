# Real-Time Chat Application

A full-stack real-time chat application built with Next.js, FastAPI, and PostgreSQL.

## Features

- Real-time messaging with WebSockets
- User authentication (JWT)
- One-on-one and group chats
- Message read receipts
- Typing indicators
- Responsive design with dark/light mode
- Modern UI with shadcn/ui components

## Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Zustand (state management)
  - Axios (HTTP client)

- **Backend**:
  - FastAPI (Python)
  - SQLAlchemy (ORM)
  - PostgreSQL (database)
  - WebSockets (real-time communication)
  - JWT (authentication)

- **DevOps**:
  - Docker
  - Docker Compose
  - GitHub Actions (CI/CD)

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/real-time-chat.git
cd real-time-chat
```

### 2. Set up the backend

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### 3. Set up the frontend

1. Install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

### 4. Run with Docker (recommended)

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database
- FastAPI backend (http://localhost:8000)
- Next.js frontend (http://localhost:3000)

### 5. Run migrations

```bash
docker-compose exec backend alembic upgrade head
```

### 6. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm run dev
```

## Environment Variables

### Backend (`.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chat_db

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Deployment

### Production Build

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Environment Variables in Production

Make sure to set the following environment variables in your production environment:

```env
# Production Database
DATABASE_URL=postgresql://user:password@db:5432/chat_db

# JWT (generate a strong secret)
SECRET_KEY=your-strong-secret-key-here

# CORS (update with your production domain)
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]

# Set to False in production
DEBUG=False
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
# Whatsapp-Clone
# Whatsapp-Clone
