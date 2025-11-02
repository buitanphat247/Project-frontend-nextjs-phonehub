"use client";

import React, { useState, useEffect } from "react";
import { Tabs, message } from "antd";
import { UserOutlined, SettingOutlined, HeartOutlined } from "@ant-design/icons";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { UserInfo } from "./interface/IAccount";
import UserHeader from "./components/UserHeader";
import UserStats from "./components/UserStats";
import ProfileTab from "./components/ProfileTab";
import FavoriteProductsTab from "./components/FavoriteProductsTab";
import SettingsTab from "./components/SettingsTab";
import ChangePasswordModal from "./components/ChangePasswordModal";
import AccountSkeleton from "./components/AccountSkeleton";
import { getUserById } from "../../../lib/api/users";
import { getAuthData } from "../../../lib/utils/cookie";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Đọc tab từ URL query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab && ['account', 'favorites', 'settings'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const authData = getAuthData();
        
        if (!authData?.userId) {
          message.error("Không tìm thấy thông tin người dùng");
          return;
        }

        const userId = parseInt(authData.userId, 10);
        const response = await getUserById(userId);

        if (response.success && response.data) {
          const userData = response.data;
          
          // Format joinDate từ createdAt
          const joinDate = new Date(userData.createdAt);
          const formattedJoinDate = joinDate.toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric'
          });

          setUserInfo({
            name: userData.username,
            email: userData.email,
            phone: userData.phone || "",
            avatar: userData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            joinDate: formattedJoinDate,
            totalOrders: 0, // TODO: Fetch từ API orders
            totalSpent: 0, // TODO: Fetch từ API orders
            loyaltyPoints: 0, // TODO: Fetch từ API loyalty
          });
        } else {
          message.error(response.message || "Không thể tải thông tin người dùng");
        }
      } catch (error: any) {
        message.error(error.message || "Có lỗi xảy ra khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleOpenPasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handlePasswordSuccess = () => {
    setIsChangePasswordModalOpen(false);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AccountSkeleton />
      </ProtectedRoute>
    );
  }

  if (!userInfo) {
    return (
      <ProtectedRoute>
        <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Không thể tải thông tin người dùng</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const tabItems = [
    {
      key: "account",
      label: (
        <div className="flex items-center space-x-2">
          <UserOutlined />
          <span>Tài khoản của tôi</span>
        </div>
      ),
      children: <ProfileTab userInfo={userInfo} />,
    },
    {
      key: "favorites",
      label: (
        <div className="flex items-center space-x-2">
          <HeartOutlined />
          <span>Sản phẩm yêu thích</span>
        </div>
      ),
      children: <FavoriteProductsTab />,
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
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
};

export default AccountPage;
