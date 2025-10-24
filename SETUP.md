# Setup Guide

## Prerequisites

- .NET 8 SDK: https://dotnet.microsoft.com/download/dotnet/8.0
- Node.js 18+: https://nodejs.org/
- Git

## Quick Setup

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install web dependencies
cd web
npm install
cd ..
```

### 2. Configure Environment Variables

#### Backend (.NET)
Create `server/ProjectManager.Api/appsettings.Development.json` (already exists with defaults)

Or set environment variables:
```bash
export JWT__Key="your-secret-key-must-be-at-least-32-characters-long-for-security"
export ConnectionStrings__Default="Data Source=projectmanager.db"
export ASPNETCORE_URLS="http://localhost:5000"
```

#### Frontend (React)
Create `web/.env`:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Initialize Database

```bash
cd server
dotnet restore
dotnet ef database update --project ProjectManager.Api
cd ..
```

If `dotnet ef` is not installed:
```bash
dotnet tool install --global dotnet-ef
```

### 4. Start Development Servers

#### Option A: Start Both (Recommended)
```bash
npm run dev
```

#### Option B: Start Separately

Terminal 1 - Backend:
```bash
cd server
dotnet run --project ProjectManager.Api
```

Terminal 2 - Frontend:
```bash
cd web
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

## Running Tests

### Backend Tests
```bash
cd server/ProjectManager.Tests
dotnet test
```

### Frontend Tests
```bash
cd web
npm run test
```

### All Tests
```bash
npm run test
```

## Building for Production

### Build Everything
```bash
npm run build
```

### Backend Only
```bash
cd server
dotnet publish -c Release -o out
```

### Frontend Only
```bash
cd web
npm run build
```

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:

Backend:
```bash
export ASPNETCORE_URLS="http://localhost:5001"
```

Frontend: Edit `web/vite.config.ts` and change the port.

### Database Issues
Delete the database and recreate:
```bash
cd server
rm projectmanager.db
dotnet ef database update --project ProjectManager.Api
```

### CORS Errors
Ensure the backend `AllowedOrigins` in `appsettings.json` includes your frontend URL.

## First Time Usage

1. Start the application
2. Navigate to http://localhost:5173
3. Click "Create a new account"
4. Register with email and password
5. Start creating projects and tasks!

## API Documentation

- Swagger UI: http://localhost:5000/swagger
- Postman Collection: `docs/postman_collection.json`
- Import the Postman collection for easy API testing

## Development Tips

- Hot reload is enabled for both frontend and backend
- Backend logs appear in the terminal
- Frontend uses React Query for caching - check the React Query DevTools
- JWT tokens expire after 60 minutes
- Database is SQLite by default (file: `projectmanager.db`)

## Need Help?

Check the main README.md for:
- Architecture overview
- API documentation
- Deployment instructions
- Feature descriptions
