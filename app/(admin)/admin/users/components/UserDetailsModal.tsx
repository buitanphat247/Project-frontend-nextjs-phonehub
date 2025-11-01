import { Modal, Button, Descriptions, Tag } from 'antd';
import { User } from '../interface/IUser';
import { capitalizeFirst } from '../../../../../lib/utils/string';

const roleMap: Record<number, string> = {
  1: 'Admin',
  2: 'Staff',
  3: 'User',
};

interface UserDetailsModalProps {
  user: User | null;
  visible: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({ user, visible, onClose }: UserDetailsModalProps) {
  return (
    <Modal
      title="Thông tin người dùng"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={600}
    >
      {user && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{user.address}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color={user.roleId === 1 ? 'red' : user.roleId === 2 ? 'orange' : 'blue'}>
              {capitalizeFirst(user.roleName || roleMap[user.roleId] || 'User')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(user.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

