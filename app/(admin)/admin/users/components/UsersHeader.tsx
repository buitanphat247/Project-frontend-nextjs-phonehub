import { Button, Input, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

interface UsersHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export default function UsersHeader({ searchValue, onSearchChange, onCreateClick }: UsersHeaderProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Quản lý người dùng</h2>
      <Space>
        <Input
          placeholder="Tìm kiếm theo tên hoặc email"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
          autoComplete="off"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Tạo người dùng
        </Button>
      </Space>
    </div>
  );
}