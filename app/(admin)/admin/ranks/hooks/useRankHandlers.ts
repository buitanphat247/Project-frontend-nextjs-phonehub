import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { Rank } from '../interface/IRank';
import { getUserRanks, createRank, updateRank, deleteRank } from '../../../../../lib/api/ranks';
import type { RankResponse } from '../../../../../lib/api/ranks';

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

export function useRankHandlers() {
  const router = useRouter();
  const urlParams = getUrlParams();
  
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(urlParams.search);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);
  
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
    const newUrl = `/admin/ranks${queryString ? `?${queryString}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Fetch ranks from API (array response, client-side pagination)
  const fetchRanks = async () => {
    try {
      setLoading(true);
      const response = await getUserRanks();
      
      if (response.success && response.data) {
        // Transform API response to Rank format
        const transformedRanks: Rank[] = response.data.map((rank: RankResponse) => ({
          id: rank.id,
          name: rank.name,
          minPoints: rank.minPoints,
          maxPoints: rank.maxPoints,
          discountPercent: rank.discountPercent || rank.discount,
          createdAt: rank.createdAt,
          updatedAt: rank.updatedAt,
        }));
        
        setRanks(transformedRanks);
        setTotalElements(transformedRanks.length);
      }
    } catch (error: any) {
      console.error('Error fetching ranks:', error);
      message.error('Không thể tải danh sách xếp hạng: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  // Load ranks on mount
  useEffect(() => {
    const params = getUrlParams();
    setCurrentPage(params.page);
    setPageSize(params.size);
    setSearchText(params.search);
    fetchRanks();
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

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(0);
    updateUrlParams(0, pageSize, value);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteRank(id);
      if (response.success) {
        message.success('Xóa xếp hạng thành công');
        await fetchRanks();
      } else {
        message.error(response.message || 'Không thể xóa xếp hạng');
      }
    } catch (error: any) {
      console.error('Error deleting rank:', error);
      message.error('Không thể xóa xếp hạng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleView = (rank: Rank) => {
    setSelectedRank(rank);
    setModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setModalVisible(false);
    setSelectedRank(null);
  };

  const handleCreateClick = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleEditClick = (rank: Rank) => {
    setSelectedRank(rank);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedRank(null);
  };

  const handleCreateRank = async (values: Partial<Rank>) => {
    try {
      if (!values.name || values.minPoints === undefined) {
        message.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
        return;
      }

      // Map discountPercent to discount for API
      const response = await createRank({
        name: values.name,
        minPoints: values.minPoints,
        maxPoints: values.maxPoints,
        discount: values.discountPercent,
      });

      if (response.success) {
        message.success('Tạo xếp hạng thành công');
        setCreateModalVisible(false);
        await fetchRanks();
      } else {
        message.error(response.message || 'Không thể tạo xếp hạng');
      }
    } catch (error: any) {
      console.error('Error creating rank:', error);
      message.error('Không thể tạo xếp hạng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleEditRank = async (values: Partial<Rank>) => {
    try {
      if (!selectedRank) {
        message.error('Không tìm thấy xếp hạng cần cập nhật');
        return;
      }

      if (!values.name || values.minPoints === undefined) {
        message.error('Vui lòng nhập đầy đủ thông tin bắt buộc (Tên và Điểm tối thiểu)');
        return;
      }

      const response = await updateRank(selectedRank.id, {
        name: values.name,
        minPoints: values.minPoints,
        maxPoints: values.maxPoints,
        discount: values.discountPercent,
      });

      if (response.success) {
        message.success('Cập nhật xếp hạng thành công');
        setEditModalVisible(false);
        setSelectedRank(null);
        await fetchRanks();
      } else {
        message.error(response.message || 'Không thể cập nhật xếp hạng');
      }
    } catch (error: any) {
      console.error('Error updating rank:', error);
      message.error('Không thể cập nhật xếp hạng: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handlePageChange = (page: number, size: number) => {
    const apiPage = page - 1; // Ant Design pagination is 1-based, API is 0-based
    setCurrentPage(apiPage);
    setPageSize(size);
    updateUrlParams(apiPage, size, searchText);
  };

  // Filter ranks based on search text
  const filteredRanks = ranks.filter(rank =>
    rank.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Client-side pagination
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRanks = filteredRanks.slice(startIndex, endIndex);

  return {
    ranks: paginatedRanks,
    loading,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedRank,
    currentPage,
    pageSize,
    totalElements: filteredRanks.length,
    handleSearch,
    handleDelete,
    handleView,
    handleCloseViewModal,
    handleCreateClick,
    handleCloseCreateModal,
    handleEditClick,
    handleCloseEditModal,
    handleCreateRank,
    handleEditRank,
    handlePageChange,
    fetchRanks,
  };
}

