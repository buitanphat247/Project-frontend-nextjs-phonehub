'use client'

import Link from 'next/link'
import { useState } from 'react'

interface MainHeaderProps {
  totalItems: number
  onCartClick: () => void
}

export default function MainHeader({ totalItems, onCartClick }: MainHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">PhoneHub</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm điện thoại, thương hiệu..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-2">
          {/* Search Icon (Mobile) */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-xl">🔍</span>
          </button>

          {/* User Account */}
          <Link 
            href="/account" 
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Tài khoản"
          >
            <span className="text-xl">👤</span>
          </Link>

          {/* Shopping Cart */}
          <button
            onClick={onCartClick}
            className="relative cursor-pointer p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Giỏ hàng"
            aria-label={`Giỏ hàng có ${totalItems} sản phẩm`}
          >
            <span className="text-xl">🛒</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {totalItems}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden py-4 border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm điện thoại..."
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          </div>
        </div>
      )}
    </>
  )
}
