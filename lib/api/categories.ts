import { ApiResponse, PaginatedResponse } from './config';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';

// Category interface matching API response
export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Get categories with pagination
export async function getCategories(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<CategoryResponse>>> {
  return apiGet<PaginatedResponse<CategoryResponse>>(`/categories?page=${page}&size=${size}`);
}

// Get category by ID
export async function getCategoryById(id: number): Promise<ApiResponse<CategoryResponse>> {
  return apiGet<CategoryResponse>(`/categories/${id}`);
}

// Create category
export async function createCategory(categoryData: {
  name: string;
  slug: string;
}): Promise<ApiResponse<CategoryResponse>> {
  return apiPost<CategoryResponse>('/categories', categoryData);
}

// Update category
export async function updateCategory(id: number, categoryData: {
  name?: string;
  slug?: string;
}): Promise<ApiResponse<CategoryResponse>> {
  return apiPut<CategoryResponse>(`/categories/${id}`, categoryData);
}

// Delete category
export async function deleteCategory(id: number): Promise<ApiResponse<void>> {
  return apiDelete<void>(`/categories/${id}`);
}

// Get all categories without pagination (for dropdowns)
export async function getAllCategories(): Promise<ApiResponse<CategoryResponse[]>> {
  const result = await apiGet<PaginatedResponse<CategoryResponse>>('/categories?page=0&size=1000');
  
  // Transform paginated response to array
  if (result.success && result.data && result.data.content) {
    return {
      ...result,
      data: result.data.content,
    } as ApiResponse<CategoryResponse[]>;
  }

  return {
    ...result,
    data: [],
  } as ApiResponse<CategoryResponse[]>;
}

