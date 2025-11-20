import { NextRequest, NextResponse } from "next/server";

// For server-side proxy, use environment variable or fallback
// In development: use localhost:8080
// In production: use deployment domain https://phonehub.io.vn/api/v1
const getApiBaseUrl = (): string => {
  // Ưu tiên API_BASE_URL (server-side only), sau đó NEXT_PUBLIC_API_BASE_URL
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // Production: sử dụng deployment domain
  if (process.env.NODE_ENV === 'production') {
    return "https://phonehub.io.vn/api/v1";
  }
  // Development: sử dụng localhost:8080
  return "http://localhost:8080/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params, "GET");
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params, "POST");
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params, "PUT");
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params, "DELETE");
}

async function handleRequest(request: NextRequest, params: { path: string[] }, method: string) {
  try {
    // Validate and clean path
    const pathArray = Array.isArray(params.path) ? params.path : [];

    // Filter out any invalid values (null, undefined, empty strings)
    const validPathParts = pathArray.filter(
      (p): p is string => typeof p === "string" && p.length > 0 && !p.includes("undefined") && !p.includes("[object")
    );

    if (validPathParts.length === 0) {
      console.error("⚠️ Proxy: Invalid or empty path array:", params.path);
      return NextResponse.json({ success: false, message: "Invalid proxy path" }, { status: 400 });
    }

    const path = validPathParts.join("/");

    // Ensure API_BASE_URL doesn't end with slash and path doesn't start with slash
    const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const url = `${baseUrl}/${cleanPath}`;

    // Get query params from request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    // Log the actual URL being called (critical for debugging)
    console.log(`➡️ Fetching URL: ${fullUrl}`);
    console.log(`   Method: ${method}`);
    console.log(`   Path parts:`, validPathParts);
    console.log(`   API_BASE_URL: ${API_BASE_URL}`);

    // Get headers from request
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Override Content-Type if provided
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    // Forward Accept header if provided (overrides default)
    const acceptHeader = request.headers.get("accept");
    if (acceptHeader) {
      headers["Accept"] = acceptHeader;
    }

    // Log headers being sent (for debugging)
    console.log(`📤 Request headers:`, JSON.stringify(headers, null, 2));

    // Get body for POST/PUT requests
    let body: string | undefined;
    if (method === "POST" || method === "PUT") {
      body = await request.text();
    }

    // Make request to backend
    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method,
        headers,
        body,
        // Add timeout for connection
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });

      // Log response status
      console.log(`✅ Response status: ${response.status} ${response.statusText}`);
    } catch (fetchError: any) {
      console.error(`❌ Fetch error for ${fullUrl}:`, fetchError.message);
      console.error(`   Error code: ${fetchError.code}`);
      console.error(`   Error name: ${fetchError.name}`);
      // Check if it's a connection error
      if (
        fetchError.code === "ECONNREFUSED" ||
        fetchError.name === "AggregateError" ||
        fetchError.message?.includes("ECONNREFUSED") ||
        fetchError.message?.includes("fetch failed")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Không thể kết nối đến server backend. Vui lòng kiểm tra backend có đang chạy không.",
            error: "Backend Connection Error",
            code: "ECONNREFUSED",
          },
          { status: 503 } // Service Unavailable
        );
      }

      // Other fetch errors
      return NextResponse.json(
        {
          success: false,
          message: fetchError.message || "Lỗi kết nối đến backend",
          error: "Proxy Error",
        },
        { status: 500 }
      );
    }

    // Get response data
    const data = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(data);

      // Log raw response structure for debugging (first 500 chars)
      const responsePreview = JSON.stringify(jsonData).substring(0, 500);
      console.log(`📦 Raw response preview: ${responsePreview}...`);

      // Log response summary for debugging
      if (jsonData?.data) {
        const contentLength = Array.isArray(jsonData.data?.content) ? jsonData.data.content.length : "N/A";
        const totalElements = jsonData.data?.totalElements ?? "N/A";
        console.log(`📦 Response data: success=${jsonData.success}, content.length=${contentLength}, totalElements=${totalElements}`);

        // Log full data structure if empty
        if (contentLength === 0 || totalElements === 0) {
          console.log(`⚠️ Empty response detected. Full data structure:`, JSON.stringify(jsonData, null, 2));
        }
      } else {
        // Response doesn't have expected structure
        console.warn(`⚠️ Response doesn't have 'data' field. Full response:`, JSON.stringify(jsonData, null, 2));
      }
    } catch (parseError) {
      console.error(`❌ Failed to parse JSON response`);
      console.error(`   Raw response (first 500 chars): ${data.substring(0, 500)}`);
      console.error(`   Parse error:`, parseError);
      jsonData = data;
    }

    // Forward all response headers from backend
    const responseHeaders = new Headers();

    // Copy all headers from backend response
    // Note: Headers are case-insensitive in HTTP but we preserve original case
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();

      // Forward all custom headers (x-*), content headers, and auth headers
      if (
        lowerKey.startsWith("x-") || // All custom headers including x-new-accestoken
        lowerKey === "content-type" ||
        lowerKey === "content-length" ||
        lowerKey === "cache-control" ||
        lowerKey === "set-cookie"
      ) {
        // Preserve original header name (case-sensitive)
        responseHeaders.set(key, value);
      }
    });

    // Ensure Content-Type is set
    if (!responseHeaders.has("Content-Type")) {
      responseHeaders.set("Content-Type", "application/json");
    }

    return NextResponse.json(jsonData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Proxy request failed",
        error: "Proxy Error",
      },
      { status: 500 }
    );
  }
}
