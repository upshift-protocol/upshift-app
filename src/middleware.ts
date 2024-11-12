import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Block USA
const BLOCKED_COUNTRIES = ['US'];

// Limit middleware pathname config
export const config = {
  matcher: '/',
};

export default function middleware(
  req: NextRequest & { geo: { country: string } },
) {
  // Extract country
  const country = req.geo.country || 'US';

  // Specify the correct pathname
  if (BLOCKED_COUNTRIES.includes(country)) {
    req.nextUrl.pathname = '/blocked';
    return NextResponse.redirect('https://terms.upshift.finance');
  }
  return NextResponse.next();
}
