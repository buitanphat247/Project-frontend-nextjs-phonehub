import Link from 'next/link'
import { HomeOutlined, ShoppingOutlined, CustomerServiceOutlined, FileSearchOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
            <FileSearchOutlined className="text-6xl text-blue-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Trang không tồn tại
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
            Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Link href="/">
            <Button 
              type="primary" 
              size="large"
              icon={<HomeOutlined />}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 h-12 px-8 text-base"
            >
              Về trang chủ
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <Link href="/products" className="block">
            <Button 
              type="default" 
              size="large"
              icon={<ShoppingOutlined />}
              className="w-full h-11 text-base border-gray-300 hover:border-blue-600 hover:text-blue-600"
            >
              Xem sản phẩm
            </Button>
          </Link>
          <Link href="/contact" className="block">
            <Button 
              type="default" 
              size="large"
              icon={<CustomerServiceOutlined />}
              className="w-full h-11 text-base border-gray-300 hover:border-blue-600 hover:text-blue-600"
            >
              Liên hệ hỗ trợ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
