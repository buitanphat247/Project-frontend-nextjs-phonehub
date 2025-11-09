'use client'

import { useState, useEffect, useRef } from 'react'
import TopBar from './TopBar'
import MainHeader from './MainHeader'
import Navigation from './Navigation'
import CartSidebar from './CartSidebar'
import { getMyCart, CartItemApi } from '../../../../lib/api/cart'
import { getAuthData } from '../../../../lib/utils/cookie'

interface AuthState {
  authenticated: boolean
  userData: {
    username: string
    email: string
  } | null
}

interface HeaderClientProps {
  initialAuth: AuthState
}

export default function HeaderClient({ initialAuth }: HeaderClientProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCartClosing, setIsCartClosing] = useState(false)
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  // Cart count is driven by localStorage 'cart_count' (updated when adding cart)
  const [totalItems, setTotalItems] = useState<number>(
    typeof window !== 'undefined' ? parseInt(localStorage.getItem('cart_count') || '0', 10) || 0 : 0
  )
  const [cartItems, setCartItems] = useState<CartItemApi[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

  // Handle ESC key and focus management
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen && !isCartClosing) {
        closeCart()
      }
    }

    if (isCartOpen) {
      document.addEventListener("keydown", handleEsc)
      // Sử dụng requestAnimationFrame để tránh forced reflow
      requestAnimationFrame(() => {
        document.body.style.overflow = "hidden"
      })
    } else {
      requestAnimationFrame(() => {
        document.body.style.overflow = "unset"
      })
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      requestAnimationFrame(() => {
        document.body.style.overflow = "unset"
      })
    }
  }, [isCartOpen, isCartClosing])

  // Listen to storage changes to update cart badge in real-time
  useEffect(() => {
    const syncCartCount = () => {
      const next = parseInt(localStorage.getItem('cart_count') || '0', 10) || 0
      setTotalItems(next)
    }
    window.addEventListener('storage', syncCartCount)
    const interval = setInterval(syncCartCount, 1000)
    return () => {
      window.removeEventListener('storage', syncCartCount)
      clearInterval(interval)
    }
  }, [])

  // Fetch cart items when sidebar opens
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const auth = getAuthData()
        const userId = auth?.userId ? parseInt(auth.userId, 10) : NaN
        if (!userId) return
        const res = await getMyCart(userId)
        if (res.success && Array.isArray(res.data)) {
          setCartItems(res.data)
          const count = res.data.reduce((sum, ci) => sum + ci.quantity, 0)
          setTotalItems(count)
          const price = res.data.reduce((sum, ci) => sum + ((ci.priceAtAdd || ci.product.price) * ci.quantity), 0)
          setTotalPrice(price)
        }
      } catch {}
    }
    if (isCartOpen) fetchCart()
  }, [isCartOpen])

  const openCart = () => {
    setIsCartOpen(true)
  }

  const closeCart = () => {
    setIsCartClosing(true)
    setTimeout(() => {
      setIsCartOpen(false)
      setIsCartClosing(false)
      cartButtonRef.current?.focus()
    }, 300) // Match animation duration
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <TopBar initialAuth={initialAuth} />
      <div className="container mx-auto px-4">
        <MainHeader initialAuth={initialAuth} totalItems={totalItems} onCartClick={openCart} />
        <Navigation />
      </div>
      <CartSidebar
        isOpen={isCartOpen}
        isClosing={isCartClosing}
        cartItems={cartItems}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onClose={closeCart}
      />
    </header>
  )
}
