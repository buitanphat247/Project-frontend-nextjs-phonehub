import { Modal, Button, Descriptions, Tag } from 'antd';
import { User } from '../interface/IUser';
import { roleMap } from '../mock/usersData';

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
            <Tag color={user.role_id === 1 ? 'red' : user.role_id === 2 ? 'orange' : 'blue'}>
              {roleMap[user.role_id] || 'User'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(user.created_at).toLocaleString('vi-VN')}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

