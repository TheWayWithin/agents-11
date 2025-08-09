// Sentry Error Tracking Configuration
// This file sets up error tracking for both client and server environments

import { init, configureScope } from '@sentry/nextjs';

// Initialize Sentry only in production
if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_SENTRY_DSN
) {
  init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions

    // Session replay (optional, can impact performance)
    replaysSessionSampleRate: 0.01, // 1% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Filter out noise
    beforeSend(event, hint) {
      // Don't send events for development or known issues
      if (event.exception) {
        const error = hint.originalException;

        // Filter out network errors that aren't actionable
        if (error instanceof TypeError && error.message.includes('fetch')) {
          return null;
        }

        // Filter out known browser extension errors
        if (error instanceof Error && error.stack?.includes('extension://')) {
          return null;
        }
      }

      return event;
    },

    // Ignore certain error messages
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
      'Loading chunk',
      'ChunkLoadError',
    ],

    // Configure release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA,

    // Add user context automatically
    integrations: [
      // Add any additional integrations here
    ],
  });

  // Configure global scope
  configureScope(scope => {
    scope.setTag('deployment.environment', process.env.NODE_ENV);
    scope.setTag('deployment.vercel', true);

    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      scope.setTag('deployment.commit', process.env.VERCEL_GIT_COMMIT_SHA);
    }

    if (process.env.VERCEL_URL) {
      scope.setTag('deployment.url', process.env.VERCEL_URL);
    }
  });
}

// Export utility functions for manual error reporting
export const captureException = (
  error: Error,
  context?: Record<string, any>
) => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_SENTRY_DSN
  ) {
    const {
      captureException: sentryCaptureException,
      withScope,
    } = require('@sentry/nextjs');

    if (context) {
      withScope((scope: any) => {
        Object.entries(context).forEach(([key, value]) => {
          scope.setContext(key, value);
        });
        sentryCaptureException(error);
      });
    } else {
      sentryCaptureException(error);
    }
  } else {
    // In development, just log to console
    console.error('Error captured:', error, context);
  }
};

export const captureMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
) => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_SENTRY_DSN
  ) {
    const { captureMessage: sentryCaptureMessage } = require('@sentry/nextjs');
    sentryCaptureMessage(message, level);
  } else {
    console[level === 'warning' ? 'warn' : level === 'error' ? 'error' : 'log'](
      message
    );
  }
};

// Set user context for error tracking
export const setUserContext = (user: {
  id: string;
  email?: string;
  subscription?: string;
}) => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_SENTRY_DSN
  ) {
    const { configureScope } = require('@sentry/nextjs');

    configureScope((scope: any) => {
      scope.setUser({
        id: user.id,
        email: user.email,
        subscription: user.subscription,
      });
    });
  }
};
