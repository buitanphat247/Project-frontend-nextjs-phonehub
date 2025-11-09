import { NextRequest, NextResponse } from 'next/server';

// Redirect favicon.ico requests to /icon
// Một số browser cũ vẫn tìm favicon.ico
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/icon', request.url), 301);
}

