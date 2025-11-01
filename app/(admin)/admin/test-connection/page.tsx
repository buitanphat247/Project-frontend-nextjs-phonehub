'use client';

import React from 'react';
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
