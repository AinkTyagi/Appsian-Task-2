# Getting Started with Deployment 🚀

**New to deployment?** Start here! This guide will help you navigate all the deployment documentation.

---

## 📖 Which Guide Should I Read?

### 🏃‍♂️ I want to deploy ASAP (15 minutes)
**→ Read: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)**

Step-by-step guide to get your app live in 15 minutes using Render and Vercel.

### 📚 I want complete deployment documentation
**→ Read: [DEPLOYMENT.md](DEPLOYMENT.md)**

Comprehensive guide covering:
- Multiple deployment platforms
- Environment configuration
- Security setup
- Troubleshooting
- Alternative deployment options

### ✅ I want to track my deployment progress
**→ Use: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)**

Interactive checklist to ensure you don't miss any steps.

### 🤖 I want automated CI/CD
**→ Read: [.github/README.md](.github/README.md)**

Guide to set up GitHub Actions for automatic deployment on every push.

### 📊 I want a complete overview
**→ Read: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)**

Everything in one place: architecture, troubleshooting, costs, and workflows.

---

## 🎯 Recommended Path

### For Beginners

```
1. QUICK_DEPLOY.md          (Get it live!)
2. DEPLOYMENT_CHECKLIST.md  (Verify everything works)
3. .github/README.md        (Set up auto-deploy)
```

### For Experienced Developers

```
1. DEPLOYMENT_SUMMARY.md    (Quick overview)
2. DEPLOYMENT.md            (Detailed setup)
3. .github/README.md        (CI/CD pipeline)
```

---

## ⚡ Quickest Path to Production

### Step 1: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy Backend (5 min)
1. Go to https://render.com/dashboard
2. Click "New +" → "Blueprint"
3. Select your repository
4. Click "Apply"
5. **Copy your backend URL**

### Step 3: Deploy Frontend (5 min)
1. Go to https://vercel.com/new
2. Import your repository
3. Configure:
   - Root Directory: `web`
   - Add env var: `VITE_API_BASE_URL` = (backend URL from Step 2)
4. Click "Deploy"

### Step 4: Fix CORS (3 min)
1. Edit `server/ProjectManager.Api/appsettings.json`
2. Add your Vercel URL to `AllowedOrigins`
3. Commit and push

**Done!** Your app is live! 🎉

---

## 🛠️ Using the Makefile

Quick commands to make your life easier:

```bash
# See all available commands
make help

# Development
make install          # Install all dependencies
make dev              # Start development servers
make test             # Run all tests

# Deployment
make deploy-check     # Verify you're ready to deploy
make quick-deploy     # Run tests and push (triggers CI/CD)

# Docker (test production locally)
make docker-up        # Start containers
make docker-logs      # View logs
make docker-down      # Stop containers
```

---

## 📁 Documentation Files Overview

| File | Purpose | Length | Difficulty |
|------|---------|--------|------------|
| **QUICK_DEPLOY.md** | Fast deployment | 5 min read | ⭐ Easy |
| **DEPLOYMENT.md** | Complete guide | 15 min read | ⭐⭐ Medium |
| **DEPLOYMENT_CHECKLIST.md** | Progress tracker | Reference | ⭐ Easy |
| **DEPLOYMENT_SUMMARY.md** | Full overview | 10 min read | ⭐⭐ Medium |
| **.github/README.md** | CI/CD setup | 8 min read | ⭐⭐⭐ Advanced |
| **GETTING_STARTED_WITH_DEPLOYMENT.md** | This file! | 3 min read | ⭐ Easy |

---

## 🎓 Learning Resources

### Understanding the Stack

**Backend (.NET 8)**
- Web API with Entity Framework
- JWT Authentication
- SQLite database
- Hosted on Render

**Frontend (React + TypeScript)**
- Vite build tool
- React Query for data fetching
- Tailwind CSS for styling
- Hosted on Vercel

**CI/CD (GitHub Actions)**
- Automated testing
- Automated deployment
- Pull request checks

### Key Concepts

**Environment Variables**
- Backend needs: JWT key, database connection
- Frontend needs: API URL
- Set in deployment platform dashboard

**CORS (Cross-Origin Resource Sharing)**
- Backend must allow frontend URL
- Prevents unauthorized access
- Configure in `appsettings.json`

**Health Checks**
- Backend exposes `/healthz` endpoint
- Render uses it to verify service health
- Returns JSON with status

---

## ❓ Common Questions

### Do I need a credit card?
- **Render Free Tier**: No credit card needed
- **Vercel Free Tier**: No credit card needed
- Perfect for hobby projects and testing

### Will my app go to sleep?
- **Render Free**: Yes, after 15 minutes of inactivity
- **Render Paid** ($7/month): Always on
- **Vercel**: No, frontend is always available

### Can I use a custom domain?
Yes! Both Render and Vercel support custom domains:
- Render: Settings → Custom Domain
- Vercel: Settings → Domains

### How do I update my deployed app?
With CI/CD:
```bash
git add .
git commit -m "Update"
git push
```
GitHub Actions automatically deploys!

Without CI/CD:
- Render: Push to GitHub, then trigger deploy in dashboard
- Vercel: Push to GitHub, auto-deploys

### What if something breaks?
1. Check logs (Render dashboard, Vercel dashboard)
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
3. Rollback: Both platforms keep previous deployments
4. Test locally: `make dev`

### How much will this cost?
**Free option**: $0/month
- Render free tier + Vercel free tier
- Backend sleeps when not in use

**Always-on option**: $7/month
- Render Starter + Vercel free tier
- Backend always available

See [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) for detailed cost breakdown.

---

## 🔍 Quick Troubleshooting

### Backend not accessible
```bash
# Check Render logs
Dashboard → Your Service → Logs

# Verify environment variables
Dashboard → Your Service → Environment

# Check health endpoint
curl https://your-api.onrender.com/healthz
```

### Frontend can't connect to backend
```bash
# Check browser console (F12)
# Verify VITE_API_BASE_URL in Vercel
Dashboard → Project → Settings → Environment Variables

# Update CORS in backend
Edit: server/ProjectManager.Api/appsettings.json
Add: "https://your-app.vercel.app" to AllowedOrigins
```

### CI/CD not working
```bash
# Check GitHub secrets
Settings → Secrets → Actions

# View workflow logs
Actions tab → Click on failed run

# Verify branch name
Workflow triggers on 'main' branch
```

---

## 🎯 Next Steps

After reading this guide:

1. **Choose your path** (Quick Deploy vs Full Documentation)
2. **Follow the guide** step by step
3. **Use the checklist** to track progress
4. **Set up CI/CD** for automatic deployments
5. **Test thoroughly** in production
6. **Monitor** your application

---

## 💡 Pro Tips

1. **Test locally first**: Run `make test && make build` before deploying
2. **Use feature branches**: Don't push directly to main
3. **Enable CI/CD**: Saves time and prevents errors
4. **Monitor logs**: Check regularly for issues
5. **Keep dependencies updated**: Run `npm audit` and update packages
6. **Document changes**: Update README with any customizations

---

## 🆘 Need Help?

1. **Read the docs**: Start with the appropriate guide above
2. **Check logs**: Most issues are visible in logs
3. **Test locally**: Verify it works locally first
4. **Review environment variables**: Most issues are config-related
5. **Check CORS**: Common issue with frontend-backend communication

---

## 📞 Useful Links

### Deployment Platforms
- Render: https://render.com
- Vercel: https://vercel.com
- Railway: https://railway.app
- Fly.io: https://fly.io

### Documentation
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Actions: https://docs.github.com/actions

### Tools
- GitHub: https://github.com
- Docker: https://docker.com

---

**Ready to deploy?** Start with [QUICK_DEPLOY.md](QUICK_DEPLOY.md)!

**Want to learn more?** Check out [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)!

**Need CI/CD?** See [.github/README.md](.github/README.md)!

---

Good luck! 🚀 Your app will be live in no time!
