'use client';

import React from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import type { ColumnsType } from 'antd/es/table';
import { Role } from '../interface/IRole';
import { capitalizeFirst } from '../../../../../lib/utils/string';

interface RolesTableProps {
  roles: Role[];
  searchText: string;
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (id: number) => void;
  onPageChange?: (page: number, size: number) => void;
}

export default function RolesTable({ 
  roles, 
  searchText, 
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onView, 
  onEdit, 
  onDelete,
  onPageChange,
}: RolesTableProps) {
  const columns: ColumnsType<Role> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value as string),
      render: (name: string) => capitalizeFirst(name),
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
            title="Xóa vai trò"
            description="Bạn có chắc chắn muốn xóa vai trò này?"
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
      dataSource={roles}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showTotal: (total, range) => {
          if (loading) return 'Đang tải...';
          if (total === 0) return 'Không có dữ liệu';
          return `${range[0]}-${range[1]} của ${total} vai trò`;
        },
        onChange: onPageChange ? (page, size) => onPageChange(page, size || 10) : undefined,
        onShowSizeChange: onPageChange ? (current, size) => onPageChange(current, size) : undefined,
      }}
    />
  );
}
