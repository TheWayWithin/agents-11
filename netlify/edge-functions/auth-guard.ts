import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/api/libraries',
    '/api/download',
    '/api/stripe/portal',
  ];
  
  // Public API routes that don't require auth
  const publicApiRoutes = [
    '/api/auth',
    '/api/stripe/webhooks',
    '/api/stripe/checkout',
  ];
  
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !isPublicApiRoute) {
    // Check for authentication token in cookies or headers
    const authToken = request.headers.get('authorization') || 
                     context.cookies.get('sb-access-token') ||
                     context.cookies.get('supabase-auth-token');
    
    if (!authToken) {
      // For API routes, return 401
      if (pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }), 
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              'WWW-Authenticate': 'Bearer realm="API"',
            },
          }
        );
      }
      
      // For page routes, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      return new Response(null, {
        status: 302,
        headers: {
          Location: loginUrl.toString(),
        },
      });
    }
    
    // TODO: Implement proper token validation with Supabase
    // For now, we'll let the Next.js middleware handle detailed auth validation
  }
  
  // Continue to Next.js for further processing
  return context.next();
};

export const config: Config = {
  path: ["/dashboard/*", "/api/libraries/*", "/api/download/*", "/api/stripe/portal"],
};