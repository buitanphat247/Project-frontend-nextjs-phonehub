import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { Category } from '../interface/ICategory';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../../../lib/api/categories';
import type { CategoryResponse } from '../../../../../lib/api/categories';

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

export function useCategoryHandlers() {
  const router = useRouter();
  const urlParams = getUrlParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(urlParams.search);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
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
    const newUrl = `/admin/categories${queryString ? `?${queryString}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Fetch categories from API
  const fetchCategories = async (page: number = currentPage, size: number = pageSize) => {
    try {
      setLoading(true);
      const response = await getCategories(page, size);
      
      if (response.success && response.data) {
        // Transform API response to Category format
        const transformedCategories: Category[] = response.data.content.map((category: CategoryResponse) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        }));
        
        setCategories(transformedCategories);
        setTotalElements(response.data.totalElements);
        setCurrentPage(response.data.number);
        setPageSize(response.data.size);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      message.error('Không thể tải danh sách danh mục: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  // Load categories on mount and sync with URL params
  useEffect(() => {
    const params = getUrlParams();
    setCurrentPage(params.page);
    setPageSize(params.size);
    setSearchText(params.search);
    fetchCategories(params.page, params.size);
  }, []);

  // Listen for URL changes (e.g., browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const params = getUrlParams();
      setCurrentPage(params.page);
      setPageSize(params.size);
      setSearchText(params.search);
      fetchCategories(params.page, params.size);
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
      await deleteCategory(id);
      message.success('Xóa danh mục thành công');
      await fetchCategories(currentPage, pageSize);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      message.error('Không thể xóa danh mục: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const handleCreateClick = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedCategory(null);
  };

  const handleCreateCategory = async (values: Partial<Category>) => {
    try {
      if (!values.name || !values.slug) {
        message.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      await createCategory({
        name: values.name,
        slug: values.slug,
      });
      
      message.success('Tạo danh mục thành công');
      setCreateModalVisible(false);
      await fetchCategories(currentPage, pageSize);
    } catch (error: any) {
      console.error('Error creating category:', error);
      message.error('Không thể tạo danh mục: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handleEditCategory = async (values: Partial<Category>) => {
    try {
      if (!selectedCategory) {
        message.error('Không tìm thấy danh mục');
        return;
      }

      await updateCategory(selectedCategory.id, {
        name: values.name,
        slug: values.slug,
      });
      
      message.success('Cập nhật danh mục thành công');
      setEditModalVisible(false);
      setSelectedCategory(null);
      await fetchCategories(currentPage, pageSize);
    } catch (error: any) {
      console.error('Error updating category:', error);
      message.error('Không thể cập nhật danh mục: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const handlePageChange = (page: number, size: number) => {
    const apiPage = page - 1; // Ant Design pagination is 1-based, API is 0-based
    setCurrentPage(apiPage);
    setPageSize(size);
    updateUrlParams(apiPage, size, searchText);
    fetchCategories(apiPage, size);
  };

  // Filter categories based on search text
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    categories: filteredCategories,
    loading,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedCategory,
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
    handleCreateCategory,
    handleEditCategory,
    handlePageChange,
    fetchCategories,
  };
}
