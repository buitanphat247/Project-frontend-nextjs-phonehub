'use client'

import { useState, useEffect, useRef } from 'react'
import TopBar from './TopBar'
import MainHeader from './MainHeader'
import Navigation from './Navigation'
import CartSidebar from './CartSidebar'

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCartClosing, setIsCartClosing] = useState(false)
  const cartButtonRef = useRef<HTMLButtonElement>(null)

  // Sample cart data
  const cartItems = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 29990000,
      quantity: 1,
      image: '📱',
      color: 'Titanium Natural'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      price: 24990000,
      quantity: 1,
      image: '📱',
      color: 'Titanium Black'
    }
  ]

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Handle ESC key and focus management
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen && !isCartClosing) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, isCartClosing]);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartClosing(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setIsCartClosing(false);
      cartButtonRef.current?.focus();
    }, 300); // Match animation duration
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <TopBar />
      <div className="container mx-auto px-4">
        <MainHeader totalItems={totalItems} onCartClick={openCart} />
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