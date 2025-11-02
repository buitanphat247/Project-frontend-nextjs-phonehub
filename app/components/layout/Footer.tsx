import Link from 'next/link'
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold">PhoneHub</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Nền tảng mua sắm điện thoại thông minh hàng đầu Việt Nam. 
              Chúng tôi cam kết mang đến những sản phẩm chất lượng với giá tốt nhất.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title="Facebook"
              >
                <FacebookOutlined className="text-xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title="Twitter"
              >
                <TwitterOutlined className="text-xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title="Instagram"
              >
                <InstagramOutlined className="text-xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title="YouTube"
              >
                <YoutubeOutlined className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/iphone" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  iPhone
                </Link>
              </li>
              <li>
                <Link href="/products/samsung" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  Samsung
                </Link>
              </li>
              <li>
                <Link href="/products/xiaomi" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  Xiaomi
                </Link>
              </li>
              <li>
                <Link href="/products/oppo" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  OPPO
                </Link>
              </li>
              <li>
                <Link href="/products/vivo" className="text-gray-300! hover:text-white! transition-colors block py-1">
                  Vivo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PhoneOutlined className="text-blue-400 text-lg" />
                <div>
                  <p className="text-gray-300 font-medium">1900 1234</p>
                  <p className="text-gray-400 text-sm">Hỗ trợ 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MailOutlined className="text-blue-400 text-lg" />
                <div>
                  <p className="text-gray-300 font-medium">support@phonehub.vn</p>
                  <p className="text-gray-400 text-sm">Email hỗ trợ</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <EnvironmentOutlined className="text-blue-400 text-lg mt-1" />
                <div>
                  <p className="text-gray-300 font-medium">123 Đường ABC, Quận 1</p>
                  <p className="text-gray-400 text-sm">TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} PhoneHub. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <Link 
                href="/privacy" 
                className="text-gray-400! hover:text-white! text-sm transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400! hover:text-white! text-sm transition-colors"
              >
                Điều khoản sử dụng
              </Link>
              <Link 
                href="/shipping" 
                className="text-gray-400! hover:text-white! text-sm transition-colors"
              >
                Chính sách vận chuyển
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
