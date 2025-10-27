"use client";

import React, { useState } from "react";
import { message } from "antd";
import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import UserDetailsModal from "./components/UserDetailsModal";
import { User } from "./interface/IUser";
import { mockUsers } from "./mock/usersData";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    message.success("Xóa người dùng thành công");
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-4">
      <UsersHeader searchValue={searchText} onSearchChange={handleSearch} />
      <UsersTable users={users} searchText={searchText} onView={handleView} onDelete={handleDelete} />
      <UserDetailsModal user={selectedUser} visible={modalVisible} onClose={handleCloseModal} />
    </div>
  );
}
