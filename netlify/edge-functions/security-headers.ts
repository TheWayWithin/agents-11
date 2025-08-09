import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();
  const url = new URL(request.url);
  
  // Clone response to modify headers
  const newHeaders = new Headers(response.headers);
  
  // Enhanced Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://checkout.stripe.com wss://*.supabase.co https://www.google-analytics.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  // Security headers
  newHeaders.set('Content-Security-Policy', csp);
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-XSS-Protection', '1; mode=block');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), ' +
    'accelerometer=(), gyroscope=(), magnetometer=(), ambient-light-sensor=(), ' +
    'autoplay=(self), encrypted-media=(self), fullscreen=(self)'
  );
  
  // HSTS header for HTTPS
  if (url.protocol === 'https:') {
    newHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  
  // Performance headers
  newHeaders.set('X-DNS-Prefetch-Control', 'on');
  
  // Remove server information
  newHeaders.delete('Server');
  newHeaders.delete('X-Powered-By');
  
  // Add custom headers for monitoring
  newHeaders.set('X-Edge-Location', context.geo?.region || 'unknown');
  newHeaders.set('X-Response-Time', String(Date.now()));
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

export const config: Config = {
  path: "/*",
};