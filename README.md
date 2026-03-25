# Blog Platform - Microservices Architecture

A full-stack blog platform built with a microservices architecture as a mini-project. Users can register, log in, create/read/like/comment on posts, and manage their profile.

## Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Auth**: JWT (JSON Web Tokens)
- **Containerization**: Docker + Docker Compose

## Project Structure

```
blog-platform-microservices/
├── api-gateway/          # Routes requests to appropriate services (port 3000)
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── user-service/         # Handles auth & user management (port 3001)
│   ├── config/
│   ├── controller/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── blog-service/         # Handles posts, likes, comments (port 3002)
│   ├── config/
│   ├── controller/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── Dockerfile
├── frontend/             # React/Vite SPA (port 5173 dev / 80 prod)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Features

- User registration and login with JWT authentication
- Create, read, and browse blog posts with categories and tags
- Like/unlike posts (one reaction per user)
- Comment on posts
- User profile page showing all your posts
- Edit profile (username, bio)
- Responsive UI built with inline styles

## Running Locally (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Start User Service
```bash
cd user-service
npm install
npm run dev
# Runs on http://localhost:3001
```

### 2. Start Blog Service
```bash
cd blog-service
npm install
npm run dev
# Runs on http://localhost:3002
```

### 3. Start API Gateway
```bash
cd api-gateway
npm install
npm run dev
# Runs on http://localhost:3000
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Running with Docker

```bash
# Build and start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost:5173
# API Gateway: http://localhost:3000
```

## API Endpoints

### User Service (port 3001)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /users/register | Register new user |
| POST | /users/login | Login & get JWT |
| GET | /users/me | Get current user profile |
| PUT | /users/me | Update profile |
| GET | /users/:id | Get user by ID |

### Blog Service (port 3002)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /posts | Get all posts (with pagination) |
| POST | /posts | Create new post |
| GET | /posts/:id | Get post by ID |
| PUT | /posts/:id | Update post |
| DELETE | /posts/:id | Delete post |
| POST | /posts/:id/like | Toggle like on post |
| POST | /posts/:id/comments | Add comment |

## Environment Variables

Each service has a `.env` file. Key variables:

**user-service/.env**
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/blog-users
JWT_SECRET=your-secret-key
```

**blog-service/.env**
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/blog-posts
JWT_SECRET=your-secret-key
USER_SERVICE_URL=http://localhost:3001
```

## Architecture

```
Browser
  |
  v
Frontend (React/Vite) :5173
  |
  |-- Direct API calls -->
  |
  +-> User Service :3001  (auth, users)
  +-> Blog Service :3002  (posts, comments, likes)
```

> Note: The API Gateway (port 3000) is also available to proxy all requests through a single entry point.

## Mini-Project Info

This project was built as a mini-project demonstrating microservices architecture concepts including:
- Service separation by domain
- Independent deployability via Docker
- JWT-based stateless authentication
- RESTful API design
- React SPA with client-side routing
