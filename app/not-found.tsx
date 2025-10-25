import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📱</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Trang không tồn tại
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            🏠 Về trang chủ
          </Link>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <Link
            href="/products"
            className="block text-blue-600 hover:text-blue-800 transition-colors"
          >
            📱 Xem sản phẩm
          </Link>
          <Link
            href="/contact"
            className="block text-gray-600 hover:text-gray-800 transition-colors"
          >
            📞 Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  )
}
