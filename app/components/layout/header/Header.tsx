import { getServerAuthState } from '../../../../lib/utils/cookie-server'
import HeaderClient from './HeaderClient'

export default async function Header() {
  // Read auth state from cookie on server
  const initialAuth = await getServerAuthState()
  
  return <HeaderClient initialAuth={initialAuth} />
}