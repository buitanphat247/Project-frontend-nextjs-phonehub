import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { Role } from '../interface/IRole';
import { getRoles, createRole, updateRole, deleteRole } from '../../../../../lib/api/roles';
import type { RoleResponse } from '../../../../../lib/api/roles';
import { notifyRoleChanged } from '../../users/hooks/useRolesForSelect';

// Helper to get URL params
const getUrlParams = () => {
  if (typeof window === 'undefined') return { page: 0, size: 10, search: '' };
  const params = new URLSearchParams(window.location.search);
  return {
    page: parseInt(params.get('page') || '0'),
    size: parseInt(params.get('size') || '10'),
    search: params.get('search') || '',
  };
};

export function useRoleHandlers() {
  const router = useRouter();
  const urlParams = getUrlParams();
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(urlParams.search);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Pagination state - initialized from URL
  const [currentPage, setCurrentPage] = useState(urlParams.page);
  const [pageSize, setPageSize] = useState(urlParams.size);
  const [totalElements, setTotalElements] = useState(0);
  
  // Update URL when pagination changes
  const updateUrlParams = useCallback((page: number, size: number, search: string) => {
    const params = new URLSearchParams();
    if (page > 0) params.set('page', page.toString());
    if (size !== 10) params.set('size', size.toString());
    if (search) params.set('search', search);
    const queryString = params.toString();
    const newUrl = `/admin/roles${queryString ? `?${queryString}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Fetch roles from API
  const fetchRoles = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await getRoles(page, size);
      
      if (response.success && response.data) {
        // Transform API response to Role format
        const transformedRoles: Role[] = response.data.content.map((role: RoleResponse) => ({
          id: role.id,
          name: role.name,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        }));
        
        setRoles(transformedRoles);
        setTotalElements(response.data.totalElements);
        setCurrentPage(response.data.number);
        setPageSize(response.data.size);
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      message.error('Không thể tải danh sách vai trò: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  // Load roles on mount and sync with URL params
  useEffect(() => {
    const params = getUrlParams();
    setCurrentPage(params.page);
    setPageSize(params.size);
    setSearchText(params.search);
    fetchRoles(params.page, params.size);
  }, []);

  // Listen for URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = getUrlParams();
      setCurrentPage(params.page);
      setPageSize(params.size);
      setSearchText(params.search);
      fetchRoles(params.page, params.size);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(0);
    updateUrlParams(0, pageSize, value);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      message.success('Xóa vai trò thành công');
      // Reload roles after deletion
      await fetchRoles(currentPage, pageSize);
      // Notify other components that roles have changed
      notifyRoleChanged();
    } catch (error: any) {
      console.error('Error deleting role:', error);
      message.error('Không thể xóa vai trò: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setModalVisible(false);
    setSelectedRole(null);
  };

  const handleCreateClick = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedRole(null);
  };

  const handleCreateRole = async (values: Partial<Role>) => {
    try {
      if (!values.name) {
        message.error('Vui lòng nhập tên vai trò');
        return;
      }

      await createRole(values.name);
      message.success('Tạo vai trò thành công');
      setCreateModalVisible(false);
      // Reload roles after creation
      await fetchRoles(currentPage, pageSize);
      // Notify other components that roles have changed
      notifyRoleChanged();
    } catch (error: any) {
      console.error('Error creating role:', error);
      message.error('Không thể tạo vai trò: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleEditRole = async (values: Partial<Role>) => {
    try {
      if (!selectedRole || !values.name) {
        message.error('Vui lòng nhập tên vai trò');
        return;
      }

      await updateRole(selectedRole.id, values.name);
      message.success('Cập nhật vai trò thành công');
      setEditModalVisible(false);
      setSelectedRole(null);
      // Reload roles after update
      await fetchRoles(currentPage, pageSize);
      // Notify other components that roles have changed
      notifyRoleChanged();
    } catch (error: any) {
      console.error('Error updating role:', error);
      message.error('Không thể cập nhật vai trò: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handlePageChange = (page: number, size: number) => {
    const apiPage = page - 1; // Ant Design pagination is 1-based, API is 0-based
    setCurrentPage(apiPage);
    setPageSize(size);
    updateUrlParams(apiPage, size, searchText);
    fetchRoles(apiPage, size);
  };

  // Filter roles based on search text
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    roles: filteredRoles,
    loading,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedRole,
    currentPage,
    pageSize,
    totalElements,
    handleSearch,
    handleDelete,
    handleView,
    handleCloseViewModal,
    handleCreateClick,
    handleCloseCreateModal,
    handleEditClick,
    handleCloseEditModal,
    handleCreateRole,
    handleEditRole,
    handlePageChange,
    fetchRoles,
  };
}
