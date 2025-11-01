"use client";

import React, { useState } from "react";
import { Card, Button, Input, Space, Typography, Alert, Spin, Row, Col, Tag, Descriptions, Divider } from "antd";
import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined, DatabaseOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface TestResult {
  success: boolean;
  status?: number;
  statusText?: string;
  responseTime?: number;
  data?: any;
  error?: string;
  timestamp?: string;
  corsError?: boolean;
}

export default function TestConnectionPage() {
  const [apiUrl, setApiUrl] = useState("http://localhost:8080/api/v1");
  const [endpoint, setEndpoint] = useState("/database/health");
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleTestConnection = async () => {
    if (!apiUrl || !endpoint) {
      return;
    }

    setLoading(true);
    // Đảm bảo endpoint bắt đầu bằng / và base URL không kết thúc bằng /
    const cleanApiUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const fullUrl = `${cleanApiUrl}${cleanEndpoint}`;
    const startTime = Date.now();

    try {
      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      };

      const response = await fetch(fullUrl, options);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const result: TestResult = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        responseTime,
        data,
        timestamp: new Date().toLocaleString("vi-VN"),
        corsError: false,
      };

      setTestResult(result);
    } catch (error: any) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Kiểm tra nếu là lỗi CORS
      const isCorsError = error.message?.includes("CORS") || error.message?.includes("fetch") || error.name === "TypeError";

      const result: TestResult = {
        success: false,
        responseTime,
        error: error.message || "Không thể kết nối đến server",
        timestamp: new Date().toLocaleString("vi-VN"),
        corsError: isCorsError,
      };

      setTestResult(result);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: number) => {
    if (!status) return "default";
    if (status >= 200 && status < 300) return "success";
    if (status >= 300 && status < 400) return "warning";
    if (status >= 400) return "error";
    return "default";
  };

  return (
    <div className="space-y-4">

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Kiểm tra kết nối API Database Health" extra={<ApiOutlined />}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div>
                <Text strong>API Base URL:</Text>
                <Input
                  placeholder="http://localhost:8080/api/v1"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  style={{ marginTop: 8 }}
                  prefix={<ApiOutlined />}
                  disabled={loading}
                />
                <Paragraph type="secondary" style={{ marginTop: 4, fontSize: "12px" }}>
                  Base URL đã bao gồm <Text code>/api/v1</Text>
                </Paragraph>
              </div>

              <div>
                <Text strong>Endpoint:</Text>
                <Input
                  placeholder="/database/health"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  style={{ marginTop: 8 }}
                  prefix={<DatabaseOutlined />}
                  disabled={loading}
                />
                <Paragraph type="secondary" style={{ marginTop: 4, fontSize: "12px" }}>
                  Đường dẫn endpoint (bắt đầu bằng <Text code>/</Text>)
                </Paragraph>
              </div>

              <Button type="primary" icon={<DatabaseOutlined />} onClick={handleTestConnection} loading={loading} size="large" block>
                Kiểm tra kết nối
              </Button>

              {testResult?.corsError && (
                <Alert
                  message="Lỗi CORS (Cross-Origin Resource Sharing)"
                  description={
                    <div>
                      <Paragraph style={{ marginBottom: 8 }}>Backend cần cấu hình CORS để cho phép frontend gọi API. Hãy thêm vào backend:</Paragraph>
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
                          fontFamily: "monospace",
                          fontSize: "11px",
                          marginBottom: 8,
                        }}
                      />
                      <Paragraph style={{ marginBottom: 0, fontSize: "12px" }}>
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

          <Card title="Kết quả kiểm tra" style={{ marginTop: 16 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: 16 }}>Đang kiểm tra kết nối...</Paragraph>
              </div>
            ) : testResult ? (
              <Space direction="vertical" style={{ width: "100%" }} size="large">
                <Alert
                  message={testResult.success ? "Kết nối thành công!" : "Kết nối thất bại!"}
                  description={
                    testResult.success
                      ? `Database health check thành công với status ${testResult.status}`
                      : testResult.error || `Server trả về status ${testResult.status}`
                  }
                  type={testResult.success ? "success" : "error"}
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
                    <Text code>
                      {`${apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Response Data" span={2}>
                    <TextArea
                      readOnly
                      rows={10}
                      value={testResult.data ? JSON.stringify(testResult.data, null, 2) : testResult.error || "Không có dữ liệu"}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "12px",
                      }}
                    />
                  </Descriptions.Item>
                </Descriptions>

                <Button icon={<ReloadOutlined />} onClick={handleTestConnection} loading={loading} style={{ marginTop: 8 }}>
                  Kiểm tra lại
                </Button>
              </Space>
            ) : (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <DatabaseOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
                <Paragraph type="secondary" style={{ marginTop: 16 }}>
                  Nhấn "Kiểm tra kết nối" để kiểm tra trạng thái database
                </Paragraph>
              </div>
            )}
          </Card>

          <Card title="Thông tin" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>URL đầy đủ:</Text>
                <Paragraph style={{ marginTop: 4 }}>
                  <Text code>
                    GET {`${apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`}
                  </Text>
                </Paragraph>
              </div>

              <Divider style={{ margin: "16px 0" }} />

              <div>
                <Text strong>Lưu ý:</Text>
                <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: "13px" }}>
                  <li>Đảm bảo backend đang chạy tại URL đã nhập</li>
                  <li>Kiểm tra CORS nếu gặp lỗi "CORS policy"</li>
                  <li>Kiểm tra firewall/network nếu không kết nối được</li>
                  <li>Kiểm tra console (F12) để xem chi tiết lỗi</li>
                  <li>API này sẽ kiểm tra trạng thái kết nối database</li>
                </ul>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
