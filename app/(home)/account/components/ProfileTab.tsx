import React from 'react';
import { Button, Input } from 'antd';
import { UserInfo } from '../interface/IAccount';

interface ProfileTabProps {
  userInfo: UserInfo;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ userInfo }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin cá nhân</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          <Input value={userInfo.name} className="rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input value={userInfo.email} className="rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <Input value={userInfo.phone} className="rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
          <Input placeholder="DD/MM/YYYY" className="rounded-lg" />
        </div>
      </div>

      <div className="mt-6">
        <Button type="primary" className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-2">
          Cập nhật thông tin
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
