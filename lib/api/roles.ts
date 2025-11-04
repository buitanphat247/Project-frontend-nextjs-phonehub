import { ApiResponse, PaginatedResponse } from './config';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';

// Role interface matching API response
export interface RoleResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Get roles with pagination
export async function getRoles(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<RoleResponse>>> {
  return apiGet<PaginatedResponse<RoleResponse>>(`/roles?page=${page}&size=${size}`);
}

// Get role by ID
export async function getRoleById(id: number): Promise<ApiResponse<RoleResponse>> {
  return apiGet<RoleResponse>(`/roles/${id}`);
}

// Create role
export async function createRole(name: string): Promise<ApiResponse<RoleResponse>> {
  return apiPost<RoleResponse>('/roles', { name });
}

// Update role
export async function updateRole(id: number, name: string): Promise<ApiResponse<RoleResponse>> {
  return apiPut<RoleResponse>(`/roles/${id}`, { name });
}

// Delete role
export async function deleteRole(id: number): Promise<ApiResponse<void>> {
  return apiDelete<void>(`/roles/${id}`);
}

// Get all roles without pagination (for dropdowns)
export async function getAllRoles(): Promise<ApiResponse<RoleResponse[]>> {
  const result = await apiGet<PaginatedResponse<RoleResponse>>('/roles?page=0&size=1000');
  
  // Transform paginated response to array
  if (result.success && result.data && result.data.content) {
    return {
      ...result,
      data: result.data.content,
    } as ApiResponse<RoleResponse[]>;
  }

  return {
    ...result,
    data: [],
  } as ApiResponse<RoleResponse[]>;
}

