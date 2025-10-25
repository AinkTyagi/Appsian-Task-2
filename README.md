# Mini Project Manager

🚀 **[Live Demo](https://appsian-project-manager-phi.vercel.app/register)** - Try it now!

A production-ready full-stack project management application with smart task scheduling capabilities.

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   React + TS    │────────▶│  .NET 8 Web API  │
│   Frontend      │  HTTP   │   + EF Core      │
│  (Port 5173)    │◀────────│  (Port 5000)     │
└─────────────────┘         └──────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │  SQLite / SQL   │
                            │    Database     │
                            └─────────────────┘
```

## ✨ Features

- **JWT Authentication**: Secure user registration and login
- **Project Management**: Create, view, and delete projects
- **Task Management**: Full CRUD operations with due dates and completion tracking
- **Smart Scheduler**: AI-powered task ordering based on dependencies, due dates, and estimated hours
- **Responsive UI**: Mobile-friendly interface built with React and Tailwind CSS
- **Real-time Validation**: Client and server-side validation with detailed error messages

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- npm or yarn

### One-Command Development

```bash
# Install dependencies and start both server and web
npm install
npm run dev
```

This will start:
- Backend API at `http://localhost:5000`
- Frontend at `http://localhost:5173`
- Swagger UI at `http://localhost:5000/swagger`

### Manual Setup

#### Backend
```bash
cd server
dotnet restore
dotnet ef database update
dotnet run
```

#### Frontend
```bash
cd web
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

## 🔧 Environment Variables

### Server (.NET)
```bash
JWT__Key=your-secret-key-min-32-chars-long
ConnectionStrings__Default=Data Source=projectmanager.db
ASPNETCORE_URLS=http://localhost:5000
ASPNETCORE_ENVIRONMENT=Development
```

### Web (React)
```bash
VITE_API_BASE_URL=http://localhost:5000
```

## 📚 API Documentation

### Authentication

#### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Projects

#### List Projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "Project description here"
  }'
```

#### Get Project
```bash
curl -X GET http://localhost:5000/api/projects/{projectId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Delete Project
```bash
curl -X DELETE http://localhost:5000/api/projects/{projectId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Tasks

#### Create Task
```bash
curl -X POST http://localhost:5000/api/projects/{projectId}/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement feature X",
    "dueDate": "2025-10-30"
  }'
```

#### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/{taskId} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "dueDate": "2025-11-01",
    "isCompleted": true
  }'
```

#### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/{taskId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Smart Scheduler

#### Generate Task Schedule
```bash
curl -X POST http://localhost:5000/api/v1/projects/{projectId}/schedule \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {
        "title": "Design API",
        "estimatedHours": 5,
        "dueDate": "2025-10-25",
        "dependencies": []
      },
      {
        "title": "Implement Backend",
        "estimatedHours": 12,
        "dueDate": "2025-10-28",
        "dependencies": ["Design API"]
      },
      {
        "title": "Build Frontend",
        "estimatedHours": 10,
        "dueDate": "2025-10-30",
        "dependencies": ["Design API"]
      },
      {
        "title": "End-to-End Test",
        "estimatedHours": 8,
        "dueDate": "2025-10-31",
        "dependencies": ["Implement Backend", "Build Frontend"]
      }
    ]
  }'
```

Response:
```json
{
  "recommendedOrder": [
    "Design API",
    "Implement Backend",
    "Build Frontend",
    "End-to-End Test"
  ]
}
```

## 🗄️ Database Schema

See `/docs/erd.png` for the entity relationship diagram.

**Entities:**
- **User**: Id, Email, PasswordHash, CreatedAt
- **Project**: Id, UserId, Title, Description, CreatedAt
- **TaskItem**: Id, ProjectId, Title, DueDate, IsCompleted, CreatedAt

**Relationships:**
- User 1→* Projects
- Project 1→* TaskItems

## 🧪 Testing

### Backend Tests
```bash
cd server/ProjectManager.Tests
dotnet test
```

Tests include:
- Authentication service (password hashing/verification)
- Ownership validation
- Smart scheduler (DAG detection, topological sort, tie-breakers)

### Frontend Tests
```bash
cd web
npm run test
```

Tests include:
- Auth form validation
- Project creation flow
- Scheduler modal rendering

## 🚀 Deployment

Deploy your application in 15 minutes with automated CI/CD!

### Quick Start
```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main

# 2. Deploy with one click
# - Backend: https://render.com (use Blueprint)
# - Frontend: https://vercel.com (import repository)
```

### Comprehensive Guides
- **[Quick Deploy Guide](QUICK_DEPLOY.md)** - 15-minute deployment walkthrough
- **[Full Deployment Guide](DEPLOYMENT.md)** - Detailed deployment documentation
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Track your progress
- **[CI/CD Setup](.github/README.md)** - Automated deployment pipeline

### Deployment Options
1. **Render + Vercel** (Recommended) - Free tier available, auto-deploy from GitHub
2. **Railway** - All-in-one platform, simple setup
3. **Fly.io** - Global edge deployment
4. **Docker Compose** - Self-hosted on VPS

### CI/CD Pipeline
Push to `main` branch automatically:
- ✅ Runs all tests
- 🚀 Deploys backend to Render
- 🚀 Deploys frontend to Vercel
- 📢 Sends deployment notifications

See [CI/CD documentation](.github/README.md) for setup instructions.

### Quick Commands
```bash
make deploy-check   # Verify ready for deployment
make docker-up      # Test with Docker locally
make quick-deploy   # Test and deploy in one command
```

## 📖 Additional Documentation

### Setup & Development
- **[Setup Guide](SETUP.md)** - Development environment setup
- **[Features](FEATURES.md)** - Detailed feature documentation
- **[Prerequisites](INSTALL_PREREQUISITES.md)** - Required tools and installations

### Deployment & DevOps
- **[Quick Deploy](QUICK_DEPLOY.md)** - 15-minute deployment guide
- **[Full Deployment](DEPLOYMENT.md)** - Comprehensive deployment documentation
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Track deployment progress
- **[CI/CD Setup](.github/README.md)** - Automated pipeline configuration

### API Documentation
- **OpenAPI Spec**: `/docs/openapi.json`
- **Postman Collection**: `/docs/postman_collection.json`
- **Swagger UI**: `http://localhost:5000/swagger` (development only)

### Architecture
- **Entity Relationship Diagram**: `/docs/erd.png`
- **Infrastructure**: `/infra/` - Docker, Render, and Vercel configurations

## 🔒 Security Features

- JWT-based authentication with HS256 signing
- Password hashing with BCrypt
- Per-request ownership validation
- CORS protection
- Rate limiting on auth endpoints
- Input validation on all endpoints
- SQL injection protection via EF Core parameterization

## 🛠️ Tech Stack

### Backend
- .NET 8 Web API
- Entity Framework Core 8
- SQLite (dev) / SQL Server (prod)
- JWT Bearer Authentication
- BCrypt.Net for password hashing
- Swashbuckle for OpenAPI

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- React Query (TanStack Query)
- React Hook Form + Zod
- Axios
- Tailwind CSS

## 📝 License

MIT

## 👥 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
