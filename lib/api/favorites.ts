import { ApiResponse, PaginatedResponse } from './config';
import { apiGet, apiPost, apiDelete } from '../utils/apiClient';
import type { ProductResponse } from './products';

// Response type for favorite list
export interface FavoriteResponse {
  id: number;
  productId: number;
  userId: number;
  product: ProductResponse;
  createdAt: string;
  updatedAt: string;
}

// Get favorite products list
export async function getFavorites(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<FavoriteResponse>>> {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('size', size.toString());
  return apiGet<PaginatedResponse<FavoriteResponse>>(`/favorites?${params.toString()}`);
}

// Add product to favorites
export async function addToFavorites(productId: number): Promise<ApiResponse<FavoriteResponse>> {
  return apiPost<FavoriteResponse>('/favorites', { productId });
}

// Remove product from favorites
export async function removeFromFavorites(productId: number): Promise<ApiResponse<void>> {
  return apiDelete<void>(`/favorites/product/${productId}`);
}

// Check if product is in favorites
export async function checkFavorite(productId: number): Promise<ApiResponse<boolean>> {
  return apiGet<boolean>(`/favorites/product/${productId}/check`);
}

// Get favorite count for a product
export async function getFavoriteCount(productId: number): Promise<ApiResponse<number>> {
  return apiGet<number>(`/favorites/product/${productId}/count`);
}

