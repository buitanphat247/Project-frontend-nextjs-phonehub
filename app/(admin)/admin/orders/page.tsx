"use client";

import OrdersHeader from "./components/OrdersHeader";
import OrdersTable from "./components/OrdersTable";
import OrderDetailModal from "./components/OrderDetailModal";
import { useOrderHandlers } from "./hooks/useOrderHandlers";

export default function OrdersPage() {
  const {
    orders,
    loading,
    searching,
    searchText,
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
    handleSearch,
  } = useOrderHandlers();

  return (
    <div>
      <OrdersHeader 
        searchValue={searchText}
        searching={searching}
        onSearchChange={handleSearch}
      />
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
