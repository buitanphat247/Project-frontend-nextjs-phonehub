'use client';

import { User } from '../interface/IUser';
import UserDetailsModal from './UserDetailsModal';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';

interface UserModalsProps {
  selectedUser: User | null;
  modalVisible: boolean;
  createModalVisible: boolean;
  editModalVisible: boolean;
  onCloseViewModal: () => void;
  onCloseCreateModal: () => void;
  onCloseEditModal: () => void;
  onCreateUser: (values: Partial<User>) => void;
  onEditUser: (values: Partial<User>) => void;
}

export default function UserModals({
  selectedUser,
  modalVisible,
  createModalVisible,
  editModalVisible,
  onCloseViewModal,
  onCloseCreateModal,
  onCloseEditModal,
  onCreateUser,
  onEditUser,
}: UserModalsProps) {
  return (
    <>
      <UserDetailsModal user={selectedUser} visible={modalVisible} onClose={onCloseViewModal} />
      <CreateUserModal visible={createModalVisible} onClose={onCloseCreateModal} onSubmit={onCreateUser} />
      <EditUserModal user={selectedUser} visible={editModalVisible} onClose={onCloseEditModal} onSubmit={onEditUser} />
    </>
  );
}

