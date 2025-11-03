import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UserInfo } from '../interface/IAccount';

interface UserHeaderProps {
  userInfo: UserInfo;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userInfo }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl opacity-10"></div>
      <div className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-x-6">
          <Avatar size={100} src={userInfo.avatar} icon={<UserOutlined />} className="ring-4 ring-blue-100" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{userInfo.name}</h1>
            <p className="text-gray-600 mb-1">{userInfo.email}</p>
            <p className="text-sm text-gray-500">Thành viên từ {userInfo.joinDate}</p>
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-linear-to-r from-blue-100 to-purple-100 text-blue-800">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {userInfo.rankName ? `${userInfo.rankName} Member` : 'Thành viên'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
