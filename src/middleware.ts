import { type NextRequest } from 'next/server';
import { withClerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default withClerkMiddleware((_req: NextRequest) => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next|favicon.ico).*)',
  ],
};
