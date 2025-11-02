/**
 * Get initial authentication state (for useState initializer)
 * Only works on client-side
 */
export function getInitialAuthState() {
  if (typeof window === 'undefined') {
    return { authenticated: false, userData: null }
  }

  try {
    const { isAuthenticated, getAuthData } = require('./cookie')
    const auth = isAuthenticated()
    if (auth) {
      const data = getAuthData()
      if (data) {
        return {
          authenticated: true,
          userData: {
            username: data.username,
            email: data.email,
          },
        }
      }
    }
  } catch (error) {
    // Ignore errors during SSR
  }

  return { authenticated: false, userData: null }
}

