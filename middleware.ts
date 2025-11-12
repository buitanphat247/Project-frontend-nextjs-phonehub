import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Danh sách các routes cần đăng nhập
const protectedRoutes = ['/account', '/cart']
// Routes chỉ dành cho admin
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/signup']

// Kiểm tra role admin (roleId = 1 hoặc roleName = "admin")
function isAdmin(authData: any): boolean {
  if (!authData) return false
  
  // Kiểm tra roleName hoặc roleId
  const roleName = authData.roleName?.toLowerCase()
  const roleId = authData.roleId?.toString()
  
  // Role admin có roleId là "1" hoặc roleName là "admin"
  return roleId === '1' || roleName === 'admin'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Kiểm tra cookie auth
  const authCookie = request.cookies.get('auth_data')
  let isAuthenticated = false
  let authData: any = null
  
  if (authCookie?.value) {
    try {
      authData = JSON.parse(authCookie.value)
      // Kiểm tra xem có token và token không rỗng
      isAuthenticated = !!(authData?.token && authData.token.trim() !== '')
    } catch (error) {
      // Cookie không hợp lệ
      isAuthenticated = false
    }
  }

  // Kiểm tra nếu là protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Kiểm tra nếu là admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  // Kiểm tra nếu là auth route (login/signup)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Nếu chưa đăng nhập và truy cập protected route
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Nếu chưa đăng nhập và truy cập admin route
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Nếu đã đăng nhập nhưng không phải admin và truy cập admin route
  if (isAdminRoute && isAuthenticated && !isAdmin(authData)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Nếu đã đăng nhập và truy cập auth route, redirect về home
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Tạo response
  const response = NextResponse.next()

  // ============================================
  // SECURITY HEADERS - Bảo mật và chống tấn công
  // ============================================

  // 1. Content Security Policy (CSP) - Chống XSS
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phonehub.vn'
  const isDev = process.env.NODE_ENV === 'development'
  
  // CSP Directives
  const cspDirectives = [
    // Default source - chỉ cho phép từ same origin
    "default-src 'self'",
    
    // Scripts - chỉ cho phép inline scripts với nonce hoặc từ trusted sources
    // 'unsafe-inline' và 'unsafe-eval' cần thiết cho Next.js và một số libraries
    // Trong production nên sử dụng nonce thay vì 'unsafe-inline'
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://vitals.vercel-insights.com https://cdnjs.cloudflare.com https://accounts.google.com https://apis.google.com`,
    
    // Styles - cho phép inline styles (cần cho Ant Design và Tailwind)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    
    // Images - cho phép từ same origin và external CDNs
    "img-src 'self' data: blob: https: http:",
    
    // Fonts - cho phép từ Google Fonts và CDN
    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    
    // Connect - cho phép API calls
    `connect-src 'self' ${baseUrl} https://phonehub.vn http://localhost:8080 https://vercel.live https://vitals.vercel-insights.com https://*.vercel-insights.com https://accounts.google.com https://apis.google.com`,
    
    // Media - cho phép video/audio
    "media-src 'self'",
    
    // Object - chặn plugins như Flash
    "object-src 'none'",
    
    // Base URI - chỉ cho phép same origin
    "base-uri 'self'",
    
    // Form actions - chỉ cho phép submit về same origin
    "form-action 'self'",
    
    // Frame ancestors - chống clickjacking (thay thế X-Frame-Options)
    "frame-ancestors 'none'",
    
    // Upgrade insecure requests - tự động upgrade HTTP lên HTTPS
    "upgrade-insecure-requests",
    
    // Block all mixed content
    "block-all-mixed-content",
  ]

  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  )

  // 2. HTTP Strict Transport Security (HSTS) - Bảo mật HTTPS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )

  // 3. Cross-Origin-Opener-Policy (COOP) - Tách biệt nguồn gốc
  response.headers.set(
    'Cross-Origin-Opener-Policy',
    'same-origin-allow-popups'
  )

  // 4. Cross-Origin-Embedder-Policy (COEP) - Bảo vệ khỏi Spectre
  // Lưu ý: 'require-corp' có thể gây vấn đề với một số external resources
  // Sử dụng 'credentialless' để cân bằng giữa bảo mật và tương thích
  response.headers.set(
    'Cross-Origin-Embedder-Policy',
    'credentialless'
  )

  // 5. Cross-Origin-Resource-Policy (CORP) - Kiểm soát resource sharing
  // 'cross-origin' cho phép load resources từ external domains (cần cho CDN)
  response.headers.set(
    'Cross-Origin-Resource-Policy',
    'cross-origin'
  )

  // 6. X-Frame-Options - Chống clickjacking (backup cho CSP frame-ancestors)
  response.headers.set(
    'X-Frame-Options',
    'DENY'
  )

  // 7. X-Content-Type-Options - Chống MIME type sniffing
  response.headers.set(
    'X-Content-Type-Options',
    'nosniff'
  )

  // 8. Referrer-Policy - Kiểm soát thông tin referrer
  response.headers.set(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  )

  // 9. Permissions-Policy - Kiểm soát browser features
  response.headers.set(
    'Permissions-Policy',
    [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
    ].join(', ')
  )

  // 10. X-DNS-Prefetch-Control - Kiểm soát DNS prefetching
  response.headers.set(
    'X-DNS-Prefetch-Control',
    'on'
  )

  return response
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
}

