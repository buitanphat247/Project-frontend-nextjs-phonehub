'use client';

import { Card, Space, Typography, Divider } from 'antd';

const { Text, Paragraph } = Typography;

interface InfoCardProps {
  apiUrl: string;
  endpoint: string;
}

export default function InfoCard({ apiUrl, endpoint }: InfoCardProps) {
  const fullUrl = `GET ${apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  return (
    <Card title="Thông tin" style={{ marginTop: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>URL đầy đủ:</Text>
          <Paragraph style={{ marginTop: 4 }}>
            <Text code>{fullUrl}</Text>
          </Paragraph>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        <div>
          <Text strong>Lưu ý:</Text>
          <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: '13px' }}>
            <li>Đảm bảo backend đang chạy tại URL đã nhập</li>
            <li>Kiểm tra CORS nếu gặp lỗi "CORS policy"</li>
            <li>Kiểm tra firewall/network nếu không kết nối được</li>
            <li>Kiểm tra console (F12) để xem chi tiết lỗi</li>
            <li>API này sẽ kiểm tra trạng thái kết nối database</li>
          </ul>
        </div>
      </Space>
    </Card>
  );
}

