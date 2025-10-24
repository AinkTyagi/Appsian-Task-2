# Deployment Guide

Complete guide to deploy the Mini Project Manager application with automated CI/CD pipeline.

## Table of Contents
- [Quick Deployment (Recommended)](#quick-deployment-recommended)
- [Detailed Deployment Steps](#detailed-deployment-steps)
- [CI/CD Setup](#cicd-setup)
- [Alternative Deployment Options](#alternative-deployment-options)
- [Post-Deployment Configuration](#post-deployment-configuration)

---

## Quick Deployment (Recommended)

### Option 1: Render (Backend) + Vercel (Frontend)

This is the easiest and fastest deployment option with free tiers available.

#### Prerequisites
- GitHub account
- Render account (https://render.com)
- Vercel account (https://vercel.com)

#### Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy Backend to Render**
   - Go to https://render.com/dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `infra/render.yaml`
   - Click "Apply" and wait for deployment
   - Copy the backend URL (e.g., `https://project-manager-api.onrender.com`)

3. **Deploy Frontend to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `web`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add Environment Variable:
     - `VITE_API_BASE_URL` = Your Render backend URL
   - Click "Deploy"

4. **Update CORS in Backend**
   - After frontend is deployed, copy your Vercel URL
   - Update `server/ProjectManager.Api/appsettings.json`:
   ```json
   "AllowedOrigins": [
     "http://localhost:5173",
     "https://your-app.vercel.app"
   ]
   ```
   - Commit and push changes (deployment will auto-update)

---

## Detailed Deployment Steps

### Backend Deployment (Render)

#### 1. Prepare Your Repository
Ensure these files exist:
- ✅ `infra/render.yaml` (already exists)
- ✅ `infra/Dockerfile.server` (already exists)

#### 2. Create Render Account
- Sign up at https://render.com
- Connect your GitHub account

#### 3. Deploy Using Blueprint
- Click "New +" → "Blueprint"
- Select your repository
- Render reads `infra/render.yaml` and sets up:
  - Web service with Docker
  - Persistent disk for SQLite database
  - Environment variables
  - Health checks

#### 4. Configure Environment Variables (Auto-configured)
These are set automatically from `render.yaml`:
- `ASPNETCORE_ENVIRONMENT` = Production
- `ASPNETCORE_URLS` = http://0.0.0.0:5000
- `JWT__Key` = (auto-generated secure key)
- `ConnectionStrings__Default` = Data Source=/data/projectmanager.db

#### 5. Wait for Deployment
- First deployment takes ~5-10 minutes
- Watch logs in Render dashboard
- Service URL will be: `https://project-manager-api.onrender.com`

#### 6. Test Backend
```bash
curl https://your-api-url.onrender.com/healthz
```

### Frontend Deployment (Vercel)

#### 1. Prepare Environment Variables
Create `web/.env.production`:
```bash
VITE_API_BASE_URL=https://your-api-url.onrender.com
```

#### 2. Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm install -g vercel
cd web
vercel --prod
```

**Option B: Vercel Dashboard**
- Go to https://vercel.com/new
- Import repository
- Configure:
  - Root Directory: `web`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Framework: Vite

#### 3. Set Environment Variables in Vercel
- Go to Project Settings → Environment Variables
- Add: `VITE_API_BASE_URL` = `https://your-api-url.onrender.com`

#### 4. Deploy
- Click "Deploy"
- First deployment takes ~2-5 minutes
- Your app will be live at: `https://your-app.vercel.app`

---

## CI/CD Setup

### GitHub Actions (Automatic Deployment)

Create `.github/workflows/deploy.yml` in your repository root:

```yaml
name: Deploy Application

on:
  push:
    branches: [ main, production ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    name: Test Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      
      - name: Restore dependencies
        run: |
          cd server
          dotnet restore
      
      - name: Build
        run: |
          cd server
          dotnet build --no-restore
      
      - name: Test
        run: |
          cd server/ProjectManager.Tests
          dotnet test --no-build --verbosity normal

  test-frontend:
    name: Test Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: web/package-lock.json
      
      - name: Install dependencies
        run: |
          cd web
          npm ci
      
      - name: Run tests
        run: |
          cd web
          npm run test
      
      - name: Build
        run: |
          cd web
          npm run build

  deploy-backend:
    name: Deploy Backend to Render
    needs: [test-backend]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deployment
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"

  deploy-frontend:
    name: Deploy Frontend to Vercel
    needs: [test-frontend]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./web
          vercel-args: '--prod'
```

### Setting Up GitHub Secrets

#### 1. Render Deploy Hook
- Go to Render Dashboard → Your Service → Settings
- Copy "Deploy Hook URL"
- In GitHub: Settings → Secrets → New repository secret
- Name: `RENDER_DEPLOY_HOOK_URL`
- Value: (paste deploy hook URL)

#### 2. Vercel Tokens
```bash
# Install Vercel CLI
npm install -g vercel

# Login and get tokens
vercel login

# Link project
cd web
vercel link

# Get tokens from .vercel/project.json
cat .vercel/project.json
```

Add these as GitHub secrets:
- `VERCEL_TOKEN`: Get from https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: From `.vercel/project.json`
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`

### How CI/CD Works

1. **On Push to Main**:
   - Runs backend tests
   - Runs frontend tests
   - If tests pass, automatically deploys both services

2. **On Pull Request**:
   - Runs tests only
   - No deployment
   - Shows test results in PR

3. **Manual Deployment**:
   - Go to GitHub → Actions → Run workflow

---

## Alternative Deployment Options

### Option 2: Railway (Full Stack)

Railway provides a simpler all-in-one solution.

#### Steps:
1. Sign up at https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects both services
5. Configure environment variables:
   - Backend: `JWT__Key`, `ASPNETCORE_ENVIRONMENT`
   - Frontend: `VITE_API_BASE_URL`
6. Both services deploy automatically

#### CI/CD:
Railway automatically deploys on every push to main branch.

### Option 3: Fly.io (Full Stack)

For more control and global edge deployment.

#### Backend Setup:
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy backend
cd server
fly launch
fly deploy
```

#### Frontend Setup:
```bash
cd web
fly launch
fly deploy
```

### Option 4: Docker Compose (Self-hosted)

For VPS or cloud VM deployment.

Create `docker-compose.yml` in project root:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: infra/Dockerfile.server
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://0.0.0.0:5000
      - JWT__Key=${JWT_KEY}
      - ConnectionStrings__Default=Data Source=/data/projectmanager.db
    volumes:
      - db-data:/data
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: infra/Dockerfile.web
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://localhost:5000
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  db-data:
```

Deploy:
```bash
# Set JWT key
export JWT_KEY="your-secret-key-must-be-at-least-32-characters-long"

# Deploy
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## Post-Deployment Configuration

### 1. Database Migration
If using PostgreSQL/MySQL instead of SQLite:

Update `appsettings.Production.json`:
```json
{
  "ConnectionStrings": {
    "Default": "Server=your-db-host;Database=projectmanager;User=user;Password=pass;"
  }
}
```

### 2. CORS Configuration
Update `server/ProjectManager.Api/appsettings.json`:
```json
{
  "AllowedOrigins": [
    "http://localhost:5173",
    "https://your-production-domain.com",
    "https://your-app.vercel.app"
  ]
}
```

### 3. Environment Variables Reference

**Backend**:
| Variable | Description | Example |
|----------|-------------|---------|
| `ASPNETCORE_ENVIRONMENT` | Runtime environment | Production |
| `ASPNETCORE_URLS` | Bind address | http://0.0.0.0:5000 |
| `JWT__Key` | JWT signing key (min 32 chars) | your-super-secret-key... |
| `ConnectionStrings__Default` | Database connection | Data Source=/data/projectmanager.db |

**Frontend**:
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | https://api.yourdomain.com |

### 4. SSL/HTTPS
Both Render and Vercel provide automatic HTTPS certificates.

For custom domains:
- **Render**: Settings → Custom Domain → Add domain
- **Vercel**: Settings → Domains → Add domain

### 5. Monitoring

**Render**:
- Built-in logs and metrics
- Set up alerts in Settings → Notifications

**Vercel**:
- Analytics available in dashboard
- Set up Vercel Analytics for detailed insights

### 6. Database Backups

**Render with SQLite**:
```bash
# Download database backup
curl -o backup.db https://your-api.onrender.com/backup/database
```

Add backup endpoint in your API (optional):
```csharp
app.MapGet("/backup/database", async (AppDbContext db) => 
{
    var dbPath = "/data/projectmanager.db";
    var bytes = await File.ReadAllBytesAsync(dbPath);
    return Results.File(bytes, "application/octet-stream", "backup.db");
}).RequireAuthorization();
```

---

## Deployment Checklist

Before going live:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] CORS settings updated with production URLs
- [ ] JWT key set to strong secret (min 32 characters)
- [ ] Database migrations applied
- [ ] Health check endpoint working
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented
- [ ] CI/CD pipeline tested

---

## Troubleshooting

### Backend Issues

**Build Fails**:
```bash
# Check .NET version
dotnet --version  # Should be 8.0+

# Clear and rebuild
cd server
dotnet clean
dotnet restore
dotnet build
```

**Database Connection Errors**:
- Ensure persistent disk is mounted (Render)
- Check database path in connection string
- Verify write permissions

**JWT Errors**:
- JWT key must be at least 32 characters
- Ensure JWT__Key env var is set (note double underscore)

### Frontend Issues

**API Connection Fails**:
- Check `VITE_API_BASE_URL` is correct
- Verify CORS settings in backend
- Test API endpoint directly with curl

**Build Fails**:
```bash
cd web
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Working**:
- Vite env vars must start with `VITE_`
- Rebuild after changing env vars
- Verify env vars in Vercel/deployment platform dashboard

### CI/CD Issues

**GitHub Actions Fails**:
- Check secrets are set correctly
- Verify branch name (main vs master)
- Review workflow logs in GitHub Actions tab

**Deployment Hook Not Working**:
- Verify deploy hook URL is correct
- Check if Render service is active
- Test hook manually: `curl -X POST "HOOK_URL"`

---

## Cost Estimates

### Free Tier Options
- **Render**: Free tier available (sleeps after inactivity)
- **Vercel**: Free for hobby projects
- **Railway**: $5/month credit for free
- **Fly.io**: Free allowance for small apps

### Paid Options (Recommended for Production)
- **Render**: $7-25/month for backend
- **Vercel**: Free-$20/month for frontend
- **Railway**: ~$5-15/month for both services
- **Total**: $10-50/month depending on traffic

---

## Next Steps

After successful deployment:

1. **Test thoroughly**: Create test accounts, projects, and tasks
2. **Monitor**: Watch logs for first 24-48 hours
3. **Set up domain**: Use custom domain for professional look
4. **Add monitoring**: Set up Sentry or similar for error tracking
5. **Performance**: Add caching, CDN for static assets
6. **Security**: Regular dependency updates, security audits
7. **Analytics**: Add Google Analytics or Plausible

---

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Railway Documentation](https://docs.railway.app)
- [Fly.io Documentation](https://fly.io/docs)

For project-specific issues, check:
- `README.md` - General documentation
- `SETUP.md` - Development setup
- `FEATURES.md` - Feature details
