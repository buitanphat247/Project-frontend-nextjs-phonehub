import { apiClient } from "../utils/apiClient"
import type { ApiResponse } from "./config"

export interface CreateOrderRequest {
  userId: number
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  buyerAddress: string
  paymentMethod: string
  amount: number
  status?: string
}

export interface OrderResponse {
  id: number
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderDetailItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  isReviewed?: boolean
  reviewId?: number | null
  reviewRating?: number | null
  reviewComment?: string | null
  reviewCreatedAt?: string | null
  createdAt?: string
}

export interface OrderDetailResponse {
  id: number
  userId: number
  username: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  buyerAddress: string
  totalPrice: number
  paymentMethod: string
  status: string
  createdAt: string
  updatedAt: string
  items: OrderDetailItem[]
}

export interface OrderItemRequest {
  productId: number
  quantity: number
  unitPrice: number
}

export async function createOrder(payload: CreateOrderRequest): Promise<ApiResponse<OrderResponse>> {
  const res = await apiClient("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function addOrderItems(orderId: number | string, items: OrderItemRequest[]): Promise<ApiResponse<boolean>> {
  const res = await apiClient(`/orders/${orderId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  })
  return res.json()
}

// Add single item (some backends expect one item per request)
export async function addOrderItem(orderId: number | string, item: OrderItemRequest): Promise<ApiResponse<boolean>> {
  const res = await apiClient(`/orders/${orderId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
  return res.json()
}

export interface UpdateOrderItemReviewStateRequest {
  reviewed: boolean
  reviewId: number | null
}

export async function updateOrderItemReviewState(
  orderItemId: number | string,
  payload: UpdateOrderItemReviewStateRequest
): Promise<ApiResponse<boolean>> {
  const res = await apiClient(`/order-items/${orderItemId}/review-state`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function updateOrderStatus(orderId: number | string, status: string): Promise<ApiResponse<boolean>> {
  const res = await apiClient(`/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  return res.json()
}

export async function getOrderById(orderId: number | string): Promise<ApiResponse<OrderDetailResponse>> {
  const res = await apiClient(`/orders/${orderId}`, {
    method: "GET",
  })
  return res.json()
}

export async function getOrdersByUser(userId: number | string): Promise<ApiResponse<OrderDetailResponse[]>> {
  const res = await apiClient(`/orders/user/${userId}`, {
    method: "GET",
  })
  return res.json()
}

// Get orders with pagination and optional userId filter
export interface OrdersPage {
  content: OrderDetailResponse[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export async function getOrders(params: { page?: number; size?: number; userId?: number | string }): Promise<ApiResponse<OrdersPage>> {
  const search = new URLSearchParams()
  if (typeof params.page === 'number') search.set('page', String(params.page))
  if (typeof params.size === 'number') search.set('size', String(params.size))
  if (params.userId) search.set('userId', String(params.userId))
  const res = await apiClient(`/orders?${search.toString()}`, { method: 'GET' })
  return res.json()
}

/**
 * Check if user has purchased a product (by productId)
 * This function will:
 * 1. Get all orders of the user (with status = "success" or "SUCCESS")
 * 2. Find order items with the given productId
 * 3. Check purchased for each order item found
 */
export async function checkUserPurchasedProduct(userId: number, productId: number): Promise<boolean> {
  try {
    // Get all orders of the user (we need to get all pages to check all orders)
    let page = 0
    const pageSize = 50
    let hasMore = true
    
    while (hasMore) {
      const ordersResponse = await getOrders({ page, size: pageSize, userId })
      
      if (!ordersResponse.success || !ordersResponse.data) {
        return false
      }
      
      const orders = ordersResponse.data.content || []
      
      // Check each order for the product
      for (const order of orders) {
        // Only check orders with status "success" or "SUCCESS"
        const orderStatus = order.status?.toLowerCase()
        if (orderStatus !== 'success') {
          continue
        }
        
        // Find order items with the given productId
        const matchingItems = order.items?.filter(item => item.productId === productId) || []
        
        // Check purchased for each matching order item
        // If we found matching items, user has purchased the product
        if (matchingItems.length > 0) {
          return true
        }
      }
      
      // Check if there are more pages
      const totalPages = ordersResponse.data.totalPages || 0
      hasMore = page + 1 < totalPages && orders.length > 0
      page++
    }
    
    return false
  } catch (error) {
    console.error('Error checking user purchased product:', error)
    return false
  }
}


