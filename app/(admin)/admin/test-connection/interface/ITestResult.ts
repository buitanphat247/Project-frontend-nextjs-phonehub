export interface TestResult {
  success: boolean;
  status?: number;
  statusText?: string;
  responseTime?: number;
  data?: any;
  error?: string;
  timestamp?: string;
  corsError?: boolean;
}

