import { ApiResponse } from './config'
import { apiPost, apiGet, apiDelete } from '../utils/apiClient'
import { apiPut } from '../utils/apiClient'

export interface AddToCartRequest {
  userId: number
  productId: number
  quantity: number
}

export interface CartItemResponse {
  id: number
  productId: number
  quantity: number
}

export async function addToCart(payload: AddToCartRequest): Promise<ApiResponse<CartItemResponse>> {
  return apiPost<CartItemResponse>('/cart', payload)
}

// Optional: if backend supports it, consume count endpoint
export async function getCartCount(): Promise<ApiResponse<number>> {
  return apiGet<number>('/cart/count')
}

// Backend response structure
export interface CartItemApi {
  id: number
  productId: number
  product: {
    id: number
    name: string
    slug: string
    brand?: string
    category?: {
      id: number
      name: string
      slug: string
      createdAt: string
      updatedAt: string
    }
    price: number
    priceOld?: number
    discount?: string
    thumbnailImage?: string
    quantity?: number
    isPublished?: boolean
    publishedAt?: string
    createdAt: string
    updatedAt: string
  }
  quantity: number
  priceAtAdd: number
  createdAt: string
  updatedAt: string
}

export async function getMyCart(userId: number): Promise<ApiResponse<CartItemApi[]>> {
  return apiGet<CartItemApi[]>(`/cart?userId=${encodeURIComponent(String(userId))}`)
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number): Promise<ApiResponse<CartItemApi>> {
  return apiPut<CartItemApi>(`/cart/${cartItemId}`, { quantity })
}

export async function deleteCartItem(cartItemId: number): Promise<ApiResponse<boolean>> {
  return apiDelete<boolean>(`/cart/${cartItemId}`)
}


