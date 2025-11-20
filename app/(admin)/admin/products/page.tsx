'use client';

import ProductsHeader from './components/ProductsHeader';
import ProductsTable from './components/ProductsTable';
import ProductDetailsModal from './components/ProductDetailsModal';
import { useProductHandlers } from './hooks/useProductHandlers';

export default function ProductsPage() {
  const {
    products,
    loading,
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
  } = useProductHandlers();

  return (
    <div>
      <ProductsHeader 
        searchValue={searchText}
        searching={searching}
        onSearchChange={handleSearch}
        onCreateClick={handleCreateClick}
      />
      <ProductsTable 
        products={products} 
        searchText={searchText}
        loading={loading}
        currentPage={currentPage + 1}
        pageSize={pageSize}
        total={totalElements}
        onView={handleView}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />
      <ProductDetailsModal 
        product={selectedProduct}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
}

