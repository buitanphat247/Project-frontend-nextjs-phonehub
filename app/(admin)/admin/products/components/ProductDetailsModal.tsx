import { Modal, Button, Descriptions, Tag, Image } from 'antd';
import { useEffect } from 'react';
import { Product } from '../interface/IProduct';

interface ProductDetailsModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, visible, onClose }: ProductDetailsModalProps) {
  useEffect(() => {
    const styleId = 'hide-scrollbar-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .hide-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

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
      <div
        style={{
          maxHeight: '70vh',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
        className="hide-scrollbar"
      >
        {product && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{product.id}</Descriptions.Item>
          <Descriptions.Item label="Tên sản phẩm">{product.name}</Descriptions.Item>
          <Descriptions.Item label="Slug">{product.slug}</Descriptions.Item>
          <Descriptions.Item label="Thương hiệu">{product.brand}</Descriptions.Item>
          <Descriptions.Item label="Danh mục">{product.categoryName}</Descriptions.Item>
          <Descriptions.Item label="Hình ảnh">
            <Image 
              src={product.thumbnailImage} 
              alt={product.name}
              width={100}
              style={{ borderRadius: 8 }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Giá hiện tại">{product.price.toLocaleString('vi-VN')} ₫</Descriptions.Item>
          {product.priceOld > 0 ? (
            <Descriptions.Item label="Giá cũ">
              <span style={{ textDecoration: 'line-through', color: '#8c8c8c' }}>
                {product.priceOld.toLocaleString('vi-VN')} ₫
              </span>
            </Descriptions.Item>
          ) : null}
          {product.discount && product.discount.trim() && product.discount.trim() !== '' ? (
            <Descriptions.Item label="Giảm giá">
              <Tag color="red">{product.discount}</Tag>
            </Descriptions.Item>
          ) : null}
          <Descriptions.Item label="Số lượng">
            <span style={{ fontWeight: 500, color: (product.quantity || 0) > 0 ? '#52c41a' : '#ff4d4f' }}>
              {(product.quantity || 0).toLocaleString('vi-VN')}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={product.isPublished ? 'green' : 'default'}>
              {product.isPublished ? 'Đã xuất bản' : 'Chưa xuất bản'}
            </Tag>
          </Descriptions.Item>
          {product.publishedAt && (
            <Descriptions.Item label="Ngày xuất bản">
              {new Date(product.publishedAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Ngày tạo">{new Date(product.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">{new Date(product.updatedAt).toLocaleString('vi-VN')}</Descriptions.Item>
        </Descriptions>
        )}
      </div>
    </Modal>
  );
}

