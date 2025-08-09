# Production Deployment Checklist

Use this checklist to ensure a smooth and secure deployment to production.

## Pre-Deployment Setup (One-time)

### 1. Account Setup
- [ ] Vercel account created and configured
- [ ] GitHub repository connected to Vercel
- [ ] Supabase production project created
- [ ] Stripe live mode activated
- [ ] Domain purchased and DNS configured
- [ ] SSL certificate provisioned (automatic with Vercel)

### 2. Environment Configuration
- [ ] Production environment variables set in Vercel
- [ ] Stripe live mode keys configured
- [ ] Supabase production keys configured
- [ ] Webhook endpoints updated for production domain
- [ ] CORS origins configured for production domain
- [ ] Email service configured (Resend/SendGrid)

### 3. Database Setup
- [ ] Production database migrations applied
- [ ] Row Level Security (RLS) policies enabled
- [ ] Database backups configured
- [ ] Connection limits reviewed
- [ ] Performance monitoring enabled

### 4. Third-party Services
- [ ] Stripe products and prices created in live mode
- [ ] Webhook endpoints configured for production
- [ ] Payment methods tested in Stripe Dashboard
- [ ] Email templates configured
- [ ] Error tracking service setup (Sentry)
- [ ] Analytics service setup (PostHog)

## Pre-Deployment Verification

### Code Quality
- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run type-check` - no errors  
- [ ] Run `npm run format:check` - properly formatted
- [ ] All tests passing (`npm run test:ci`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] No hardcoded secrets in code
- [ ] Security audit clean (`npm audit`)

### Build Verification
- [ ] Production build succeeds (`npm run build`)
- [ ] No build warnings or errors
- [ ] Bundle size reasonable (< 1MB)
- [ ] All imports resolved correctly
- [ ] Environment variables properly referenced

### Repository State
- [ ] All changes committed to git
- [ ] Working on `main` branch for production
- [ ] No uncommitted changes
- [ ] Remote repository up to date
- [ ] No merge conflicts

## Deployment Process

### 1. Final Pre-Deployment Check
```bash
# Run comprehensive verification
./scripts/pre-deploy-check.sh production
```

### 2. Deploy to Production
```bash
# Option A: Automated deployment script
./scripts/deploy.sh production

# Option B: Manual deployment
vercel --prod
```

### 3. Immediate Post-Deployment Verification
```bash
# Wait 2 minutes for deployment to stabilize
sleep 120

# Run health checks
./scripts/check-deployment-status.sh production
```

## Post-Deployment Checklist

### Immediate Verification (0-5 minutes)
- [ ] Homepage loads correctly
- [ ] All main pages accessible (pricing, library, auth)
- [ ] No JavaScript errors in browser console
- [ ] CSS styles loading correctly
- [ ] Images and assets loading

### Functionality Testing (5-15 minutes)
- [ ] User registration flow works
- [ ] Email verification emails sent
- [ ] Login/logout functionality works
- [ ] Subscription purchase flow complete
- [ ] Payment processing successful
- [ ] Library access after subscription
- [ ] File downloads working
- [ ] Subscription management accessible

### Integration Testing (15-30 minutes)
- [ ] Stripe webhooks receiving events
- [ ] Database reads/writes working
- [ ] Email notifications sent
- [ ] Error tracking active (create test error)
- [ ] Analytics tracking events
- [ ] All API endpoints responding

### Performance & Security (30-60 minutes)
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals scores > 80
- [ ] Security headers present
- [ ] SSL certificate valid
- [ ] No broken links or resources
- [ ] Mobile responsiveness works

### Monitoring Setup (60+ minutes)
- [ ] Error tracking dashboard configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Alert thresholds set
- [ ] Cost monitoring alerts enabled
- [ ] Business metrics tracking

## Rollback Procedures

### If Issues Detected

#### Option 1: Quick Fix
If the issue is minor and can be fixed quickly:
1. Fix the issue in code
2. Run `./scripts/pre-deploy-check.sh production`
3. Deploy the fix: `./scripts/deploy.sh production`

#### Option 2: Rollback to Previous Version
If major issues are detected:

```bash
# List recent deployments
vercel ls

# Promote previous working deployment
vercel promote [previous-deployment-url] --scope=[your-team]
```

#### Option 3: Emergency Maintenance Mode
For critical issues:

```bash
# Enable maintenance mode
vercel env add NEXT_PUBLIC_MAINTENANCE_MODE production <<< "true"
vercel --prod

# Investigate and fix issues
# Disable maintenance mode when ready
vercel env rm NEXT_PUBLIC_MAINTENANCE_MODE production
vercel --prod
```

## Critical Monitoring (First 24 Hours)

### Hour 1-2: Active Monitoring
- [ ] Monitor error rates every 15 minutes
- [ ] Check payment processing success
- [ ] Verify user registration flow
- [ ] Monitor response times
- [ ] Check resource utilization

### Hour 2-8: Regular Monitoring  
- [ ] Check error rates hourly
- [ ] Verify all systems operational
- [ ] Monitor user activity patterns
- [ ] Check for any anomalies

### Hour 8-24: Passive Monitoring
- [ ] Review daily summary reports
- [ ] Check cost implications
- [ ] Analyze user behavior patterns
- [ ] Plan optimizations if needed

## Emergency Contacts

### Service Status Pages
- [ ] Vercel Status: https://vercel-status.com
- [ ] Supabase Status: https://status.supabase.com
- [ ] Stripe Status: https://status.stripe.com

### Support Channels
- [ ] Vercel Support: https://vercel.com/support
- [ ] Supabase Support: https://supabase.com/support
- [ ] Stripe Support: https://support.stripe.com

### Internal Escalation
- [ ] Technical lead contact: [Your contact]
- [ ] Business owner contact: [Your contact]
- [ ] Emergency escalation: [Your contact]

## Post-Deployment Documentation

### Update Documentation
- [ ] Update README with production URLs
- [ ] Document any deployment-specific configurations
- [ ] Update API documentation with production endpoints
- [ ] Record lessons learned

### Team Communication
- [ ] Notify team of successful deployment
- [ ] Share monitoring dashboard access
- [ ] Document any issues encountered
- [ ] Schedule post-deployment review

## Success Criteria

Deployment is considered successful when:

- [ ] All health checks pass
- [ ] Error rate < 1%
- [ ] Response times < 2 seconds
- [ ] Payment processing > 95% success rate
- [ ] No critical security issues
- [ ] All integrations functioning
- [ ] Monitoring systems active
- [ ] User journeys work end-to-end

## Next Deployment Improvements

Based on this deployment, consider:

- [ ] Automated smoke tests
- [ ] Blue-green deployment strategy
- [ ] Canary releases for major features
- [ ] Enhanced monitoring coverage
- [ ] Performance optimization opportunities
- [ ] Security hardening improvements

---

**Remember**: Take your time with each step. A careful deployment prevents production issues and emergency fixes later.

**Deployment Lead**: _________________ **Date**: _________________

**Post-Deployment Review Date**: _________________