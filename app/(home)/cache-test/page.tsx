"use client";

import React, { useState } from "react";
import { Button, Card, Statistic, Space, Divider, Alert, Tag } from "antd";
import { ThunderboltOutlined, ReloadOutlined, ClearOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { getProductsByCategory } from "../../../lib/api/products";
import { clearCache, getCacheStats } from "../../../lib/utils/cache";
import { apiGet } from "../../../lib/utils/apiClient";

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
  const [cacheStats, setCacheStats] = useState<{ size: number; keys: string[] } | null>(null);

  const updateCacheStats = () => {
    setCacheStats(getCacheStats());
  };

  const testWithCache = async (categoryId: number): Promise<number> => {
    const start = performance.now();
    await getProductsByCategory(categoryId, 0, 5);
    return performance.now() - start;
  };

  const testWithoutCache = async (categoryId: number): Promise<number> => {
    const queryParams = new URLSearchParams({
      page: "0",
      size: "5",
    });
    const start = performance.now();
    await apiGet(`/products/published/category/${categoryId}?${queryParams}`, {
      useCache: false,
    });
    return performance.now() - start;
  };

  const runTest = async (categoryId: number, categoryName: string) => {
    setLoading(true);
    try {
      // Clear cache trước khi test
      clearCache();
      updateCacheStats();

      // Test lần 1: Không có cache (cold start)
      const withoutCacheTime = await testWithoutCache(categoryId);

      // Test lần 2: Có cache (warm start)
      const withCacheTime = await testWithCache(categoryId);

      // Test lần 3: Có cache (cached)
      const withCacheTime2 = await testWithCache(categoryId);

      const improvement = ((withoutCacheTime - withCacheTime2) / withoutCacheTime) * 100;

      setResults((prev) => [
        ...prev,
        {
          withCache: withCacheTime2,
          withoutCache: withoutCacheTime,
          improvement,
          cacheHit: true,
        },
      ]);

      updateCacheStats();
    } catch (error) {
      console.error("Test error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllCache = () => {
    clearCache();
    setResults([]);
    updateCacheStats();
  };

  React.useEffect(() => {
    updateCacheStats();
  }, []);

  const averageImprovement =
    results.length > 0
      ? results.reduce((sum, r) => sum + (r.improvement || 0), 0) / results.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card className="mb-6">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <ThunderboltOutlined className="mr-3 text-blue-600" />
            Cache Performance Test
          </h1>
          <p className="text-gray-600 mb-4">
            Test tốc độ load với và không có cache để so sánh hiệu suất
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
              onClick={clearAllCache}
              danger
            >
              Clear Cache
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={updateCacheStats}
            >
              Refresh Stats
            </Button>
          </Space>
        </Card>

        {cacheStats && (
          <Card className="mb-6" title="Cache Statistics">
            <Space size="large">
              <Statistic
                title="Cache Entries"
                value={cacheStats.size}
                prefix={<ClockCircleOutlined />}
              />
              <div>
                <div className="text-sm text-gray-600 mb-2">Cache Keys:</div>
                <div className="flex flex-wrap gap-2">
                  {cacheStats.keys.slice(0, 10).map((key, idx) => (
                    <Tag key={idx} color="blue">
                      {key.substring(0, 30)}...
                    </Tag>
                  ))}
                  {cacheStats.keys.length > 10 && (
                    <Tag>+{cacheStats.keys.length - 10} more</Tag>
                  )}
                </div>
              </div>
            </Space>
          </Card>
        )}

        {results.length > 0 && (
          <Card title="Test Results">
            <div className="mb-4">
              <Alert
                message={`Average Improvement: ${averageImprovement.toFixed(2)}%`}
                description={`Cache giúp tăng tốc độ load trung bình ${averageImprovement.toFixed(2)}%`}
                type="success"
                showIcon
              />
            </div>

            <Divider />

            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} size="small" className="mb-4">
                  <Space size="large" wrap>
                    <Statistic
                      title="Without Cache"
                      value={result.withoutCache?.toFixed(2)}
                      suffix="ms"
                      valueStyle={{ color: "#cf1322" }}
                    />
                    <Statistic
                      title="With Cache"
                      value={result.withCache?.toFixed(2)}
                      suffix="ms"
                      valueStyle={{ color: "#3f8600" }}
                    />
                    <Statistic
                      title="Improvement"
                      value={result.improvement?.toFixed(2)}
                      suffix="%"
                      prefix={result.improvement && result.improvement > 0 ? "+" : ""}
                      valueStyle={{
                        color: result.improvement && result.improvement > 0 ? "#3f8600" : "#cf1322",
                      }}
                    />
                    {result.cacheHit && (
                      <Tag color="green" icon={<ThunderboltOutlined />}>
                        Cache Hit
                      </Tag>
                    )}
                  </Space>
                </Card>
              ))}
            </div>
          </Card>
        )}

        <Card className="mt-6" title="Hướng dẫn">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Test với Cache:</strong> Click vào nút test để chạy test. Lần đầu sẽ load từ API, lần sau sẽ load từ cache.
            </li>
            <li>
              <strong>So sánh:</strong> Kết quả sẽ hiển thị thời gian load với và không có cache, cùng với % cải thiện.
            </li>
            <li>
              <strong>Clear Cache:</strong> Xóa tất cả cache để test lại từ đầu.
            </li>
            <li>
              <strong>Cache TTL:</strong> Products cache trong 5 phút, Categories cache trong 10 phút.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default CacheTestPage;

