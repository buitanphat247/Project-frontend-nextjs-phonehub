import { ApiResponse, PaginatedResponse } from './config';
import { apiGet } from '../utils/apiClient';
import { CACHE_CONFIG } from '../utils/cache';

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
  quantity?: number;
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
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet<PaginatedResponse<ProductResponse>>(`/products?${queryParams}`, {
    cache: true,
    cacheTTL: CACHE_CONFIG.PRODUCTS_TTL,
    cacheTags: ['products'],
  });
}

// Search products by name with pagination (optional categoryId for more accurate filtering)
export async function searchProducts(
  name: string,
  page: number = 0,
  size: number = 10,
  categoryId?: number
): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
  const queryParams = new URLSearchParams({
    name: name,
    page: page.toString(),
    size: size.toString(),
  });

  // Add categoryId if provided
  if (categoryId !== undefined) {
    queryParams.set('categoryId', categoryId.toString());
  }

  return apiGet<PaginatedResponse<ProductResponse>>(`/products/search?${queryParams}`);
}

// Get product by ID
export async function getProductById(id: number): Promise<ApiResponse<ProductResponse>> {
  return apiGet<ProductResponse>(`/products/${id}`, {
    cache: true,
    cacheTTL: CACHE_CONFIG.PRODUCTS_TTL,
    cacheTags: ['products', `product-${id}`],
  });
}

// Get published products by category ID with pagination
export async function getProductsByCategory(
  categoryId: number,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  return apiGet<PaginatedResponse<ProductResponse>>(`/products/published/category/${categoryId}?${queryParams}`, {
    cache: true,
    cacheTTL: CACHE_CONFIG.PRODUCTS_TTL,
    cacheTags: ['products', `category-${categoryId}`],
  });
}

// Get published products by brand with pagination (optional categoryId for more precise filtering)
export async function getProductsByBrand(
  brand: string,
  page: number = 0,
  size: number = 10,
  categoryId?: number
): Promise<ApiResponse<PaginatedResponse<ProductResponse>>> {
  const queryParams = new URLSearchParams({
    brand: brand,
    page: page.toString(),
    size: size.toString(),
  });

  // Add categoryId if provided
  if (categoryId !== undefined) {
    queryParams.set('categoryId', categoryId.toString());
  }

  return apiGet<PaginatedResponse<ProductResponse>>(`/products/published/brand?${queryParams}`);
}

// Get brands by category ID
export async function getBrandsByCategory(categoryId: number): Promise<ApiResponse<string[]>> {
  return apiGet<string[]>(`/products/brands/category/${categoryId}`, {
    cache: true,
    cacheTTL: CACHE_CONFIG.CATEGORIES_TTL,
    cacheTags: ['brands', `category-${categoryId}`],
  });
}

