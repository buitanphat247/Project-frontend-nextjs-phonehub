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

