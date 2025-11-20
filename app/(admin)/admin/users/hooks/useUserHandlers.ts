import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { User } from '../interface/IUser';
import { getUsers, searchUsers, createUser, updateUser, deleteUser, getUserById } from '../../../../../lib/api/users';
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
  const [searching, setSearching] = useState(false);
  const [paging, setPaging] = useState(false);
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

  // Helper to transform API response
  const transformUsers = (content: UserResponse[]): User[] => {
    return content.map((user: UserResponse) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || '',
      birthday: user.birthday,
      points: user.points || 0,
      roleId: user.roleId ?? user.role?.id,
      roleName: user.role?.name,
      rankId: user.rankId ?? user.rank?.id,
      rankName: user.rank?.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  };

  // Fetch users from API
  const fetchUsers = async (page: number = currentPage, size: number = pageSize, search: string = searchText) => {
    try {
      setSearching(false);
      setPaging(false);
      setLoading(true);
      let response;
      
      if (search && search.trim()) {
        // Use search API when there's search text
        response = await searchUsers(search.trim(), page, size);
      } else {
        // Use regular get users API when no search text
        response = await getUsers(page, size);
      }
      
      if (response.success && response.data) {
        setUsers(transformUsers(response.data.content));
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

  // Debounce ref for search and pagination
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const previousSearchRef = useRef<string>(urlParams.search);
  const previousPageRef = useRef<number>(urlParams.page);
  const previousPageSizeRef = useRef<number>(urlParams.size);

  // Load users on mount and sync with URL params
  useEffect(() => {
    const params = getUrlParams();
    setCurrentPage(params.page);
    setPageSize(params.size);
    setSearchText(params.search);
    previousSearchRef.current = params.search;
    previousPageRef.current = params.page;
    previousPageSizeRef.current = params.size;
  }, []);

  // Listen for URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = getUrlParams();
      setCurrentPage(params.page);
      setPageSize(params.size);
      setSearchText(params.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch users when search text or pagination changes
  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      setSearching(false);
      setPaging(false);
    }

    // Check what changed
    const isSearchChange = previousSearchRef.current !== searchText;
    const isPageChange = previousPageRef.current !== currentPage;
    const isPageSizeChange = previousPageSizeRef.current !== pageSize;
    
    // Set loading states immediately when values change
    if (isSearchChange) {
      setSearching(true);
      previousSearchRef.current = searchText;
    }
    
    if (isPageChange || isPageSizeChange) {
      setPaging(true);
      previousPageRef.current = currentPage;
      previousPageSizeRef.current = pageSize;
    }

    const performFetch = () => {
      fetchUsers(currentPage, pageSize, searchText);
    };

    // Skip debounce on initial mount for faster load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      performFetch();
    } else {
      // Debounce: 500ms for search, 200ms for pagination
      let delay = 0;
      if (isSearchChange) {
        delay = 500; // Longer debounce for search
      } else if (isPageChange || isPageSizeChange) {
        delay = 200; // Shorter debounce for pagination to make it smoother
      }
      
      fetchTimeoutRef.current = setTimeout(performFetch, delay);
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        setSearching(false);
        setPaging(false);
      }
    };
  }, [searchText, currentPage, pageSize]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(0);
    updateUrlParams(0, pageSize, value);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('Xóa người dùng thành công');
      await fetchUsers(currentPage, pageSize, searchText);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      message.error('Không thể xóa người dùng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleView = async (user: User) => {
    try {
      // Fetch full user details from API
      const response = await getUserById(user.id);
      if (response.success && response.data) {
        const userData = response.data;
        const fullUser: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          avatar: userData.avatar || '',
          birthday: userData.birthday,
          points: userData.points || 0,
          roleId: userData.roleId ?? userData.role?.id,
          roleName: userData.role?.name,
          rankId: userData.rankId ?? userData.rank?.id,
          rankName: userData.rank?.name,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
        setSelectedUser(fullUser);
        setModalVisible(true);
      } else {
        message.error(response.message || 'Không thể tải thông tin người dùng');
      }
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      message.error('Không thể tải thông tin người dùng: ' + (error.message || 'Lỗi không xác định'));
    }
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

  const handleEditClick = async (user: User) => {
    try {
      // Fetch full user details from API to ensure we have roleId
      const response = await getUserById(user.id);
      if (response.success && response.data) {
        const userData = response.data;
        const fullUser: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          avatar: userData.avatar || '',
          birthday: userData.birthday,
          points: userData.points || 0,
          roleId: userData.roleId ?? userData.role?.id,
          roleName: userData.role?.name,
          rankId: userData.rankId ?? userData.rank?.id,
          rankName: userData.rank?.name,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
        setSelectedUser(fullUser);
        setEditModalVisible(true);
      } else {
        // Fallback to using user from table if API call fails
        setSelectedUser(user);
        setEditModalVisible(true);
      }
    } catch (error: any) {
      console.error('Error fetching user details for edit:', error);
      // Fallback to using user from table if API call fails
      setSelectedUser(user);
      setEditModalVisible(true);
    }
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
      await fetchUsers(currentPage, pageSize, searchText);
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
      await fetchUsers(currentPage, pageSize, searchText);
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
  };

  return {
    users,
    loading: loading || searching || paging,
    searching,
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
  };
}
