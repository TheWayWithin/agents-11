import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Get response from Next.js
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  
  // Set cache headers based on content type and path
  if (pathname.startsWith('/_next/static/')) {
    // Static assets - long-term caching
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    newHeaders.set('Vary', 'Accept-Encoding');
  } else if (pathname.startsWith('/_next/image/')) {
    // Next.js optimized images - long-term caching
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    newHeaders.set('Vary', 'Accept');
  } else if (pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    // Image assets - medium-term caching
    newHeaders.set('Cache-Control', 'public, max-age=86400');
    newHeaders.set('Vary', 'Accept-Encoding');
  } else if (pathname.match(/\.(css|js)$/)) {
    // CSS/JS files - medium-term caching with validation
    newHeaders.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    newHeaders.set('Vary', 'Accept-Encoding');
  } else if (pathname.match(/\.(woff|woff2|ttf|otf)$/)) {
    // Font files - long-term caching
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    newHeaders.set('Access-Control-Allow-Origin', '*');
  } else if (pathname === '/' || pathname.match(/^\/[^\/]*$/)) {
    // HTML pages - short-term caching with revalidation
    newHeaders.set('Cache-Control', 'public, max-age=0, must-revalidate');
    newHeaders.set('Vary', 'Accept-Encoding');
  } else if (pathname.startsWith('/api/')) {
    // API routes - no caching
    newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  // Add performance hints
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  
  // Early hints for critical resources (if supported)
  if (pathname === '/') {
    newHeaders.set('Link', [
      '</fonts/GeistVF.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
      '</_next/static/css/app.css>; rel=preload; as=style',
      '</_next/static/chunks/main.js>; rel=preload; as=script',
    ].join(', '));
  }
  
  // Compress text-based responses
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/') || 
      contentType.includes('application/json') || 
      contentType.includes('application/javascript') ||
      contentType.includes('application/css')) {
    newHeaders.set('Vary', 'Accept-Encoding');
  }
  
  // Add timing headers for monitoring
  newHeaders.set('X-Edge-Cache', response.headers.get('cf-cache-status') || 'MISS');
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