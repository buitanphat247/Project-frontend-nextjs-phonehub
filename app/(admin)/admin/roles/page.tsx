'use client';

import RolesHeader from './components/RolesHeader';
import RolesTable from './components/RolesTable';
import RoleModals from './components/RoleModals';
import { useRoleHandlers } from './hooks/useRoleHandlers';

export default function RolesPage() {
  const {
    roles,
    searchText,
    modalVisible,
    createModalVisible,
    editModalVisible,
    selectedRole,
    handleSearch,
    handleDelete,
    handleView,
    handleCloseViewModal,
    handleCreateClick,
    handleCloseCreateModal,
    handleEditClick,
    handleCloseEditModal,
    handleCreateRole,
    handleEditRole,
  } = useRoleHandlers();

  return (
    <div>
      <RolesHeader searchValue={searchText} onSearchChange={handleSearch} onCreateClick={handleCreateClick} />
      <RolesTable roles={roles} searchText={searchText} onView={handleView} onEdit={handleEditClick} onDelete={handleDelete} />
      <RoleModals
        selectedRole={selectedRole}
        modalVisible={modalVisible}
        createModalVisible={createModalVisible}
        editModalVisible={editModalVisible}
        onCloseViewModal={handleCloseViewModal}
        onCloseCreateModal={handleCloseCreateModal}
        onCloseEditModal={handleCloseEditModal}
        onCreateRole={handleCreateRole}
        onEditRole={handleEditRole}
      />
    </div>
  );
}
