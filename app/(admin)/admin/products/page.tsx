'use client';

import React, { useState } from 'react';
import { message } from 'antd';
import ProductsHeader from './components/ProductsHeader';
import ProductsTable from './components/ProductsTable';
import ProductDetailsModal from './components/ProductDetailsModal';
import { Product } from './interface/IProduct';
import { mockProducts } from './mock/productsData';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    message.success('Xóa sản phẩm thành công');
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

  return (
    <div>
      <ProductsHeader 
        searchValue={searchText} 
        onSearchChange={handleSearch}
        onCreateClick={handleCreateClick}
      />
      <ProductsTable 
        products={products} 
        searchText={searchText}
        onView={handleView}
        onDelete={handleDelete}
      />
      <ProductDetailsModal 
        product={selectedProduct}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
}

