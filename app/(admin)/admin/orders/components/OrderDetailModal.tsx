import { Modal, Button, Descriptions, Table, Tag, Spin, Empty } from 'antd';
import { Order, OrderItem } from '../interface/IOrder';
import type { ColumnsType } from 'antd/es/table';

interface OrderDetailModalProps {
  order: Order | null;
  orderItems: OrderItem[];
  itemsLoading: boolean;
  visible: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({ 
  order, 
  orderItems, 
  itemsLoading,
  visible, 
  onClose 
}: OrderDetailModalProps) {
  const itemColumns: ColumnsType<OrderItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.productName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>ID: {record.productId}</div>
        </div>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 150,
      render: (price: number) => price.toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: 'Thành tiền',
      key: 'total',
      width: 150,
      render: (_, record) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>
          {(record.quantity * record.unitPrice).toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => date ? new Date(date).toLocaleString('vi-VN') : '-',
    },
  ];

  return (
    <Modal
      title="Chi tiết đơn hàng"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={1200}
    >
      {order && (
        <div>
          <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="ID đơn hàng">{order.id}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={order.status === 'success' ? 'green' : 'orange'}>
                {order.status === 'success' ? 'Thành công' : order.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Người mua">{order.buyerName}</Descriptions.Item>
            <Descriptions.Item label="Email">{order.buyerEmail}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{order.buyerPhone}</Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              <Tag color="blue">{order.paymentMethod}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {order.buyerAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              <span style={{ fontWeight: 500, fontSize: '16px', color: '#1890ff' }}>
                {order.totalPrice.toLocaleString('vi-VN')} ₫
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Người dùng">
              {order.username} (ID: {order.userId})
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {new Date(order.updatedAt).toLocaleString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Danh sách sản phẩm</h3>
            {itemsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : orderItems.length > 0 ? (
              <Table
                columns={itemColumns}
                dataSource={orderItems}
                rowKey="id"
                pagination={false}
                scroll={{ x: 800 }}
              />
            ) : (
              <Empty description="Không có sản phẩm nào" />
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

