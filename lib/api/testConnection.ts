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
  
  // Measure API call duration (client-side only)
  const start = typeof window !== 'undefined' ? performance.now() : 0;
  const startTime = Date.now();

  try {
    const options: RequestInit = {
      ...defaultFetchOptions,
      method: 'GET',
    };

    const response = await fetch(fullUrl, options);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Calculate duration using performance.now() for logging
    const duration = typeof window !== 'undefined' 
      ? (performance.now() - start).toFixed(2) 
      : responseTime.toString();
    
    // Log timing (always log in client-side)
    if (typeof window !== 'undefined') {
      if (response.ok) {
        console.log(`✅ Test Connection [${response.status}] ${fullUrl} (${duration} ms)`);
      } else {
        console.error(`❌ Test Connection [${response.status}] ${fullUrl} (${duration} ms)`);
      }
    }

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
    
    // Calculate duration using performance.now() for logging
    const duration = typeof window !== 'undefined' 
      ? (performance.now() - start).toFixed(2) 
      : responseTime.toString();
    
    // Log error timing (always log in client-side)
    if (typeof window !== 'undefined') {
      console.error(`❌ Test Connection failed ${fullUrl} (${duration} ms):`, error);
    }

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

