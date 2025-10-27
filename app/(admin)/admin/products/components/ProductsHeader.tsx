import { Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

interface ProductsHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export default function ProductsHeader({ searchValue, onSearchChange, onCreateClick }: ProductsHeaderProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Quản lý sản phẩm</h2>
      <Space>
        <Input
          placeholder="Tìm kiếm theo tên hoặc slug"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Tạo sản phẩm
        </Button>
      </Space>
    </div>
  );
}

