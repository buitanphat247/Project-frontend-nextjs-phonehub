import { Table, Button, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Order } from '../interface/IOrder';

interface OrdersTableProps {
  orders: Order[];
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onView: (order: Order) => void;
  onPageChange?: (page: number, size: number) => void;
}

export default function OrdersTable({ 
  orders, 
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onView, 
  onPageChange,
}: OrdersTableProps) {
  const columns: ColumnsType<Order> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      fixed: 'left',
    },
    {
      title: 'Người mua',
      dataIndex: 'buyerName',
      key: 'buyerName',
      width: 160,
      render: (buyerName: string) => (
        <span style={{ fontWeight: 500 }}>{buyerName}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'buyerEmail',
      key: 'buyerEmail',
      width: 220,
      ellipsis: {
        showTitle: false,
      },
      render: (email: string) => (
        <span title={email}>{email}</span>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'buyerPhone',
      key: 'buyerPhone',
      width: 140,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'buyerAddress',
      key: 'buyerAddress',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (address: string) => (
        <span title={address} style={{ display: 'inline-block', maxWidth: 180 }}>
          {address}
        </span>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 130,
      align: 'right',
      render: (price: number) => (
        <span style={{ fontWeight: 500, color: '#1890ff' }}>
          {price.toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 120,
      render: (method: string) => (
        <Tag color={method === 'VNPAY' ? 'blue' : 'default'}>
          {method}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status === 'success' ? 'Thành công' : status === 'pending' ? 'Đang xử lý' : status}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 130,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => onView(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => {
            if (loading) return 'Đang tải...';
            if (total === 0) return 'Không có dữ liệu';
            return `${range[0]}-${range[1]} của ${total} đơn hàng`;
          },
          onChange: onPageChange ? (page, size) => onPageChange(page, size || pageSize) : undefined,
          onShowSizeChange: onPageChange ? (_, size) => onPageChange(1, size) : undefined,
        }}
      />
    </div>
  );
}

