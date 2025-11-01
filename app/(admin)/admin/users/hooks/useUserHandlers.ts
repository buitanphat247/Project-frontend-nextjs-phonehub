import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { User } from '../interface/IUser';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../../lib/api/users';
import type { UserResponse } from '../../../../../lib/api/users';

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

export function useUserHandlers() {
  const router = useRouter();
  const urlParams = getUrlParams();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(urlParams.search);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
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
    const newUrl = `/admin/users${queryString ? `?${queryString}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Fetch users from API
  const fetchUsers = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await getUsers(page, size);
      
      if (response.success && response.data) {
        // Transform API response to User format
        const transformedUsers: User[] = response.data.content.map((user: UserResponse) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone || '',
          address: user.address || '',
          avatar: user.avatar || '',
          roleId: user.role?.id || 0,
          roleName: user.role?.name || '',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }));
        
        setUsers(transformedUsers);
        setTotalElements(response.data.totalElements);
        setCurrentPage(response.data.number);
        setPageSize(response.data.size);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount and sync with URL params
  useEffect(() => {
    const params = getUrlParams();
    setCurrentPage(params.page);
    setPageSize(params.size);
    setSearchText(params.search);
    fetchUsers(params.page, params.size);
  }, []);

  // Listen for URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = getUrlParams();
      setCurrentPage(params.page);
      setPageSize(params.size);
      setSearchText(params.search);
      fetchUsers(params.page, params.size);
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
      await deleteUser(id);
      message.success('Xóa người dùng thành công');
      await fetchUsers(currentPage, pageSize);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      message.error('Không thể xóa người dùng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleCreateClick = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedUser(null);
  };

  const handleCreateUser = async (values: any) => {
    try {
      if (!values.username || !values.email || !values.roleId || !values.password) {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      await createUser({
        username: values.username,
        password: values.password,
        email: values.email,
        phone: values.phone,
        address: values.address,
        roleId: values.roleId,
      });
      
      message.success('Tạo người dùng thành công');
      setCreateModalVisible(false);
      await fetchUsers(currentPage, pageSize);
    } catch (error: any) {
      console.error('Error creating user:', error);
      message.error('Không thể tạo người dùng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleEditUser = async (values: Partial<User>) => {
    try {
      if (!selectedUser) {
        message.error('Không tìm thấy người dùng');
        return;
      }

      await updateUser(selectedUser.id, {
        username: values.username,
        email: values.email,
        phone: values.phone,
        address: values.address,
        roleId: values.roleId,
      });
      
      message.success('Cập nhật người dùng thành công');
      setEditModalVisible(false);
      setSelectedUser(null);
      await fetchUsers(currentPage, pageSize);
    } catch (error: any) {
      console.error('Error updating user:', error);
      message.error('Không thể cập nhật người dùng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handlePageChange = (page: number, size: number) => {
    const apiPage = page - 1; // Ant Design pagination is 1-based, API is 0-based
    setCurrentPage(apiPage);
    setPageSize(size);
    updateUrlParams(apiPage, size, searchText);
    fetchUsers(apiPage, size);
  };

  // Filter users based on search text
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    users: filteredUsers,
    loading,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedUser,
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
    handleCreateUser,
    handleEditUser,
    handlePageChange,
    fetchUsers,
  };
}
