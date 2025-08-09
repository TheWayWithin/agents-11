# Monitoring & Observability Guide

This document outlines the monitoring setup for Agents-11 marketplace, including error tracking, performance monitoring, and business metrics.

## Overview

Our monitoring stack includes:

- **Error Tracking**: Sentry for error reporting and performance monitoring
- **Analytics**: PostHog for user behavior and product analytics  
- **Performance**: Core Web Vitals and custom metrics
- **Infrastructure**: Vercel Analytics and monitoring
- **Uptime**: External uptime monitoring recommendations

## Error Tracking (Sentry)

### Setup

1. Create a Sentry account and project
2. Add environment variables:

```env
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx
```

3. Sentry is automatically initialized in production

### Usage

```typescript
import { captureException, captureMessage } from '@/lib/monitoring/sentry';

// Capture exceptions
try {
  await riskyOperation();
} catch (error) {
  captureException(error, { context: 'user_action' });
}

// Capture messages
captureMessage('Important event occurred', 'info');
```

### Key Metrics to Monitor

- **Error Rate**: < 1% overall error rate
- **Performance**: 95th percentile response times
- **User Impact**: Errors affecting user workflows
- **Payment Failures**: Critical payment processing errors

### Alerts

Set up alerts for:

- Error rate > 1%
- Payment failure rate > 5%  
- Database connection errors
- Stripe webhook failures
- Authentication errors

## Analytics (PostHog)

### Setup

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Business Events

Key events automatically tracked:

- User registration and login
- Subscription starts/cancellations
- Library views and downloads
- Payment events
- Feature usage

### Custom Dashboards

Create dashboards for:

1. **User Journey**
   - Registration funnel
   - Subscription conversion
   - Library engagement

2. **Revenue Metrics**
   - Monthly recurring revenue (MRR)
   - Churn rate
   - Average revenue per user (ARPU)

3. **Product Usage**
   - Most popular libraries
   - Download patterns
   - Feature adoption

## Performance Monitoring

### Core Web Vitals

Automatically tracked:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Custom Metrics

- API response times
- Database query performance
- Bundle size tracking
- Memory usage

### Performance Budgets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Page Load Time | < 2s | > 3s |
| API Response Time | < 500ms | > 1s |
| Bundle Size | < 500KB | > 1MB |
| Database Query | < 200ms | > 1s |

## Infrastructure Monitoring

### Vercel Analytics

Built-in monitoring includes:
- Request volume and patterns
- Edge cache performance
- Geographic performance
- Function execution times

### Key Dashboards

1. **Application Health**
   - Uptime percentage
   - Error rates by endpoint
   - Response time trends

2. **User Experience**  
   - Page load performance
   - Geographic performance
   - Mobile vs desktop metrics

3. **Business Impact**
   - Conversion funnel health
   - Payment processing success
   - Feature usage trends

## Database Monitoring

### Supabase Monitoring

Monitor via Supabase dashboard:
- Connection pool usage
- Query performance
- Storage usage
- Authentication rates

### Key Metrics

- **Query Performance**: 95th percentile < 200ms
- **Connection Pool**: < 80% utilization
- **Storage Growth**: Track monthly growth
- **Backup Status**: Ensure daily backups

## Uptime Monitoring

### Recommended Services

1. **UptimeRobot** (Free tier available)
2. **Pingdom** (Comprehensive monitoring)
3. **StatusCake** (Good free tier)

### Monitoring URLs

```
https://agents11.com - Homepage
https://agents11.com/api/health - Health check endpoint
https://agents11.com/api/stripe/webhooks - Webhook endpoint
https://agents11.com/pricing - Critical conversion page
```

### Alert Configuration

- **Downtime**: Alert immediately
- **Slow Response**: Alert if > 5s response time
- **SSL Certificate**: Alert 14 days before expiry
- **DNS Issues**: Monitor DNS resolution

## Cost Monitoring

### Services to Monitor

1. **Vercel**
   - Bandwidth usage
   - Function execution time
   - Build minutes

2. **Supabase**
   - Database size
   - API requests
   - Bandwidth

3. **Stripe**
   - Transaction fees
   - Volume-based pricing

4. **Third-party Services**
   - Sentry events
   - PostHog events
   - Email sending costs

### Budget Alerts

Set up alerts for:
- Monthly spend > $500
- Unexpected usage spikes
- Service limit approaches

## Health Check Endpoints

### API Health Check

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'ok', // Check Supabase connection
      stripe: 'ok',   // Check Stripe API
      email: 'ok',    // Check email service
    },
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
  };
  
  res.status(200).json(health);
}
```

### Database Health Check

```typescript
// Check database connectivity
const checkDatabase = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    return error ? 'error' : 'ok';
  } catch {
    return 'error';
  }
};
```

## Monitoring Runbook

### Daily Checks

- [ ] Review error rate trends
- [ ] Check payment processing success
- [ ] Verify key user journeys working
- [ ] Monitor performance metrics

### Weekly Reviews

- [ ] Analyze user behavior trends  
- [ ] Review performance budgets
- [ ] Check cost optimization opportunities
- [ ] Update monitoring alerts if needed

### Monthly Analysis

- [ ] Business metrics review
- [ ] Performance trend analysis
- [ ] Cost analysis and optimization
- [ ] Monitoring stack health review

## Alerting Strategy

### Severity Levels

1. **Critical** (Immediate response)
   - Site down
   - Payment processing failure
   - Database connection loss
   - Security incidents

2. **High** (Response within 1 hour)
   - Error rate > 5%
   - Performance degradation
   - Feature unavailability

3. **Medium** (Response within 4 hours)
   - Non-critical errors
   - Performance budget exceeded
   - Unusual usage patterns

4. **Low** (Review during business hours)
   - Informational alerts
   - Trend notifications
   - Usage milestones

### Notification Channels

- **Critical**: Phone, SMS, Slack
- **High**: Email, Slack
- **Medium/Low**: Email, weekly digest

## Incident Response

### Response Steps

1. **Acknowledge** the alert
2. **Assess** the impact and scope
3. **Mitigate** immediate issues
4. **Investigate** root cause
5. **Resolve** the underlying issue
6. **Document** lessons learned

### Communication

- Update status page
- Notify affected users if necessary
- Post-mortem for critical incidents

## Useful Queries & Dashboards

### Sentry Queries

```
# High error rate
error.type:* AND environment:production

# Payment errors  
transaction:"POST /api/stripe/*" AND level:error

# User impact
user.id:* AND level:error
```

### PostHog Queries

```
# Conversion funnel
events: ['user_sign_up', 'checkout_started', 'payment_completed']

# Feature usage
event: 'library_downloaded' 
breakdown: 'library_id'
```

### Performance Monitoring

```typescript
// Track critical user journeys
const trackUserJourney = async (journey: string, operation: () => Promise<void>) => {
  const startTime = performance.now();
  try {
    await operation();
    trackPerformance({
      name: `user_journey_${journey}`,
      value: performance.now() - startTime,
      unit: 'ms',
      tags: { status: 'success' }
    });
  } catch (error) {
    trackPerformance({
      name: `user_journey_${journey}`,
      value: performance.now() - startTime,
      unit: 'ms',
      tags: { status: 'error' }
    });
    throw error;
  }
};
```

## Maintenance

### Regular Tasks

- **Weekly**: Review and tune alert thresholds
- **Monthly**: Analyze monitoring costs and optimize
- **Quarterly**: Audit monitoring coverage and gaps
- **Annually**: Review monitoring strategy and tools

### Optimization

- Archive old monitoring data
- Optimize expensive queries
- Review and remove unused metrics
- Update monitoring as application evolves

---

## Quick Reference

### Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Sentry Support**: https://sentry.io/support/

### Key URLs

- **Sentry Dashboard**: https://sentry.io/organizations/your-org/
- **PostHog Dashboard**: https://app.posthog.com/
- **Vercel Analytics**: https://vercel.com/dashboard/analytics
- **Supabase Dashboard**: https://app.supabase.com/

### Status Pages

- **Application Status**: https://agents11.statuspage.io (if implemented)
- **Vercel Status**: https://vercel-status.com
- **Supabase Status**: https://status.supabase.com