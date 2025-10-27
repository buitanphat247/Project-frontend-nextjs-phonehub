import { Modal, Button, Descriptions } from 'antd';
import { Category } from '../interface/ICategory';

interface CategoryDetailsModalProps {
  category: Category | null;
  visible: boolean;
  onClose: () => void;
}

export default function CategoryDetailsModal({ category, visible, onClose }: CategoryDetailsModalProps) {
  return (
    <Modal
      title="Thông tin danh mục"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={600}
    >
      {category && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{category.id}</Descriptions.Item>
          <Descriptions.Item label="Tên danh mục">{category.name}</Descriptions.Item>
          <Descriptions.Item label="Slug">{category.slug}</Descriptions.Item>
          <Descriptions.Item label="Người tạo">{category.created_by}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(category.created_at).toLocaleString('vi-VN')}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

