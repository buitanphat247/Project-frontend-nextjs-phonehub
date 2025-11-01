import { buildApiUrl, defaultFetchOptions, ApiResponse, PaginatedResponse } from './config';

// Category interface for nested category in product
export interface ProductCategoryResponse {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Specification interface
export interface ProductSpecificationResponse {
  id: number;
  productId: number;
  groupName: string;
  label: string;
  value: string | string[];
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Color interface
export interface ProductColorResponse {
  id: number;
  productId: number;
  name: string;
  slug: string;
  hexColor: string;
  createdAt: string;
  updatedAt: string;
}

// Product Image interface
export interface ProductImageResponse {
  id: number;
  productId: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// Product interface matching API response
export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategoryResponse;
  price: number;
  priceOld: number;
  discount: string;
  thumbnailImage: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  specifications?: ProductSpecificationResponse[];
  colors?: ProductColorResponse[];
  images?: ProductImageResponse[];
}

// Get products with pagination
export async function getProducts(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
  const url = buildApiUrl('/products');
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

// Search products by name with pagination (optional categoryId for more accurate filtering)
export async function searchProducts(
  name: string,
  page: number = 0,
  size: number = 10,
  categoryId?: number
): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
  const url = buildApiUrl('/products/search');
  const queryParams = new URLSearchParams({
    name: name,
    page: page.toString(),
    size: size.toString(),
  });

  // Add categoryId if provided
  if (categoryId !== undefined) {
    queryParams.set('categoryId', categoryId.toString());
  }

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.statusText}`);
  }

  return response.json();
}

// Get product by ID
export async function getProductById(id: number): Promise<ApiResponse<ProductResponse>> {
  const url = buildApiUrl(`/products/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

// Get published products by category ID with pagination
export async function getProductsByCategory(
  categoryId: number,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
  const url = buildApiUrl(`/products/published/category/${categoryId}`);
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products by category: ${response.statusText}`);
  }

  return response.json();
}

// Get published products by brand with pagination (optional categoryId for more precise filtering)
export async function getProductsByBrand(
  brand: string,
  page: number = 0,
  size: number = 10,
  categoryId?: number
): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
  const url = buildApiUrl('/products/published/brand');
  const queryParams = new URLSearchParams({
    brand: brand,
    page: page.toString(),
    size: size.toString(),
  });

  // Add categoryId if provided
  if (categoryId !== undefined) {
    queryParams.set('categoryId', categoryId.toString());
  }

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products by brand: ${response.statusText}`);
  }

  return response.json();
}

// Get brands by category ID
export async function getBrandsByCategory(categoryId: number): Promise<ApiResponse<string[]>> {
  const url = buildApiUrl(`/products/brands/category/${categoryId}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch brands by category: ${response.statusText}`);
  }

  return response.json();
}

