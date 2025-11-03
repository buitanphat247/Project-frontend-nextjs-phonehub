'use client';

import RanksHeader from './components/RanksHeader';
import RanksTable from './components/RanksTable';
import RankModals from './components/RankModals';
import { useRankHandlers } from './hooks/useRankHandlers';

export default function RanksPage() {
  const {
    ranks,
    loading,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedRank,
    currentPage,
    pageSize,
    totalElements,
    handleSearch,
    handleDelete,
    handleView,
    handleCloseViewModal,
    handleCreateClick,
    handleCloseCreateModal,
    handleEditClick,
    handleCloseEditModal,
    handleCreateRank,
    handleEditRank,
    handlePageChange,
  } = useRankHandlers();

  return (
    <div className="space-y-4">
      <RanksHeader 
        searchValue={searchText}
        onSearchChange={handleSearch} 
        onCreateClick={handleCreateClick} 
      />
      <RanksTable 
        ranks={ranks} 
        searchText={searchText}
        loading={loading}
        currentPage={currentPage + 1}
        pageSize={pageSize}
        total={totalElements}
        onView={handleView} 
        onEdit={handleEditClick} 
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />
      <RankModals
        selectedRank={selectedRank}
        modalVisible={modalVisible}
        createModalVisible={createModalVisible}
        editModalVisible={editModalVisible}
        onCloseViewModal={handleCloseViewModal}
        onCloseCreateModal={handleCloseCreateModal}
        onCloseEditModal={handleCloseEditModal}
        onCreateRank={handleCreateRank}
        onEditRank={handleEditRank}
      />
    </div>
  );
}

