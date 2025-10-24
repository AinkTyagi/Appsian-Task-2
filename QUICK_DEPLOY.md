# Quick Deployment Guide

Get your app deployed in 15 minutes! 🚀

## Prerequisites (5 min)

1. **GitHub Account**: https://github.com/signup
2. **Render Account**: https://render.com/register
3. **Vercel Account**: https://vercel.com/signup

## Step 1: Push to GitHub (3 min)

```bash
# Initialize git if needed
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render (5 min)

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Blueprint"**
3. Click **"Connect account"** to link GitHub
4. Select your repository
5. Click **"Apply"** (Render auto-detects `infra/render.yaml`)
6. Wait 5-10 minutes for deployment
7. **Copy your backend URL**: `https://project-manager-api-xxx.onrender.com`

## Step 3: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your repository
4. Configure:
   - **Root Directory**: `web`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your Render backend URL (from Step 2)
6. Click **"Deploy"**
7. Wait 2-5 minutes

## Step 4: Update CORS (2 min)

1. Copy your Vercel URL: `https://your-app.vercel.app`
2. Edit `server/ProjectManager.Api/appsettings.json`:
   ```json
   "AllowedOrigins": [
     "http://localhost:5173",
     "https://your-app.vercel.app"
   ]
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Add production CORS"
   git push
   ```
4. Render will auto-deploy (wait 2-3 min)

## ✅ Done!

Your app is live! Visit your Vercel URL and start using it.

---

## Optional: Setup Auto-Deploy (CI/CD)

### 1. Get Render Deploy Hook
- Render Dashboard → Your Service → Settings
- Scroll to "Deploy Hook"
- Copy the webhook URL

### 2. Get Vercel Tokens
```bash
npm install -g vercel
vercel login
cd web
vercel link
cat .vercel/project.json
```

Copy:
- `orgId` (VERCEL_ORG_ID)
- `projectId` (VERCEL_PROJECT_ID)

Get token from: https://vercel.com/account/tokens

### 3. Add GitHub Secrets
GitHub repo → Settings → Secrets → Actions → New repository secret

Add these secrets:
- `RENDER_DEPLOY_HOOK_URL`: (paste webhook URL)
- `VERCEL_TOKEN`: (paste token)
- `VERCEL_ORG_ID`: (paste orgId)
- `VERCEL_PROJECT_ID`: (paste projectId)

### 4. Test Auto-Deploy
```bash
# Make a change
echo "# Test" >> README.md
git add .
git commit -m "Test auto-deploy"
git push

# Check GitHub Actions tab to see deployment
```

Now every push to `main` branch will:
1. Run tests
2. Auto-deploy to Render and Vercel
3. Show status in GitHub Actions

---

## Troubleshooting

**Backend not responding?**
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set

**Frontend can't connect to backend?**
- Check `VITE_API_BASE_URL` in Vercel: Settings → Environment Variables
- Verify CORS settings in backend

**Builds failing?**
- Check GitHub Actions: Actions tab → Failed workflow → View logs
- Ensure all tests pass locally: `npm run test`

**Need help?** Check `DEPLOYMENT.md` for detailed documentation.

---

## URLs Reference

After deployment, save these URLs:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://project-manager-api-xxx.onrender.com`
- **Backend Swagger**: `https://project-manager-api-xxx.onrender.com/swagger`

---

## Next Steps

- [ ] Test your deployed app
- [ ] Add custom domain (optional)
- [ ] Set up monitoring and alerts
- [ ] Configure database backups
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Set up error tracking (Sentry)

For production checklist, see `DEPLOYMENT.md`
