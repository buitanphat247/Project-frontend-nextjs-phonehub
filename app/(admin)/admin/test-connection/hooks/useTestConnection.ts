import { useState } from 'react';
import { testConnection } from '../../../../../lib/api/testConnection';
import { TestResult } from '../interface/ITestResult';

export function useTestConnection() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080/api/v1');
  const [endpoint, setEndpoint] = useState('/database/health');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleTestConnection = async () => {
    if (!apiUrl || !endpoint) {
      return;
    }

    setLoading(true);
    try {
      const result = await testConnection({ apiUrl, endpoint });
      setTestResult(result);
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message || 'Đã xảy ra lỗi không xác định',
        timestamp: new Date().toLocaleString('vi-VN'),
        corsError: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    apiUrl,
    endpoint,
    loading,
    testResult,
    setApiUrl,
    setEndpoint,
    handleTestConnection,
  };
}

