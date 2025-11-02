import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params
  return handleRequest(request, params, 'GET')
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params
  return handleRequest(request, params, 'POST')
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params
  return handleRequest(request, params, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params
  return handleRequest(request, params, 'DELETE')
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const path = params.path?.join('/') || ''
    const url = `${API_BASE_URL}/${path}`
    
    // Get query params from request
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    const fullUrl = queryString ? `${url}?${queryString}` : url

    // Get headers from request
    const headers: Record<string, string> = {}
    
    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    // Forward Content-Type
    const contentType = request.headers.get('content-type')
    if (contentType) {
      headers['Content-Type'] = contentType
    }

    // Get body for POST/PUT requests
    let body: string | undefined
    if (method === 'POST' || method === 'PUT') {
      body = await request.text()
    }

    // Make request to backend
    let response: Response
    try {
      response = await fetch(fullUrl, {
        method,
        headers,
        body,
        // Add timeout for connection
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      })
    } catch (fetchError: any) {
      console.error('Backend connection error:', fetchError)
      
      // Check if it's a connection error
      if (
        fetchError.code === 'ECONNREFUSED' || 
        fetchError.name === 'AggregateError' ||
        fetchError.message?.includes('ECONNREFUSED') ||
        fetchError.message?.includes('fetch failed')
      ) {
        return NextResponse.json(
          {
            success: false,
            message: 'Không thể kết nối đến server backend. Vui lòng kiểm tra backend có đang chạy không.',
            error: 'Backend Connection Error',
            code: 'ECONNREFUSED',
          },
          { status: 503 } // Service Unavailable
        )
      }
      
      // Other fetch errors
      return NextResponse.json(
        {
          success: false,
          message: fetchError.message || 'Lỗi kết nối đến backend',
          error: 'Proxy Error',
        },
        { status: 500 }
      )
    }

    // Get response data
    const data = await response.text()
    let jsonData
    try {
      jsonData = JSON.parse(data)
    } catch {
      jsonData = data
    }

    // Forward all response headers from backend
    const responseHeaders = new Headers()
    
    // Copy all headers from backend response
    // Note: Headers are case-insensitive in HTTP but we preserve original case
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase()
      
      // Forward all custom headers (x-*), content headers, and auth headers
      if (
        lowerKey.startsWith('x-') || // All custom headers including x-new-accestoken
        lowerKey === 'content-type' ||
        lowerKey === 'content-length' ||
        lowerKey === 'cache-control' ||
        lowerKey === 'set-cookie'
      ) {
        // Preserve original header name (case-sensitive)
        responseHeaders.set(key, value)
      }
    })
    
    // Ensure Content-Type is set
    if (!responseHeaders.has('Content-Type')) {
      responseHeaders.set('Content-Type', 'application/json')
    }
    

    return NextResponse.json(jsonData, {
      status: response.status,
      headers: responseHeaders,
    })
  } catch (error: any) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Proxy request failed',
        error: 'Proxy Error'
      },
      { status: 500 }
    )
  }
}

