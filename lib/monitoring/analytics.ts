// Analytics Configuration
// Handles user behavior tracking and performance monitoring

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  user_id?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  tags?: Record<string, string>;
}

// PostHog Analytics (Privacy-focused)
class Analytics {
  private static instance: Analytics;
  private initialized = false;

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  async init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Only initialize in production and if analytics is enabled
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY
    ) {
      try {
        const { default: posthog } = await import('posthog-js');

        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',

          // Privacy settings
          disable_session_recording: false,
          disable_persistence: false,
          disable_cookie: false,

          // Performance settings
          loaded: posthog => {
            if (process.env.NODE_ENV === 'development') {
              posthog.debug();
            }
          },

          // Capture settings
          capture_pageview: true,
          capture_pageleave: true,

          // Autocapture settings
          autocapture: {
            dom_event_allowlist: ['click', 'submit'],
            url_allowlist: [process.env.NEXT_PUBLIC_APP_URL || ''],
          },
        });

        this.initialized = true;
      } catch (error) {
        console.warn('Failed to initialize analytics:', error);
      }
    }
  }

  // Track custom events
  track(event: string, properties?: Record<string, any>, user_id?: string) {
    if (!this.initialized || typeof window === 'undefined') {
      // In development or when analytics disabled, just log
      console.log('Analytics event:', { event, properties, user_id });
      return;
    }

    try {
      const posthog = (window as any).posthog;
      if (posthog) {
        posthog.capture(event, {
          ...properties,
          $current_url: window.location.href,
          $timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn('Failed to track event:', error);
    }
  }

  // Identify user for tracking
  identify(user_id: string, traits?: Record<string, any>) {
    if (!this.initialized || typeof window === 'undefined') return;

    try {
      const posthog = (window as any).posthog;
      if (posthog) {
        posthog.identify(user_id, traits);
      }
    } catch (error) {
      console.warn('Failed to identify user:', error);
    }
  }

  // Track page views manually (if needed)
  page(name?: string, properties?: Record<string, any>) {
    if (!this.initialized || typeof window === 'undefined') return;

    try {
      const posthog = (window as any).posthog;
      if (posthog) {
        posthog.capture('$pageview', {
          $current_url: window.location.href,
          page_name: name,
          ...properties,
        });
      }
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  }

  // Reset user (on logout)
  reset() {
    if (!this.initialized || typeof window === 'undefined') return;

    try {
      const posthog = (window as any).posthog;
      if (posthog) {
        posthog.reset();
      }
    } catch (error) {
      console.warn('Failed to reset analytics:', error);
    }
  }
}

// Performance monitoring
export const trackPerformance = (metric: PerformanceMetric) => {
  // Track Core Web Vitals and custom metrics
  const analytics = Analytics.getInstance();

  analytics.track('performance_metric', {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_unit: metric.unit,
    ...metric.tags,
  });

  // Also send to Vercel Analytics if available
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('track', 'performance', {
      name: metric.name,
      value: metric.value,
      unit: metric.unit,
    });
  }
};

// Business event tracking
export const trackBusinessEvent = (event: AnalyticsEvent) => {
  const analytics = Analytics.getInstance();
  analytics.track(event.event, event.properties, event.user_id);
};

// Common business events
export const businessEvents = {
  // User events
  userSignUp: (user_id: string, method: string) =>
    trackBusinessEvent({
      event: 'user_sign_up',
      properties: { method },
      user_id,
    }),

  userLogin: (user_id: string, method: string) =>
    trackBusinessEvent({
      event: 'user_login',
      properties: { method },
      user_id,
    }),

  // Subscription events
  subscriptionStarted: (user_id: string, plan: string, amount: number) =>
    trackBusinessEvent({
      event: 'subscription_started',
      properties: { plan, amount },
      user_id,
    }),

  subscriptionCancelled: (user_id: string, plan: string, reason?: string) =>
    trackBusinessEvent({
      event: 'subscription_cancelled',
      properties: { plan, reason },
      user_id,
    }),

  // Library events
  libraryViewed: (user_id: string, library_id: string) =>
    trackBusinessEvent({
      event: 'library_viewed',
      properties: { library_id },
      user_id,
    }),

  libraryDownloaded: (user_id: string, library_id: string) =>
    trackBusinessEvent({
      event: 'library_downloaded',
      properties: { library_id },
      user_id,
    }),

  // Payment events
  checkoutStarted: (user_id: string, plan: string) =>
    trackBusinessEvent({
      event: 'checkout_started',
      properties: { plan },
      user_id,
    }),

  paymentCompleted: (user_id: string, plan: string, amount: number) =>
    trackBusinessEvent({
      event: 'payment_completed',
      properties: { plan, amount },
      user_id,
    }),

  paymentFailed: (user_id: string, plan: string, error: string) =>
    trackBusinessEvent({
      event: 'payment_failed',
      properties: { plan, error },
      user_id,
    }),
};

// Initialize analytics
export const analytics = Analytics.getInstance();

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  analytics.init();
}

export default analytics;
