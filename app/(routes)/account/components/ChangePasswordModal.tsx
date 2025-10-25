import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { ChangePasswordForm } from '../interface/IAccount';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: ChangePasswordForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Mật khẩu đã được cập nhật thành công!');
      onSuccess();
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <LockOutlined className="text-green-600" />
          <span>Đổi mật khẩu</span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      className="change-password-modal"
      maskClosable={true}
      destroyOnClose={true}
      centered={true}
      maskStyle={{
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-800">Lưu ý bảo mật</span>
          </div>
          <p className="text-sm text-blue-700">
            Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
          </p>
        </div>

        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu hiện tại"
            prefix={<LockOutlined className="text-gray-400" />}
            className="rounded-lg"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
            { 
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
              message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!'
            }
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            prefix={<LockOutlined className="text-gray-400" />}
            className="rounded-lg"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu mới"
            prefix={<LockOutlined className="text-gray-400" />}
            className="rounded-lg"
            size="large"
          />
        </Form.Item>

        <div className="flex justify-end space-x-3 mt-8">
          <Button 
            onClick={handleCancel}
            className="rounded-lg px-6"
            size="large"
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            className="bg-green-600 hover:bg-green-700 rounded-lg px-6"
            size="large"
          >
            Cập nhật mật khẩu
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
