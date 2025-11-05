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
import ChangeEmailModal from "./components/ChangeEmailModal";
import AccountSkeleton from "./components/AccountSkeleton";
import { getUserById, getUserTotalSpent } from "../../../lib/api/users";
import { getOrders, OrderDetailResponse } from "../../../lib/api/orders";
import { useSearchParams } from "next/navigation";
import { getAuthData, updateAuthData } from "../../../lib/utils/cookie";

const AccountPage = () => {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderDetailResponse[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersSize] = useState(5);
  const params = useSearchParams();
  const ordersRef = React.useRef<HTMLDivElement | null>(null);

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
            address: userData.address || "",
            phone: userData.phone || "",
            avatar: userData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            birthday: userData.birthday || undefined,
            joinDate: formattedJoinDate,
            totalOrders: 0,
            totalSpent: 0,
            loyaltyPoints: userData.points ?? 0,
            rankName: userData.rank?.name,
            rankDiscount: (userData as any).rank?.discount,
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

  // Fetch orders and stats
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const auth = getAuthData();
        const uid = auth?.userId ? parseInt(auth.userId, 10) : NaN;
        if (!uid) return;
        const res = await getOrders({ page: ordersPage, size: ordersSize, userId: uid });
        if (res.success && res.data) {
          setOrders(res.data.content || []);
          const total = res.data.totalElements || 0;
          setOrdersTotal(total);
          // Update userInfo with total orders
          setUserInfo(prev => prev ? { ...prev, totalOrders: total } : null);
        }
      } catch (e) {
        // silent fail
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [ordersPage, ordersSize]);

  // Fetch total spent once when userInfo is loaded
  useEffect(() => {
    if (!userInfo) return;
    const fetchTotalSpent = async () => {
      try {
        const auth = getAuthData();
        const uid = auth?.userId ? parseInt(auth.userId, 10) : NaN;
        if (!uid) return;
        const spentRes = await getUserTotalSpent(uid);
        if (spentRes.success && typeof spentRes.data === 'number') {
          setUserInfo(prev => prev ? { ...prev, totalSpent: spentRes.data } : null);
        }
      } catch {}
    };
    fetchTotalSpent();
  }, [userInfo?.name]); // Only fetch when userInfo is first loaded

  useEffect(() => {
    if (params?.get('tab') === 'orders' && ordersRef.current) {
      ordersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [params, ordersRef]);

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

  // Không cập nhật ngay; email sẽ cập nhật sau khi người dùng xác minh qua email

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
            <SettingsTab 
              onOpenPasswordModal={handleOpenPasswordModal}
              onOpenEmailModal={handleOpenEmailModal}
            />
          </div>

          {/* Đơn hàng của tôi */}
          <div ref={ordersRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng của tôi</h2>
              {ordersLoading ? (
                <div className="text-gray-500">Đang tải đơn hàng...</div>
              ) : orders.length === 0 ? (
                <div className="text-gray-600">Bạn chưa có đơn hàng nào.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mã đơn</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{o.id}</td>
                          <td className="px-4 py-3 text-sm capitalize">
                            <span className={`${o.status === 'success' ? 'text-green-600' : o.status === 'failed' ? 'text-red-600' : 'text-gray-700'}`}>{o.status}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div className="space-y-1">
                              {o.items?.map((it) => (
                                <div key={it.id}>{`${it.productName} x ${it.quantity}`}</div>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pt-4 flex justify-end gap-2 text-sm">
                    <button disabled={ordersPage===0} onClick={()=>setOrdersPage(p=>Math.max(0,p-1))} className={`px-3 py-1 rounded border ${ordersPage===0? 'text-gray-400 border-gray-200':'text-gray-700 hover:bg-gray-50 border-gray-300'}`}>Trước</button>
                    <div className="self-center text-gray-600">Trang {ordersPage+1} / {Math.max(1, Math.ceil(ordersTotal/ordersSize))}</div>
                    <button disabled={(ordersPage+1)>=Math.ceil(ordersTotal/ordersSize)} onClick={()=>setOrdersPage(p=>p+1)} className={`px-3 py-1 rounded border ${ (ordersPage+1)>=Math.ceil(ordersTotal/ordersSize) ? 'text-gray-400 border-gray-200':'text-gray-700 hover:bg-gray-50 border-gray-300'}`}>Sau</button>
                  </div>
                </div>
              )}
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
      </div>
    </ProtectedRoute>
  );
};

export default AccountPage;
