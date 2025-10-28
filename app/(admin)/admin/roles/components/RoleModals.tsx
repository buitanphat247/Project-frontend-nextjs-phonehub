'use client';

import { Role } from '../interface/IRole';
import RoleDetailsModal from './RoleDetailsModal';
import CreateRoleModal from './CreateRoleModal';
import EditRoleModal from './EditRoleModal';

interface RoleModalsProps {
  selectedRole: Role | null;
  modalVisible: boolean;
  createModalVisible: boolean;
  editModalVisible: boolean;
  onCloseViewModal: () => void;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCreateRole: (values: Partial<Role>) => void;
  onEditRole: (values: Partial<Role>) => void;
}

export default function RoleModals({
  selectedRole,
  modalVisible,
  createModalVisible,
  editModalVisible,
  onCloseViewModal,
  onCloseCreateModal,
  onCloseEditModal,
  onCreateRole,
  onEditRole,
}: RoleModalsProps) {
  return (
    <>
      <RoleDetailsModal role={selectedRole} visible={modalVisible} onClose={onCloseViewModal} />
      <CreateRoleModal visible={createModalVisible} onClose={onCloseCreateModal} onSubmit={onCreateRole} />
      <EditRoleModal role={selectedRole} visible={editModalVisible} onClose={onCloseEditModal} onSubmit={onEditRole} />
    </>
  );
}
