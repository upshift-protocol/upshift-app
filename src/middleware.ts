import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Block USA
const BLOCKED_COUNTRIES = ['US'];

// Limit middleware pathname config
export const config = {
  matcher: ['/', '/pools/:path'],
};

export default function middleware(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_URL?.includes('upshift.finance'))
    return NextResponse.next();

  // Extract country
  const country = req.headers.get('x-vercel-ip-country') || 'US';

  // Specify the correct pathname
  if (BLOCKED_COUNTRIES.includes(country)) {
    return NextResponse.redirect('https://terms.upshift.finance');
  }
  return NextResponse.next();
}
