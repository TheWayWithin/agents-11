import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Get geolocation data from Netlify Edge
  const geo = context.geo || {};
  const country = geo.country?.code || 'US';
  const city = geo.city || 'Unknown';
  const region = geo.region || 'Unknown';
  
  // Add geolocation headers for the application to use
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  
  // Add geo headers (can be used by your React app)
  newHeaders.set('X-User-Country', country);
  newHeaders.set('X-User-City', city);
  newHeaders.set('X-User-Region', region);
  newHeaders.set('X-User-Timezone', geo.timezone || 'UTC');
  
  // Log geolocation for analytics (in production, send to your analytics service)
  console.log(`Request from ${country}, ${city} - ${request.method} ${url.pathname}`);
  
  // Handle region-specific redirects or content
  // Example: Redirect EU users to GDPR compliance page if needed
  if (['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'NO'].includes(country)) {
    // Add GDPR compliance headers for EU users
    newHeaders.set('X-GDPR-Required', 'true');
  }
  
  // Handle currency preferences based on location
  const currencyMap: Record<string, string> = {
    'US': 'USD',
    'GB': 'GBP', 
    'CA': 'CAD',
    'AU': 'AUD',
    'EU': 'EUR', // Fallback for EU countries
    'DE': 'EUR',
    'FR': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'NL': 'EUR',
  };
  
  const preferredCurrency = currencyMap[country] || 'USD';
  newHeaders.set('X-Preferred-Currency', preferredCurrency);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

export const config: Config = {
  path: "/*",
};