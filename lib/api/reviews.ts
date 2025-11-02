import { ApiResponse, PaginatedResponse } from './config';
import { apiGet, apiPost } from '../utils/apiClient';
import { getAuthData } from '../utils/cookie';

// User interface for nested user in review
export interface ReviewUserResponse {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  birthday?: string;
  role: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Product interface for nested product in review
export interface ReviewProductResponse {
  id: number;
  name: string;
  slug: string;
  brand: string;
  category: {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
  price: number;
  priceOld?: number;
  discount?: string;
  thumbnailImage: string;
  quantity?: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Review interface matching API response
export interface ReviewResponse {
  id: number;
  productId: number;
  userId: number;
  product?: ReviewProductResponse;
  user?: ReviewUserResponse;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Request interface for creating review
export interface CreateReviewRequest {
  productId: number;
  userId: number;
  rating: number;
  comment: string;
}

/**
 * Get reviews by product ID with pagination
 */
export async function getReviewsByProductId(
  productId: number,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedResponse<ReviewResponse>>> {
  return apiGet<PaginatedResponse<ReviewResponse>>(
    `/product-reviews/product/${productId}?page=${page}&size=${size}`
  );
}

/**
 * Create a new review
 */
export async function createReview(
  reviewData: Omit<CreateReviewRequest, 'userId'>
): Promise<ApiResponse<ReviewResponse | null>> {
  const authData = getAuthData();
  if (!authData?.userId) {
    return {
      success: false,
      message: 'Vui lòng đăng nhập để đánh giá',
      data: null,
      statusCode: 401,
      timestamp: new Date().toISOString(),
    };
  }

  const userId = parseInt(authData.userId, 10);
  const payload: CreateReviewRequest = {
    ...reviewData,
    userId,
  };

  return apiPost<ReviewResponse>('/product-reviews', payload);
}

