'use client';

import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import TestConnectionForm from './components/TestConnectionForm';
import TestResultCard from './components/TestResultCard';
import InfoCard from './components/InfoCard';
import { useTestConnection } from './hooks/useTestConnection';

export default function TestConnectionPage() {
  const {
    apiUrl,
    endpoint,
    loading,
    testResult,
    setApiUrl,
    setEndpoint,
    handleTestConnection,
  } = useTestConnection();

  // Handle Enter key press anywhere on the page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Chỉ trigger khi nhấn Enter và không đang focus vào input/textarea hoặc các element có thể nhập
      if (e.key === 'Enter' && !loading) {
        const target = e.target as HTMLElement;
        const isInputElement = 
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea');
        
        // Nếu không phải input element, trigger test
        if (!isInputElement) {
          e.preventDefault();
          handleTestConnection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, handleTestConnection]);

  return (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={24}>
          <TestConnectionForm
            apiUrl={apiUrl}
            endpoint={endpoint}
            loading={loading}
            corsError={testResult?.corsError}
            onApiUrlChange={setApiUrl}
            onEndpointChange={setEndpoint}
            onTest={handleTestConnection}
          />

          <TestResultCard
            loading={loading}
            testResult={testResult}
            apiUrl={apiUrl}
            endpoint={endpoint}
            onRetest={handleTestConnection}
          />

          <InfoCard apiUrl={apiUrl} endpoint={endpoint} />
        </Col>
      </Row>
    </div>
  );
}
