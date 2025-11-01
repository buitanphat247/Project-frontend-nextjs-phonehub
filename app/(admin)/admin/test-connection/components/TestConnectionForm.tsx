'use client';

import { Card, Button, Input, Space, Typography, Alert } from 'antd';
import { ApiOutlined, DatabaseOutlined } from '@ant-design/icons';
import { TestResult } from '../interface/ITestResult';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface TestConnectionFormProps {
  apiUrl: string;
  endpoint: string;
  loading: boolean;
  corsError?: boolean;
  onApiUrlChange: (value: string) => void;
  onEndpointChange: (value: string) => void;
  onTest: () => void;
}

export default function TestConnectionForm({
  apiUrl,
  endpoint,
  loading,
  corsError,
  onApiUrlChange,
  onEndpointChange,
  onTest,
}: TestConnectionFormProps) {
  return (
    <Card title="Kiểm tra kết nối API Database Health" extra={<ApiOutlined />}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong>API Base URL:</Text>
          <Input
            placeholder="http://localhost:8080/api/v1"
            value={apiUrl}
            onChange={(e) => onApiUrlChange(e.target.value)}
            style={{ marginTop: 8 }}
            prefix={<ApiOutlined />}
            disabled={loading}
          />
          <Paragraph type="secondary" style={{ marginTop: 4, fontSize: '12px' }}>
            Base URL đã bao gồm <Text code>/api/v1</Text>
          </Paragraph>
        </div>

        <div>
          <Text strong>Endpoint:</Text>
          <Input
            placeholder="/database/health"
            value={endpoint}
            onChange={(e) => onEndpointChange(e.target.value)}
            style={{ marginTop: 8 }}
            prefix={<DatabaseOutlined />}
            disabled={true}
          />
          <Paragraph type="secondary" style={{ marginTop: 4, fontSize: '12px' }}>
            Đường dẫn endpoint (bắt đầu bằng <Text code>/</Text>)
          </Paragraph>
        </div>

        <Button
          type="primary"
          icon={<DatabaseOutlined />}
          onClick={onTest}
          loading={loading}
          size="large"
          block
        >
          Kiểm tra kết nối
        </Button>

        {corsError && (
          <Alert
            message="Lỗi CORS (Cross-Origin Resource Sharing)"
            description={
              <div>
                <Paragraph style={{ marginBottom: 8 }}>
                  Backend cần cấu hình CORS để cho phép frontend gọi API. Hãy thêm vào backend:
                </Paragraph>
                <TextArea
                  readOnly
                  rows={6}
                  value={`// Express.js example
app.use(cors({
  origin: 'http://localhost:3000', // hoặc domain của frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));`}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    marginBottom: 8,
                  }}
                />
                <Paragraph style={{ marginBottom: 0, fontSize: '12px' }}>
                  Hoặc sử dụng proxy trong Next.js config nếu không thể cấu hình CORS trên backend.
                </Paragraph>
              </div>
            }
            type="warning"
            showIcon
            closable
          />
        )}
      </Space>
    </Card>
  );
}

