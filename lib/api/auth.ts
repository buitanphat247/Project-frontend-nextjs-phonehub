import { buildApiUrl, ApiResponse } from './config'
import { apiPost } from '../utils/apiClient'

export interface SignInRequest {
  username: string
  password: string
}

export interface SignInResponse {
  roleId: string
  roleName: string
  type: string
  userId: string
  email: string
  token: string
  username: string
}

/**
 * Sign in user
 */
export async function signIn(credentials: SignInRequest): Promise<ApiResponse<SignInResponse>> {
  const response = await fetch(buildApiUrl('/auth/signin'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Đăng nhập thất bại',
    }))
    throw new Error(errorData.message || 'Đăng nhập thất bại')
  }

  return response.json()
}

/**
 * Sign in with Google id_token (body expects a JSON string)
 */
export async function signInWithGoogle(idToken: string): Promise<ApiResponse<SignInResponse>> {
  // Use shared api client (handles token refresh, headers, proxy, errors)
  return apiPost<SignInResponse>('/auth/signin/google', idToken)
}

/**
 * Request email change: backend will send verification mail to new address
 */
export interface ChangeEmailRequestBody {
  userId: string
  currentEmail: string
  newEmail: string
}

export async function requestEmailChange(payload: ChangeEmailRequestBody): Promise<ApiResponse<boolean>> {
  return apiPost<boolean>('/auth/change-email-request', payload)
}

/**
 * Verify email change by token (GET endpoint on backend)
 */
export async function verifyEmailChange(token: string): Promise<ApiResponse<boolean>> {
  const url = buildApiUrl(`/auth/verify-email-change?token=${encodeURIComponent(token)}`)
  const response = await fetch(url, { method: 'GET' })
  
  // Parse response body
  const data = await response.json().catch(() => ({ 
    success: false, 
    message: 'Lỗi xác minh email',
    data: false,
    timestamp: new Date().toISOString(),
    statusCode: response.status || 500
  }))
  
  // If response doesn't have all required fields, ensure it does
  if (!data.timestamp) {
    data.timestamp = new Date().toISOString()
  }
  if (!data.statusCode) {
    data.statusCode = response.status || (data.success ? 200 : 400)
  }
  
  return data
}

/**
 * Check email availability
 */
export async function checkEmailAvailability(email: string): Promise<ApiResponse<{ email: string; available: boolean }>> {
  const url = buildApiUrl(`/auth/check-email?email=${encodeURIComponent(email)}`)
  const response = await fetch(url, { method: 'GET' })
  const data = await response.json().catch(() => ({
    success: false,
    message: 'Không kiểm tra được email',
    data: { email, available: false },
    timestamp: new Date().toISOString(),
    statusCode: response.status || 500,
  }))
  if (!data.timestamp) data.timestamp = new Date().toISOString()
  if (!data.statusCode) data.statusCode = response.status || (data.success ? 200 : 400)
  return data
}

/**
 * Sign out user (if needed)
 */
export async function signOut(): Promise<void> {
  // If backend has a signout endpoint, call it here
  // For now, just clear local storage/cookie
}

