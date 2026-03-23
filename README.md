# Blog Platform - Microservices Architecture

A simple blog app built with microservices: `api-gateway`, `user-service`, `blog-service`, `notification-service`, and a React/Vite frontend.

## Tech Stack
- Backend: Node.js + Express
- Frontend: React + Vite
- Database: MongoDB
- Containerization: Docker + Docker Compose

## Services
- `api-gateway` (port 3000) - Routes all frontend requests
- `user-service` (port 3001) - Register, Login, JWT Auth
- `blog-service` (port 3002) - Create, Read, Update, Delete posts
- `notification-service` (port 3003) - Email notifications (mocked)
- `frontend` (port 5173) - React + Vite UI

## How to Run

### With Docker
```bash
docker-compose up --build
```

### Without Docker (Manual)
```bash
# Install dependencies in each folder
cd user-service && npm install && npm start
cd blog-service && npm install && npm start
cd notification-service && npm install && npm start
cd api-gateway && npm install && npm start
cd frontend && npm install && npm run dev
```

## URLs
- Frontend: http://localhost:5173
- API Gateway: http://localhost:3000
- User Service: http://localhost:3001
- Blog Service: http://localhost:3002

## Features
- User Registration & Login (JWT)
- Create, View Blog Posts
- View Post Details
- Email Notification on new post (mocked)
- Microservices communicating via API Gateway
