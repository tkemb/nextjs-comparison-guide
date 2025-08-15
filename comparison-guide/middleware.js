import { NextResponse } from 'next/server';

export function middleware(request) {
  const { hostname, pathname } = request.nextUrl;
  
  console.log('🔍 Middleware - hostname:', hostname, 'pathname:', pathname);
  
  // Handle localhost subdomain testing
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const parts = hostname.split('.');
    console.log('🔍 Middleware - hostname parts:', parts);
    
    // Check if this is a subdomain.localhost pattern
    if (parts.length >= 2 && parts[1] === 'localhost' && parts[0] !== 'www') {
      const subdomain = parts[0];
      console.log('🔍 Middleware - detected subdomain:', subdomain);
      
      // Rewrite subdomain requests to the PPC landing page route
      if (pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = `/ppc/${subdomain}`;
        console.log('🔍 Middleware - rewriting to:', url.pathname);
        return NextResponse.rewrite(url);
      }
    }
    
    return NextResponse.next();
  }
  
  // Extract subdomain for production
  const subdomain = hostname.split('.')[0];
  
  // Skip if no subdomain or if it's www
  if (!subdomain || subdomain === 'www' || hostname.split('.').length < 3) {
    return NextResponse.next();
  }
  
  // Rewrite subdomain requests to the PPC landing page route
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/ppc/${subdomain}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};