import { buildApiUrl, ApiResponse } from '../api/config'
import { getToken, getAuthData, saveAuthData } from './cookie'

/**
 * Custom fetch wrapper that:
 * 1. Automatically adds Authorization header with token
 * 2. Handles token refresh when expired (via X-New-Access-Token header from backend)
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken()
  const url = buildApiUrl(endpoint)

  // Merge headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    // Make the request (proxy handles CORS, so no special mode needed)
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Check if we got a new token in the response header
    // Backend returns X-New-Access-Token header
    // Headers are case-insensitive, so try different variations
    const newToken = 
      response.headers.get('x-new-access-token') || 
      response.headers.get('X-New-Access-Token') ||
      response.headers.get('x-new-accestoken') || // Fallback for typo version
      response.headers.get('X-New-Accestoken')
    
    if (newToken) {
      // Update token in cookie
      const authData = getAuthData()
      if (authData) {
        authData.token = newToken
        saveAuthData(authData)
      }
    }

    return response
  } catch (error: any) {
    console.error(`Error when calling ${url}:`, error)
    throw error
  }
}

/**
 * Wrapper for GET requests
 */
export async function apiGet<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient(endpoint, {
      ...options,
      method: 'GET',
    })

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = {
          message: `Request failed with status ${response.status}: ${response.statusText}`,
        }
      }
      console.error(`API Error [${response.status}]:`, errorData)
      throw new Error(errorData.message || `Request failed with status ${response.status}`)
    }

    return response.json()
  } catch (error: any) {
    console.error(`Error in apiGet for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Wrapper for POST requests
 */
export async function apiPost<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await apiClient(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Request failed',
    }))
    throw new Error(errorData.message || 'Request failed')
  }

  return response.json()
}

/**
 * Wrapper for PUT requests
 */
export async function apiPut<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await apiClient(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Request failed',
    }))
    throw new Error(errorData.message || 'Request failed')
  }

  return response.json()
}

/**
 * Wrapper for DELETE requests
 */
export async function apiDelete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await apiClient(endpoint, {
    ...options,
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Request failed',
    }))
    throw new Error(errorData.message || 'Request failed')
  }

  return response.json()
}

