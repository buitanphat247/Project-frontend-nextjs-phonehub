import { NextRequest, NextResponse } from 'next/server'

const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // Production: sử dụng deployment host
  if (process.env.NODE_ENV === 'production') {
    return 'http://180.93.43.3:8080/api/v1';
  }
  // Development: sử dụng localhost:8080
  return 'http://localhost:8080/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * API route riêng cho VNPAY submitOrder
 * Route này forward query params trực tiếp đến backend mà không thêm headers
 * để tránh ảnh hưởng đến chữ ký VNPAY
 */
export async function POST(request: NextRequest) {
  try {
    // Lấy query params từ request
    const searchParams = request.nextUrl.searchParams
    const amount = searchParams.get('amount')
    const orderInfo = searchParams.get('orderInfo')

    if (!amount || !orderInfo) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters: amount and orderInfo' },
        { status: 400 }
      )
    }

    // Build URL với query params
    const backendUrl = `${API_BASE_URL}/vnpay/submitOrder?amount=${encodeURIComponent(amount)}&orderInfo=${encodeURIComponent(orderInfo)}`

    console.log(`➡️ VNPAY: Forwarding to ${backendUrl}`)

    // Forward request đến backend
    // KHÔNG thêm bất kỳ header nào để tránh ảnh hưởng đến chữ ký VNPAY
    const response = await fetch(backendUrl, {
      method: 'POST',
      // Không thêm headers, để backend tự xử lý
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    })

    // Get response text (không phải JSON)
    const responseText = await response.text()

    console.log(`✅ VNPAY: Response status ${response.status}`)

    // Return response text trực tiếp (không parse JSON)
    // VNPAY response có format: "redirect:URL" hoặc JSON string
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  } catch (error: any) {
    console.error('❌ VNPAY Error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit VNPAY order' },
      { status: 500 }
    )
  }
}

