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

  return NextResponse.next()
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

