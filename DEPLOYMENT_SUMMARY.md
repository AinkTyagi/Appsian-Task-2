# Deployment & CI/CD - Complete Summary

Everything you need to know about deploying and maintaining your Mini Project Manager application.

## 📚 Documentation Overview

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | Fast 15-min deployment | First deployment, getting started |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Comprehensive deployment guide | Detailed setup, troubleshooting |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | Track deployment progress | Ensure nothing is missed |
| **[.github/README.md](.github/README.md)** | CI/CD pipeline setup | Automated deployments |

---

## 🚀 Quick Reference

### First-Time Deployment (15 minutes)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy Backend (Render)
# - Visit: https://render.com/dashboard
# - Click: New + → Blueprint
# - Select your repo → Apply

# 3. Deploy Frontend (Vercel)
# - Visit: https://vercel.com/new
# - Import repo → Configure:
#   Root: web | Framework: Vite | Build: npm run build
# - Add env: VITE_API_BASE_URL = <render-backend-url>

# 4. Update CORS and Redeploy
# Edit: server/ProjectManager.Api/appsettings.json
# Add your Vercel URL to AllowedOrigins
git add . && git commit -m "Add CORS" && git push
```

### Automated CI/CD Setup (10 minutes)

```bash
# 1. Get deployment credentials
# - Render: Dashboard → Service → Settings → Deploy Hook
# - Vercel: npm install -g vercel && vercel login && cd web && vercel link

# 2. Add GitHub Secrets
# Settings → Secrets → Actions → New repository secret
# Add: RENDER_DEPLOY_HOOK_URL, VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

# 3. Test auto-deploy
git commit --allow-empty -m "Test CI/CD"
git push
# Check: GitHub → Actions tab
```

### Useful Commands

```bash
# Development
make dev              # Start dev servers
make test             # Run all tests
make build            # Build for production

# Deployment
make deploy-check     # Pre-deployment verification
make docker-up        # Test with Docker
make quick-deploy     # Test + push (triggers CI/CD)

# Docker
docker-compose up -d  # Start containers
docker-compose logs   # View logs
docker-compose down   # Stop containers
```

---

## 🏗️ Architecture Overview

### Production Stack

```
┌─────────────────────────────────────────────────┐
│              User's Browser                      │
│         https://your-app.vercel.app             │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────┐
│           Vercel CDN (Frontend)                  │
│     React + TypeScript + Vite                   │
│            Static Assets                         │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls (HTTPS)
                 ▼
┌─────────────────────────────────────────────────┐
│          Render (Backend API)                    │
│        .NET 8 + Entity Framework                │
│     https://api.onrender.com                    │
└────────────────┬────────────────────────────────┘
                 │
                 │ SQLite / PostgreSQL
                 ▼
┌─────────────────────────────────────────────────┐
│           Persistent Storage                     │
│         Database (Render Disk)                  │
└─────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```
Developer Push to GitHub
         │
         ▼
┌────────────────────────────────────┐
│       GitHub Actions Trigger       │
└────────────────────────────────────┘
         │
         ├─────────────────┬──────────────────┐
         ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Backend Test │  │Frontend Test │  │Security Scan │
│  .NET Tests  │  │ React Tests  │  │    Trivy     │
└──────┬───────┘  └──────┬───────┘  └──────────────┘
       │                 │
       └────────┬────────┘
                ▼
         Tests Passed?
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│Deploy Backend│  │Deploy Frontend│
│  to Render   │  │  to Vercel   │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                ▼
        ┌──────────────┐
        │ Notification │
        │   Success!   │
        └──────────────┘
```

---

## 🔐 Environment Variables Reference

### Backend (Render)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ASPNETCORE_ENVIRONMENT` | ✅ | Runtime environment | `Production` |
| `ASPNETCORE_URLS` | ✅ | Server bind address | `http://0.0.0.0:5000` |
| `JWT__Key` | ✅ | JWT signing key (min 32 chars) | Auto-generated |
| `ConnectionStrings__Default` | ✅ | Database connection | `Data Source=/data/projectmanager.db` |

### Frontend (Vercel)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_BASE_URL` | ✅ | Backend API URL | `https://api.onrender.com` |

### GitHub Actions

| Secret | Required | Description | Where to Get |
|--------|----------|-------------|--------------|
| `RENDER_DEPLOY_HOOK_URL` | For CI/CD | Webhook URL | Render → Settings → Deploy Hook |
| `VERCEL_TOKEN` | For CI/CD | API token | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | For CI/CD | Organization ID | `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | For CI/CD | Project ID | `.vercel/project.json` |

---

## 📊 Deployment Options Comparison

| Feature | Render + Vercel | Railway | Fly.io | Docker (VPS) |
|---------|----------------|---------|--------|--------------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Free Tier** | ✅ Yes | $5 credit | Limited | No |
| **Auto Deploy** | ✅ Yes | ✅ Yes | ✅ Yes | Manual |
| **Custom Domain** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **HTTPS** | ✅ Auto | ✅ Auto | ✅ Auto | Manual |
| **Database** | SQLite/Disk | PostgreSQL | PostgreSQL | Any |
| **Cost (Monthly)** | $0-7 | $5-15 | $5-10 | $5-20 |
| **Best For** | Beginners | Full-stack | Global edge | Full control |

---

## 🛠️ Troubleshooting Guide

### Common Issues

#### 1. Backend Not Responding
```bash
# Check Render logs
# Dashboard → Your Service → Logs

# Common causes:
- Port binding issue (must use ASPNETCORE_URLS)
- Missing environment variables
- Database connection error
- Build failure
```

#### 2. Frontend Can't Connect to Backend
```bash
# Check browser console for errors
# Verify VITE_API_BASE_URL is correct
# Check CORS settings in backend

# Fix CORS:
# Edit: server/ProjectManager.Api/appsettings.json
# Add: "https://your-app.vercel.app" to AllowedOrigins
```

#### 3. CI/CD Pipeline Failing
```bash
# Check GitHub Actions logs
# Actions tab → Failed workflow → View details

# Common issues:
- Missing GitHub secrets
- Tests failing locally
- Branch name mismatch (main vs master)
```

#### 4. Database Issues
```bash
# Render uses persistent disk at /data
# Ensure ConnectionStrings__Default points to /data/projectmanager.db
# Check disk is mounted: Render → Service → Disks
```

### Quick Fixes

```bash
# Reset database
# Render Console: rm /data/projectmanager.db
# Restart service

# Clear Vercel cache
vercel --prod --force

# Rebuild Docker images
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check all environment variables
# Render: Dashboard → Service → Environment
# Vercel: Dashboard → Project → Settings → Environment Variables
```

---

## 📈 Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl https://your-api.onrender.com/healthz

# Should return:
# {"status":"healthy","timestamp":"2024-01-01T00:00:00Z"}
```

### Logs

```bash
# Render logs
# Dashboard → Service → Logs (real-time)

# Vercel logs
# Dashboard → Project → Deployments → Click deployment → Runtime Logs

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Performance Monitoring

- **Render**: Built-in metrics (CPU, Memory, Network)
- **Vercel**: Analytics available in dashboard
- **Optional**: Add Sentry for error tracking
- **Optional**: Add New Relic/Datadog for APM

### Database Backups

```bash
# Download SQLite database from Render
# Method 1: Use Render SSH/Console
# Navigate to /data/ and download projectmanager.db

# Method 2: Add backup endpoint (optional)
# See DEPLOYMENT.md for implementation
```

---

## 🎯 Success Criteria

Your deployment is successful when:

- [x] ✅ Application accessible at production URL
- [x] ✅ Users can register and login
- [x] ✅ HTTPS working (automatic with Render/Vercel)
- [x] ✅ API calls working (check browser Network tab)
- [x] ✅ Database persisting data (create project, refresh page)
- [x] ✅ CORS configured correctly
- [x] ✅ No errors in logs
- [x] ✅ Health check endpoint responding
- [x] ✅ CI/CD pipeline running (if configured)

---

## 💰 Cost Breakdown

### Free Tier (Hobby Projects)
```
Render Free Tier:
  - Backend: $0/month
  - Sleeps after 15 min inactivity
  - 750 hours/month free

Vercel Free Tier:
  - Frontend: $0/month
  - 100GB bandwidth
  - Unlimited deployments

Total: $0/month
```

### Paid Tier (Production)
```
Render Starter:
  - Backend: $7/month
  - Always on
  - 512MB RAM

Vercel Pro:
  - Frontend: $20/month (if needed)
  - More bandwidth and builds
  - Or stay on free tier

Total: $7-27/month
```

### Alternative Options
```
Railway: ~$5-15/month for both services
Fly.io: ~$5-10/month for both services
VPS (DigitalOcean): ~$6-12/month + setup time
```

---

## 🔄 Deployment Workflow

### Development → Production

```bash
# 1. Feature Development
git checkout -b feature/new-feature
# Make changes
npm run test
git commit -m "Add new feature"
git push origin feature/new-feature

# 2. Create Pull Request
# GitHub → New Pull Request
# CI workflow runs automatically
# Tests must pass

# 3. Review & Merge
# Team reviews code
# Merge to main

# 4. Automatic Deployment
# CI/CD pipeline triggers
# Tests run again
# Deploy to production

# 5. Verify Deployment
# Check GitHub Actions
# Test production URL
# Monitor logs
```

---

## 📞 Support & Resources

### Official Documentation
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **GitHub Actions**: https://docs.github.com/actions
- **.NET**: https://docs.microsoft.com/aspnet/core
- **React**: https://react.dev

### Project-Specific Help
- Check other markdown files in root directory
- Review workflow files in `.github/workflows/`
- Examine infrastructure configs in `infra/`

### Getting Help
1. Check troubleshooting section above
2. Review logs (Render, Vercel, GitHub Actions)
3. Test locally first: `make dev`
4. Verify environment variables
5. Check CORS configuration

---

## 🎉 Next Steps After Deployment

1. **Test Thoroughly**
   - Register users
   - Create projects and tasks
   - Test all features

2. **Add Custom Domain** (Optional)
   - Render: Settings → Custom Domain
   - Vercel: Settings → Domains

3. **Set Up Monitoring**
   - Sentry for error tracking
   - Google Analytics for usage
   - Uptime monitoring

4. **Database Management**
   - Set up regular backups
   - Consider migrating to PostgreSQL for production
   - Monitor database size

5. **Performance Optimization**
   - Enable caching
   - Add CDN for static assets
   - Optimize database queries

6. **Security Hardening**
   - Regular dependency updates
   - Security audit
   - Rate limiting
   - DDoS protection

7. **Documentation**
   - Update deployment URLs
   - Document any custom changes
   - Create runbook for common tasks

---

## 📋 Quick Command Reference

```bash
# Local Development
make dev              # Start dev servers
make test             # Run all tests
make build            # Build for production
make clean            # Clean artifacts

# Docker Testing
make docker-up        # Start containers
make docker-down      # Stop containers
make docker-logs      # View logs
make docker-rebuild   # Rebuild containers

# Deployment
make deploy-check     # Verify ready
make quick-deploy     # Test & deploy
make setup-deployment # Run setup script

# Git Operations
make git-push         # Add, commit, push

# Testing
make test-backend     # Backend tests only
make test-frontend    # Frontend tests only
```

---

**Remember**: Always test locally before deploying!

```bash
npm run test && npm run build
```

Good luck with your deployment! 🚀
