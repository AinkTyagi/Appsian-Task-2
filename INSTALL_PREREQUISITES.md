# Install Prerequisites

## Required Software

### 1. Install .NET 8 SDK

#### macOS (Homebrew)
```bash
brew install dotnet@8
```

#### macOS (Direct Download)
Download from: https://dotnet.microsoft.com/download/dotnet/8.0

After installation, verify:
```bash
dotnet --version
# Should show 8.0.x
```

### 2. Install .NET EF Tools (for migrations)
```bash
dotnet tool install --global dotnet-ef
```

## Quick Start After Installation

### 1. Restore Backend Dependencies
```bash
cd server/ProjectManager.Api
dotnet restore
cd ../..
```

### 2. Initialize Database
```bash
cd server
dotnet ef database update --project ProjectManager.Api
cd ..
```

### 3. Start the Application
```bash
# Start both servers
npm run dev
```

This will start:
- Backend API at http://localhost:5000
- Frontend at http://localhost:5173
- Swagger UI at http://localhost:5000/swagger

## Alternative: Run Without .NET (Frontend Only)

If you want to test the frontend without the backend:

```bash
cd web
npm run dev
```

Note: API calls will fail without the backend running.

## Troubleshooting

### .NET Command Not Found
Make sure .NET is in your PATH. After installation, restart your terminal.

### Port Already in Use
If ports are occupied, you can change them:
- Backend: Edit `server/ProjectManager.Api/Properties/launchSettings.json`
- Frontend: Edit `web/vite.config.ts`
