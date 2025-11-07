"use client";

import React, { useState, useEffect, useRef } from "react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { UserInfo } from "./interface/IAccount";
import UserHeader from "./components/UserHeader";
import UserStats from "./components/UserStats";
import ProfileTab from "./components/ProfileTab";
import SettingsTab from "./components/SettingsTab";
import ChangePasswordModal from "./components/ChangePasswordModal";
import ChangeEmailModal from "./components/ChangeEmailModal";
import AccountSkeleton from "./components/AccountSkeleton";
import OrdersTable from "./components/OrdersTable";
import ReviewModal from "./components/ReviewModal";
import { useAccountData } from "./hooks/useAccountData";
import { useReviewModal } from "./hooks/useReviewModal";
import { getUserById } from "../../../lib/api/users";
import { getAuthData, updateAuthData } from "../../../lib/utils/cookie";

const AccountPage = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const ordersRef = useRef<HTMLDivElement | null>(null);
  const [tabParam, setTabParam] = useState<string | null>(null);

  // Use custom hooks
  const {
    userInfo,
    setUserInfo,
    loading,
    orders,
    ordersLoading,
    ordersTotal,
    ordersPage,
    setOrdersPage,
    ordersSize,
    productReviews,
    productReviewsRef,
    dataReady,
    markOrderItemReviewed,
  } = useAccountData();

  const {
    isReviewModalOpen,
    currentStep,
    rating,
    commentContent,
    isSubmitting,
    handleOpenReviewModal,
    handleCloseReviewModal,
    handleNextStep,
    handlePrevStep,
    handleSubmitReview,
    setRating,
    setCommentContent,
  } = useReviewModal({ productReviews, productReviewsRef, markOrderItemReviewed });

  // Get tab param from URL safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      setTabParam(tab);
    }
  }, []);

  useEffect(() => {
    if (dataReady && tabParam === 'orders' && ordersRef.current) {
      ordersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [tabParam, ordersRef, dataReady]);

  const handleOpenPasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handlePasswordSuccess = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handleOpenEmailModal = () => {
    setIsChangeEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    setIsChangeEmailModalOpen(false);
  };

  const handleProfileUpdate = async (updatedUserInfo: UserInfo) => {
    // Update state immediately for UI
    setUserInfo(updatedUserInfo);
    
    // Update auth_data cookie with new username and email
    updateAuthData({
      username: updatedUserInfo.name,
      email: updatedUserInfo.email,
    });
    
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
            address: userData.address || "",
            phone: userData.phone || "",
            avatar: userData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            birthday: userData.birthday || undefined,
            joinDate: formattedJoinDate,
            totalOrders: updatedUserInfo.totalOrders,
            totalSpent: updatedUserInfo.totalSpent,
            loyaltyPoints: userData.points ?? updatedUserInfo.loyaltyPoints,
            rankName: userData.rank?.name ?? updatedUserInfo.rankName,
            rankDiscount: (userData as any).rank?.discount ?? updatedUserInfo.rankDiscount,
          });

          // Update cookie again with fresh data from API
          updateAuthData({
            username: userData.username,
            email: userData.email,
          });
        }
      }
    } catch (error) {
      // If reload fails, keep the updated info we already have
      console.error('Error reloading user data:', error);
    }
  };

  // Chỉ hiển thị khi tất cả data đã ready
  if (loading || !dataReady || !userInfo) {
    return (
      <ProtectedRoute>
        <AccountSkeleton />
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
            <SettingsTab 
              onOpenPasswordModal={handleOpenPasswordModal}
              onOpenEmailModal={handleOpenEmailModal}
            />
          </div>

          {/* Đơn hàng của tôi */}
          <div ref={ordersRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng của tôi</h2>
              <OrdersTable
                orders={orders}
                ordersLoading={ordersLoading}
                ordersTotal={ordersTotal}
                ordersPage={ordersPage}
                ordersSize={ordersSize}
                onPageChange={setOrdersPage}
                productReviews={productReviews}
                onReviewClick={handleOpenReviewModal}
              />
            </div>
          </div>
        </div>

        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={handleClosePasswordModal}
          onSuccess={handlePasswordSuccess}
        />
        <ChangeEmailModal
          isOpen={isChangeEmailModalOpen}
          onClose={handleCloseEmailModal}
          currentEmail={userInfo?.email}
        />

        {/* Review Modal */}
        <ReviewModal
          open={isReviewModalOpen}
          currentStep={currentStep}
          rating={rating}
          commentContent={commentContent}
          isSubmitting={isSubmitting}
          onClose={handleCloseReviewModal}
          onRatingChange={setRating}
          onCommentChange={setCommentContent}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onSubmit={handleSubmitReview}
        />
      </div>
    </ProtectedRoute>
  );
};

export default AccountPage;
