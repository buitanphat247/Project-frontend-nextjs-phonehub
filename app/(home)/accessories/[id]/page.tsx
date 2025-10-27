"use client";

import { useState, useEffect } from "react";
import { Collapse } from "antd";
import { Product } from "../../products/interface/IProduct";
import ProductBreadcrumb from "../../products/components/ProductBreadcrumb";
import ProductImage from "../../products/components/ProductImage";
import ProductInfo from "../../products/components/ProductInfo";
import RelatedProducts from "../../products/components/RelatedProducts";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const AccessoryDetailPage = ({ params }: PageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(parseInt(resolvedParams.id));
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (id === 0) return;

    const generateProduct = () => {
      const baseProducts: Omit<Product, "discountPercent" | "isOnSale" | "rating" | "reviews">[] = [
        { id: 1, name: "AirPods Pro 2nd Gen", price: 5990000, originalPrice: 6990000, image: "🎧", brand: "Apple", category: "accessories" },
        { id: 2, name: "Samsung Galaxy Buds2 Pro", price: 3990000, originalPrice: 4990000, image: "🎧", brand: "Samsung", category: "accessories" },
        { id: 3, name: "Sony WH-1000XM5", price: 6990000, originalPrice: 7990000, image: "🎧", brand: "Sony", category: "accessories" },
        { id: 4, name: "Bose QuietComfort 45", price: 5990000, originalPrice: 6990000, image: "🎧", brand: "Bose", category: "accessories" },
        { id: 5, name: "Apple Watch Series 9", price: 8990000, originalPrice: 9990000, image: "⌚", brand: "Apple", category: "accessories" },
        { id: 6, name: "Samsung Galaxy Watch 6", price: 6990000, originalPrice: 7990000, image: "⌚", brand: "Samsung", category: "accessories" },
        { id: 7, name: "iPhone 15 Case", price: 299000, originalPrice: 399000, image: "📱", brand: "Apple", category: "accessories" },
        { id: 8, name: "Samsung Galaxy S24 Case", price: 199000, originalPrice: 299000, image: "📱", brand: "Samsung", category: "accessories" },
        { id: 9, name: "MacBook Pro Charger", price: 1990000, originalPrice: 2290000, image: "🔌", brand: "Apple", category: "accessories" },
        { id: 10, name: "USB-C Hub", price: 599000, originalPrice: 799000, image: "🔌", brand: "Anker", category: "accessories" },
        { id: 11, name: "AirPods 3rd Gen", price: 3990000, originalPrice: 4990000, image: "🎧", brand: "Apple", category: "accessories" },
        { id: 12, name: "Samsung Galaxy Buds Live", price: 2990000, originalPrice: 3990000, image: "🎧", brand: "Samsung", category: "accessories" },
        { id: 13, name: "Sony WF-1000XM4", price: 4990000, originalPrice: 5990000, image: "🎧", brand: "Sony", category: "accessories" },
        { id: 14, name: "Bose Sport Earbuds", price: 3990000, originalPrice: 4990000, image: "🎧", brand: "Bose", category: "accessories" },
        { id: 15, name: "Apple Watch SE", price: 5990000, originalPrice: 6990000, image: "⌚", brand: "Apple", category: "accessories" },
        { id: 16, name: "Samsung Galaxy Watch 5", price: 4990000, originalPrice: 5990000, image: "⌚", brand: "Samsung", category: "accessories" },
        { id: 17, name: "iPhone 15 Pro Case", price: 399000, originalPrice: 499000, image: "📱", brand: "Apple", category: "accessories" },
        { id: 18, name: "Samsung Galaxy S24 Ultra Case", price: 299000, originalPrice: 399000, image: "📱", brand: "Samsung", category: "accessories" },
        { id: 19, name: "MacBook Air Charger", price: 1490000, originalPrice: 1790000, image: "🔌", brand: "Apple", category: "accessories" },
        { id: 20, name: "Wireless Charger", price: 299000, originalPrice: 399000, image: "🔌", brand: "Anker", category: "accessories" },
      ];

      const foundProduct = baseProducts.find((p) => p.id === id);

      if (foundProduct) {
        return {
          ...foundProduct,
          discountPercent: Math.floor(((foundProduct.originalPrice - foundProduct.price) / foundProduct.originalPrice) * 100),
          isOnSale: id % 3 === 0,
          rating: 4 + (id % 5) * 0.2,
          reviews: Math.floor(Math.random() * 1000) + 100,
        } as Product;
      }
      return null;
    };

    const productData = generateProduct();
    setProduct(productData);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-600 mb-6">Sản phẩm bạn tìm kiếm không tồn tại.</p>
          <a href="/accessories" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            Quay lại danh sách
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <ProductBreadcrumb category="accessories" productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <ProductImage product={product} />

          {/* Product Info */}
          <ProductInfo product={product} category="accessories" />
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Thông số kỹ thuật</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Loại sản phẩm</td>
                  <td className="px-6 py-4 text-gray-900">Phụ kiện điện tử</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Kết nối</td>
                  <td className="px-6 py-4 text-gray-900">Bluetooth 5.0, USB-C</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Pin</td>
                  <td className="px-6 py-4 text-gray-900">Li-ion 500mAh</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Thời gian sử dụng</td>
                  <td className="px-6 py-4 text-gray-900">6-8 giờ</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Chống nước</td>
                  <td className="px-6 py-4 text-gray-900">IPX4</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Trọng lượng</td>
                  <td className="px-6 py-4 text-gray-900">5.4g</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Màu sắc</td>
                  <td className="px-6 py-4 text-gray-900">Đen, Trắng, Xanh</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-600 font-medium">Bảo hành</td>
                  <td className="px-6 py-4 text-gray-900">12 tháng</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts product={product} />
      </div>
    </div>
  );
};

export default AccessoryDetailPage;
