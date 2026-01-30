import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*']
};

export default function middleware(request: NextRequest) {
  // For now, we'll rely on client-side authentication checks
  // since the auth system uses localStorage
  // Server-side protection can be added later if needed
  return NextResponse.next();
}