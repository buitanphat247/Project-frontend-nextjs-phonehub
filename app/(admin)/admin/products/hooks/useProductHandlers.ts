import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { Product } from '../interface/IProduct';
import { getProducts, searchProducts } from '../../../../../lib/api/products';
import type { ProductResponse } from '../../../../../lib/api/products';

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

export function useProductHandlers() {
  const router = useRouter();
  const urlParams = getUrlParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [paging, setPaging] = useState(false);
  const [searchText, setSearchText] = useState(urlParams.search);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
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
    const newUrl = `/admin/products${queryString ? `?${queryString}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Helper to transform API response
  const transformProducts = (content: ProductResponse[]): Product[] => {
    return content.map((product: ProductResponse) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      categoryId: product.category?.id || 0,
      categoryName: product.category?.name || '',
      price: product.price,
      priceOld: product.priceOld,
      discount: product.discount,
      thumbnailImage: product.thumbnailImage,
      isPublished: product.isPublished,
      publishedAt: product.publishedAt,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  };

  // Fetch products from API
  const fetchProducts = async (page: number = currentPage, size: number = pageSize, search: string = searchText) => {
    try {
      setSearching(false); // Clear searching state when actual fetch starts
      setPaging(false); // Clear paging state when actual fetch starts
      setLoading(true);
      let response;
      
      if (search && search.trim()) {
        // Use search API when there's search text
        response = await searchProducts(search.trim(), page, size);
      } else {
        // Use regular get products API when no search text
        response = await getProducts(page, size);
      }
      
      if (response.success && response.data) {
        setProducts(transformProducts(response.data.content));
        setTotalElements(response.data.totalElements);
        setCurrentPage(response.data.number);
        setPageSize(response.data.size);
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      message.error('Không thể tải danh sách sản phẩm: ' + (error.message || 'Lỗi không xác định'));
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

  // Load products on mount and sync with URL params
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

  // Fetch products when search text or pagination changes
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
      fetchProducts(currentPage, pageSize, searchText);
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

  const handleDelete = (id: number) => {
    message.info('Chức năng xóa sản phẩm đang phát triển');
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleCreateClick = () => {
    message.info('Chức năng tạo sản phẩm mới đang phát triển');
  };

  const handlePageChange = (page: number, size: number) => {
    const apiPage = page - 1; // Ant Design pagination is 1-based, API is 0-based
    setCurrentPage(apiPage);
    setPageSize(size);
    updateUrlParams(apiPage, size, searchText);
  };

  return {
    products,
    loading: loading || searching || paging,
    searching,
    searchText,
    modalVisible,
    selectedProduct,
    currentPage,
    pageSize,
    totalElements,
    handleSearch,
    handleDelete,
    handleView,
    handleCloseModal,
    handleCreateClick,
    handlePageChange,
  };
}

