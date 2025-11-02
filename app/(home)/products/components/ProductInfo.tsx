"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { HeartFilled, HeartOutlined, ShoppingCartOutlined, ThunderboltOutlined, SwapOutlined } from "@ant-design/icons";
import { Product } from "../interface/IProduct";
import { isAuthenticated } from "../../../../lib/utils/cookie";
import { addToFavorites, removeFromFavorites, checkFavorite } from "../../../../lib/api/favorites";

interface ProductInfoProps {
  product: Product;
  category: string;
}

const ProductInfo = ({ product, category }: ProductInfoProps) => {
  const router = useRouter();
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);

  // Check if product is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        setIsCheckingFavorite(false);
        return;
      }

      try {
        setIsCheckingFavorite(true);
        const response = await checkFavorite(product.id);
        if (response.success) {
          setIsFavorite(response.data);
        }
      } catch (error) {
        // Ignore error when checking favorite
      } finally {
        setIsCheckingFavorite(false);
      }
    };

    checkFavoriteStatus();
  }, [product.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleFavoriteClick = async () => {
    const authenticated = isAuthenticated();
    
    if (!authenticated) {
      toast.warn("Vui lòng đăng nhập để thêm sản phẩm vào yêu thích!");
      return;
    }

    try {
      setIsAddingFavorite(true);

      if (isFavorite) {
        // Remove from favorites
        const response = await removeFromFavorites(product.id);
        if (response.success) {
          setIsFavorite(false);
          toast.success("Đã xóa sản phẩm khỏi yêu thích!");
        } else {
          toast.error(response.message || "Không thể xóa sản phẩm khỏi yêu thích");
        }
      } else {
        // Add to favorites
        const response = await addToFavorites(product.id);
        if (response.success) {
          setIsFavorite(true);
          toast.success("Đã thêm sản phẩm vào yêu thích!");
        } else {
          toast.error(response.message || "Không thể thêm sản phẩm vào yêu thích");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setIsAddingFavorite(false);
    }
  };

  const handleActionClick = (actionName: string) => {
    const authenticated = isAuthenticated();
    
    if (!authenticated) {
      toast.warn("Vui lòng đăng nhập!");
      return;
    }
    // TODO: Implement action logic here
    console.log(`${actionName} clicked for product ${product.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Brand & Name */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</span>
          {product.quantity !== undefined && (
            <span className={`text-sm font-medium ${
              product.quantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              (Còn {product.quantity.toLocaleString('vi-VN')} sản phẩm)
            </span>
          )}
          {/* Rating - chỉ hiển thị nếu có */}
          {product.reviews && product.rating && (
            <>
              <span className="text-gray-600">({product.reviews} đánh giá)</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
        {product.discountPercent > 0 && (
          <div className="flex items-center space-x-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">-{product.discountPercent}% OFF</span>
            {product.isOnSale && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">SALE</span>}
          </div>
        )}
      </div>

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Màu sắc</h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                style={{ borderColor: color.hexColor }}
              >
                <div
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hexColor }}
                />
                <span className="text-gray-700">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Mô tả sản phẩm</h3>
        <p className="text-gray-600 leading-relaxed">
          {product.name} là một sản phẩm cao cấp từ {product.brand}, được thiết kế với công nghệ tiên tiến và chất lượng vượt trội. Sản phẩm mang đến
          trải nghiệm tuyệt vời cho người dùng với hiệu năng mạnh mẽ và thiết kế tinh tế.
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Tính năng nổi bật</h3>
        <ul className="grid grid-cols-2 gap-2">
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-gray-600">Thiết kế cao cấp, sang trọng</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-gray-600">Hiệu năng mạnh mẽ, ổn định</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-gray-600">Bảo hành chính hãng 12 tháng</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-gray-600">Miễn phí vận chuyển toàn quốc</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button 
            onClick={() => handleActionClick("Thêm vào giỏ hàng")}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShoppingCartOutlined />
            <span>Thêm vào giỏ hàng</span>
          </button>
          <button 
            onClick={() => handleActionClick("Mua ngay")}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <ThunderboltOutlined />
            <span>Mua ngay</span>
          </button>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={handleFavoriteClick}
            disabled={isAddingFavorite || isCheckingFavorite}
            className={`flex-1 border py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
              isFavorite 
                ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100" 
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {isAddingFavorite ? (
              <span>Đang xử lý...</span>
            ) : (
              <>
                {isFavorite ? (
                  <>
                    <HeartFilled className="text-red-500" />
                    <span>Đã yêu thích</span>
                  </>
                ) : (
                  <>
                    <HeartOutlined />
                    <span>Yêu thích</span>
                  </>
                )}
              </>
            )}
          </button>
          <button 
            onClick={() => handleActionClick("So sánh")}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <SwapOutlined />
            <span>So sánh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
