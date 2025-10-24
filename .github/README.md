# GitHub Actions CI/CD

Automated testing and deployment workflows for the Mini Project Manager.

## Workflows

### 1. `deploy.yml` - Deployment Pipeline

**Trigger**: Push to `main` or `production` branch

**Jobs**:
- ✅ Test backend (.NET tests)
- ✅ Test frontend (React tests)
- 🚀 Deploy backend to Render
- 🚀 Deploy frontend to Vercel
- 📢 Send deployment notification

**Required Secrets**:
- `RENDER_DEPLOY_HOOK_URL` - Render webhook for triggering deploys
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### 2. `ci.yml` - Continuous Integration

**Trigger**: Push to feature branches or pull requests

**Jobs**:
- ✅ Lint and test backend
- ✅ Lint and test frontend
- 🔒 Security vulnerability scan
- 💬 PR comment with results

**No deployment** - Only runs tests and checks

## Setup Instructions

### 1. Get Render Deploy Hook

1. Go to [Render Dashboard](https://render.com/dashboard)
2. Select your service
3. Go to **Settings** → Scroll to **Deploy Hook**
4. Click **Create Deploy Hook**
5. Copy the webhook URL

### 2. Get Vercel Credentials

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project (from web directory)
cd web
vercel link

# Get project info
cat .vercel/project.json
```

This gives you:
- `orgId` → `VERCEL_ORG_ID`
- `projectId` → `VERCEL_PROJECT_ID`

Get your token from: https://vercel.com/account/tokens

### 3. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

| Secret Name | Description | Where to Get |
|------------|-------------|--------------|
| `RENDER_DEPLOY_HOOK_URL` | Render webhook URL | Render Dashboard → Service → Settings |
| `VERCEL_TOKEN` | Vercel API token | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | Vercel project ID | `.vercel/project.json` after `vercel link` |
| `VITE_API_BASE_URL` | Backend API URL (optional) | Your Render backend URL |

### 4. Test the Workflow

```bash
# Make a test change
echo "# CI/CD Test" >> README.md
git add .
git commit -m "Test CI/CD pipeline"
git push origin main

# Watch deployment
# Go to: https://github.com/YOUR_USER/YOUR_REPO/actions
```

## Workflow Behavior

### On Feature Branch Push
```
Push to feature branch
  ↓
Run CI checks (ci.yml)
  ├─ Test backend
  ├─ Test frontend
  └─ Security scan
  ↓
Show results
(No deployment)
```

### On Pull Request
```
Open/Update PR
  ↓
Run CI checks (ci.yml)
  ├─ Test backend
  ├─ Test frontend
  └─ Security scan
  ↓
Post comment on PR with results
(No deployment)
```

### On Main Branch Push
```
Push/Merge to main
  ↓
Run tests (deploy.yml)
  ├─ Test backend ✅
  └─ Test frontend ✅
  ↓
Deploy (in parallel)
  ├─ Backend → Render (5-10 min)
  └─ Frontend → Vercel (2-5 min)
  ↓
Send notification
  ├─ GitHub Actions summary
  └─ Deployment status
```

## Manual Deployment

You can manually trigger deployment from GitHub:

1. Go to **Actions** tab
2. Select **Deploy Application** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

## Monitoring Deployments

### GitHub Actions
- Go to **Actions** tab in your repository
- Click on a workflow run to see details
- View logs for each job
- Check deployment status

### Render
- Go to [Render Dashboard](https://render.com/dashboard)
- Select your service
- Click **Logs** to see deployment logs
- Check **Events** for deployment history

### Vercel
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Select your project
- View **Deployments** tab
- Click on a deployment to see details

## Troubleshooting

### Deployment Not Triggering

**Check**:
1. Secrets are correctly set in GitHub
2. Push is to `main` branch
3. Tests are passing

**Fix**:
```bash
# Verify secrets exist
gh secret list  # Using GitHub CLI

# Or check in browser
# Settings → Secrets → Actions
```

### Tests Failing

**Backend Tests**:
```bash
cd server/ProjectManager.Tests
dotnet test --verbosity detailed
```

**Frontend Tests**:
```bash
cd web
npm run test -- --run
```

### Backend Deploy Fails

**Check Render Logs**:
- Dashboard → Service → Logs
- Look for build errors

**Common Issues**:
- Missing environment variables
- Database connection issues
- Port binding problems

### Frontend Deploy Fails

**Check Vercel Logs**:
- Dashboard → Project → Deployments → Click deployment
- View build logs

**Common Issues**:
- Missing `VITE_API_BASE_URL`
- Build errors (run `npm run build` locally)
- TypeScript errors

### Security Scan Failures

Security scans are informational and won't block deployment. To fix vulnerabilities:

```bash
# Update dependencies
npm audit fix

# For .NET
dotnet list package --vulnerable
dotnet add package <PackageName> --version <Version>
```

## Customization

### Change Deployment Branch

Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [ production ]  # Change from 'main'
```

### Add Slack Notifications

Add to `deploy.yml`:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add More Tests

Edit workflow files to add additional test steps:
```yaml
- name: Run E2E Tests
  run: npm run test:e2e
```

### Deploy to Staging First

Create separate workflows for staging:
- `deploy-staging.yml` for `develop` branch
- `deploy-production.yml` for `main` branch

## Best Practices

1. **Always run tests locally** before pushing
   ```bash
   npm run test
   ```

2. **Use feature branches** for development
   ```bash
   git checkout -b feature/my-feature
   # Make changes
   git push origin feature/my-feature
   # Create PR on GitHub
   ```

3. **Review CI results** before merging PRs

4. **Monitor deployments** after merging to main

5. **Keep dependencies updated** to avoid security issues

6. **Test in staging** before deploying to production (if you have staging)

## Workflow Status Badges

Add to your README.md:

```markdown
[![Deploy](https://github.com/USERNAME/REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/deploy.yml)
[![CI](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/ci.yml)
```

Replace `USERNAME` and `REPO` with your details.

## Cost Considerations

**GitHub Actions**:
- Public repos: Unlimited free minutes
- Private repos: 2,000 free minutes/month

**Render**:
- Free tier: Sleeps after 15 min inactivity
- Paid: $7+/month for always-on

**Vercel**:
- Hobby: Free with limits
- Pro: $20/month for production apps

## Need Help?

- Check [GitHub Actions docs](https://docs.github.com/actions)
- See [Render docs](https://render.com/docs)
- See [Vercel docs](https://vercel.com/docs)
- Review main `DEPLOYMENT.md` for detailed deployment guide
