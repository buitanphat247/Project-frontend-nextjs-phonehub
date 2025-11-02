import { cookies } from 'next/headers'

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

/**
 * Get auth data from cookie (Server-side)
 */
export async function getServerAuthData(): Promise<AuthData | null> {
  try {
    const cookieStore = await cookies()
    const cookieValue = cookieStore.get(AUTH_COOKIE_KEY)?.value
    
    if (!cookieValue) return null
    
    return JSON.parse(cookieValue) as AuthData
  } catch (error) {
    console.error('Error reading auth data from server:', error)
    return null
  }
}

/**
 * Get initial auth state for Server Components
 */
export async function getServerAuthState() {
  const authData = await getServerAuthData()
  
  if (authData) {
    return {
      authenticated: true,
      userData: {
        username: authData.username,
        email: authData.email,
      },
    }
  }
  
  return {
    authenticated: false,
    userData: null,
  }
}

