import { Modal, Button, Descriptions, Tag } from 'antd';
import { Role } from '../interface/IRole';
import { capitalizeFirst } from '../../../../../lib/utils/string';

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
          <Descriptions.Item label="Tên vai trò">{capitalizeFirst(role.name)}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(role.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(role.updatedAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
