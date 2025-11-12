import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { Order, OrderItem } from '../interface/IOrder';
import { getOrdersSuccess, getOrderItems } from '../../../../../lib/api/orders';
import type { OrdersPage, OrderItemsPage } from '../../../../../lib/api/orders';

const getUrlParams = () => {
  if (typeof window === 'undefined') return { page: 0, size: 10 };
  const params = new URLSearchParams(window.location.search);
  return {
    page: parseInt(params.get('page') || '0'),
    size: parseInt(params.get('size') || '10'),
  };
};

export function useOrderHandlers() {
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  const updateUrlParams = useCallback((page: number, size: number) => {
    const params = new URLSearchParams();
    if (page > 0) params.set('page', page.toString());
    if (size !== 10) params.set('size', size.toString());
    const queryString = params.toString();
    const newUrl = `/admin/orders${queryString ? `?${queryString}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [router]);

  const transformOrders = useCallback((content: any[]): Order[] => {
    return content.map((order: any) => ({
      id: order.id,
      userId: order.userId,
      username: order.username,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      buyerPhone: order.buyerPhone,
      buyerAddress: order.buyerAddress,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items || null,
    }));
  }, []);

  const fetchOrders = useCallback(async (page: number, size: number) => {
    try {
      setPaging(false);
      setLoading(true);
      const response = await getOrdersSuccess({ page, size });
      
      if (!response.success || !response.data || !Array.isArray(response.data.content)) {
        const fallbackMessage = response.message || 'Không thể tải danh sách đơn hàng';
        message.error(fallbackMessage);
        setOrders([]);
        setTotalElements(0);
        setCurrentPage(page);
        setPageSize(size);
        return;
      }

      setOrders(transformOrders(response.data.content));
      setTotalElements(response.data.totalElements ?? 0);
      setCurrentPage(response.data.number ?? page);
      setPageSize(response.data.size ?? size);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải danh sách đơn hàng: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  }, [transformOrders]);

  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const previousPageRef = useRef<number>(0);
  const previousPageSizeRef = useRef<number>(10);

  useEffect(() => {
    const params = getUrlParams();
    setCurrentPage(params.page);
    setPageSize(params.size);
    previousPageRef.current = params.page;
    previousPageSizeRef.current = params.size;
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = getUrlParams();
      setCurrentPage(params.page);
      setPageSize(params.size);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      setPaging(false);
    }

    const isPageChange = previousPageRef.current !== currentPage;
    const isPageSizeChange = previousPageSizeRef.current !== pageSize;
    
    if (isPageChange || isPageSizeChange) {
      setPaging(true);
      previousPageRef.current = currentPage;
      previousPageSizeRef.current = pageSize;
    }

    const performFetch = () => {
      fetchOrders(currentPage, pageSize);
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      performFetch();
    } else {
      const delay = isPageChange || isPageSizeChange ? 200 : 0;
      fetchTimeoutRef.current = setTimeout(performFetch, delay);
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        setPaging(false);
      }
    };
  }, [currentPage, pageSize, fetchOrders]);

  const handleView = async (order: Order) => {
    try {
      setSelectedOrder(order);
      setModalVisible(true);
      setItemsLoading(true);
      setOrderItems([]);
      
      // Fetch order items when modal opens
      const response = await getOrderItems(order.id, { page: 0, size: 100 });
      
      if (!response.success || !response.data || !Array.isArray(response.data.content)) {
        message.error(response.message || 'Không thể tải chi tiết đơn hàng');
        setOrderItems([]);
        return;
      }

      setOrderItems(response.data.content);
    } catch (error: any) {
      console.error('Error fetching order items:', error);
      message.error('Không thể tải chi tiết đơn hàng: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setItemsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const handlePageChange = (page: number, size: number) => {
    const apiPage = page - 1;
    setCurrentPage(apiPage);
    setPageSize(size);
    updateUrlParams(apiPage, size);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setSearching(false);
  };

  // Filter orders based on search text (client-side)
  const filteredOrders = searchText.trim()
    ? orders.filter((order) => {
        const keyword = searchText.trim().toLowerCase();
        return (
          order.buyerName?.toLowerCase().includes(keyword) ||
          order.buyerEmail?.toLowerCase().includes(keyword) ||
          order.buyerPhone?.toLowerCase().includes(keyword) ||
          order.buyerAddress?.toLowerCase().includes(keyword) ||
          String(order.id).includes(keyword) ||
          order.username?.toLowerCase().includes(keyword)
        );
      })
    : orders;

  const displayedTotal = searchText.trim() ? filteredOrders.length : totalElements;

  return {
    orders: filteredOrders,
    loading: loading || paging,
    paging,
    searching,
    searchText,
    modalVisible,
    selectedOrder,
    orderItems,
    itemsLoading,
    currentPage,
    pageSize,
    totalElements: displayedTotal,
    handleView,
    handleCloseModal,
    handlePageChange,
    handleSearch,
  };
}

