import { defaultFetchOptions } from './config';

export interface TestConnectionParams {
  apiUrl: string;
  endpoint: string;
}

export async function testConnection({ apiUrl, endpoint }: TestConnectionParams) {
  // Đảm bảo endpoint bắt đầu bằng / và base URL không kết thúc bằng /
  const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${cleanApiUrl}${cleanEndpoint}`;
  const startTime = Date.now();

  try {
    const options: RequestInit = {
      ...defaultFetchOptions,
      method: 'GET',
    };

    const response = await fetch(fullUrl, options);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      data,
      timestamp: new Date().toLocaleString('vi-VN'),
      corsError: false,
    };
  } catch (error: any) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Kiểm tra nếu là lỗi CORS
    const isCorsError =
      error.message?.includes('CORS') ||
      error.message?.includes('fetch') ||
      error.name === 'TypeError';

    return {
      success: false,
      responseTime,
      error: error.message || 'Không thể kết nối đến server',
      timestamp: new Date().toLocaleString('vi-VN'),
      corsError: isCorsError,
    };
  }
}

