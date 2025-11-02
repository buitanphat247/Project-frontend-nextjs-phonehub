"use client";

import React, { useState, useEffect } from "react";
import { message } from "antd";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { UserInfo } from "./interface/IAccount";
import UserHeader from "./components/UserHeader";
import UserStats from "./components/UserStats";
import ProfileTab from "./components/ProfileTab";
import SettingsTab from "./components/SettingsTab";
import ChangePasswordModal from "./components/ChangePasswordModal";
import AccountSkeleton from "./components/AccountSkeleton";
import { getUserById } from "../../../lib/api/users";
import { getAuthData } from "../../../lib/utils/cookie";

const AccountPage = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

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
            birthday: userData.birthday || undefined,
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

  const handleProfileUpdate = async (updatedUserInfo: UserInfo) => {
    // Update state immediately for UI
    setUserInfo(updatedUserInfo);
    
    // Optionally reload fresh data from API to ensure consistency
    try {
      const authData = getAuthData();
      if (authData?.userId) {
        const userId = parseInt(authData.userId, 10);
        const response = await getUserById(userId);
        
        if (response.success && response.data) {
          const userData = response.data;
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
            birthday: userData.birthday || undefined,
            joinDate: formattedJoinDate,
            totalOrders: updatedUserInfo.totalOrders,
            totalSpent: updatedUserInfo.totalSpent,
            loyaltyPoints: updatedUserInfo.loyaltyPoints,
          });
        }
      }
    } catch (error) {
      // If reload fails, keep the updated info we already have
      console.error('Error reloading user data:', error);
    }
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

  return (
    <ProtectedRoute>
      <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 space-y-4">
          <UserHeader userInfo={userInfo} />
          <UserStats userInfo={userInfo} />
          
          {/* Thông tin cá nhân */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {userInfo && <ProfileTab userInfo={userInfo} onUpdateSuccess={handleProfileUpdate} />}
          </div>

          {/* Cài đặt */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <SettingsTab onOpenPasswordModal={handleOpenPasswordModal} />
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
