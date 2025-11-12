import { Input, Space } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";

interface OrdersHeaderProps {
  searchValue?: string;
  searching?: boolean;
  onSearchChange?: (value: string) => void;
}

export default function OrdersHeader({
  searchValue = "",
  searching = false,
  onSearchChange,
}: OrdersHeaderProps) {
  return (
    <div
      style={{
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>Quản lý đơn hàng</h2>
      {onSearchChange && (
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại, địa chỉ hoặc ID"
            prefix={searching ? <LoadingOutlined spin /> : <SearchOutlined />}
            onChange={(e) => onSearchChange(e.target.value)}
            value={searchValue}
            style={{ width: 300 }}
            allowClear
            autoComplete="off"
          />
        </Space>
      )}
    </div>
  );
}
