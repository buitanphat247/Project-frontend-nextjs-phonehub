import { NextRequest, NextResponse } from 'next/server';

// Route handler để redirect /logo.png đến /icon
// Tránh 404 khi có request đến /logo.png (có thể từ cache hoặc metadata cũ)
export async function GET(request: NextRequest) {
  // Redirect đến /icon route (từ app/icon.tsx)
  return NextResponse.redirect(new URL('/icon', request.url), 301);
}

