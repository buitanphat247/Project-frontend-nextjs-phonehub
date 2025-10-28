'use client';

import CategoriesHeader from './components/CategoriesHeader';
import CategoriesTable from './components/CategoriesTable';
import CategoryModals from './components/CategoryModals';
import { useCategoryHandlers } from './hooks/useCategoryHandlers';

export default function CategoriesPage() {
  const {
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
  } = useCategoryHandlers();

  return (
    <div>
      <CategoriesHeader searchValue={searchText} onSearchChange={handleSearch} onCreateClick={handleCreateClick} />
      <CategoriesTable categories={categories} searchText={searchText} onView={handleView} onEdit={handleEditClick} onDelete={handleDelete} />
      <CategoryModals
        selectedCategory={selectedCategory}
        modalVisible={modalVisible}
        createModalVisible={createModalVisible}
        editModalVisible={editModalVisible}
        onCloseViewModal={handleCloseViewModal}
        onCloseCreateModal={handleCloseCreateModal}
        onCloseEditModal={handleCloseEditModal}
        onCreateCategory={handleCreateCategory}
        onEditCategory={handleEditCategory}
      />
    </div>
  );
}
