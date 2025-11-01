import { useState, useEffect } from 'react';
import { message } from 'antd';
import { Role } from '../interface/IRole';
import { getRoles, createRole, updateRole, deleteRole } from '../../../../../lib/api/roles';
import type { RoleResponse } from '../../../../../lib/api/roles';

export function useRoleHandlers() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

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

  // Load roles on mount and when pagination changes
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    // Reset to first page when searching
    setCurrentPage(0);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      message.success('Xóa vai trò thành công');
      // Reload roles after deletion
      await fetchRoles(currentPage, pageSize);
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
    } catch (error: any) {
      console.error('Error updating role:', error);
      message.error('Không thể cập nhật vai trò: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page - 1); // Ant Design pagination is 1-based, API is 0-based
    setPageSize(size);
    fetchRoles(page - 1, size);
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
