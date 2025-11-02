'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCartOutlined, CloseOutlined, MinusOutlined, PlusOutlined, DeleteOutlined, CreditCardOutlined, CarOutlined, ShoppingOutlined } from '@ant-design/icons'

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
  color: string
  brand: string
}

interface CartSidebarProps {
  isOpen: boolean
  isClosing: boolean
  cartItems: CartItem[]
  totalItems: number
  totalPrice: number
  onClose: () => void
}

export default function CartSidebar({
  isOpen,
  isClosing,
  cartItems,
  totalItems,
  totalPrice,
  onClose
}: CartSidebarProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }))
  }

  const removeItem = (itemId: number) => {
    // Logic to remove item from cart
    console.log('Remove item:', itemId)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(100%);
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
          
          .cart-sidebar-enter {
            animation: slideInRight 0.3s ease-out forwards;
          }
          
          .cart-sidebar-exit {
            animation: slideOutRight 0.3s ease-in forwards;
          }
          
          .cart-overlay-enter {
            animation: fadeIn 0.3s ease-out forwards;
          }
          
          .cart-overlay-exit {
            animation: fadeOut 0.3s ease-in forwards;
          }
        `
      }} />
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-40 ${isClosing ? 'cart-overlay-exit' : 'cart-overlay-enter'}`}
        style={{
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-white z-50 ${
          isClosing ? 'cart-sidebar-exit' : 'cart-sidebar-enter'
        }`}
        style={{
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ShoppingCartOutlined className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Giỏ hàng</h2>
                <p className="text-blue-100 text-sm">{totalItems} sản phẩm</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
              aria-label="Đóng giỏ hàng"
            >
              <CloseOutlined className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {cartItems.length > 0 ? (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                          {item.image}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
                          <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                          <p className="text-xs text-gray-500 mb-2">{item.color}</p>
                          
                          {/* Price */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-blue-600">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                             <button 
                               onClick={() => updateQuantity(item.id, (quantities[item.id] || item.quantity) - 1)}
                               className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                             >
                               <MinusOutlined className="text-xs" />
                             </button>
                             <span className="text-sm font-bold w-6 text-center">
                               {quantities[item.id] || item.quantity}
                             </span>
                             <button 
                               onClick={() => updateQuantity(item.id, (quantities[item.id] || item.quantity) + 1)}
                               className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors cursor-pointer"
                             >
                               <PlusOutlined className="text-xs" />
                             </button>
                          </div>
                          
                           <button 
                             onClick={() => removeItem(item.id)}
                             className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                           >
                             <DeleteOutlined className="text-xs" />
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Total */}
                <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/cart"
                    className="flex w-full items-center justify-center bg-linear-to-r from-blue-600 to-blue-700  py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg text-white!"
                    onClick={onClose}
                  >
                    <ShoppingCartOutlined className="mr-2 text-white!" />
                    Xem giỏ hàng
                  </Link>
                  <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center bg-white border-2 border-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                    onClick={onClose}
                  >
                    <CreditCardOutlined className="mr-2 " />
                    Thanh toán
                  </Link>
                </div>
                
                {/* Free shipping notice */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-600 text-sm">
                    <CarOutlined className="mr-2" />
                    <span>Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCartOutlined className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h3>
              <p className="text-gray-500 text-center mb-8 max-w-xs">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
              <Link
                href="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                onClick={onClose}
              >
                <ShoppingOutlined className="mr-2 text-white" />
                Mua sắm ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
