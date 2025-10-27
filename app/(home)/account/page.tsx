"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import { UserOutlined, SettingOutlined, ShoppingOutlined } from "@ant-design/icons";
import { UserInfo, Order } from "./interface/IAccount";
import UserHeader from "./components/UserHeader";
import UserStats from "./components/UserStats";
import ProfileTab from "./components/ProfileTab";
import OrdersTab from "./components/OrdersTab";
import SettingsTab from "./components/SettingsTab";
import ChangePasswordModal from "./components/ChangePasswordModal";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const userInfo: UserInfo = {
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0123456789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    joinDate: "Tháng 1, 2024",
    totalOrders: 15,
    totalSpent: 25000000,
    loyaltyPoints: 1250,
  };

  const orders: Order[] = [
    { id: 1, product: "iPhone 15 Pro Max", status: "Đã giao", date: "15/12/2024", total: 29990000 },
    { id: 2, product: "MacBook Pro 16-inch", status: "Đang giao", date: "10/12/2024", total: 45990000 },
    { id: 3, product: "AirPods Pro 2nd Gen", status: "Đã hủy", date: "05/12/2024", total: 5990000 },
  ];

  const handleOpenPasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handlePasswordSuccess = () => {
    setIsChangePasswordModalOpen(false);
  };

  const tabItems = [
    {
      key: "profile",
      label: (
        <div className="flex items-center space-x-2">
          <UserOutlined />
          <span>Thông tin cá nhân</span>
        </div>
      ),
      children: <ProfileTab userInfo={userInfo} />,
    },
    {
      key: "orders",
      label: (
        <div className="flex items-center space-x-2">
          <ShoppingOutlined />
          <span>Đơn hàng</span>
        </div>
      ),
      children: <OrdersTab orders={orders} />,
    },
    {
      key: "settings",
      label: (
        <div className="flex items-center space-x-2">
          <SettingOutlined />
          <span>Cài đặt</span>
        </div>
      ),
      children: <SettingsTab onOpenPasswordModal={handleOpenPasswordModal} />,
    },
  ];

  return (
    <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-4">
        <UserHeader userInfo={userInfo} />
        <UserStats userInfo={userInfo} />
        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="account-tabs"
            tabBarStyle={{
              backgroundColor: "transparent",
              borderBottom: "1px solid #e2e8f0",
              margin: 0,
              padding: "0 24px",
            }}
            tabBarGutter={32}
          />
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={handleClosePasswordModal}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default AccountPage;
