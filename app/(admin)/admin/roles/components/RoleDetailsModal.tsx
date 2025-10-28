import { Modal, Button, Descriptions, Tag } from 'antd';
import { Role } from '../interface/IRole';

interface RoleDetailsModalProps {
  role: Role | null;
  visible: boolean;
  onClose: () => void;
}

export default function RoleDetailsModal({ role, visible, onClose }: RoleDetailsModalProps) {
  return (
    <Modal
      title="Thông tin vai trò"
      open={visible}
      onCancel={onClose}
      footer={[<Button key="close" onClick={onClose}>Đóng</Button>]}
      width={600}
    >
      {role && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{role.id}</Descriptions.Item>
          <Descriptions.Item label="Tên vai trò">{role.name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{role.description}</Descriptions.Item>
          <Descriptions.Item label="Quyền">
            <Tag color={role.permissions === 'all' ? 'red' : 'blue'}>
              {role.permissions}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(role.created_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
