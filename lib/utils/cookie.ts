/**
 * Cookie utilities for client-side cookie management
 */

export interface AuthData {
  roleId: string
  roleName: string
  type: string
  userId: string
  email: string
  token: string
  username: string
}

const AUTH_COOKIE_KEY = 'auth_data'
const COOKIE_EXPIRES_DAYS = 7 // Token expires in 1 hour from backend, but we'll store for 7 days

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, days: number = COOKIE_EXPIRES_DAYS): void {
  if (typeof window === 'undefined') return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null

  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  
  return null
}

/**
 * Remove a cookie
 */
export function removeCookie(name: string): void {
  if (typeof window === 'undefined') return

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

/**
 * Save auth data to cookie
 */
export function saveAuthData(authData: AuthData): void {
  try {
    const jsonString = JSON.stringify(authData)
    setCookie(AUTH_COOKIE_KEY, jsonString, COOKIE_EXPIRES_DAYS)
  } catch (error) {
    console.error('Error saving auth data:', error)
  }
}

/**
 * Get auth data from cookie
 */
export function getAuthData(): AuthData | null {
  try {
    const cookieValue = getCookie(AUTH_COOKIE_KEY)
    if (!cookieValue) return null
    
    return JSON.parse(cookieValue) as AuthData
  } catch (error) {
    console.error('Error reading auth data:', error)
    return null
  }
}

/**
 * Get token from cookie
 */
export function getToken(): string | null {
  const authData = getAuthData()
  return authData?.token || null
}

/**
 * Clear auth data from cookie
 */
export function clearAuthData(): void {
  removeCookie(AUTH_COOKIE_KEY)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}

