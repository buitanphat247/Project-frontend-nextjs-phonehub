'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { searchProducts } from '../../../../lib/api/products'
import type { ProductResponse } from '../../../../lib/api/products'
import { Product } from '../../../(home)/products/interface/IProduct'
import { getCategoryRoute } from '../../../(home)/products/utils/categoryUtils'
import { Spin, Dropdown, Button, App } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined, HeartOutlined, ExclamationCircleOutlined, ShoppingCartOutlined, SearchOutlined, MobileOutlined, OrderedListOutlined } from '@ant-design/icons'
import { isAuthenticated, getAuthData, clearAuthData } from '../../../../lib/utils/cookie'
import { createDangerousHTML } from '@/lib/utils/trustedTypes'

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
  onMenuClick: () => void
  isMenuOpen?: boolean
}

export default function MainHeader({ initialAuth, totalItems, onCartClick, onMenuClick, isMenuOpen = false }: MainHeaderProps) {
  const { modal } = App.useApp()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearchClosing, setIsSearchClosing] = useState(false)
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

  // No cart animation

  const handleLogout = () => {
    modal.confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn đăng xuất không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      maskClosable: true,
      keyboard: true,
      onOk() {
        clearAuthData()
        setAuthenticated(false)
        setUserData(null)
        window.location.reload()
      },
    })
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'account') {
      router.push('/account?tab=account')
    } else if (e.key === 'orders') {
      router.push('/account?tab=orders')
    } else if (e.key === 'favorites') {
      router.push('/favourite')
    } else if (e.key === 'settings') {
      router.push('/account?tab=settings')
    } else if (e.key === 'logout') {
      handleLogout()
    }
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'Tài khoản của tôi',
      className: 'cursor-pointer',
    },
    // {
    //   key: 'orders',
    //   icon: <OrderedListOutlined />,
    //   label: 'Đơn hàng của tôi',
    //   className: 'cursor-pointer',
    // },
    {
      key: 'favorites',
      icon: <HeartOutlined />,
      label: 'Sản phẩm yêu thích',
      className: 'cursor-pointer',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      className: 'cursor-pointer',
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

  // Close search function with animation
  const closeSearch = () => {
    setIsSearchClosing(true)
    setTimeout(() => {
      setIsSearchOpen(false)
      setIsSearchClosing(false)
      setShowResults(false)
      setSearchQuery('')
    }, 300) // Match animation duration
  }

  // Prevent body scroll when mobile search is open
  useEffect(() => {
    if (isSearchOpen && !isSearchClosing) {
      // Sử dụng requestAnimationFrame để tránh forced reflow
      requestAnimationFrame(() => {
        document.body.style.overflow = 'hidden'
      })

      // Handle ESC key to close search
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isSearchClosing) {
          closeSearch()
        }
      }

      document.addEventListener('keydown', handleEsc)
      return () => {
        document.removeEventListener('keydown', handleEsc)
        requestAnimationFrame(() => {
          document.body.style.overflow = 'unset'
        })
      }
    } else {
      requestAnimationFrame(() => {
        document.body.style.overflow = 'unset'
      })
    }
  }, [isSearchOpen, isSearchClosing])

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
        {/* Logo - Hidden on mobile, show on desktop */}
        <Link href="/" className="hidden md:flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">PhoneHub</span>
        </Link>
        
        {/* Menu Icon (Mobile) - Replace logo on mobile */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
        </button>

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
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchOutlined className="text-lg" />
            </span>
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
                  // Cache layout values để tránh multiple reads
                  const scrollTop = target.scrollTop
                  const scrollHeight = target.scrollHeight
                  const clientHeight = target.clientHeight
                  const isScrollingDown = e.deltaY > 0
                  const isAtTop = scrollTop === 0
                  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                  
                  // preventDefault phải được gọi đồng bộ
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
                              // Sử dụng requestAnimationFrame để tránh forced reflow
                              requestAnimationFrame(() => {
                                const target = e.target as HTMLImageElement
                                target.classList.add('hidden')
                                target.nextElementSibling?.classList.remove('hidden')
                              })
                            }}
                          />
                        ) : null}
                        <span className={`${product.thumbnailImage ? 'hidden' : ''} flex items-center justify-center text-gray-400`}>
                          {product.image || <MobileOutlined className="text-2xl" />}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        <p className="text-base font-semibold text-blue-700 mt-1">
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
            onClick={() => {
              if (isSearchOpen) {
                closeSearch()
              } else {
                setIsSearchOpen(true)
              }
            }}
            className="md:hidden p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SearchOutlined className="text-xl" />
          </button>

          {/* User Account - Only show when authenticated */}
          {authenticated && userData && (
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <button
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title={`Xin chào, ${userData.username}`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userData.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium">{userData.username}</span>
              </button>
            </Dropdown>
          )}

          {/* Shopping Cart - hide when not authenticated */}
          {authenticated && (
            <button
              onClick={onCartClick}
              className="relative cursor-pointer p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Giỏ hàng"
              aria-label={`Giỏ hàng có ${totalItems} sản phẩm`}
            >
              <span className="text-xl"><ShoppingCartOutlined /></span>
              {/* Không hiển thị badge/hiệu ứng */}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay - Fixed position với animation */}
      {isSearchOpen && (
        <>
          <style dangerouslySetInnerHTML={createDangerousHTML(`
              @keyframes slideDown {
                from {
                  transform: translateY(-100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
              
              @keyframes slideUp {
                from {
                  transform: translateY(0);
                  opacity: 1;
                }
                to {
                  transform: translateY(-100%);
                  opacity: 0;
                }
              }
              
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              
              @keyframes fadeOut {
                from {
                  opacity: 1;
                }
                to {
                  opacity: 0;
                }
              }
              
              .mobile-search-enter {
                animation: slideDown 0.3s ease-out forwards;
              }
              
              .mobile-search-exit {
                animation: slideUp 0.3s ease-in forwards;
              }
              
              .mobile-search-overlay-enter {
                animation: fadeIn 0.2s ease-out forwards;
              }
              
              .mobile-search-overlay-exit {
                animation: fadeOut 0.2s ease-in forwards;
              }
            `)} />
          
          {/* Backdrop overlay */}
          <div 
            className={`fixed inset-0 bg-black/50 z-40 md:hidden ${isSearchClosing ? 'mobile-search-overlay-exit' : 'mobile-search-overlay-enter'}`}
            onClick={closeSearch}
          />
          
          {/* Search Container - Fixed position */}
          <div 
            className={`fixed top-0 left-0 right-0 bg-white z-50 md:hidden shadow-lg ${isSearchClosing ? 'mobile-search-exit' : 'mobile-search-enter'}`}
            ref={searchContainerRef}
          >
            <div className="p-4 border-b border-gray-200">
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
                  autoFocus
                  className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchOutlined className="text-lg" />
                </span>
                {isSearching && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Spin size="small" />
                  </span>
                )}
                {/* Close button */}
                <button
                  onClick={closeSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            {/* Mobile Search Results Dropdown - Fixed position */}
            {showResults && searchResults.length > 0 && (
              <div 
                className={`fixed left-0 right-0 bg-white border-t border-gray-200 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto z-50 search-results-scrollbar ${isSearchClosing ? 'mobile-search-exit' : 'mobile-search-enter'}`}
                style={{ top: '80px', animationDelay: isSearchClosing ? '0s' : '0.1s' }}
                onWheel={(e) => {
                  e.stopPropagation()
                  const target = e.currentTarget
                  // Cache layout values để tránh multiple reads
                  const scrollTop = target.scrollTop
                  const scrollHeight = target.scrollHeight
                  const clientHeight = target.clientHeight
                  const isScrollingDown = e.deltaY > 0
                  const isAtTop = scrollTop === 0
                  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
                  
                  // preventDefault phải được gọi đồng bộ
                  if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
                    e.preventDefault()
                  }
                }}
              >
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.thumbnailImage ? (
                          <img 
                            src={product.thumbnailImage} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Sử dụng requestAnimationFrame để tránh forced reflow
                              requestAnimationFrame(() => {
                                const target = e.target as HTMLImageElement
                                target.classList.add('hidden')
                                target.nextElementSibling?.classList.remove('hidden')
                              })
                            }}
                          />
                        ) : null}
                        <span className={`${product.thumbnailImage ? 'hidden' : ''} flex items-center justify-center text-gray-400`}>
                          {product.image || <MobileOutlined className="text-2xl" />}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        <p className="text-base font-semibold text-blue-700 mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Loading Skeleton - Mobile */}
            {isSearching && (
              <div 
                className={`fixed left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50 ${isSearchClosing ? 'mobile-search-exit' : 'mobile-search-enter'}`}
                style={{ top: '80px', animationDelay: isSearchClosing ? '0s' : '0.1s' }}
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
            
            {/* No Results - Mobile */}
            {showResults && searchQuery.trim() && !isSearching && searchResults.length === 0 && (
              <div 
                className={`fixed left-0 right-0 bg-white border-t border-gray-200 shadow-xl p-4 z-50 ${isSearchClosing ? 'mobile-search-exit' : 'mobile-search-enter'}`}
                style={{ top: '80px', animationDelay: isSearchClosing ? '0s' : '0.1s' }}
              >
                <p className="text-gray-500 text-center">Không tìm thấy sản phẩm</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
