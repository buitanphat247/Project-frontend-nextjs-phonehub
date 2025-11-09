'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCartOutlined, CloseOutlined, MinusOutlined, PlusOutlined, DeleteOutlined, CreditCardOutlined, CarOutlined, ShoppingOutlined, PictureOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { getMyCart, updateCartItemQuantity, deleteCartItem } from '../../../../lib/api/cart'
import { getAuthData } from '../../../../lib/utils/cookie'

interface CartItem {
  id: number
  productId: number
  product: {
    id: number
    name: string
    slug: string
    brand?: string
    price: number
    priceOld?: number
    thumbnailImage?: string
  }
  quantity: number
  priceAtAdd: number
  createdAt: string
  updatedAt: string
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
  const [fetchedItems, setFetchedItems] = useState<CartItem[]>([])
  const [fetchedTotal, setFetchedTotal] = useState<number>(0)
  const [useLocalData, setUseLocalData] = useState<boolean>(false)

  // Fetch cart when sidebar opens (defensive, in case parent chưa truyền items)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const auth = getAuthData()
        const userId = auth?.userId ? parseInt(auth.userId, 10) : NaN
        if (!userId) return
        const res = await getMyCart(userId)
        if (res.success && Array.isArray(res.data)) {
          setFetchedItems(res.data as unknown as CartItem[])
          const total = res.data.reduce((sum: number, ci: any) => sum + ((ci.priceAtAdd || ci.product.price) * ci.quantity), 0)
          setFetchedTotal(total)
          setUseLocalData(true)
        }
      } catch {
        // ignore
      }
    }
    if (isOpen) fetchCart()
  }, [isOpen])

  // Ưu tiên dùng dữ liệu fetch nội bộ để có thể cập nhật số lượng tức thời
  const itemsToRender = useLocalData ? fetchedItems : (cartItems || [])
  const totalToRender = useLocalData ? fetchedTotal : (totalPrice || 0)

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    // Tìm item trong danh sách hiện tại (fetchedItems)
    const currentItems = itemsToRender.length ? [...itemsToRender] : []
    const idx = currentItems.findIndex(i => i.id === itemId)
    if (idx === -1) return
    const prevQty = currentItems[idx].quantity

    // Optimistic update
    currentItems[idx] = { ...currentItems[idx], quantity: newQuantity }
    setFetchedItems(currentItems)
    setUseLocalData(true)
    setQuantities(prev => ({ ...prev, [itemId]: newQuantity }))
    setFetchedTotal(currentItems.reduce((sum, ci) => sum + ((ci.priceAtAdd || ci.product.price) * ci.quantity), 0))

    try {
      const res = await updateCartItemQuantity(itemId, newQuantity)
      if (!res.success) throw new Error(res.message || 'Cập nhật thất bại')
      // đồng bộ badge
      const count = currentItems.reduce((s, i) => s + i.quantity, 0)
      localStorage.setItem('cart_count', String(count))
      window.dispatchEvent(new Event('storage'))
    } catch (e: any) {
      // rollback
      const rollback = itemsToRender.length ? [...itemsToRender] : []
      const rIdx = rollback.findIndex(i => i.id === itemId)
      if (rIdx !== -1) rollback[rIdx] = { ...rollback[rIdx], quantity: prevQty }
      setFetchedItems(rollback)
      setFetchedTotal(rollback.reduce((sum, ci) => sum + ((ci.priceAtAdd || ci.product.price) * ci.quantity), 0))
    }
  }

  const removeItem = async (itemId: number) => {
    const currentItems = itemsToRender.length ? [...itemsToRender] : []
    const idx = currentItems.findIndex(i => i.id === itemId)
    if (idx === -1) return

    // Optimistic remove
    const removed = currentItems.splice(idx, 1)[0]
    const prevItems = itemsToRender
    setFetchedItems(currentItems)
    setUseLocalData(true)
    setFetchedTotal(currentItems.reduce((s, i) => s + ((i.priceAtAdd || i.product.price) * i.quantity), 0))
    setQuantities(prev => {
      const n = { ...prev }
      delete n[itemId]
      return n
    })
    try {
      const res = await deleteCartItem(itemId)
      if (!res.success) throw new Error(res.message || 'Xóa thất bại')
      toast.success('Đã xóa khỏi giỏ hàng')
      const count = currentItems.reduce((s, i) => s + i.quantity, 0)
      localStorage.setItem('cart_count', String(count))
      window.dispatchEvent(new Event('storage'))
    } catch (e: any) {
      // rollback
      const rollback = [...prevItems]
      // chèn lại item đã xóa tại vị trí cũ
      rollback.splice(idx, 0, removed)
      setFetchedItems(rollback)
      setFetchedTotal(rollback.reduce((s, i) => s + ((i.priceAtAdd || i.product.price) * i.quantity), 0))
      toast.error(e?.message || 'Không thể xóa khỏi giỏ hàng')
    }
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
                <p className="text-blue-100 text-sm">{itemsToRender.reduce((s, i) => s + i.quantity, 0)} sản phẩm</p>
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
          {itemsToRender.length > 0 ? (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {itemsToRender.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                          {item.product.thumbnailImage ? (
                            <img src={item.product.thumbnailImage} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <PictureOutlined className="text-xl text-gray-400" />
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{item.product.name}</h3>
                          {item.product.brand && (
                            <p className="text-xs text-gray-500 mb-1">{item.product.brand}</p>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-blue-700">
                              {formatPrice(item.priceAtAdd || item.product.price)}
                            </span>
                            {typeof item.product.priceOld === 'number' && item.product.priceOld > (item.priceAtAdd || item.product.price) && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(item.product.priceOld)}
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
                               className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-100 hover:text-green-700 transition-colors cursor-pointer"
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
              <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-3">
                {/* Total */}
                <div className="flex justify-between items-center  bg-white rounded-lg">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-blue-700">
                    {formatPrice(totalToRender)}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div >
                  <Link
                    href="/cart"
                    className="flex w-full items-center justify-center bg-linear-to-r from-blue-600 to-blue-700  py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg text-white!"
                    onClick={onClose}
                  >
                    <ShoppingCartOutlined className="mr-2 text-white!" />
                    Xem giỏ hàng
                  </Link>
                  {/* <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center bg-white border-2 border-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
                    onClick={onClose}
                  >
                    <CreditCardOutlined className="mr-2 " />
                    Thanh toán
                  </Link> */}
                </div>
                
                {/* Free shipping notice */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-700 text-sm">
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
