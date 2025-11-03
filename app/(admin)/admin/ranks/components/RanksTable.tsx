'use client';

import React from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import type { ColumnsType } from 'antd/es/table';
import { Rank } from '../interface/IRank';
import { capitalizeFirst } from '../../../../../lib/utils/string';

interface RanksTableProps {
  ranks: Rank[];
  searchText: string;
  loading?: boolean;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  onView: (rank: Rank) => void;
  onEdit: (rank: Rank) => void;
  onDelete: (id: number) => void;
  onPageChange?: (page: number, size: number) => void;
}

export default function RanksTable({ 
  ranks, 
  searchText, 
  loading = false,
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onView, 
  onEdit, 
  onDelete,
  onPageChange,
}: RanksTableProps) {
  const columns: ColumnsType<Rank> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên xếp hạng',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes((value as string).toLowerCase()),
      render: (name: string) => capitalizeFirst(name),
    },
    {
      title: 'Điểm tối thiểu',
      dataIndex: 'minPoints',
      key: 'minPoints',
      render: (points: number) => points.toLocaleString('vi-VN'),
    },
    {
      title: 'Điểm tối đa',
      dataIndex: 'maxPoints',
      key: 'maxPoints',
      render: (points: number | undefined) => points ? points.toLocaleString('vi-VN') : '∞',
    },
    {
      title: 'Giảm giá (%)',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
      render: (percent: number | undefined) => percent ? `${percent}%` : '-',
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
            title="Xóa xếp hạng"
            description="Bạn có chắc chắn muốn xóa xếp hạng này?"
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
      dataSource={ranks}
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
          return `${range[0]}-${range[1]} của ${total} xếp hạng`;
        },
        onChange: onPageChange ? (page) => onPageChange(page, pageSize) : undefined,
      }}
    />
  );
}

