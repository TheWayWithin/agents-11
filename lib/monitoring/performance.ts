// Performance Monitoring Utilities
// Tracks Core Web Vitals and custom performance metrics

import { trackPerformance } from './analytics';

// Core Web Vitals tracking
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  import('web-vitals')
    .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(metric => {
        trackPerformance({
          name: 'CLS',
          value: metric.value,
          unit: 'count',
          tags: { type: 'core_web_vital' },
        });
      });

      getFID(metric => {
        trackPerformance({
          name: 'FID',
          value: metric.value,
          unit: 'ms',
          tags: { type: 'core_web_vital' },
        });
      });

      getFCP(metric => {
        trackPerformance({
          name: 'FCP',
          value: metric.value,
          unit: 'ms',
          tags: { type: 'core_web_vital' },
        });
      });

      getLCP(metric => {
        trackPerformance({
          name: 'LCP',
          value: metric.value,
          unit: 'ms',
          tags: { type: 'core_web_vital' },
        });
      });

      getTTFB(metric => {
        trackPerformance({
          name: 'TTFB',
          value: metric.value,
          unit: 'ms',
          tags: { type: 'core_web_vital' },
        });
      });
    })
    .catch(console.warn);

  // Track custom performance metrics
  trackNavigationTiming();
  trackResourceTiming();
};

// Navigation timing metrics
const trackNavigationTiming = () => {
  if (
    !('performance' in window) ||
    !('getEntriesByType' in window.performance)
  ) {
    return;
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        // DOM Content Loaded
        trackPerformance({
          name: 'DOM_Content_Loaded',
          value:
            navigation.domContentLoadedEventEnd - navigation.navigationStart,
          unit: 'ms',
          tags: { type: 'navigation' },
        });

        // Page Load Complete
        trackPerformance({
          name: 'Page_Load_Complete',
          value: navigation.loadEventEnd - navigation.navigationStart,
          unit: 'ms',
          tags: { type: 'navigation' },
        });

        // DNS Resolution
        trackPerformance({
          name: 'DNS_Resolution',
          value: navigation.domainLookupEnd - navigation.domainLookupStart,
          unit: 'ms',
          tags: { type: 'navigation' },
        });

        // TCP Connection
        trackPerformance({
          name: 'TCP_Connection',
          value: navigation.connectEnd - navigation.connectStart,
          unit: 'ms',
          tags: { type: 'navigation' },
        });

        // Server Response
        trackPerformance({
          name: 'Server_Response',
          value: navigation.responseEnd - navigation.requestStart,
          unit: 'ms',
          tags: { type: 'navigation' },
        });
      }
    }, 0);
  });
};

// Resource timing metrics
const trackResourceTiming = () => {
  if (
    !('performance' in window) ||
    !('getEntriesByType' in window.performance)
  ) {
    return;
  }

  // Track large resources
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.transferSize > 100 * 1024) {
        // Track resources > 100KB
        trackPerformance({
          name: 'Large_Resource_Load',
          value: entry.duration,
          unit: 'ms',
          tags: {
            type: 'resource',
            resource_name: entry.name.split('/').pop() || 'unknown',
            resource_size: entry.transferSize?.toString() || '0',
          },
        });
      }
    }
  });

  observer.observe({ entryTypes: ['resource'] });
};

// Custom performance markers
export const performanceMark = (name: string) => {
  if ('performance' in window && 'mark' in window.performance) {
    performance.mark(name);
  }
};

export const performanceMeasure = (
  name: string,
  startMark: string,
  endMark?: string
) => {
  if ('performance' in window && 'measure' in window.performance) {
    try {
      const measure = performance.measure(name, startMark, endMark);

      trackPerformance({
        name: name,
        value: measure.duration,
        unit: 'ms',
        tags: { type: 'custom_measure' },
      });

      return measure;
    } catch (error) {
      console.warn('Failed to create performance measure:', error);
    }
  }
};

// API response time tracking
export const trackAPICall = async <T>(
  apiName: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;

    trackPerformance({
      name: 'API_Call_Success',
      value: duration,
      unit: 'ms',
      tags: {
        type: 'api',
        api_name: apiName,
        status: 'success',
      },
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    trackPerformance({
      name: 'API_Call_Error',
      value: duration,
      unit: 'ms',
      tags: {
        type: 'api',
        api_name: apiName,
        status: 'error',
      },
    });

    throw error;
  }
};

// Database query performance tracking (for API routes)
export const trackDatabaseQuery = async <T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now();

  try {
    const result = await query();
    const duration = Date.now() - startTime;

    // Log slow queries
    if (duration > 1000) {
      console.warn(
        `Slow database query detected: ${queryName} took ${duration}ms`
      );
    }

    trackPerformance({
      name: 'Database_Query',
      value: duration,
      unit: 'ms',
      tags: {
        type: 'database',
        query_name: queryName,
        performance:
          duration > 1000 ? 'slow' : duration > 500 ? 'medium' : 'fast',
      },
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    trackPerformance({
      name: 'Database_Query_Error',
      value: duration,
      unit: 'ms',
      tags: {
        type: 'database',
        query_name: queryName,
        status: 'error',
      },
    });

    throw error;
  }
};

// Bundle size tracking
export const trackBundleMetrics = () => {
  if (typeof window === 'undefined') return;

  // Track JavaScript bundle size
  const scripts = document.querySelectorAll('script[src]');
  let totalScriptSize = 0;

  scripts.forEach(script => {
    const scriptElement = script as HTMLScriptElement;
    if (scriptElement.src.includes('/_next/static/')) {
      // Estimate script size (not exact, but useful for trends)
      totalScriptSize += scriptElement.src.length;
    }
  });

  if (totalScriptSize > 0) {
    trackPerformance({
      name: 'Estimated_JS_Bundle_Size',
      value: totalScriptSize,
      unit: 'bytes',
      tags: { type: 'bundle' },
    });
  }

  // Track CSS bundle size
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  let totalCSSSize = 0;

  stylesheets.forEach(link => {
    const linkElement = link as HTMLLinkElement;
    if (linkElement.href.includes('/_next/static/')) {
      totalCSSSize += linkElement.href.length;
    }
  });

  if (totalCSSSize > 0) {
    trackPerformance({
      name: 'Estimated_CSS_Bundle_Size',
      value: totalCSSSize,
      unit: 'bytes',
      tags: { type: 'bundle' },
    });
  }
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  const memory = (performance as any).memory;
  if (memory) {
    trackPerformance({
      name: 'Memory_Used',
      value: memory.usedJSHeapSize,
      unit: 'bytes',
      tags: { type: 'memory' },
    });

    trackPerformance({
      name: 'Memory_Limit',
      value: memory.jsHeapSizeLimit,
      unit: 'bytes',
      tags: { type: 'memory' },
    });

    // Track memory pressure
    const memoryPressure =
      (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
    trackPerformance({
      name: 'Memory_Pressure',
      value: memoryPressure,
      unit: 'count',
      tags: {
        type: 'memory',
        level:
          memoryPressure > 80 ? 'high' : memoryPressure > 60 ? 'medium' : 'low',
      },
    });
  }
};

// Auto-initialize performance monitoring
if (typeof window !== 'undefined') {
  // Initialize on next tick to avoid blocking
  setTimeout(initPerformanceMonitoring, 0);

  // Track bundle metrics once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackBundleMetrics);
  } else {
    trackBundleMetrics();
  }

  // Track memory usage periodically (every 30 seconds)
  setInterval(trackMemoryUsage, 30000);
}
