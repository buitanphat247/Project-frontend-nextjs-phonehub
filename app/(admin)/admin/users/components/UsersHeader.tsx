import { Button, Input, Space } from 'antd';
import { PlusOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';

interface UsersHeaderProps {
  searchValue: string;
  searching?: boolean;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export default function UsersHeader({ searchValue, searching = false, onSearchChange, onCreateClick }: UsersHeaderProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Quản lý người dùng</h2>
      <Space>
        <Input
          placeholder="Tìm kiếm theo username hoặc email"
          prefix={searching ? <LoadingOutlined spin /> : <SearchOutlined />}
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchValue}
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