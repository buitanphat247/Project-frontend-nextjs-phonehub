'use client';

import { Card, Button, Space, Typography, Alert, Spin, Descriptions, Tag, Input } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, DatabaseOutlined } from '@ant-design/icons';
import { TestResult } from '../interface/ITestResult';
import { getStatusColor } from '../../../../../lib/utils/string';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

interface TestResultCardProps {
  loading: boolean;
  testResult: TestResult | null;
  apiUrl: string;
  endpoint: string;
  onRetest: () => void;
}

export default function TestResultCard({
  loading,
  testResult,
  apiUrl,
  endpoint,
  onRetest,
}: TestResultCardProps) {
  const fullUrl = `${apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  return (
    <Card title="Kết quả kiểm tra" style={{ marginTop: 16 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: 16 }}>Đang kiểm tra kết nối...</Paragraph>
        </div>
      ) : testResult ? (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message={testResult.success ? 'Kết nối thành công!' : 'Kết nối thất bại!'}
            description={
              testResult.success
                ? `Database health check thành công với status ${testResult.status}`
                : testResult.error || `Server trả về status ${testResult.status}`
            }
            type={testResult.success ? 'success' : 'error'}
            icon={testResult.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            showIcon
          />

          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Trạng thái">
              {testResult.status ? (
                <Tag color={getStatusColor(testResult.status)}>
                  {testResult.status} {testResult.statusText}
                </Tag>
              ) : (
                <Tag color="error">
                  <CloseCircleOutlined /> Lỗi kết nối
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian phản hồi">{testResult.responseTime}ms</Descriptions.Item>
            <Descriptions.Item label="Thời gian kiểm tra" span={2}>
              {testResult.timestamp}
            </Descriptions.Item>
            <Descriptions.Item label="URL" span={2}>
              <Text code>{fullUrl}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Response Data" span={2}>
              <TextArea
                readOnly
                rows={10}
                value={
                  testResult.data
                    ? JSON.stringify(testResult.data, null, 2)
                    : testResult.error || 'Không có dữ liệu'
                }
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
            </Descriptions.Item>
          </Descriptions>

          <Button icon={<ReloadOutlined />} onClick={onRetest} loading={loading} style={{ marginTop: 8 }}>
            Kiểm tra lại
          </Button>
        </Space>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <DatabaseOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
          <Paragraph type="secondary" style={{ marginTop: 16 }}>
            Nhấn "Kiểm tra kết nối" để kiểm tra trạng thái database
          </Paragraph>
        </div>
      )}
    </Card>
  );
}

