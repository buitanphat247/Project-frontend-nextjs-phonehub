import { useState } from 'react';
import { message } from 'antd';
import { User } from '../interface/IUser';
import { mockUsers } from '../mock/usersData';

export function useUserHandlers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('Xóa người dùng thành công');
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleCreateClick = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedUser(null);
  };

  const handleCreateUser = (values: Partial<User>) => {
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      username: values.username || '',
      email: values.email || '',
      phone: values.phone || '',
      address: values.address || '',
      avatar: '',
      role_id: values.role_id || 3,
      role_name: values.role_id === 1 ? 'Admin' : values.role_id === 2 ? 'Staff' : 'User',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };
    setUsers([...users, newUser]);
    message.success('Tạo người dùng thành công');
  };

  const handleEditUser = (values: Partial<User>) => {
    if (selectedUser) {
      const updatedUsers = users.map(user =>
        user.id === selectedUser.id
          ? { ...user, ...values, role_name: values.role_id === 1 ? 'Admin' : values.role_id === 2 ? 'Staff' : 'User', updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ') }
          : user
      );
      setUsers(updatedUsers);
      message.success('Cập nhật người dùng thành công');
    }
  };

  return {
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
  };
}

