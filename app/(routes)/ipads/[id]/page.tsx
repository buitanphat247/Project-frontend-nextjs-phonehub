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

const IpadDetailPage = ({ params }: PageProps) => {
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
        { id: 1, name: "iPad Pro 12.9-inch", price: 22990000, originalPrice: 25990000, image: "📱", brand: "Apple", category: "ipads" },
        { id: 2, name: "iPad Air 5th Gen", price: 15990000, originalPrice: 17990000, image: "📱", brand: "Apple", category: "ipads" },
        { id: 3, name: "iPad 10th Gen", price: 9990000, originalPrice: 11990000, image: "📱", brand: "Apple", category: "ipads" },
        { id: 4, name: "iPad mini 6th Gen", price: 12990000, originalPrice: 14990000, image: "📱", brand: "Apple", category: "ipads" },
        { id: 5, name: "Samsung Galaxy Tab S9", price: 18990000, originalPrice: 21990000, image: "📱", brand: "Samsung", category: "ipads" },
        { id: 6, name: "Samsung Galaxy Tab S9+", price: 22990000, originalPrice: 25990000, image: "📱", brand: "Samsung", category: "ipads" },
        { id: 7, name: "Huawei MatePad Pro", price: 14990000, originalPrice: 17990000, image: "📱", brand: "Huawei", category: "ipads" },
        { id: 8, name: "Lenovo Tab P11 Pro", price: 8990000, originalPrice: 10990000, image: "📱", brand: "Lenovo", category: "ipads" },
        { id: 9, name: "Xiaomi Pad 6", price: 7990000, originalPrice: 9990000, image: "📱", brand: "Xiaomi", category: "ipads" },
        { id: 10, name: "Surface Go 3", price: 11990000, originalPrice: 13990000, image: "📱", brand: "Microsoft", category: "ipads" },
        { id: 11, name: "iPad Pro 11-inch", price: 19990000, originalPrice: 22990000, image: "📱", brand: "Apple", category: "ipads" },
        { id: 12, name: "Samsung Galaxy Tab A8", price: 5990000, originalPrice: 7990000, image: "📱", brand: "Samsung", category: "ipads" },
        { id: 13, name: "Huawei MatePad 11", price: 9990000, originalPrice: 12990000, image: "📱", brand: "Huawei", category: "ipads" },
        { id: 14, name: "Lenovo Tab M10", price: 4990000, originalPrice: 6990000, image: "📱", brand: "Lenovo", category: "ipads" },
        { id: 15, name: "Xiaomi Pad 5", price: 6990000, originalPrice: 8990000, image: "📱", brand: "Xiaomi", category: "ipads" },
        { id: 16, name: "Surface Pro 9", price: 27990000, originalPrice: 30990000, image: "📱", brand: "Microsoft", category: "ipads" },
        { id: 17, name: "iPad 9th Gen", price: 7990000, originalPrice: 9990000, image: "📱", brand: "Apple", category: "ipads" },
        { id: 18, name: "Samsung Galaxy Tab S8", price: 15990000, originalPrice: 18990000, image: "📱", brand: "Samsung", category: "ipads" },
        { id: 19, name: "Huawei MatePad 10.4", price: 6990000, originalPrice: 8990000, image: "📱", brand: "Huawei", category: "ipads" },
        { id: 20, name: "Lenovo Tab M8", price: 2990000, originalPrice: 4990000, image: "📱", brand: "Lenovo", category: "ipads" },
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
          <a href="/ipads" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
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
        <ProductBreadcrumb category="ipads" productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <ProductImage product={product} />

          {/* Product Info */}
          <ProductInfo product={product} category="ipads" />
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Thông số kỹ thuật</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Màn hình</td>
                  <td className="px-6 py-4 text-gray-900">11 inch Liquid Retina</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Chip xử lý</td>
                  <td className="px-6 py-4 text-gray-900">Apple M2</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">RAM</td>
                  <td className="px-6 py-4 text-gray-900">8GB</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Bộ nhớ trong</td>
                  <td className="px-6 py-4 text-gray-900">128GB / 256GB / 512GB</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Camera sau</td>
                  <td className="px-6 py-4 text-gray-900">12MP + 10MP</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Camera trước</td>
                  <td className="px-6 py-4 text-gray-900">12MP</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Pin</td>
                  <td className="px-6 py-4 text-gray-900">28.65Wh</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Cân nặng</td>
                  <td className="px-6 py-4 text-gray-900">466g</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-600 font-medium">Hệ điều hành</td>
                  <td className="px-6 py-4 text-gray-900">iPadOS 17</td>
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

export default IpadDetailPage;
