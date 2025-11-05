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


