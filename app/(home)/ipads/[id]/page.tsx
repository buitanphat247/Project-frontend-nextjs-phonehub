"use client";

import { useState, useEffect } from "react";
import { Product } from "../../products/interface/IProduct";
import ProductBreadcrumb from "../../products/components/ProductBreadcrumb";
import ProductImage from "../../products/components/ProductImage";
import ProductInfo from "../../products/components/ProductInfo";
import RelatedProducts from "../../products/components/RelatedProducts";
import ProductDetailSkeleton from "../../products/components/ProductDetailSkeleton";
import { getProductById } from "../../../../lib/api/products";
import type { ProductResponse } from "../../../../lib/api/products";
import { getCategoryRoute } from "../../products/utils/categoryUtils";

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

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);

        if (response.success && response.data) {
          const productData: ProductResponse = response.data;
          
          const discountPercent = productData.priceOld > 0 
            ? Math.floor((productData.priceOld - productData.price) / productData.priceOld * 100)
            : 0

          const transformedProduct: Product = {
            id: productData.id,
            name: productData.name,
            slug: productData.slug,
            price: productData.price,
            originalPrice: productData.priceOld || productData.price,
            thumbnailImage: productData.thumbnailImage,
            brand: productData.brand,
            category: {
              id: productData.category.id,
              name: productData.category.name,
              slug: productData.category.slug,
            },
            discount: productData.discount || '',
            discountPercent,
            isOnSale: productData.priceOld > 0 && productData.price < productData.priceOld,
            isPublished: productData.isPublished,
            specifications: productData.specifications?.map(spec => ({
              id: spec.id,
              productId: spec.productId,
              groupName: spec.groupName,
              label: spec.label,
              value: spec.value,
              type: spec.type,
            })),
            colors: productData.colors?.map(color => ({
              id: color.id,
              productId: color.productId,
              name: color.name,
              slug: color.slug,
              hexColor: color.hexColor,
            })),
            images: productData.images?.map(img => ({
              id: img.id,
              productId: img.productId,
              url: img.url,
            })),
          };

          setProduct(transformedProduct);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
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
        <ProductBreadcrumb 
          category={getCategoryRoute(product)}
          productName={product.name} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <ProductImage product={product} />

          {/* Product Info */}
          <ProductInfo 
            product={product} 
            category={getCategoryRoute(product)}
          />
        </div>

        {/* Technical Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Thông số kỹ thuật</h2>
            {(() => {
              // Group specifications by groupName
              const groupedSpecs = product.specifications.reduce((acc, spec) => {
                if (!acc[spec.groupName]) {
                  acc[spec.groupName] = [];
                }
                acc[spec.groupName].push(spec);
                return acc;
              }, {} as Record<string, typeof product.specifications>);

              return Object.entries(groupedSpecs).map(([groupName, specs]) => (
                <div key={groupName} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <h3 className="px-6 py-4 bg-gray-50 border-b border-gray-200 text-lg font-semibold text-gray-900">
                    {groupName}
                  </h3>
            <table className="w-full">
              <tbody>
                      {specs.map((spec, index) => (
                        <tr 
                          key={spec.id} 
                          className={index < specs.length - 1 ? "border-b border-gray-200" : ""}
                        >
                          <td className="px-6 py-4 text-gray-600 font-medium w-1/3">
                            {spec.label}
                          </td>
                          <td className="px-6 py-4 text-gray-900">
                            {Array.isArray(spec.value) ? spec.value.join(', ') : spec.value}
                          </td>
                </tr>
                      ))}
              </tbody>
            </table>
          </div>
              ));
            })()}
        </div>
        )}

        {/* Related Products */}
        <RelatedProducts product={product} />
      </div>
    </div>
  );
};

export default IpadDetailPage;
