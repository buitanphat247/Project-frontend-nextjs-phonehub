'use client';

import React from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import type { ColumnsType } from 'antd/es/table';
import { Role } from '../interface/IRole';

interface RolesTableProps {
  roles: Role[];
  searchText: string;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (id: number) => void;
}

export default function RolesTable({ roles, searchText, onView, onEdit, onDelete }: RolesTableProps) {
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
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Quyền',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string) => (
        <Tag color={permissions === 'all' ? 'red' : 'blue'}>
          {permissions}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
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
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} vai trò`,
      }}
    />
  );
}
