import React from 'react';
import { ShoppingOutlined, CreditCardOutlined, HistoryOutlined, CrownOutlined } from '@ant-design/icons';
import { UserInfo } from '../interface/IAccount';

interface UserStatsProps {
  userInfo: UserInfo;
}

const UserStats: React.FC<UserStatsProps> = ({ userInfo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Đơn hàng</p>
            <p className="text-2xl font-bold text-blue-600">{userInfo.totalOrders}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShoppingOutlined className="text-blue-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Đã chi tiêu</p>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(userInfo.totalSpent)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CreditCardOutlined className="text-green-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Điểm tích lũy</p>
            <p className="text-2xl font-bold text-purple-600">{userInfo.loyaltyPoints}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <HistoryOutlined className="text-purple-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Cấp độ</p>
            <p className="text-2xl font-bold text-orange-600">{userInfo.rankName || '—'}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <CrownOutlined className="text-orange-600 text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
