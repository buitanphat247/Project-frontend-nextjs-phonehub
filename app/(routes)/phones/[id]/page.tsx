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

const PhoneDetailPage = ({ params }: PageProps) => {
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
        { id: 1, name: "iPhone 15 Pro Max", price: 29990000, originalPrice: 32990000, image: "📱", brand: "Apple", category: "phones" },
        { id: 2, name: "Samsung Galaxy S24 Ultra", price: 24990000, originalPrice: 27990000, image: "📱", brand: "Samsung", category: "phones" },
        { id: 3, name: "Xiaomi 14 Pro", price: 19990000, originalPrice: 22990000, image: "📱", brand: "Xiaomi", category: "phones" },
        { id: 4, name: "Google Pixel 8 Pro", price: 22990000, originalPrice: 25990000, image: "📱", brand: "Google", category: "phones" },
        { id: 5, name: "OnePlus 12", price: 18990000, originalPrice: 21990000, image: "📱", brand: "OnePlus", category: "phones" },
        { id: 6, name: "Huawei P60 Pro", price: 17990000, originalPrice: 20990000, image: "📱", brand: "Huawei", category: "phones" },
        { id: 7, name: "iPhone 15 Pro", price: 26990000, originalPrice: 29990000, image: "📱", brand: "Apple", category: "phones" },
        { id: 8, name: "Samsung Galaxy S24", price: 19990000, originalPrice: 22990000, image: "📱", brand: "Samsung", category: "phones" },
        { id: 9, name: "Xiaomi 13 Ultra", price: 17990000, originalPrice: 20990000, image: "📱", brand: "Xiaomi", category: "phones" },
        { id: 10, name: "Google Pixel 8", price: 18990000, originalPrice: 21990000, image: "📱", brand: "Google", category: "phones" },
        { id: 11, name: "OnePlus 11", price: 15990000, originalPrice: 18990000, image: "📱", brand: "OnePlus", category: "phones" },
        { id: 12, name: "Huawei Mate 60 Pro", price: 16990000, originalPrice: 19990000, image: "📱", brand: "Huawei", category: "phones" },
        { id: 13, name: "iPhone 15", price: 22990000, originalPrice: 25990000, image: "📱", brand: "Apple", category: "phones" },
        { id: 14, name: "Samsung Galaxy A54", price: 8990000, originalPrice: 10990000, image: "📱", brand: "Samsung", category: "phones" },
        { id: 15, name: "Xiaomi Redmi Note 13 Pro", price: 6990000, originalPrice: 8990000, image: "📱", brand: "Xiaomi", category: "phones" },
        { id: 16, name: "Google Pixel 7a", price: 12990000, originalPrice: 15990000, image: "📱", brand: "Google", category: "phones" },
        { id: 17, name: "OnePlus Nord 3", price: 9990000, originalPrice: 12990000, image: "📱", brand: "OnePlus", category: "phones" },
        { id: 18, name: "Huawei Nova 11", price: 7990000, originalPrice: 9990000, image: "📱", brand: "Huawei", category: "phones" },
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
          <a href="/phones" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
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
        <ProductBreadcrumb category="phones" productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <ProductImage product={product} />

          {/* Product Info */}
          <ProductInfo product={product} category="phones" />
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Thông số kỹ thuật</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Màn hình</td>
                  <td className="px-6 py-4 text-gray-900">6.7 inch Super Retina XDR</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Chip xử lý</td>
                  <td className="px-6 py-4 text-gray-900">A17 Pro</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">RAM</td>
                  <td className="px-6 py-4 text-gray-900">8GB</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Bộ nhớ trong</td>
                  <td className="px-6 py-4 text-gray-900">256GB / 512GB / 1TB</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Camera sau</td>
                  <td className="px-6 py-4 text-gray-900">48MP + 12MP + 12MP</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Camera trước</td>
                  <td className="px-6 py-4 text-gray-900">12MP</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Pin</td>
                  <td className="px-6 py-4 text-gray-900">4422mAh</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Sạc</td>
                  <td className="px-6 py-4 text-gray-900">USB-C, MagSafe, Qi</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Kết nối</td>
                  <td className="px-6 py-4 text-gray-900">5G, Wi-Fi 6E, Bluetooth 5.3</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-600 font-medium">Hệ điều hành</td>
                  <td className="px-6 py-4 text-gray-900">iOS 17</td>
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

export default PhoneDetailPage;
