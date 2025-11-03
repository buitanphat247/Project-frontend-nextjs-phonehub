import { Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

interface RanksHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export default function RanksHeader({ searchValue, onSearchChange, onCreateClick }: RanksHeaderProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Quản lý xếp hạng</h2>
      <Space>
        <Input
          placeholder="Tìm kiếm theo tên"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
          autoComplete="off"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Tạo xếp hạng
        </Button>
      </Space>
    </div>
  );
}

