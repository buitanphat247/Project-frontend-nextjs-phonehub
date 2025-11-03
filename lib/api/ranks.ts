import { ApiResponse, PaginatedResponse } from './config';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';

export interface RankResponse {
  id: number;
  name: string;
  minPoints: number;
  maxPoints?: number;
  discount?: number;
  discountPercent?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRankRequest {
  name: string;
  minPoints: number;
  maxPoints?: number;
  discount?: number;
}

export interface UpdateRankRequest {
  name: string;
  minPoints: number;
  maxPoints?: number;
  discount?: number;
}

/**
 * Get all user ranks (returns array, not paginated)
 */
export async function getUserRanks(): Promise<ApiResponse<RankResponse[]>> {
  return apiGet<RankResponse[]>('/user-ranks');
}

/**
 * Get all ranks with pagination
 */
export async function getRanks(
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedResponse<RankResponse>>> {
  return apiGet<PaginatedResponse<RankResponse>>(`/ranks?page=${page}&size=${size}`);
}

/**
 * Get a rank by ID
 */
export async function getRankById(id: number): Promise<ApiResponse<RankResponse>> {
  return apiGet<RankResponse>(`/ranks/${id}`);
}

/**
 * Create a new rank
 */
export async function createRank(data: CreateRankRequest): Promise<ApiResponse<RankResponse>> {
  return apiPost<RankResponse>('/user-ranks', data);
}

/**
 * Update a rank
 */
export async function updateRank(id: number, data: UpdateRankRequest): Promise<ApiResponse<RankResponse>> {
  return apiPut<RankResponse>(`/user-ranks/${id}`, data);
}

/**
 * Delete a rank
 */
export async function deleteRank(id: number): Promise<ApiResponse<void>> {
  return apiDelete<void>(`/ranks/${id}`);
}

