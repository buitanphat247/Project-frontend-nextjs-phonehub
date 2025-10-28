'use client';

import UsersHeader from './components/UsersHeader';
import UsersTable from './components/UsersTable';
import UserModals from './components/UserModals';
import { useUserHandlers } from './hooks/useUserHandlers';

export default function UsersPage() {
  const {
    users,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedUser,
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
  } = useUserHandlers();

  return (
    <div className="space-y-4">
      <UsersHeader searchValue={searchText} onSearchChange={handleSearch} onCreateClick={handleCreateClick} />
      <UsersTable users={users} searchText={searchText} onView={handleView} onEdit={handleEditClick} onDelete={handleDelete} />
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
