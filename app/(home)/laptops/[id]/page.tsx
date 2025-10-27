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

const LaptopDetailPage = ({ params }: PageProps) => {
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
        { id: 1, name: "MacBook Pro 16-inch", price: 45990000, originalPrice: 49990000, image: "💻", brand: "Apple", category: "laptops" },
        { id: 2, name: "Dell XPS 15", price: 39990000, originalPrice: 43990000, image: "💻", brand: "Dell", category: "laptops" },
        { id: 3, name: "HP Spectre x360", price: 32990000, originalPrice: 36990000, image: "💻", brand: "HP", category: "laptops" },
        { id: 4, name: "Lenovo ThinkPad X1", price: 35990000, originalPrice: 39990000, image: "💻", brand: "Lenovo", category: "laptops" },
        { id: 5, name: "ASUS ROG Strix", price: 29990000, originalPrice: 33990000, image: "💻", brand: "ASUS", category: "laptops" },
        { id: 6, name: "MSI Gaming Laptop", price: 27990000, originalPrice: 31990000, image: "💻", brand: "MSI", category: "laptops" },
        { id: 7, name: "MacBook Air M2", price: 25990000, originalPrice: 28990000, image: "💻", brand: "Apple", category: "laptops" },
        { id: 8, name: "Surface Laptop 5", price: 22990000, originalPrice: 25990000, image: "💻", brand: "Microsoft", category: "laptops" },
        { id: 9, name: "Acer Swift 3", price: 15990000, originalPrice: 18990000, image: "💻", brand: "Acer", category: "laptops" },
        { id: 10, name: "Samsung Galaxy Book", price: 19990000, originalPrice: 22990000, image: "💻", brand: "Samsung", category: "laptops" },
        { id: 11, name: "MacBook Pro 14-inch", price: 39990000, originalPrice: 43990000, image: "💻", brand: "Apple", category: "laptops" },
        { id: 12, name: "Dell Inspiron 15", price: 19990000, originalPrice: 22990000, image: "💻", brand: "Dell", category: "laptops" },
        { id: 13, name: "HP Pavilion 15", price: 15990000, originalPrice: 18990000, image: "💻", brand: "HP", category: "laptops" },
        { id: 14, name: "Lenovo IdeaPad 3", price: 12990000, originalPrice: 15990000, image: "💻", brand: "Lenovo", category: "laptops" },
        { id: 15, name: "ASUS VivoBook S15", price: 17990000, originalPrice: 20990000, image: "💻", brand: "ASUS", category: "laptops" },
        { id: 16, name: "MSI Modern 15", price: 15990000, originalPrice: 18990000, image: "💻", brand: "MSI", category: "laptops" },
        { id: 17, name: "MacBook Air M1", price: 22990000, originalPrice: 25990000, image: "💻", brand: "Apple", category: "laptops" },
        { id: 18, name: "Surface Pro 9", price: 27990000, originalPrice: 30990000, image: "💻", brand: "Microsoft", category: "laptops" },
        { id: 19, name: "Acer Aspire 5", price: 11990000, originalPrice: 14990000, image: "💻", brand: "Acer", category: "laptops" },
        { id: 20, name: "Samsung Galaxy Book2", price: 17990000, originalPrice: 20990000, image: "💻", brand: "Samsung", category: "laptops" },
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
          <a href="/laptops" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
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
        <ProductBreadcrumb category="laptops" productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <ProductImage product={product} />

          {/* Product Info */}
          <ProductInfo product={product} category="laptops" />
        </div>

        {/* Technical Specifications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Thông số kỹ thuật</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Màn hình</td>
                  <td className="px-6 py-4 text-gray-900">15.6 inch Full HD IPS</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">CPU</td>
                  <td className="px-6 py-4 text-gray-900">Intel Core i7-12700H</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">RAM</td>
                  <td className="px-6 py-4 text-gray-900">16GB DDR4</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Ổ cứng</td>
                  <td className="px-6 py-4 text-gray-900">512GB SSD NVMe</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Card đồ họa</td>
                  <td className="px-6 py-4 text-gray-900">NVIDIA GeForce RTX 3060</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Pin</td>
                  <td className="px-6 py-4 text-gray-900">90Wh</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 text-gray-600 font-medium">Cân nặng</td>
                  <td className="px-6 py-4 text-gray-900">2.1kg</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-600 font-medium">Hệ điều hành</td>
                  <td className="px-6 py-4 text-gray-900">Windows 11 Home</td>
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

export default LaptopDetailPage;
