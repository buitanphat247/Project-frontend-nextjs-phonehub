import { buildApiUrl, defaultFetchOptions, ApiResponse, PaginatedResponse } from './config';

// User interface matching API response
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Get users with pagination
export async function getUsers(page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
  const url = buildApiUrl('/users');
  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
}

// Search users by keyword (username or email) with pagination
export async function searchUsers(
  keyword: string,
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
  const url = buildApiUrl('/users/search');
  const queryParams = new URLSearchParams({
    keyword: keyword,
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`${url}?${queryParams}`, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to search users: ${response.statusText}`);
  }

  return response.json();
}

// Get user by ID
export async function getUserById(id: number): Promise<ApiResponse<UserResponse>> {
  const url = buildApiUrl(`/users/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
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
  const url = buildApiUrl('/users');
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.statusText}`);
  }

  return response.json();
}

// Update user
export async function updateUser(id: number, userData: {
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  roleId?: number;
}): Promise<ApiResponse<UserResponse>> {
  const url = buildApiUrl(`/users/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'PUT',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.statusText}`);
  }

  return response.json();
}

// Delete user
export async function deleteUser(id: number): Promise<ApiResponse<void>> {
  const url = buildApiUrl(`/users/${id}`);
  
  const response = await fetch(url, {
    ...defaultFetchOptions,
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.statusText}`);
  }

  return response.json();
}

