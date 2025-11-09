import Link from "next/link";
import { Product } from "../interface/IProduct";
import { getCategoryRoute } from "../utils/categoryUtils";

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

  const categoryRoute = getCategoryRoute(product);
  const imageUrl = product.thumbnailImage || product.image || "📱";

  return (
    <Link href={`/${categoryRoute}/${product.id}`} className="block h-full">
      <div className="bg-white rounded-lg transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer hover:scale-105 hover:shadow-lg h-full flex flex-col">
        {/* Product Image */}
        <div className="relative shrink-0">
          <div className="w-full h-48 bg-[#ffffff] border-b border-gray-200 py-2 flex items-center justify-center overflow-hidden">
            {product.thumbnailImage ? (
              <img
                src={product.thumbnailImage}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Sử dụng requestAnimationFrame để tránh forced reflow
                  requestAnimationFrame(() => {
                    const target = e.target as HTMLImageElement;
                    target.classList.add('hidden');
                    if (target.parentElement) {
                      const fallback = document.createElement('div');
                      fallback.className = 'text-6xl';
                      fallback.textContent = '📱';
                      target.parentElement.appendChild(fallback);
                    }
                  });
                }}
              />
            ) : (
              <div className="text-6xl">{imageUrl}</div>
            )}
          </div>

          {/* Sale Badge */}
          {product.isOnSale && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-sm font-semibold">Sale</span>
            </div>
          )}

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <div className="absolute top-2 right-2">
              <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-sm font-semibold">-{product.discountPercent}%</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col grow">
          <div className="mb-2">
            <span className="text-sm text-gray-500">{product.brand}</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          {product.rating && product.reviews && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.reviews} đánh giá)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <div className="text-xl font-bold text-blue-700">{formatPrice(product.price)}</div>
              {product.originalPrice > product.price && (
                <div className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
