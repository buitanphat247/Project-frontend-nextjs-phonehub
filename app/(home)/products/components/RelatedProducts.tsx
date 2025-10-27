import { Product } from "../interface/IProduct";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  product: Product;
}

const RelatedProducts = ({ product }: RelatedProductsProps) => {
  // Tạo danh sách sản phẩm liên quan
  const relatedProducts: Product[] = [
    {
      id: product.id + 1,
      name: `${product.brand} ${product.name.split(" ").slice(1).join(" ")} Pro`,
      price: product.price - 2000000,
      originalPrice: product.originalPrice - 1000000,
      image: product.image,
      brand: product.brand,
      category: product.category,
      discountPercent: Math.floor(((product.originalPrice - 1000000 - (product.price - 2000000)) / (product.originalPrice - 1000000)) * 100),
      isOnSale: true,
      rating: 4.2,
      reviews: 156,
    },
    {
      id: product.id + 2,
      name: `${product.brand} ${product.name.split(" ").slice(1).join(" ")} Plus`,
      price: product.price - 1000000,
      originalPrice: product.originalPrice,
      image: product.image,
      brand: product.brand,
      category: product.category,
      discountPercent: Math.floor(((product.originalPrice - (product.price - 1000000)) / product.originalPrice) * 100),
      isOnSale: false,
      rating: 4.5,
      reviews: 203,
    },
    {
      id: product.id + 3,
      name: `${product.brand} ${product.name.split(" ").slice(1).join(" ")} Mini`,
      price: product.price - 3000000,
      originalPrice: product.originalPrice - 2000000,
      image: product.image,
      brand: product.brand,
      category: product.category,
      discountPercent: Math.floor(((product.originalPrice - 2000000 - (product.price - 3000000)) / (product.originalPrice - 2000000)) * 100),
      isOnSale: true,
      rating: 4.0,
      reviews: 89,
    },
    {
      id: product.id + 4,
      name: `${product.brand} ${product.name.split(" ").slice(1).join(" ")} SE`,
      price: product.price - 4000000,
      originalPrice: product.originalPrice - 3000000,
      image: product.image,
      brand: product.brand,
      category: product.category,
      discountPercent: Math.floor(((product.originalPrice - 3000000 - (product.price - 4000000)) / (product.originalPrice - 3000000)) * 100),
      isOnSale: false,
      rating: 4.3,
      reviews: 127,
    },
    {
      id: product.id + 5,
      name: `${product.brand} ${product.name.split(" ").slice(1).join(" ")} Pro`,
      price: product.price - 2000000,
      originalPrice: product.originalPrice - 1000000,
      image: product.image,
      brand: product.brand,
      category: product.category,
      discountPercent: Math.floor(((product.originalPrice - 1000000 - (product.price - 2000000)) / (product.originalPrice - 1000000)) * 100),
      isOnSale: true,
      rating: 4.2,
      reviews: 156,
    },
    {
      id: product.id + 6,
      name: `${product.brand} ${product.name.split(" ").slice(1).join(" ")} Plus`,
      price: product.price - 1000000,
      originalPrice: product.originalPrice,
      image: product.image,
      brand: product.brand,
      category: product.category,
      discountPercent: Math.floor(((product.originalPrice - (product.price - 1000000)) / product.originalPrice) * 100),
      isOnSale: false,
      rating: 4.5,
      reviews: 203,
    },
    {
      id: product.id + 7,
      name: `${product.brand} ${product.name.split(" ").slice(1).join(" ")} Mini`,
      price: product.price - 3000000,
      originalPrice: product.originalPrice - 2000000,
      image: product.image,
      brand: product.brand,
      category: product.category,
      discountPercent: Math.floor(((product.originalPrice - 2000000 - (product.price - 3000000)) / (product.originalPrice - 2000000)) * 100),
      isOnSale: true,
      rating: 4.0,
      reviews: 89,
    },
    {
      id: product.id + 8,
      name: `${product.brand} ${product.name.split(" ").slice(1).join(" ")} SE`,
      price: product.price - 4000000,
      originalPrice: product.originalPrice - 3000000,
      image: product.image,
      brand: product.brand,
      category: product.category,
      discountPercent: Math.floor(((product.originalPrice - 3000000 - (product.price - 4000000)) / (product.originalPrice - 3000000)) * 100),
      isOnSale: false,
      rating: 4.3,
      reviews: 127,
    },
  ];

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
