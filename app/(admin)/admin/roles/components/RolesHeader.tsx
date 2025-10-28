import { Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

interface RolesHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export default function RolesHeader({ searchValue, onSearchChange, onCreateClick }: RolesHeaderProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Quản lý vai trò</h2>
      <Space>
        <Input
          placeholder="Tìm kiếm theo tên"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Tạo vai trò
        </Button>
      </Space>
    </div>
  );
}
