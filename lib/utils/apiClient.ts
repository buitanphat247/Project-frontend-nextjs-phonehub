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

  // Measure API call duration (client-side only)
  const start = typeof window !== 'undefined' ? performance.now() : 0

  try {
    
    // Make the request (proxy handles CORS, so no special mode needed)
    const response = await fetch(url, {
      ...options,
      headers,
    })
    
    const duration = typeof window !== 'undefined' 
      ? (performance.now() - start).toFixed(2) 
      : '0'
    
    // Log timing (always log in client-side)
    if (typeof window !== 'undefined') {
      if (response.ok) {
        console.log(`✅ API [${response.status}] ${endpoint} (${duration} ms)`)
      } else {
        console.error(`❌ API [${response.status}] ${endpoint} (${duration} ms)`)
      }
    }

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
    // Measure duration even on error (client-side only)
    if (typeof window !== 'undefined') {
      const duration = (performance.now() - start).toFixed(2)
      console.error(`❌ API failed ${endpoint} (${duration} ms):`, error)
    }
    throw error
  }
}

/**
 * Wrapper for GET requests
 * Handles token refresh automatically on JWT expiration
 */
export async function apiGet<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient(endpoint, {
      ...options,
      method: 'GET',
    })

    // Check for new token even if response is not ok (for JWT expiration)
    // Must check headers before consuming response body
    const newToken = 
      response.headers.get('x-new-access-token') || 
      response.headers.get('X-New-Access-Token') ||
      response.headers.get('x-new-accestoken') ||
      response.headers.get('X-New-Accestoken')
    
    // If we have a new token and got a 400/401 error (likely JWT expired), save token and retry
    if (newToken && !response.ok && (response.status === 400 || response.status === 401)) {
      const authData = getAuthData()
      if (authData) {
        authData.token = newToken
        saveAuthData(authData)
        
        // Retry once with new token
        const retryResponse = await apiClient(endpoint, {
          ...options,
          method: 'GET',
        })
        
        if (!retryResponse.ok) {
          let errorData
          try {
            errorData = await retryResponse.json()
          } catch {
            errorData = {
              message: `Request failed with status ${retryResponse.status}: ${retryResponse.statusText}`,
            }
          }
          throw new Error(errorData.message || `Request failed with status ${retryResponse.status}`)
        }
        
        return retryResponse.json()
      }
    }

    // If we have new token but response is ok, just save it (already saved in apiClient, but ensure it's saved)
    if (newToken && response.ok) {
      const authData = getAuthData()
      if (authData && authData.token !== newToken) {
        authData.token = newToken
        saveAuthData(authData)
      }
    }

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = {
          message: `Request failed with status ${response.status}: ${response.statusText}`,
        }
      }
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
 * Handles token refresh automatically on JWT expiration
 */
export async function apiPost<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })

    // Check for new token even if response is not ok (for JWT expiration)
    // Must check headers before consuming response body
    const newToken = 
      response.headers.get('x-new-access-token') || 
      response.headers.get('X-New-Access-Token') ||
      response.headers.get('x-new-accestoken') ||
      response.headers.get('X-New-Accestoken')
    
    // If we have a new token and got a 400/401 error (likely JWT expired), save token and retry
    if (newToken && !response.ok && (response.status === 400 || response.status === 401)) {
      const authData = getAuthData()
      if (authData) {
        authData.token = newToken
        saveAuthData(authData)
        
        // Retry once with new token
        const retryResponse = await apiClient(endpoint, {
          ...options,
          method: 'POST',
          body: data ? JSON.stringify(data) : undefined,
        })
        
        if (!retryResponse.ok) {
          let errorData
          try {
            errorData = await retryResponse.json()
          } catch {
            errorData = {
              message: `Request failed with status ${retryResponse.status}: ${retryResponse.statusText}`,
            }
          }
          throw new Error(errorData.message || `Request failed with status ${retryResponse.status}`)
        }
        
        return retryResponse.json()
      }
    }

    // If we have new token but response is ok, just save it (already saved in apiClient, but ensure it's saved)
    if (newToken && response.ok) {
      const authData = getAuthData()
      if (authData && authData.token !== newToken) {
        authData.token = newToken
        saveAuthData(authData)
      }
    }

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = {
          message: `Request failed with status ${response.status}: ${response.statusText}`,
        }
      }
      throw new Error(errorData.message || `Request failed with status ${response.status}`)
    }

    return response.json()
  } catch (error: any) {
    console.error(`Error in apiPost for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Wrapper for PUT requests
 * Handles token refresh automatically on JWT expiration
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

  // Check for new token even if response is not ok (for JWT expiration)
  const newToken = 
    response.headers.get('x-new-access-token') || 
    response.headers.get('X-New-Access-Token') ||
    response.headers.get('x-new-accestoken') ||
    response.headers.get('X-New-Accestoken')
  
  // If we have a new token and got a 400/401 error (likely JWT expired), save token and retry
  if (newToken && !response.ok && (response.status === 400 || response.status === 401)) {
    const authData = getAuthData()
    if (authData) {
      authData.token = newToken
      saveAuthData(authData)
      
      // Retry once with new token
      const retryResponse = await apiClient(endpoint, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      })
      
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({
          message: 'Request failed',
        }))
        throw new Error(errorData.message || 'Request failed')
      }
      
      return retryResponse.json()
    }
  }

  // If we have new token but response is ok, just save it (already saved in apiClient, but ensure it's saved)
  if (newToken && response.ok) {
    const authData = getAuthData()
    if (authData && authData.token !== newToken) {
      authData.token = newToken
      saveAuthData(authData)
    }
  }

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
 * Handles token refresh automatically on JWT expiration
 */
export async function apiDelete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await apiClient(endpoint, {
    ...options,
    method: 'DELETE',
  })

  // Check for new token even if response is not ok (for JWT expiration)
  const newToken = 
    response.headers.get('x-new-access-token') || 
    response.headers.get('X-New-Access-Token') ||
    response.headers.get('x-new-accestoken') ||
    response.headers.get('X-New-Accestoken')
  
  // If we have a new token and got a 400/401 error (likely JWT expired), save token and retry
  if (newToken && !response.ok && (response.status === 400 || response.status === 401)) {
    const authData = getAuthData()
    if (authData) {
      authData.token = newToken
      saveAuthData(authData)
      
      // Retry once with new token
      const retryResponse = await apiClient(endpoint, {
        ...options,
        method: 'DELETE',
      })
      
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({
          message: 'Request failed',
        }))
        throw new Error(errorData.message || 'Request failed')
      }
      
      return retryResponse.json()
    }
  }

  // If we have new token but response is ok, just save it (already saved in apiClient, but ensure it's saved)
  if (newToken && response.ok) {
    const authData = getAuthData()
    if (authData && authData.token !== newToken) {
      authData.token = newToken
      saveAuthData(authData)
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Request failed',
    }))
    throw new Error(errorData.message || 'Request failed')
  }

  return response.json()
}

