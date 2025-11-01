import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import type { ColumnsType } from 'antd/es/table';
import { Category } from '../interface/ICategory';

interface CategoriesTableProps {
  categories: Category[];
  searchText: string;
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onPageChange?: (page: number, size: number) => void;
}

export default function CategoriesTable({ 
  categories, 
  searchText,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onView, 
  onEdit, 
  onDelete,
  onPageChange,
}: CategoriesTableProps) {
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value as string) ||
        record.slug.toLowerCase().includes(value as string),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
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
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này?"
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
      dataSource={categories}
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
          return `${range[0]}-${range[1]} của ${total} danh mục`;
        },
        onChange: onPageChange ? (page) => onPageChange(page, pageSize) : undefined,
      }}
    />
  );
}

