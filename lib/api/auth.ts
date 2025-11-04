import { ApiResponse } from './config'
import { apiPost, apiGet } from '../utils/apiClient'

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

export interface SignUpRequest {
  username: string
  email: string
  phone: string
  address?: string
  birthday?: string // Format: YYYY-MM-DD
  password: string
}

export interface SignUpResponse {
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
  return apiPost<SignInResponse>('/auth/signin', credentials)
}

/**
 * Sign up new user
 */
export async function signUp(userData: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
  return apiPost<SignUpResponse>('/auth/signup', userData)
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
  return apiGet<boolean>(`/auth/verify-email-change?token=${encodeURIComponent(token)}`)
}

/**
 * Check email availability
 */
export async function checkEmailAvailability(email: string): Promise<ApiResponse<{ email: string; available: boolean }>> {
  return apiGet<{ email: string; available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`)
}

/**
 * Sign out user (if needed)
 */
export async function signOut(): Promise<void> {
  // If backend has a signout endpoint, call it here
  // For now, just clear local storage/cookie
}

