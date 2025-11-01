import { buildApiUrl, defaultFetchOptions, ApiResponse, PaginatedResponse } from './config';

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
  const url = buildApiUrl('/categories');
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

// Get category by ID
export async function getCategoryById(id: number): Promise<ApiResponse<CategoryResponse>> {
  const url = buildApiUrl(`/categories/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.statusText}`);
  }

  return response.json();
}

// Create category
export async function createCategory(categoryData: {
  name: string;
  slug: string;
}): Promise<ApiResponse<CategoryResponse>> {
  const url = buildApiUrl('/categories');
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create category: ${response.statusText}`);
  }

  return response.json();
}

// Update category
export async function updateCategory(id: number, categoryData: {
  name?: string;
  slug?: string;
}): Promise<ApiResponse<CategoryResponse>> {
  const url = buildApiUrl(`/categories/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update category: ${response.statusText}`);
  }

  return response.json();
}

// Delete category
export async function deleteCategory(id: number): Promise<ApiResponse<void>> {
  const url = buildApiUrl(`/categories/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete category: ${response.statusText}`);
  }

  return response.json();
}

// Get all categories without pagination (for dropdowns)
export async function getAllCategories(): Promise<ApiResponse<CategoryResponse[]>> {
  const url = buildApiUrl('/categories');
  // Request a large size to get all categories
  const queryParams = new URLSearchParams({
    page: '0',
    size: '1000',
  });

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Transform paginated response to array
  if (result.success && result.data && result.data.content) {
    return {
      ...result,
      data: result.data.content,
    };
  }

  return result;
}

