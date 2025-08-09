# Netlify Deployment Checklist

Complete this checklist before deploying to production to ensure a smooth, zero-downtime deployment.

## Pre-Deployment Validation

### Code Quality & Testing
- [ ] **Linting passes**: Run `npm run lint` - no errors
- [ ] **Type checking passes**: Run `npm run type-check` - no TypeScript errors  
- [ ] **Unit tests pass**: Run `npm run test:ci` - all tests green with >80% coverage
- [ ] **E2E tests pass**: Run `npm run test:e2e` - critical user journeys working
- [ ] **Build succeeds**: Run `npm run build` - no build errors
- [ ] **Local preview works**: Run `npm run start` - verify production build locally

### Environment Configuration
- [ ] **Environment variables defined**: All required variables listed in Netlify
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `NEXT_PUBLIC_APP_URL` (set to your production domain)
- [ ] **Supabase configuration**: Production database ready and migrated
- [ ] **Stripe configuration**: Webhooks configured for production domain
- [ ] **API endpoints tested**: All external integrations working

### Performance & Security
- [ ] **Images optimized**: All images under 500KB, using WebP/AVIF formats
- [ ] **Bundle analysis**: Run `npm run build:analyze` - no unusually large bundles
- [ ] **Security headers configured**: Check `netlify.toml` and `next.config.mjs`
- [ ] **Content Security Policy tested**: No console errors from CSP violations
- [ ] **SSL certificate ready**: Domain properly configured for automatic SSL

## Netlify Configuration

### Site Setup
- [ ] **Repository connected**: GitHub repository linked to Netlify
- [ ] **Build settings configured**:
  - Build command: `npm run build`
  - Publish directory: `.next`
  - Node version: 18.x
- [ ] **Plugins installed**: `@netlify/plugin-nextjs` added
- [ ] **Functions enabled**: If using Netlify Functions for API routes

### Domain Configuration
- [ ] **Custom domain added**: `agents-11.com` added as primary domain
- [ ] **Domain alias configured**: `www.agents-11.com` added as alias
- [ ] **DNS records configured**: Following NETLIFY_DNS_SETUP.md instructions
- [ ] **SSL certificate active**: HTTPS enabled and working
- [ ] **Force HTTPS enabled**: HTTP traffic redirects to HTTPS

### Deployment Settings
- [ ] **Auto-publish enabled**: Automatic deploys from main branch
- [ ] **Deploy previews enabled**: For pull requests
- [ ] **Branch deploys configured**: For feature branches if needed
- [ ] **Deploy notifications set**: Slack/email notifications configured

## Pre-Deploy Testing

### Local Testing
- [ ] **Production build tested locally**:
  ```bash
  npm run build
  npm run start
  ```
- [ ] **All pages load correctly**: Navigate through entire site
- [ ] **Authentication flow works**: Login/logout/signup tested
- [ ] **Payment flow works**: Stripe checkout tested with test cards
- [ ] **Download functionality works**: File downloads working
- [ ] **Mobile responsive**: Test on mobile devices/Chrome DevTools

### Staging Deployment (if applicable)
- [ ] **Deploy to staging first**: Test on Netlify deploy preview
- [ ] **Full user journey tested**: Complete end-to-end testing
- [ ] **Performance metrics checked**: Core Web Vitals acceptable
- [ ] **Cross-browser testing**: Chrome, Firefox, Safari, Edge
- [ ] **External integrations verified**: Supabase, Stripe working

## Deployment Execution

### Initial Deployment
- [ ] **Deploy during low-traffic period**: Minimize user impact
- [ ] **Monitor deployment logs**: Watch build process for errors
- [ ] **Verify successful build**: Green checkmark in Netlify dashboard
- [ ] **Check deploy summary**: No build warnings or errors
- [ ] **Function deployment verified**: All serverless functions deployed

### Post-Deploy Verification (First 5 minutes)
- [ ] **Site loads at custom domain**: `https://agents-11.com` works
- [ ] **WWW redirect works**: `https://www.agents-11.com` redirects properly
- [ ] **HTTPS redirect works**: `http://agents-11.com` redirects to HTTPS
- [ ] **API routes functional**: Test at least one API endpoint
- [ ] **Database connectivity**: Verify Supabase connection
- [ ] **Payment processing**: Test Stripe webhook delivery

### Post-Deploy Monitoring (First 30 minutes)
- [ ] **Error rate normal**: No spike in 404s or 500s
- [ ] **Performance metrics stable**: Core Web Vitals within targets
- [ ] **CDN cache working**: Static assets loading from CDN
- [ ] **SSL certificate valid**: Certificate issued and trusted
- [ ] **Security headers active**: Check browser dev tools
- [ ] **Analytics tracking**: Google Analytics/Netlify Analytics working

## Rollback Procedures

### Rollback Triggers
Monitor for these conditions that require immediate rollback:

- [ ] **Site completely down**: 404 or 500 errors on homepage
- [ ] **Critical user flows broken**: Login, signup, or payment failing
- [ ] **Database errors**: Connection issues or data corruption
- [ ] **Security vulnerabilities**: Exposed sensitive data
- [ ] **Performance degradation**: >50% increase in load times

### Rollback Execution
If rollback needed:

1. **Immediate rollback**: 
   ```bash
   # In Netlify dashboard, go to Deploys
   # Find last known good deploy
   # Click "Publish deploy" 
   ```

2. **Verify rollback**:
   - [ ] Site loads correctly
   - [ ] Critical functionality works
   - [ ] Performance restored

3. **Post-rollback actions**:
   - [ ] Notify team of rollback
   - [ ] Create incident report
   - [ ] Fix issues before next deployment

## Success Criteria

Deployment is successful when:

- [ ] **Availability**: Site loading with 99.9% uptime
- [ ] **Functionality**: All critical user journeys working
- [ ] **Performance**: Core Web Vitals meet targets
  - [ ] Largest Contentful Paint (LCP) < 2.5s
  - [ ] First Input Delay (FID) < 100ms
  - [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] **Security**: All security headers active, HTTPS working
- [ ] **Integration**: Supabase and Stripe fully functional
- [ ] **Monitoring**: Error rates within normal parameters

## Post-Deployment Tasks

### Immediate (First hour)
- [ ] **Update team**: Notify team of successful deployment
- [ ] **Monitor metrics**: Watch error rates, performance, traffic
- [ ] **Test key features**: Manual testing of critical functionality
- [ ] **Check logs**: Review deployment and application logs

### Within 24 hours
- [ ] **Performance review**: Analyze Core Web Vitals and load times
- [ ] **Error analysis**: Review any new errors or warnings
- [ ] **User feedback**: Monitor support channels for issues
- [ ] **Analytics review**: Check traffic patterns and user behavior

### Within 1 week
- [ ] **Post-mortem**: Document lessons learned
- [ ] **Performance optimization**: Identify improvement opportunities
- [ ] **Monitoring setup**: Configure alerts for key metrics
- [ ] **Documentation update**: Update deployment documentation

## Emergency Contacts

- **Technical Lead**: [Your contact info]
- **DevOps Engineer**: [Your contact info]  
- **Netlify Support**: support@netlify.com
- **Supabase Support**: support@supabase.io
- **Stripe Support**: support@stripe.com

## Deployment Sign-off

**Deployed by**: ___________________ **Date**: ___________

**Reviewed by**: ___________________ **Date**: ___________

**Production Manager Approval**: ___________________ **Date**: ___________

---

**Notes:**
- This checklist should be completed for every production deployment
- Keep a record of completed checklists for audit purposes
- Update this checklist based on lessons learned from deployments
- Automate as many checks as possible through CI/CD pipelines