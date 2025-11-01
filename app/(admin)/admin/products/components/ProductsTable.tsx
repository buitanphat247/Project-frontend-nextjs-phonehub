import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import type { ColumnsType } from 'antd/es/table';
import { Product } from '../interface/IProduct';

interface ProductsTableProps {
  products: Product[];
  searchText: string;
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onView: (product: Product) => void;
  onDelete: (id: number) => void;
  onPageChange?: (page: number, size: number) => void;
}

export default function ProductsTable({ 
  products, 
  searchText,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onView, 
  onDelete,
  onPageChange,
}: ProductsTableProps) {
  const columns: ColumnsType<Product> = [
    {
      title: 'ID',
      key: 'index',
      width: 80,
      render: (_: any, __: Product, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name: string) => (
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 300,
          }}
          title={name}
        >
          {name}
        </div>
      ),
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
      width: 150,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
    },
    {
      title: 'Giá mới',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'right',
      render: (price: number) => (
        <div style={{ fontWeight: 500, color: '#1890ff' }}>
          {price.toLocaleString('vi-VN')} ₫
        </div>
      ),
    },
    {
      title: 'Giá cũ',
      dataIndex: 'priceOld',
      key: 'priceOld',
      width: 120,
      align: 'right',
      render: (priceOld: number) => (
        priceOld > 0 ? (
          <div style={{ textDecoration: 'line-through', color: '#8c8c8c' }}>
            {priceOld.toLocaleString('vi-VN')} ₫
          </div>
        ) : (
          <span style={{ color: '#8c8c8c' }}>-</span>
        )
      ),
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      align: 'center',
      render: (discount: string) => discount ? <Tag color="red">{discount}</Tag> : '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? 'green' : 'default'}>
          {isPublished ? 'Đã xuất bản' : 'Chưa xuất bản'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onView(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => toast.info('This feature is under development')}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: false,
        showTotal: (total, range) => {
          if (loading) return 'Đang tải...';
          if (total === 0) return 'Không có dữ liệu';
          return `${range[0]}-${range[1]} của ${total} sản phẩm`;
        },
        onChange: onPageChange ? (page) => onPageChange(page, pageSize) : undefined,
      }}
    />
  );
}

