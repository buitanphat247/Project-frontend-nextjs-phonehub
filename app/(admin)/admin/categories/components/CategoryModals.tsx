'use client';

import { Category } from '../interface/ICategory';
import CategoryDetailsModal from './CategoryDetailsModal';
import CreateCategoryModal from './CreateCategoryModal';
import EditCategoryModal from './EditCategoryModal';

interface CategoryModalsProps {
  selectedCategory: Category | null;
  modalVisible: boolean;
  createModalVisible: boolean;
  editModalVisible: boolean;
  onCloseViewModal: () => void;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCreateCategory: (values: Partial<Category>) => void;
  onEditCategory: (values: Partial<Category>) => void;
}

export default function CategoryModals({
  selectedCategory,
  modalVisible,
  createModalVisible,
  editModalVisible,
  onCloseViewModal,
  onCloseCreateModal,
  onCloseEditModal,
  onCreateCategory,
  onEditCategory,
}: CategoryModalsProps) {
  return (
    <>
      <CategoryDetailsModal category={selectedCategory} visible={modalVisible} onClose={onCloseViewModal} />
      <CreateCategoryModal visible={createModalVisible} onClose={onCloseCreateModal} onSubmit={onCreateCategory} />
      <EditCategoryModal category={selectedCategory} visible={editModalVisible} onClose={onCloseEditModal} onSubmit={onEditCategory} />
    </>
  );
}

