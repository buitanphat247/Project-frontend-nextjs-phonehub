"use client";

import React, { useState } from "react";
import { Button, Card, Statistic, Space } from "antd";
import { ThunderboltOutlined, ClearOutlined } from "@ant-design/icons";
import { getProductsByCategory } from "../../../lib/api/products";

const PHONES_CATEGORY_ID = 2;
const LAPTOPS_CATEGORY_ID = 3;

interface TestResult {
  withCache: number | null;
  withoutCache: number | null;
  improvement: number | null;
  cacheHit: boolean;
}

const CacheTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const testLoadTime = async (categoryId: number): Promise<number> => {
    const start = performance.now();
    await getProductsByCategory(categoryId, 0, 5);
    return performance.now() - start;
  };

  const runTest = async (categoryId: number, categoryName: string) => {
    setLoading(true);
    try {
      // Test load time
      const loadTime = await testLoadTime(categoryId);

      setResults((prev) => [
        ...prev,
        {
          withCache: loadTime,
          withoutCache: loadTime,
          improvement: 0,
          cacheHit: false,
        },
      ]);
    } catch (error) {
      console.error("Test error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="mb-6">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <ThunderboltOutlined className="mr-3 text-blue-700" />
            API Performance Test
          </h1>
          <p className="text-gray-600 mb-4">
            Test tốc độ load API để kiểm tra hiệu suất
          </p>

          <Space size="large" wrap>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => runTest(PHONES_CATEGORY_ID, "Điện thoại")}
              loading={loading}
            >
              Test Điện thoại
            </Button>
            <Button
              type="primary"
              icon={<ThunderboltOutlined />}
              onClick={() => runTest(LAPTOPS_CATEGORY_ID, "Laptop")}
              loading={loading}
            >
              Test Laptop
            </Button>
            <Button
              icon={<ClearOutlined />}
              onClick={clearResults}
              danger
            >
              Clear Results
            </Button>
          </Space>
        </Card>

        {results.length > 0 && (
          <Card title="Test Results">
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} size="small" className="mb-4">
                  <Space size="large" wrap>
                    <Statistic
                      title="Load Time"
                      value={result.withCache?.toFixed(2)}
                      suffix="ms"
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Space>
                </Card>
              ))}
            </div>
          </Card>
        )}

        <Card className="mt-6" title="Hướng dẫn">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Test API:</strong> Click vào nút test để kiểm tra tốc độ load API.
            </li>
            <li>
              <strong>Kết quả:</strong> Hiển thị thời gian load API tính bằng milliseconds.
            </li>
            <li>
              <strong>Clear Results:</strong> Xóa tất cả kết quả test.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default CacheTestPage;

