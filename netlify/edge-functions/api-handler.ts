import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Handle CORS for API routes
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://agents-11.com',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  // Get the response from Next.js
  const response = await context.next();
  
  // Add security and performance headers for API routes
  const newHeaders = new Headers(response.headers);
  
  // Security headers
  newHeaders.set('X-Robots-Tag', 'noindex');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'DENY');
  
  // Cache control for API routes
  newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  newHeaders.set('Pragma', 'no-cache');
  newHeaders.set('Expires', '0');
  
  // Rate limiting headers (implement rate limiting logic as needed)
  newHeaders.set('X-RateLimit-Limit', '100');
  newHeaders.set('X-RateLimit-Remaining', '99');
  newHeaders.set('X-RateLimit-Reset', String(Math.floor(Date.now() / 1000) + 3600));
  
  // CORS headers for API routes
  newHeaders.set('Access-Control-Allow-Origin', 'https://agents-11.com');
  
  // Log API requests for monitoring
  console.log(`API Request: ${request.method} ${pathname} - ${response.status}`);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

export const config: Config = {
  path: "/api/*",
};