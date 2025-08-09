# Complete Netlify Deployment Guide for Agents-11

This comprehensive guide walks you through deploying the Agents-11 marketplace to Netlify with custom domain configuration, zero-downtime deployment, and full CI/CD automation.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Domain Configuration](#domain-configuration)
5. [CI/CD Setup](#cicd-setup)
6. [Edge Functions Setup](#edge-functions-setup)
7. [Deployment Process](#deployment-process)
8. [Post-Deployment Configuration](#post-deployment-configuration)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:

- [x] **GitHub Repository**: Code pushed to GitHub
- [x] **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
- [x] **Domain**: `agents-11.com` registered with Namecheap
- [x] **Supabase Project**: Production database configured
- [x] **Stripe Account**: Production keys available
- [x] **Local Testing**: Application builds and runs successfully

## Initial Setup

### 1. Create Netlify Site

1. **Login to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in with your GitHub account

2. **Import Repository**:
   - Click "New site from Git"
   - Choose "GitHub" as your Git provider
   - Select your `Agents-11` repository
   - Branch to deploy: `main`

3. **Configure Build Settings**:
   ```
   Build command: npm run build
   Publish directory: .next
   Functions directory: netlify/functions
   ```

4. **Advanced Settings**:
   - Node.js version: 18.x
   - Environment: Production

### 2. Install Required Plugins

In your Netlify site dashboard:

1. Go to **Site settings** → **Plugins**
2. Install **@netlify/plugin-nextjs**
3. The plugin will automatically configure Next.js optimizations

## Environment Configuration

### 1. Add Environment Variables

Go to **Site settings** → **Environment variables** and add:

#### Required Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration  
STRIPE_SECRET_KEY=sk_live_... (production key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (production key)
STRIPE_WEBHOOK_SECRET=whsec_... (webhook secret)

# Application Configuration
NEXT_PUBLIC_APP_URL=https://agents-11.com
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### Optional Variables
```bash
# Analytics (if using)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key

# Monitoring (if using)
SENTRY_DSN=your_sentry_dsn
```

### 2. Environment Variable Validation

Create a validation script to ensure all required variables are present:

```bash
# Add to package.json scripts
"validate-env": "node scripts/validate-env.js"
```

## Domain Configuration

### 1. Configure Custom Domain in Netlify

1. **Add Primary Domain**:
   - Go to **Site settings** → **Domain management**
   - Click **Add custom domain**
   - Enter: `agents-11.com`
   - Click **Verify**

2. **Add Domain Alias**:
   - Click **Add domain alias**
   - Enter: `www.agents-11.com`
   - This handles www → non-www redirects

### 2. DNS Configuration

Follow the complete DNS setup guide in [NETLIFY_DNS_SETUP.md](./NETLIFY_DNS_SETUP.md):

**Quick Reference - DNS Records for Namecheap:**

```
Type: A       | Host: @   | Value: 75.2.60.5
Type: A       | Host: @   | Value: 99.83.190.102  
Type: A       | Host: @   | Value: 3.33.152.147
Type: A       | Host: @   | Value: 3.248.220.207
Type: CNAME   | Host: www | Value: agents-11.com
```

### 3. SSL Configuration

1. **Automatic SSL**:
   - Netlify automatically provisions SSL certificates via Let's Encrypt
   - Wait 5-10 minutes for certificate provisioning

2. **Force HTTPS**:
   - Go to **Site settings** → **Domain management** → **HTTPS**
   - Enable **Force HTTPS**
   - This redirects all HTTP traffic to HTTPS

## CI/CD Setup

### 1. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to **Repository** → **Settings** → **Secrets and variables** → **Actions**

2. **Add Repository Secrets**:
   ```bash
   NETLIFY_AUTH_TOKEN=your_netlify_personal_access_token
   NETLIFY_SITE_ID=your_netlify_site_id
   NETLIFY_SITE_NAME=your_netlify_site_name
   
   # Production Environment Variables (same as Netlify)
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_production_stripe_key
   
   # Staging Environment Variables (for preview deploys)
   NEXT_PUBLIC_SUPABASE_URL_STAGING=your_staging_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING=your_staging_supabase_anon_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=your_test_stripe_key
   ```

### 2. Get Netlify Credentials

1. **Personal Access Token**:
   - Go to [app.netlify.com/user/applications](https://app.netlify.com/user/applications)
   - Click **New access token**
   - Name: "GitHub Actions CI/CD"
   - Copy the token → Add to GitHub secrets as `NETLIFY_AUTH_TOKEN`

2. **Site ID**:
   - In your Netlify site dashboard
   - Go to **Site settings** → **General**
   - Copy **Site ID** → Add to GitHub secrets as `NETLIFY_SITE_ID`

### 3. Workflow Configuration

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) automatically:

- **Tests**: Runs linting, type checking, unit tests
- **Builds**: Creates production build
- **Security**: Runs security audits and secret scanning  
- **E2E Tests**: Runs end-to-end tests on main branch
- **Deploys**: Automatically deploys to Netlify on main branch pushes
- **Previews**: Creates preview deployments for pull requests
- **Monitoring**: Runs Lighthouse performance audits

## Edge Functions Setup

### 1. Create Edge Functions Directory

```bash
mkdir -p netlify/edge-functions
```

### 2. Basic Edge Function for API Routes

Create `netlify/edge-functions/api-handler.ts`:

```typescript
import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Handle CORS for API routes
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://agents-11.com',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  
  // Add security headers
  const response = await context.next();
  
  response.headers.set('X-Robots-Tag', 'noindex');
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  return response;
};

export const config: Config = {
  path: "/api/*",
};
```

### 3. Authentication Edge Function

Create `netlify/edge-functions/auth.ts`:

```typescript
import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/library/download'];
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/login?redirect=' + encodeURIComponent(pathname),
        },
      });
    }
  }
  
  return context.next();
};

export const config: Config = {
  path: "/*",
};
```

## Deployment Process

### 1. Pre-Deployment Checklist

Complete the [NETLIFY_DEPLOYMENT_CHECKLIST.md](./NETLIFY_DEPLOYMENT_CHECKLIST.md) before deploying.

### 2. Initial Deployment

1. **Trigger Deployment**:
   ```bash
   git push origin main
   ```

2. **Monitor Build**:
   - Watch GitHub Actions workflow
   - Monitor Netlify deploy logs
   - Check for any build errors

3. **Verify Deployment**:
   - Test site at `https://agents-11.com`
   - Verify all functionality works
   - Check performance metrics

### 3. Automated Deployments

Once configured, deployments are fully automated:

- **Main Branch**: Automatic production deployment
- **Pull Requests**: Automatic preview deployments  
- **Feature Branches**: Optional branch deployments

## Post-Deployment Configuration

### 1. Stripe Webhook Configuration

1. **Update Webhook Endpoint**:
   - Go to Stripe Dashboard → Webhooks
   - Update endpoint URL to: `https://agents-11.com/api/stripe/webhooks`
   - Ensure webhook is enabled

2. **Test Webhook**:
   - Send test webhook from Stripe Dashboard
   - Check Netlify function logs for successful processing

### 2. Supabase Configuration

1. **Update Auth Settings**:
   - Site URL: `https://agents-11.com`
   - Redirect URLs: `https://agents-11.com/auth/callback`

2. **CORS Configuration**:
   ```sql
   -- Add to Supabase SQL editor
   INSERT INTO auth.cors_domains (domain) VALUES ('https://agents-11.com');
   ```

### 3. Analytics Setup

1. **Google Analytics** (if using):
   - Update GA property with new domain
   - Verify tracking code is working

2. **Netlify Analytics**:
   - Enable in site settings for traffic insights

## Monitoring & Maintenance

### 1. Performance Monitoring

- **Core Web Vitals**: Monitor via Lighthouse CI
- **Uptime Monitoring**: Set up external monitoring (UptimeRobot, Pingdom)
- **Error Tracking**: Configure Sentry or similar service

### 2. Regular Maintenance Tasks

#### Weekly
- [ ] Review error logs in Netlify
- [ ] Check Core Web Vitals performance
- [ ] Monitor security notifications

#### Monthly  
- [ ] Update dependencies
- [ ] Review and rotate API keys
- [ ] Analyze traffic and performance trends
- [ ] Review and update documentation

#### Quarterly
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Backup and disaster recovery testing
- [ ] Cost optimization review

### 3. Alerting Setup

Configure alerts for:

- **Site Down**: HTTP status monitoring
- **Performance Degradation**: Core Web Vitals thresholds
- **Error Spikes**: Application error rates
- **SSL Certificate Expiry**: 30 days before expiration

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Netlify
# Common fixes:
npm ci --legacy-peer-deps
npm run build

# Check for environment variable issues
npm run validate-env
```

#### SSL Certificate Issues
```bash
# Check DNS propagation
nslookup agents-11.com

# Force SSL certificate renewal
# Contact Netlify support if automatic renewal fails
```

#### Function Deployment Issues
```bash
# Check function logs in Netlify
# Verify function directory structure
# Check function size limits (50MB max)
```

#### Domain Redirect Issues
```bash
# Verify netlify.toml redirects
# Check DNS CNAME records
# Clear browser cache and test
```

### Support Resources

- **Netlify Support**: [support.netlify.com](https://support.netlify.com)
- **Netlify Community**: [community.netlify.com](https://community.netlify.com)
- **GitHub Discussions**: Your repository discussions
- **Documentation**: [docs.netlify.com](https://docs.netlify.com)

## Security Considerations

### 1. Security Headers

Ensure these headers are configured (already in `netlify.toml`):

- Content Security Policy (CSP)
- X-Frame-Options  
- X-XSS-Protection
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)

### 2. Environment Variables

- Never commit secrets to Git
- Use Netlify's encrypted environment variables
- Rotate API keys regularly
- Use different keys for staging/production

### 3. Regular Security Updates

- Keep dependencies updated
- Monitor security advisories
- Run regular security audits
- Enable automated security scanning

## Success Metrics

Track these metrics to measure deployment success:

### Performance Targets
- **Lighthouse Performance**: >90
- **Largest Contentful Paint**: <2.5s
- **First Input Delay**: <100ms
- **Cumulative Layout Shift**: <0.1

### Reliability Targets  
- **Uptime**: >99.9%
- **Error Rate**: <0.1%
- **Build Success Rate**: >95%

### User Experience
- **Page Load Time**: <3s (95th percentile)
- **API Response Time**: <500ms
- **Conversion Rate**: Monitor and optimize

---

## Deployment Summary

Once completed, your Agents-11 marketplace will have:

✅ **Zero-downtime deployment** with Netlify
✅ **Custom domain** (agents-11.com) with automatic SSL
✅ **CI/CD pipeline** with automated testing and deployment
✅ **Performance optimization** with Core Web Vitals monitoring  
✅ **Security headers** and best practices implemented
✅ **Edge functions** for enhanced performance
✅ **Comprehensive monitoring** and alerting
✅ **Automated rollback** capabilities

The deployment is now production-ready with enterprise-grade reliability and performance.

**Support**: For deployment issues or questions, create an issue in the repository or contact the development team.

**Next Steps**: Configure monitoring dashboards and set up regular maintenance schedules.