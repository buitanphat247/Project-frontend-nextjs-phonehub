import { Modal, Button, Descriptions, Tag } from 'antd';
import { User } from '../interface/IUser';
import { capitalizeFirst } from '../../../../../lib/utils/string';

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
          <Descriptions.Item label="Số điện thoại">{user.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{user.address || '-'}</Descriptions.Item>
          {user.birthday && (
            <Descriptions.Item label="Ngày sinh">
              {new Date(user.birthday).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Điểm">
            {(user.points || 0).toLocaleString('vi-VN')} điểm
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            {user.roleId && user.roleName ? (
              <Tag color={user.roleId === 1 ? 'red' : user.roleId === 2 ? 'orange' : 'blue'}>
                {capitalizeFirst(user.roleName)}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Xếp hạng">
            {user.rankName ? (
              <Tag color="gold">
                {capitalizeFirst(user.rankName)}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(user.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">{new Date(user.updatedAt).toLocaleString('vi-VN')}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

