'use client'

import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { MinusOutlined, PlusOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons'
import ProtectedRoute from '../../components/auth/ProtectedRoute'
import CartSkeleton from './components/CartSkeleton'

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  brand: string
  category: string
  quantity: number
  discountPercent: number
  isOnSale: boolean
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch cart items từ API
    // Tạm thời giữ sample data để demo
    const fetchCartItems = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setCartItems([
          {
            id: 1,
            name: 'iPhone 15 Pro Max',
            price: 29990000,
            originalPrice: 32990000,
            image: '📱',
            brand: 'Apple',
            category: 'phones',
            quantity: 1,
            discountPercent: 9,
            isOnSale: true
          },
          {
            id: 2,
            name: 'MacBook Pro 16-inch',
            price: 45990000,
            originalPrice: 49990000,
            image: '💻',
            brand: 'Apple',
            category: 'laptops',
            quantity: 1,
            discountPercent: 8,
            isOnSale: false
          },
          {
            id: 3,
            name: 'AirPods Pro 2nd Gen',
            price: 5990000,
            originalPrice: 6990000,
            image: '🎧',
            brand: 'Apple',
            category: 'accessories',
            quantity: 2,
            discountPercent: 14,
            isOnSale: true
          }
        ])
        setLoading(false)
      }, 1000)
    }

    fetchCartItems()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => 
      total + ((item.originalPrice - item.price) * item.quantity), 0
    )
  }

  const getShippingFee = () => {
    return getSubtotal() >= 500000 ? 0 : 30000
  }

  const getTotal = () => {
    return getSubtotal() + getShippingFee()
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <CartSkeleton />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className=" bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn</h1>
          <p className="text-gray-600">
            {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div> */}

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Button 
              type="primary" 
              size="large"
              icon={<ShoppingOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Sản phẩm đã chọn</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                          {item.image}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                          
                          {/* Price */}
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice > item.price && (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                                  -{item.discountPercent}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            icon={<MinusOutlined />}
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          />
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          />
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeItem(item.id)}
                          className="ml-4"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{formatPrice(getSubtotal())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="text-green-600 font-medium">-{formatPrice(getTotalDiscount())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium">
                      {getShippingFee() === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        formatPrice(getShippingFee())
                      )}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{formatPrice(getTotal())}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Thanh toán
                  </Button>
                  
                  <Button 
                    size="large" 
                    block
                    icon={<ShoppingOutlined />}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center text-green-600 text-sm">
                    <span className="mr-2">✓</span>
                    <span>Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default CartPage