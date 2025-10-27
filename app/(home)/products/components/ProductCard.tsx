import Link from "next/link";
import { Product } from "../interface/IProduct";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Link href={`/${product.category}/${product.id}`} className="block">
      <div className="bg-white rounded-lg transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer hover:scale-105 hover:shadow-lg">
        {/* Product Image */}
        <div className="relative">
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-6xl">{product.image}</div>

          {/* Sale Badge */}
          {product.isOnSale && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">Sale</span>
            </div>
          )}

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold">-{product.discountPercent}%</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <span className="text-sm text-gray-500">{product.brand}</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.reviews} đánh giá)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</div>
              {product.originalPrice > product.price && <div className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
