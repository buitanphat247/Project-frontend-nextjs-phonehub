'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { searchProducts } from '../../../../lib/api/products'
import type { ProductResponse } from '../../../../lib/api/products'
import { Product } from '../../../(home)/products/interface/IProduct'
import { getCategoryRoute } from '../../../(home)/products/utils/categoryUtils'
import { Spin, Dropdown, Button } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { isAuthenticated, getAuthData, clearAuthData } from '../../../../lib/utils/cookie'

interface AuthState {
  authenticated: boolean
  userData: {
    username: string
    email: string
  } | null
}

interface MainHeaderProps {
  initialAuth: AuthState
  totalItems: number
  onCartClick: () => void
}

export default function MainHeader({ initialAuth, totalItems, onCartClick }: MainHeaderProps) {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [authenticated, setAuthenticated] = useState(initialAuth.authenticated)
  const [userData, setUserData] = useState<{ username: string; email: string } | null>(initialAuth.userData)

  // Use useEffect for event listeners and interval
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated()
      setAuthenticated(auth)
      if (auth) {
        const data = getAuthData()
        if (data) {
          setUserData({ username: data.username, email: data.email })
        }
      } else {
        setUserData(null)
      }
    }

    const handleStorageChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(checkAuth, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    clearAuthData()
    setAuthenticated(false)
    setUserData(null)
    window.location.reload()
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: <Link href="/account">Tài khoản của tôi</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/account">Cài đặt</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ]

  // Transform API response to Product
  const transformProduct = (product: ProductResponse): Product => {
    const discountPercent = product.priceOld > 0 
      ? Math.floor((product.priceOld - product.price) / product.priceOld * 100)
      : 0

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.priceOld || product.price,
      thumbnailImage: product.thumbnailImage,
      brand: product.brand,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
      discount: product.discount || '',
      discountPercent,
      isOnSale: product.priceOld > 0 && product.price < product.priceOld,
      isPublished: product.isPublished,
    }
  }

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowResults(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await searchProducts(searchQuery.trim(), 0, 10)
        
        if (response.success && response.data) {
          const products = response.data.content.slice(0, 10).map(transformProduct)
          setSearchResults(products)
          setShowResults(true)
        } else {
          setSearchResults([])
          setShowResults(false)
        }
      } catch (error) {
        console.error('Error searching products:', error)
        setSearchResults([])
        setShowResults(false)
      } finally {
        setIsSearching(false)
      }
    }, 500) // Debounce 500ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleProductClick = (product: Product) => {
    const categoryRoute = getCategoryRoute(product)
    router.push(`/${categoryRoute}/${product.id}`)
    setShowResults(false)
    setSearchQuery('')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

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
        <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchContainerRef}>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm điện thoại, thương hiệu..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowResults(true)
                }
              }}
              className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            {isSearching && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Spin size="small" />
              </span>
            )}
            
            {/* Search Results Loading Skeleton */}
            {isSearching && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
              >
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 shrink-0 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Search Results Dropdown */}
            {!isSearching && showResults && searchResults.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 search-results-scrollbar"
                onWheel={(e) => {
                  e.stopPropagation()
                  const target = e.currentTarget
                  const { scrollTop, scrollHeight, clientHeight } = target
                  const isScrollingDown = e.deltaY > 0
                  const isAtTop = scrollTop === 0
                  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                  
                  if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
                    e.preventDefault()
                  }
                }}
              >
                <style jsx global>{`
                  .search-results-scrollbar::-webkit-scrollbar {
                    width: 4px;
                  }
                  .search-results-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .search-results-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(203, 213, 225, 0.5);
                    border-radius: 2px;
                  }
                  .search-results-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(148, 163, 184, 0.7);
                  }
                  .search-results-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(203, 213, 225, 0.5) transparent;
                  }
                `}</style>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.thumbnailImage ? (
                          <img 
                            src={product.thumbnailImage} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        <span className={`text-2xl ${product.thumbnailImage ? 'hidden' : ''}`}>
                          {product.image || '📱'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        <p className="text-base font-semibold text-blue-600 mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showResults && searchQuery.trim() && !isSearching && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
                <p className="text-gray-500 text-center">Không tìm thấy sản phẩm</p>
              </div>
            )}
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

          {/* User Account - Only show when authenticated */}
          {authenticated && userData && (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <button
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={`Xin chào, ${userData.username}`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userData.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium">{userData.username}</span>
              </button>
            </Dropdown>
          )}

          {/* Shopping Cart - Only show when authenticated */}
          {authenticated && (
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
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden py-4 border-t border-gray-200" ref={searchContainerRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm điện thoại..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowResults(true)
                }
              }}
              className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            {isSearching && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Spin size="small" />
              </span>
            )}
            
            {/* Mobile Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 search-results-scrollbar"
                onWheel={(e) => {
                  e.stopPropagation()
                  const target = e.currentTarget
                  const { scrollTop, scrollHeight, clientHeight } = target
                  const isScrollingDown = e.deltaY > 0
                  const isAtTop = scrollTop === 0
                  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                  
                  if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
                    e.preventDefault()
                  }
                }}
              >
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.thumbnailImage ? (
                          <img 
                            src={product.thumbnailImage} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        <span className={`text-2xl ${product.thumbnailImage ? 'hidden' : ''}`}>
                          {product.image || '📱'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        <p className="text-base font-semibold text-blue-600 mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showResults && searchQuery.trim() && !isSearching && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50">
                <p className="text-gray-500 text-center">Không tìm thấy sản phẩm</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
