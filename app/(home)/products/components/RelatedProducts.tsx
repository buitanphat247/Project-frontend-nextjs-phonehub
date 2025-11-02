"use client";

import { useState, useEffect } from "react";
import { Spin } from "antd";
import { Product } from "../interface/IProduct";
import ProductCard from "./ProductCard";
import { getProductsByCategory } from "../../../../lib/api/products";
import type { ProductResponse } from "../../../../lib/api/products";

interface RelatedProductsProps {
  product: Product;
}

const RelatedProducts = ({ product }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);

        // Lấy category ID từ product
        const categoryId = typeof product.category === "string" ? null : product.category.id;

        if (!categoryId) {
          setRelatedProducts([]);
          setLoading(false);
          return;
        }

        // Lấy 8 sản phẩm cùng category (lấy nhiều hơn để loại trừ product hiện tại)
        const response = await getProductsByCategory(categoryId, 0, 12);

        if (response.success && response.data) {
          const transformedProducts = response.data.content
            .filter((p: ProductResponse) => p.id !== product.id) // Loại trừ product hiện tại
            .slice(0, 8) // Lấy tối đa 8 sản phẩm
            .map((p: ProductResponse) => {
              const discountPercent = p.priceOld > 0 ? Math.floor(((p.priceOld - p.price) / p.priceOld) * 100) : 0;

              return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                originalPrice: p.priceOld || p.price,
                thumbnailImage: p.thumbnailImage,
                brand: p.brand,
                category: {
                  id: p.category.id,
                  name: p.category.name,
                  slug: p.category.slug,
                },
                discount: p.discount || "",
                discountPercent,
                isOnSale: p.priceOld > 0 && p.price < p.priceOld,
                isPublished: p.isPublished,
              } as Product;
            });

          setRelatedProducts(transformedProducts);
        } else {
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product.id, product.category]);

  if (loading) {
    return (
      <div >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm liên quan</h2>
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div >
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
