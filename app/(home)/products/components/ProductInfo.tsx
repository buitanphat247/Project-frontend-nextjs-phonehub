import { Product } from "../interface/IProduct";

interface ProductInfoProps {
  product: Product;
  category: string;
}

const ProductInfo = ({ product, category }: ProductInfoProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Brand & Name */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</span>
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
          <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
            Thêm vào giỏ hàng
          </button>
          <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer">
            Mua ngay
          </button>
        </div>

        <div className="flex space-x-4">
          <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
            Yêu thích
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
            So sánh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
