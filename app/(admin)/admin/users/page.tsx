'use client';

import UsersHeader from './components/UsersHeader';
import UsersTable from './components/UsersTable';
import UserModals from './components/UserModals';
import { useUserHandlers } from './hooks/useUserHandlers';

export default function UsersPage() {
  const {
    users,
    loading,
    searching,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedUser,
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
    handleCreateUser,
    handleEditUser,
    handlePageChange,
  } = useUserHandlers();

  return (
    <div className="space-y-4">
      <UsersHeader 
        searchValue={searchText}
        searching={searching}
        onSearchChange={handleSearch} 
        onCreateClick={handleCreateClick} 
      />
      <UsersTable 
        users={users} 
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
      <UserModals
        selectedUser={selectedUser}
        modalVisible={modalVisible}
        createModalVisible={createModalVisible}
        editModalVisible={editModalVisible}
        onCloseViewModal={handleCloseViewModal}
        onCloseCreateModal={handleCloseCreateModal}
        onCloseEditModal={handleCloseEditModal}
        onCreateUser={handleCreateUser}
        onEditUser={handleEditUser}
      />
    </div>
  );
}
