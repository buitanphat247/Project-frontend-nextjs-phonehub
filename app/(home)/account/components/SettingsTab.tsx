import React from 'react';
import { Button, Switch } from 'antd';
import { BellOutlined, LockOutlined, CreditCardOutlined, MailOutlined } from '@ant-design/icons';

interface SettingsTabProps {
  onOpenPasswordModal: () => void;
  onOpenEmailModal?: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ onOpenPasswordModal, onOpenEmailModal }) => {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BellOutlined className="mr-2 text-blue-700" />
            Thông báo
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">Email thông báo</h4>
                <p className="text-sm text-gray-500">Nhận thông báo qua email về đơn hàng và khuyến mãi</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">SMS thông báo</h4>
                <p className="text-sm text-gray-500">Nhận thông báo qua SMS về trạng thái đơn hàng</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">Khuyến mãi</h4>
                <p className="text-sm text-gray-500">Nhận thông tin về các chương trình khuyến mãi</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <LockOutlined className="mr-2 text-green-700" />
            Bảo mật
          </h3>
          <div className="space-y-3">
            <Button 
              icon={<MailOutlined />} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-lg"
              onClick={onOpenEmailModal}
            >
              Cập nhật email
            </Button>
            <Button 
              icon={<LockOutlined />} 
              className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-0"
              onClick={onOpenPasswordModal}
            >
              Đổi mật khẩu
            </Button>
            <Button icon={<CreditCardOutlined />} className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-lg">
              Quản lý thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
