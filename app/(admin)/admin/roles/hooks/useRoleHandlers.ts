import { useState } from 'react';
import { message } from 'antd';
import { Role } from '../interface/IRole';
import { mockRoles } from '../mock/rolesData';

export function useRoleHandlers() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
    message.success('Xóa vai trò thành công');
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setModalVisible(true);
  }; 

  const handleCloseViewModal = () => {
    setModalVisible(false);
    setSelectedRole(null);
  };

  const handleCreateClick = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedRole(null);
  };

  const handleCreateRole = (values: Partial<Role>) => {
    const newRole: Role = {
      id: Math.max(...roles.map(r => r.id)) + 1,
      name: values.name || '',
      description: '',
      permissions: '',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    setRoles([...roles, newRole]);
    message.success('Tạo vai trò thành công');
  };

  const handleEditRole = (values: Partial<Role>) => {
    if (selectedRole) {
      const updatedRoles = roles.map(role =>
        role.id === selectedRole.id
          ? { ...role, ...values, updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ') }
          : role
      );
      setRoles(updatedRoles);
      message.success('Cập nhật vai trò thành công');
    }
  };

  return {
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
  };
}
