import { useState } from 'react';
import { message } from 'antd';
import { Category } from '../interface/ICategory';
import { mockCategories } from '../mock/categoriesData';

export function useCategoryHandlers() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
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

  const handleCreateCategory = (values: Partial<Category>) => {
    const newCategory: Category = {
      id: Math.max(...categories.map(c => c.id)) + 1,
      name: values.name || '',
      slug: values.slug || '',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    setCategories([...categories, newCategory]);
    message.success('Tạo danh mục thành công');
  };

  const handleEditCategory = (values: Partial<Category>) => {
    if (selectedCategory) {
      const updatedCategories = categories.map(category =>
        category.id === selectedCategory.id
          ? { ...category, ...values, updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ') }
          : category
      );
      setCategories(updatedCategories);
      message.success('Cập nhật danh mục thành công');
    }
  };

  return {
    categories,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedCategory,
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
  };
}
