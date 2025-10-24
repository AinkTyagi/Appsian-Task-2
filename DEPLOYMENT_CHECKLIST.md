# Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment Setup

### Local Development
- [ ] Application runs locally without errors
- [ ] All tests pass: `npm run test`
- [ ] Backend builds successfully: `cd server && dotnet build`
- [ ] Frontend builds successfully: `cd web && npm run build`
- [ ] Environment variables configured locally

### Code Repository
- [ ] Code is committed to Git
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] `.gitignore` properly configured (no secrets committed)

## Backend Deployment (Render)

### Setup
- [ ] Render account created
- [ ] GitHub account connected to Render
- [ ] Backend service created using Blueprint

### Configuration
- [ ] `JWT__Key` environment variable set (min 32 chars)
- [ ] `ASPNETCORE_ENVIRONMENT` set to `Production`
- [ ] `ASPNETCORE_URLS` set to `http://0.0.0.0:5000`
- [ ] `ConnectionStrings__Default` configured
- [ ] Persistent disk attached for database

### Verification
- [ ] Backend deployed successfully
- [ ] Health check endpoint responding: `/healthz`
- [ ] Swagger UI accessible (if enabled): `/swagger`
- [ ] Backend URL copied for frontend configuration

## Frontend Deployment (Vercel)

### Setup
- [ ] Vercel account created
- [ ] GitHub account connected to Vercel
- [ ] Project imported to Vercel

### Configuration
- [ ] Root directory set to `web`
- [ ] Build command set to `npm run build`
- [ ] Output directory set to `dist`
- [ ] Framework preset set to `Vite`
- [ ] `VITE_API_BASE_URL` environment variable set (backend URL)

### Verification
- [ ] Frontend deployed successfully
- [ ] Application loads in browser
- [ ] API connection working (check network tab)
- [ ] Can register/login
- [ ] Can create projects and tasks

## CORS Configuration

- [ ] Vercel URL added to backend CORS settings
- [ ] `appsettings.json` updated with production URLs
- [ ] Changes committed and pushed
- [ ] Backend redeployed with new CORS settings
- [ ] Frontend can successfully call backend APIs

## CI/CD Setup (Optional but Recommended)

### GitHub Secrets
- [ ] `RENDER_DEPLOY_HOOK_URL` added to GitHub secrets
- [ ] `VERCEL_TOKEN` added to GitHub secrets
- [ ] `VERCEL_ORG_ID` added to GitHub secrets
- [ ] `VERCEL_PROJECT_ID` added to GitHub secrets

### Workflow Files
- [ ] `.github/workflows/deploy.yml` exists
- [ ] `.github/workflows/ci.yml` exists
- [ ] Workflows have correct branch names

### Testing
- [ ] Made test commit to trigger CI/CD
- [ ] GitHub Actions workflow runs successfully
- [ ] Backend auto-deploys on push to main
- [ ] Frontend auto-deploys on push to main
- [ ] Deployment notifications working

## Security & Production Readiness

### Security
- [ ] JWT secret is strong (min 32 characters, random)
- [ ] No secrets in source code
- [ ] HTTPS enabled (automatic with Render/Vercel)
- [ ] CORS properly configured (not using wildcard *)
- [ ] Rate limiting configured for auth endpoints
- [ ] Database backups configured

### Performance
- [ ] Frontend assets optimized
- [ ] API response times acceptable
- [ ] Database queries optimized
- [ ] Caching configured where appropriate

### Monitoring
- [ ] Error logging configured
- [ ] Application logs accessible
- [ ] Uptime monitoring set up (optional)
- [ ] Performance monitoring set up (optional)

## Post-Deployment

### Testing
- [ ] Register new user in production
- [ ] Create project in production
- [ ] Create tasks in production
- [ ] Test smart scheduler in production
- [ ] Test on mobile devices
- [ ] Test in different browsers

### Documentation
- [ ] Production URLs documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide available

### Optional Enhancements
- [ ] Custom domain configured
- [ ] Analytics added (Google Analytics, Plausible, etc.)
- [ ] Error tracking added (Sentry, Rollbar, etc.)
- [ ] CDN configured for static assets
- [ ] Database upgraded from SQLite to PostgreSQL (if needed)
- [ ] Email notifications configured
- [ ] Backup automation configured

## Maintenance Tasks

### Regular Tasks
- [ ] Monitor application logs weekly
- [ ] Check for dependency updates monthly
- [ ] Review security vulnerabilities monthly
- [ ] Test backup restoration quarterly
- [ ] Review and optimize costs monthly

### When Issues Occur
- [ ] Check GitHub Actions for failed workflows
- [ ] Check Render logs for backend errors
- [ ] Check Vercel logs for frontend errors
- [ ] Review error tracking service (if configured)
- [ ] Test rollback procedure if needed

## Rollback Plan

In case of issues after deployment:

### Quick Rollback
- [ ] Know how to rollback in Render (previous deployment)
- [ ] Know how to rollback in Vercel (previous deployment)
- [ ] Have backup of database (if using SQLite)

### Rollback Procedure
1. [ ] Identify the issue
2. [ ] Check if hotfix is possible
3. [ ] If not, rollback backend to previous version
4. [ ] Rollback frontend to previous version
5. [ ] Verify application is working
6. [ ] Fix issue in development
7. [ ] Redeploy when fix is ready

## Success Criteria

- [x] Application is live and accessible
- [x] Users can register and login
- [x] Users can create projects and tasks
- [x] Smart scheduler works correctly
- [x] Application is secure (HTTPS, auth working)
- [x] CI/CD pipeline working (if configured)
- [x] No critical errors in logs
- [x] Performance is acceptable
- [x] Mobile responsive
- [x] Documentation is complete

## Notes

Use this section to track deployment dates, URLs, and any specific notes:

```
Deployment Date: _________________
Backend URL: _________________
Frontend URL: _________________
Database: SQLite / PostgreSQL / Other: _________________
CDN: None / Cloudflare / Other: _________________

Notes:
_________________________________
_________________________________
_________________________________
```

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Actions Docs**: https://docs.github.com/actions
- **Project Docs**: See `DEPLOYMENT.md` and `QUICK_DEPLOY.md`

---

**Tips**:
- Check items as you complete them
- Don't skip security items
- Test thoroughly before marking as complete
- Keep this checklist updated with your specific needs
- Save your deployment URLs and credentials securely
