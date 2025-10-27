'use client';

import React, { useState } from 'react';
import { message } from 'antd';
import CategoriesHeader from './components/CategoriesHeader';
import CategoriesTable from './components/CategoriesTable';
import CategoryDetailsModal from './components/CategoryDetailsModal';
import { Category } from './interface/ICategory';
import { mockCategories } from './mock/categoriesData';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    message.success('Xóa danh mục thành công');
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const handleCreateClick = () => {
    message.info('Chức năng tạo danh mục mới đang phát triển');
  };

  return (
    <div>
      <CategoriesHeader 
        searchValue={searchText} 
        onSearchChange={handleSearch}
        onCreateClick={handleCreateClick}
      />
      <CategoriesTable 
        categories={categories} 
        searchText={searchText}
        onView={handleView}
        onDelete={handleDelete}
      />
      <CategoryDetailsModal 
        category={selectedCategory}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
}

