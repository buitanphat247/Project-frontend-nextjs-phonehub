import { Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

interface CategoriesHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export default function CategoriesHeader({ searchValue, onSearchChange, onCreateClick }: CategoriesHeaderProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Quản lý danh mục</h2>
      <Space>
        <Input
          placeholder="Tìm kiếm theo tên hoặc slug"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
          autoComplete="off"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Tạo danh mục
        </Button>
      </Space>
    </div>
  );
}

