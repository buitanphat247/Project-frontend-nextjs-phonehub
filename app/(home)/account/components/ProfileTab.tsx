"use client";

import React, { useState, useEffect } from 'react';
import { Button, Input, DatePicker, ConfigProvider } from 'antd';
import toast from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/locale/vi_VN';
import { UserInfo } from '../interface/IAccount';
import { updateUser } from '../../../../lib/api/users';
import { getAuthData } from '../../../../lib/utils/cookie';

// Set dayjs locale to Vietnamese
dayjs.locale('vi');

interface ProfileTabProps {
  userInfo: UserInfo;
  onUpdateSuccess?: (updatedUserInfo: UserInfo) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ userInfo, onUpdateSuccess }) => {
  // Convert YYYY-MM-DD string to dayjs object
  const parseDateFromAPI = (dateString: string | undefined): Dayjs | null => {
    if (!dateString) return null;
    try {
      return dayjs(dateString);
    } catch {
      return null;
    }
  };

  // Convert dayjs object to YYYY-MM-DD string for API
  const formatDateForAPI = (date: Dayjs | null): string | undefined => {
    if (!date || !date.isValid()) return undefined;
    return date.format('YYYY-MM-DD');
  };

  const [formData, setFormData] = useState({
    name: userInfo.name,
    address: userInfo.address || '',
    phone: userInfo.phone || '',
    birthday: parseDateFromAPI(userInfo.birthday),
  });
  const [loading, setLoading] = useState(false);

  // Update form data when userInfo changes
  useEffect(() => {
    const parsedBirthday = parseDateFromAPI(userInfo.birthday);
    
    setFormData(prev => {
      // If form data matches userInfo exactly, it means initial load or after API update
      const isInitialLoad = prev.name === userInfo.name && 
                           prev.address === (userInfo.address || '') && 
                           prev.phone === (userInfo.phone || '');
      
      // Compare dayjs objects
      const birthdayChanged = !prev.birthday && !parsedBirthday 
        ? false 
        : !prev.birthday || !parsedBirthday 
        ? true 
        : !prev.birthday.isSame(parsedBirthday, 'day');
      
      if (isInitialLoad && !birthdayChanged) {
        // Update all fields including birthday
        return {
          name: userInfo.name,
          address: userInfo.address || '',
          phone: userInfo.phone || '',
          birthday: parsedBirthday,
        };
      }
      
      // If name, address, phone match, update birthday from API
      if (isInitialLoad) {
        return {
          ...prev,
          birthday: parsedBirthday,
        };
      }
      
      // Otherwise keep current form data (user is typing in other fields)
      return prev;
    });
  }, [userInfo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBirthdayChange = (date: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      birthday: date,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const authData = getAuthData();
      
      if (!authData?.userId) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }

      const userId = parseInt(authData.userId, 10);
      
      // Prepare update data (only send changed fields)
      const updateData: any = {};
      
      if (formData.name !== userInfo.name) {
        updateData.username = formData.name;
      }
      if (formData.address !== (userInfo.address || '')) {
        updateData.address = formData.address || null;
      }
      if (formData.phone !== (userInfo.phone || '')) {
        updateData.phone = formData.phone || null;
      }
      // Check if birthday changed
      const currentBirthday = userInfo.birthday ? parseDateFromAPI(userInfo.birthday) : null;
      const birthdayChanged = !formData.birthday && !currentBirthday 
        ? false 
        : !formData.birthday || !currentBirthday 
        ? true 
        : !formData.birthday.isSame(currentBirthday, 'day');
      
      if (birthdayChanged) {
        const formattedDate = formatDateForAPI(formData.birthday);
        if (formattedDate) {
          updateData.birthday = formattedDate;
        } else if (!formData.birthday) {
          // If cleared, send null to remove birthday
          updateData.birthday = null;
        }
      }

      // Check if there are any changes
      if (Object.keys(updateData).length === 0) {
        toast("Không có thay đổi nào để cập nhật", { icon: 'ℹ️' });
        return;
      }

      const response = await updateUser(userId, updateData);

      if (response.success && response.data) {
        toast.success("Cập nhật thông tin thành công!");
        
        // Update formData với dữ liệu mới
        setFormData(prev => ({
          ...prev,
          name: response.data.username,
          address: response.data.address || '',
          phone: response.data.phone || '',
          birthday: parseDateFromAPI(response.data.birthday),
        }));
        
        // Update parent component với dữ liệu mới từ API
        if (onUpdateSuccess) {
          const updatedInfo: UserInfo = {
            ...userInfo,
            name: response.data.username,
            address: response.data.address || '',
            phone: response.data.phone || '',
            avatar: response.data.avatar || userInfo.avatar,
            birthday: response.data.birthday || undefined,
          };
          onUpdateSuccess(updatedInfo);
        }
      } else {
        toast.error(response.message || "Không thể cập nhật thông tin");
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider locale={locale}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông tin cá nhân</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <Input 
              value={formData.name} 
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
            <Input 
              value={formData.address} 
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
            <Input 
              value={formData.phone} 
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
            <DatePicker
              value={formData.birthday}
              onChange={handleBirthdayChange}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              className="w-full rounded-lg"
              allowClear
            />
          </div>
        </div>

        <div className="mt-6">
          <Button 
            type="primary" 
            loading={loading}
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-2"
          >
            Cập nhật thông tin
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ProfileTab;
