import { NextResponse, NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')?.value; // Get the auth_token cookie
    const publicPaths = [ '/login','/register']; // Add more public routes as needed
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
    console.log(authToken , isPublicPath,request.nextUrl.pathname)
    if (!authToken && !isPublicPath) {
      console.log('Middleware: No auth_token found, redirecting to login.');
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}
 
export const config = {
  matcher: '/admin/:path*',
}
