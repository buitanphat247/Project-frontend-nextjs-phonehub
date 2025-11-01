import { buildApiUrl, defaultFetchOptions, ApiResponse, PaginatedResponse } from './config';

// Role interface matching API response
export interface RoleResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Get roles with pagination
export async function getRoles(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<RoleResponse>>> {
  const url = buildApiUrl('/roles');
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
  }

  return response.json();
}

// Get role by ID
export async function getRoleById(id: number): Promise<ApiResponse<RoleResponse>> {
  const url = buildApiUrl(`/roles/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch role: ${response.statusText}`);
  }

  return response.json();
}

// Create role
export async function createRole(name: string): Promise<ApiResponse<RoleResponse>> {
  const url = buildApiUrl('/roles');
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create role: ${response.statusText}`);
  }

  return response.json();
}

// Update role
export async function updateRole(id: number, name: string): Promise<ApiResponse<RoleResponse>> {
  const url = buildApiUrl(`/roles/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'PUT',
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update role: ${response.statusText}`);
  }

  return response.json();
}

// Delete role
export async function deleteRole(id: number): Promise<ApiResponse<void>> {
  const url = buildApiUrl(`/roles/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete role: ${response.statusText}`);
  }

  return response.json();
}

// Get all roles without pagination (for dropdowns)
export async function getAllRoles(): Promise<ApiResponse<RoleResponse[]>> {
  const url = buildApiUrl('/roles');
  // Request a large size to get all roles
  const queryParams = new URLSearchParams({
    page: '0',
    size: '1000',
  });

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
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

