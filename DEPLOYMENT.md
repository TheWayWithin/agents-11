# Deployment Guide - Agents-11 Marketplace

This guide covers the complete deployment process for the Agents-11 marketplace from local development to production on Vercel.

## Quick Start

```bash
# 1. Setup production environment
./scripts/setup-production.sh

# 2. Deploy to production
./scripts/deploy.sh production
```

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Production Configuration](#production-configuration)
4. [Deployment Process](#deployment-process)
5. [Post-Deployment](#post-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts & Services

- [Vercel Account](https://vercel.com) - For hosting and deployment
- [Supabase Account](https://supabase.com) - For production database
- [Stripe Account](https://stripe.com) - For payment processing
- [GitHub Account](https://github.com) - For CI/CD automation

### Required Tools

```bash
# Install Vercel CLI
npm install -g vercel

# Install dependencies
npm install
```

## Environment Setup

### 1. Local Development Setup

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your development keys
vim .env.local
```

### 2. Production Environment Variables

Use the automated setup script:

```bash
./scripts/setup-production.sh
```

Or manually configure in Vercel dashboard:

#### Core Application Variables

```env
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Stripe (Live Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (from Stripe Dashboard)
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_UNLIMITED_PRICE_ID=price_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://agents11.com
NEXTAUTH_SECRET=your_32_char_secret
```

#### Optional Monitoring Variables

```env
# Error Tracking
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Email Service
RESEND_API_KEY=re_...
```

## Production Configuration

### 1. Supabase Production Setup

#### Database Migration

```sql
-- Apply all migrations to production
-- Run these in your Supabase SQL editor

-- 1. Initial schema
\i supabase/migrations/20240101000001_initial_schema.sql

-- 2. Access view
\i supabase/migrations/20240101000002_create_access_view.sql

-- 3. RLS policies
\i supabase/migrations/20240101000003_rls_policies.sql
```

#### Authentication Configuration

1. Go to Authentication > Settings in Supabase dashboard
2. Add your production domain to "Site URL"
3. Add redirect URLs for OAuth providers
4. Configure email templates for production branding

#### API Settings

1. Go to Settings > API
2. Add your production domain to CORS origins
3. Copy production keys to Vercel environment variables

### 2. Stripe Production Setup

#### Webhook Configuration

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://agents11.com/api/stripe/webhooks`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to environment variables

#### Product & Price Setup

Create products and prices in Stripe Dashboard:

```bash
# Starter Plan - $9.95/month
stripe products create --name="Starter Plan" --description="Basic agent library access"
stripe prices create --product=prod_... --unit-amount=995 --currency=usd --recurring-interval=month

# Professional Plan - $19.95/month
stripe products create --name="Professional Plan" --description="Full agent library access"
stripe prices create --product=prod_... --unit-amount=1995 --currency=usd --recurring-interval=month

# Unlimited Plan - $39.95/month
stripe products create --name="Unlimited Plan" --description="Unlimited access + premium features"
stripe prices create --product=prod_... --unit-amount=3995 --currency=usd --recurring-interval=month
```

### 3. Domain & SSL Configuration

#### Custom Domain Setup (Vercel)

1. Go to Project Settings > Domains in Vercel
2. Add your custom domain: `agents11.com`
3. Add www subdomain: `www.agents11.com`
4. Configure DNS records:

```dns
# A Record
agents11.com -> 76.76.19.61

# CNAME Record  
www.agents11.com -> cname.vercel-dns.com
```

#### SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. No additional configuration required.

## Deployment Process

### 1. Automated Deployment (Recommended)

The GitHub Actions workflow automatically deploys:

- **Staging**: Deploys on push to `develop` branch
- **Production**: Deploys on push to `main` branch

#### Manual Trigger

```bash
# Deploy to staging
git checkout develop
git push origin develop

# Deploy to production
git checkout main
git merge develop
git push origin main
```

### 2. Manual Deployment

#### Using Deployment Script

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production  
./scripts/deploy.sh production
```

#### Using Vercel CLI Directly

```bash
# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

### 3. CI/CD Pipeline

The pipeline includes:

1. **Code Quality Checks**
   - ESLint
   - Prettier
   - TypeScript compilation

2. **Testing**
   - Unit tests with Jest
   - E2E tests with Playwright
   - Coverage reporting

3. **Security**
   - npm audit
   - CodeQL analysis

4. **Build Verification**
   - Production build test
   - Asset optimization

5. **Deployment**
   - Automated deployment to Vercel
   - Health checks
   - Rollback capability

## Post-Deployment

### 1. Immediate Verification

```bash
# Health check
curl -f https://agents11.com/api/health

# Key functionality tests
curl -f https://agents11.com/api/libraries
curl -f https://agents11.com/pricing
```

### 2. Critical Path Testing

Test these user journeys:

- [ ] User registration and email verification
- [ ] Subscription purchase flow
- [ ] Library access after subscription
- [ ] File downloads
- [ ] Subscription management
- [ ] Payment method updates

### 3. Integration Verification

- [ ] Stripe webhooks receiving events
- [ ] Email notifications working
- [ ] Database connections stable
- [ ] Authentication flows working
- [ ] File storage accessible

### 4. Performance Monitoring

Monitor these metrics for 30 minutes post-deployment:

- [ ] Response times < 2s
- [ ] Error rate < 1%
- [ ] Payment success rate > 95%
- [ ] Database query performance
- [ ] CDN cache hit rates

## Monitoring & Maintenance

### 1. Error Tracking (Sentry)

```javascript
// Automatically configured in production
// View errors at: https://sentry.io/organizations/your-org/projects/
```

### 2. Analytics (PostHog)

```javascript
// User behavior tracking
// View analytics at: https://app.posthog.com
```

### 3. Performance Monitoring

#### Vercel Analytics

- Core Web Vitals
- Page load times
- Geographic performance
- Edge caching efficiency

#### Custom Monitoring

```bash
# Set up uptime monitoring
curl -X POST "https://api.uptimerobot.com/v2/newMonitor" \
  -d "api_key=your_api_key" \
  -d "url=https://agents11.com" \
  -d "type=1"
```

### 4. Database Monitoring

- Query performance in Supabase dashboard
- Connection pool usage
- Storage usage and limits
- Backup verification

### 5. Cost Monitoring

Track monthly costs for:

- Vercel hosting and bandwidth
- Supabase database and storage
- Stripe transaction fees
- Third-party service costs

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Check build logs
vercel logs your-deployment-url

# Common fixes
npm run lint:fix
npm run type-check
npm install
```

#### 2. Environment Variable Issues

```bash
# List current env vars
vercel env ls

# Update specific variable
vercel env rm STRIPE_SECRET_KEY production
vercel env add STRIPE_SECRET_KEY production
```

#### 3. Database Connection Issues

```bash
# Test Supabase connection
curl -H "apikey: your_anon_key" \
  "https://your-project.supabase.co/rest/v1/profiles?select=*"
```

#### 4. Stripe Webhook Failures

1. Check webhook logs in Stripe Dashboard
2. Verify webhook endpoint URL
3. Confirm webhook secret matches environment
4. Test webhook manually

#### 5. Domain/SSL Issues

```bash
# Check DNS propagation
dig agents11.com

# Verify SSL certificate
curl -vI https://agents11.com
```

### Recovery Procedures

#### Rollback Deployment

```bash
# View deployment history
vercel ls

# Promote previous deployment
vercel promote deployment-url --scope=your-team
```

#### Emergency Maintenance Mode

```bash
# Enable maintenance mode
vercel env add NEXT_PUBLIC_MAINTENANCE_MODE production <<< "true"

# Trigger new deployment
vercel --prod
```

#### Database Recovery

```sql
-- Restore from backup (if needed)
-- Contact Supabase support for major issues
```

## Security Checklist

### Pre-Deployment Security

- [ ] All secrets properly configured
- [ ] CORS origins restricted to production domains
- [ ] Rate limiting enabled
- [ ] Content Security Policy configured
- [ ] HTTPS enforced
- [ ] Security headers implemented

### Post-Deployment Security

- [ ] SSL certificate valid and properly configured
- [ ] Security headers present in response
- [ ] CSP not blocking legitimate resources
- [ ] Authentication flows secure
- [ ] API endpoints properly protected
- [ ] No sensitive data in client-side code

## Performance Checklist

### Build Optimization

- [ ] Bundle size under 1MB compressed
- [ ] Images optimized with WebP/AVIF
- [ ] Unused dependencies removed
- [ ] Code splitting implemented
- [ ] Static generation where possible

### Runtime Performance

- [ ] Core Web Vitals scores > 90
- [ ] Page load times < 2 seconds
- [ ] Database queries optimized
- [ ] CDN cache hit rate > 80%
- [ ] API response times < 500ms

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support  
- **Stripe Support**: https://support.stripe.com
- **Emergency Contact**: [Your team contact info]

---

## Changelog

- **v1.0.0** - Initial production deployment setup
- **v1.1.0** - Added monitoring and error tracking
- **v1.2.0** - Enhanced security headers and CSP