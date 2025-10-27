import { Modal, Button, Descriptions, Tag, Image } from 'antd';
import { Product } from '../interface/IProduct';

interface ProductDetailsModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, visible, onClose }: ProductDetailsModalProps) {
  return (
    <Modal
      title="Thông tin sản phẩm"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={700}
    >
      {product && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{product.id}</Descriptions.Item>
          <Descriptions.Item label="Tên sản phẩm">{product.name}</Descriptions.Item>
          <Descriptions.Item label="Slug">{product.slug}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{product.description}</Descriptions.Item>
          <Descriptions.Item label="Hình ảnh">
            <Image 
              src={product.image} 
              alt={product.name}
              width={100}
              style={{ borderRadius: 8 }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">{product.category_name}</Descriptions.Item>
          <Descriptions.Item label="Giá">{product.price.toLocaleString('vi-VN')} ₫</Descriptions.Item>
          <Descriptions.Item label="Tồn kho">{product.stock}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={product.status === 'active' ? 'green' : 'default'}>
              {product.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(product.created_at).toLocaleString('vi-VN')}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

