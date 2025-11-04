import { ApiResponse, PaginatedResponse } from "./config";
import { apiPut, apiGet, apiPost, apiDelete } from "../utils/apiClient";

// User interface matching API response
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  birthday?: string; // Format: YYYY-MM-DD
  points?: number;
  roleId?: number; // Direct roleId from API (when role object is not present)
  rankId?: number; // Direct rankId from API (when rank object is not present)
  role: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  rank: {
    id: number;
    name: string;
    minPoints: number;
    maxPoints?: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// Get users with pagination
export async function getUsers(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
  return apiGet<PaginatedResponse<UserResponse>>(`/users?page=${page}&size=${size}`);
}

// Search users by keyword (username or email) with pagination
export async function searchUsers(keyword: string, page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
  return apiGet<PaginatedResponse<UserResponse>>(`/users/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
}

// Get user by ID
export async function getUserById(id: number): Promise<ApiResponse<UserResponse>> {
  return apiGet<UserResponse>(`/users/${id}`);
}

// Create user
export async function createUser(userData: {
  username: string;
  password: string;
  email: string;
  phone?: string;
  address?: string;
  roleId: number;
}): Promise<ApiResponse<UserResponse>> {
  return apiPost<UserResponse>("/users", userData);
}

// Update user
export async function updateUser(
  id: number,
  userData: {
    username?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    birthday?: string;
    roleId?: number;
  }
): Promise<ApiResponse<UserResponse>> {
  return apiPut<UserResponse>(`/users/${id}`, userData);
}

// Delete user
export async function deleteUser(id: number): Promise<ApiResponse<void>> {
  return apiDelete<void>(`/users/${id}`);
}
