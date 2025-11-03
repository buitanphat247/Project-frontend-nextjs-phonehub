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
 * Sign out user (if needed)
 */
export async function signOut(): Promise<void> {
  // If backend has a signout endpoint, call it here
  // For now, just clear local storage/cookie
}

