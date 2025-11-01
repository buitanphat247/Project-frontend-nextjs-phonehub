import { Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';

interface ProductsHeaderProps {
  searchValue: string;
  searching?: boolean;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export default function ProductsHeader({ searchValue, searching = false, onSearchChange, onCreateClick }: ProductsHeaderProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Quản lý sản phẩm</h2>
      <Space>
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          prefix={searching ? <LoadingOutlined spin /> : <SearchOutlined />}
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchValue}
          style={{ width: 300 }}
          allowClear
          autoComplete="off"
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Tạo sản phẩm
        </Button>
      </Space>
    </div>
  );
}

