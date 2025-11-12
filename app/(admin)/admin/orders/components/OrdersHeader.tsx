import { Typography } from 'antd';

const { Title } = Typography;

interface OrdersHeaderProps {}

export default function OrdersHeader({}: OrdersHeaderProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Title level={2} style={{ margin: 0 }}>
        Quản lý đơn hàng
      </Title>
    </div>
  );
}

