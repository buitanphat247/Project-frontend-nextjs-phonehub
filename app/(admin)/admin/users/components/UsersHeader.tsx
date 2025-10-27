import { Button, Input, Space } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

interface UsersHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function UsersHeader({ searchValue, onSearchChange }: UsersHeaderProps) {
  return (
    // <div style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //   <h2 style={{ margin: 0 }}>Quản lý người dùng</h2>
    //   <Input
    //     placeholder="Tìm kiếm theo tên hoặc email"
    //     prefix={<SearchOutlined />}
    //     onChange={(e) => onSearchChange(e.target.value)}
    //     style={{ width: 300 }}
    //     allowClear
    //   />
    // </div>
    <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2 style={{ margin: 0 }}>Quản lý sản phẩm</h2>
      <Space>
        <Input
          placeholder="Tìm kiếm theo tên hoặc slug"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Tạo sản phẩm
        </Button>
      </Space>
    </div>
  );
}
