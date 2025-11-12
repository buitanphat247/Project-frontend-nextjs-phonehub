'use client';

import OrdersHeader from './components/OrdersHeader';
import OrdersTable from './components/OrdersTable';
import OrderDetailModal from './components/OrderDetailModal';
import { useOrderHandlers } from './hooks/useOrderHandlers';

export default function OrdersPage() {
  const {
    orders,
    loading,
    modalVisible,
    selectedOrder,
    orderItems,
    itemsLoading,
    currentPage,
    pageSize,
    totalElements,
    handleView,
    handleCloseModal,
    handlePageChange,
  } = useOrderHandlers();

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: 16 }}>
        <OrdersHeader />
      </div>
      <OrdersTable 
        orders={orders} 
        loading={loading}
        currentPage={currentPage + 1}
        pageSize={pageSize}
        total={totalElements}
        onView={handleView}
        onPageChange={handlePageChange}
      />
      <OrderDetailModal
        order={selectedOrder}
        orderItems={orderItems}
        itemsLoading={itemsLoading}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
}
