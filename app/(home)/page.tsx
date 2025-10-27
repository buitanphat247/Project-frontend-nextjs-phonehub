import React from "react";
import Link from "next/link";
import { Button } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  StarOutlined,
  PhoneOutlined,
  LaptopOutlined,
  TabletOutlined,
  GiftOutlined,
  TruckOutlined,
  SafetyOutlined,
  AudioOutlined,
} from "@ant-design/icons";
import { Product } from "./products/interface/IProduct";
import ProductCard from "./products/components/ProductCard";

const HomePage = () => {
  // Sample products for each category
  const sampleProducts: Product[] = [
    // Phones
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      price: 29990000,
      originalPrice: 32990000,
      image: "📱",
      brand: "Apple",
      category: "phones",
      discountPercent: 9,
      isOnSale: true,
      rating: 4.8,
      reviews: 1247,
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      price: 24990000,
      originalPrice: 27990000,
      image: "📱",
      brand: "Samsung",
      category: "phones",
      discountPercent: 11,
      isOnSale: false,
      rating: 4.6,
      reviews: 892,
    },
    {
      id: 3,
      name: "Xiaomi 14 Pro",
      price: 19990000,
      originalPrice: 22990000,
      image: "📱",
      brand: "Xiaomi",
      category: "phones",
      discountPercent: 13,
      isOnSale: true,
      rating: 4.4,
      reviews: 634,
    },
    {
      id: 4,
      name: "Google Pixel 8 Pro",
      price: 22990000,
      originalPrice: 25990000,
      image: "📱",
      brand: "Google",
      category: "phones",
      discountPercent: 12,
      isOnSale: false,
      rating: 4.5,
      reviews: 456,
    },
    {
      id: 5,
      name: "OnePlus 12",
      price: 18990000,
      originalPrice: 21990000,
      image: "📱",
      brand: "OnePlus",
      category: "phones",
      discountPercent: 14,
      isOnSale: true,
      rating: 4.3,
      reviews: 378,
    },

    // Laptops
    {
      id: 6,
      name: "MacBook Pro M3",
      price: 45990000,
      originalPrice: 49990000,
      image: "💻",
      brand: "Apple",
      category: "laptops",
      discountPercent: 8,
      isOnSale: false,
      rating: 4.9,
      reviews: 567,
    },
    {
      id: 7,
      name: "Dell XPS 15",
      price: 38990000,
      originalPrice: 42990000,
      image: "💻",
      brand: "Dell",
      category: "laptops",
      discountPercent: 9,
      isOnSale: true,
      rating: 4.7,
      reviews: 423,
    },
    {
      id: 8,
      name: "HP Spectre x360",
      price: 32990000,
      originalPrice: 36990000,
      image: "💻",
      brand: "HP",
      category: "laptops",
      discountPercent: 11,
      isOnSale: false,
      rating: 4.5,
      reviews: 312,
    },
    {
      id: 9,
      name: "Lenovo ThinkPad X1",
      price: 35990000,
      originalPrice: 39990000,
      image: "💻",
      brand: "Lenovo",
      category: "laptops",
      discountPercent: 10,
      isOnSale: true,
      rating: 4.6,
      reviews: 289,
    },
    {
      id: 10,
      name: "ASUS ROG Strix",
      price: 27990000,
      originalPrice: 31990000,
      image: "💻",
      brand: "ASUS",
      category: "laptops",
      discountPercent: 13,
      isOnSale: false,
      rating: 4.4,
      reviews: 198,
    },

    // iPads
    {
      id: 11,
      name: "iPad Pro 12.9",
      price: 22990000,
      originalPrice: 25990000,
      image: "📱",
      brand: "Apple",
      category: "ipads",
      discountPercent: 12,
      isOnSale: true,
      rating: 4.8,
      reviews: 445,
    },
    {
      id: 12,
      name: "iPad Air 5",
      price: 17990000,
      originalPrice: 20990000,
      image: "📱",
      brand: "Apple",
      category: "ipads",
      discountPercent: 14,
      isOnSale: false,
      rating: 4.6,
      reviews: 334,
    },
    {
      id: 13,
      name: "iPad mini 6",
      price: 12990000,
      originalPrice: 15990000,
      image: "📱",
      brand: "Apple",
      category: "ipads",
      discountPercent: 19,
      isOnSale: true,
      rating: 4.5,
      reviews: 267,
    },
    {
      id: 14,
      name: "Samsung Galaxy Tab S9",
      price: 19990000,
      originalPrice: 22990000,
      image: "📱",
      brand: "Samsung",
      category: "ipads",
      discountPercent: 13,
      isOnSale: false,
      rating: 4.4,
      reviews: 189,
    },
    {
      id: 15,
      name: "Microsoft Surface Pro",
      price: 24990000,
      originalPrice: 27990000,
      image: "📱",
      brand: "Microsoft",
      category: "ipads",
      discountPercent: 11,
      isOnSale: true,
      rating: 4.3,
      reviews: 156,
    },

    // Accessories
    {
      id: 16,
      name: "AirPods Pro 2",
      price: 5990000,
      originalPrice: 6990000,
      image: "🎧",
      brand: "Apple",
      category: "accessories",
      discountPercent: 14,
      isOnSale: true,
      rating: 4.7,
      reviews: 892,
    },
    {
      id: 17,
      name: "Sony WH-1000XM5",
      price: 7990000,
      originalPrice: 8990000,
      image: "🎧",
      brand: "Sony",
      category: "accessories",
      discountPercent: 11,
      isOnSale: false,
      rating: 4.8,
      reviews: 567,
    },
    {
      id: 18,
      name: "Magic Mouse 3",
      price: 2990000,
      originalPrice: 3490000,
      image: "🖱️",
      brand: "Apple",
      category: "accessories",
      discountPercent: 14,
      isOnSale: true,
      rating: 4.2,
      reviews: 234,
    },
    {
      id: 19,
      name: "Logitech MX Master 3S",
      price: 2490000,
      originalPrice: 2990000,
      image: "🖱️",
      brand: "Logitech",
      category: "accessories",
      discountPercent: 17,
      isOnSale: false,
      rating: 4.6,
      reviews: 345,
    },
    {
      id: 20,
      name: "Samsung Galaxy Watch 6",
      price: 6990000,
      originalPrice: 7990000,
      image: "⌚",
      brand: "Samsung",
      category: "accessories",
      discountPercent: 13,
      isOnSale: true,
      rating: 4.5,
      reviews: 278,
    },
  ];

  const categories = [
    {
      name: "Điện thoại",
      icon: <PhoneOutlined className="text-4xl" />,
      link: "/phones",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      name: "Laptop",
      icon: <LaptopOutlined className="text-4xl" />,
      link: "/laptops",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      name: "iPad",
      icon: <TabletOutlined className="text-4xl" />,
      link: "/ipads",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      name: "Phụ kiện",
      icon: <AudioOutlined className="text-4xl" />,
      link: "/accessories",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const features = [
    {
      icon: <TruckOutlined className="text-3xl" />,
      title: "Giao hàng nhanh",
      description: "Giao hàng trong 24h tại TP.HCM",
    },
    {
      icon: <SafetyOutlined className="text-3xl" />,
      title: "Bảo hành chính hãng",
      description: "Bảo hành 12-24 tháng từ nhà sản xuất",
    },
    {
      icon: <GiftOutlined className="text-3xl" />,
      title: "Ưu đãi hấp dẫn",
      description: "Giảm giá lên đến 50% mỗi tuần",
    },
    {
      icon: <AudioOutlined className="text-3xl" />,
      title: "Hỗ trợ 24/7",
      description: "Tư vấn miễn phí mọi lúc",
    },
  ];

  const stats = [
    { number: "50K+", label: "Khách hàng tin tưởng" },
    { number: "10K+", label: "Sản phẩm đa dạng" },
    { number: "99%", label: "Khách hàng hài lòng" },
    { number: "24/7", label: "Hỗ trợ khách hàng" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Chào mừng đến với <span className="text-yellow-300">PhoneHub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Điểm đến hàng đầu cho điện thoại, laptop và phụ kiện công nghệ</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-black font-semibold px-8 py-4 h-auto"
              >
                <ShoppingCartOutlined className="mr-2" />
                Mua sắm ngay
              </Button>
              <Button size="large" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 h-auto">
                <HeartOutlined className="mr-2" />
                Yêu thích
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-300 rounded-full opacity-25 animate-pulse"></div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Danh mục sản phẩm</h2>
            <p className="text-gray-600 text-lg">Khám phá các sản phẩm công nghệ đa dạng</p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link key={index} href={category.link}>
                  <div className={`${category.bgColor} rounded-2xl p-8 text-center border border-gray-200 hover:border-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                    <div className={`${category.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <div className={`w-12 h-1 bg-linear-to-r ${category.color} mx-auto rounded-full`}></div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 text-lg">Khám phá những sản phẩm công nghệ mới nhất và được yêu thích nhất</p>
          </div> */}

          {/* Phones Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <PhoneOutlined className="mr-3 text-blue-600" />
                Điện thoại
              </h3>
              <Link href="/phones" className="text-blue-600 hover:text-blue-700 font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {sampleProducts
                .filter((p) => p.category === "phones")
                .slice(0, 5)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

          {/* Laptops Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <LaptopOutlined className="mr-3 text-green-600" />
                Laptop
              </h3>
              <Link href="/laptops" className="text-green-600 hover:text-green-700 font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {sampleProducts
                .filter((p) => p.category === "laptops")
                .slice(0, 5)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

          {/* iPads Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <TabletOutlined className="mr-3 text-purple-600" />
                iPad & Tablet
              </h3>
              <Link href="/ipads" className="text-purple-600 hover:text-purple-700 font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {sampleProducts
                .filter((p) => p.category === "ipads")
                .slice(0, 5)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

          {/* Accessories Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <AudioOutlined className="mr-3 text-orange-600" />
                Phụ kiện
              </h3>
              <Link href="/accessories" className="text-orange-600 hover:text-orange-700 font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {sampleProducts
                .filter((p) => p.category === "accessories")
                .slice(0, 5)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="bg-gray-50 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tin tức công nghệ</h2>
            <p className="text-gray-600 text-lg">Cập nhật những tin tức mới nhất về công nghệ và sản phẩm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* News Item 1 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-6xl">📱</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Điện thoại</span>
                  <span className="text-gray-500 text-sm ml-auto">2 ngày trước</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  iPhone 16 Pro Max ra mắt với camera 48MP mới
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  Apple vừa chính thức ra mắt iPhone 16 Pro Max với camera chính 48MP, chip A18 Pro mạnh mẽ và thiết kế titan cao cấp...
                </p>
              </div>
            </div>

            {/* News Item 2 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <div className="text-white text-6xl">💻</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Laptop</span>
                  <span className="text-gray-500 text-sm ml-auto">3 ngày trước</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  MacBook Pro M4 với hiệu năng vượt trội
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  Chip M4 mới của Apple mang lại hiệu năng xử lý nhanh hơn 40% so với thế hệ trước, tiết kiệm pin và hỗ trợ AI...
                </p>
              </div>
            </div>

            {/* News Item 3 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <div className="text-white text-6xl">🎧</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Phụ kiện</span>
                  <span className="text-gray-500 text-sm ml-auto">5 ngày trước</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  AirPods Pro 3 với chống ồn cải tiến
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  Thế hệ mới của AirPods Pro được nâng cấp với công nghệ chống ồn thông minh, thời lượng pin lên đến 8 giờ...
                </p>
              </div>
            </div>

            {/* News Item 4 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <div className="text-white text-6xl">📱</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Công nghệ</span>
                  <span className="text-gray-500 text-sm ml-auto">1 tuần trước</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  Samsung Galaxy S25 Ultra với màn hình 6.8 inch
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  Samsung chuẩn bị ra mắt Galaxy S25 Ultra với màn hình Dynamic AMOLED 2X 6.8 inch, camera 200MP và pin 5000mAh...
                </p>
              </div>
            </div>

            {/* News Item 5 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <div className="text-white text-6xl">⌚</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Smartwatch</span>
                  <span className="text-gray-500 text-sm ml-auto">1 tuần trước</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  Apple Watch Series 10 với màn hình lớn hơn
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  Apple Watch Series 10 sẽ có màn hình 2.1 inch, chip S10 mới, theo dõi sức khỏe nâng cao và thời lượng pin 2 ngày...
                </p>
              </div>
            </div>

            {/* News Item 6 */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="h-48 bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-6xl">🎮</div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Gaming</span>
                  <span className="text-gray-500 text-sm ml-auto">2 tuần trước</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  PlayStation 5 Pro với hiệu năng 4K 120fps
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  Sony ra mắt PlayStation 5 Pro với GPU mạnh hơn 45%, hỗ trợ 4K 120fps, SSD 2TB và thiết kế mới hoàn toàn...
                </p>
              </div>
            </div>
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <Button 
              size="large" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto border-0"
            >
              Xem tất cả tin tức
            </Button>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default HomePage;