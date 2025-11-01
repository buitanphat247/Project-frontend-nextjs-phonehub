import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import type { ColumnsType } from 'antd/es/table';
import { User } from '../interface/IUser';
import { capitalizeFirst } from '../../../../../lib/utils/string';

const roleMap: Record<number, string> = {
  1: 'Admin',
  2: 'Staff',
  3: 'User',
};

interface UsersTableProps {
  users: User[];
  searchText: string;
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onPageChange?: (page: number, size: number) => void;
}

export default function UsersTable({ 
  users, 
  searchText,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onView, 
  onEdit, 
  onDelete,
  onPageChange,
}: UsersTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId: number, record: User) => (
        <Tag color={roleId === 1 ? 'red' : roleId === 2 ? 'orange' : 'blue'}>
          {capitalizeFirst(record.roleName || roleMap[roleId] || 'User')}
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
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
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
      dataSource={users}
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
          return `${range[0]}-${range[1]} của ${total} người dùng`;
        },
        onChange: onPageChange ? (page) => onPageChange(page, pageSize) : undefined,
      }}
    />
  );
}

