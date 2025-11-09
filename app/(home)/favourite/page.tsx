"use client";

import React, { useState, useEffect } from "react";
import { Empty, message } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import ProductCard from "../products/components/ProductCard";
import ProductCardSkeleton from "../products/components/ProductCardSkeleton";
import Pagination from "../products/components/Pagination";
import { Product } from "../products/interface/IProduct";
import { getFavorites, type FavoriteResponse } from "../../../lib/api/favorites";
import type { ProductResponse } from "../../../lib/api/products";

const FavouritePage = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 1-based for UI
  const [pageSize] = useState(10); // 10 items per page
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Transform API product response to Product interface
  const transformProduct = (productData: ProductResponse): Product => {
    const discountPercent = productData.priceOld > 0 
      ? Math.floor((productData.priceOld - productData.price) / productData.priceOld * 100)
      : 0

    return {
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
    };
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        // API uses 0-based page, UI uses 1-based
        const apiPage = currentPage - 1;
        const response = await getFavorites(apiPage, pageSize);

        if (response.success && response.data && response.data.content) {
          // Transform FavoriteResponse[] to Product[]
          const products = response.data.content.map((favorite: FavoriteResponse) => 
            transformProduct(favorite.product)
          );
          setFavoriteProducts(products);
          setTotalPages(response.data.totalPages);
          setTotalElements(response.data.totalElements);
        } else {
          message.error(response.message || "Không thể tải danh sách yêu thích");
          setFavoriteProducts([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } catch (error: any) {
        message.error(error.message || "Có lỗi xảy ra khi tải danh sách yêu thích");
        setFavoriteProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 ">
          <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm yêu thích</h1>
          <p className="text-gray-600 mb-8">{totalElements} sản phẩm</p>
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5">
              {[...Array(10)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 ">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm yêu thích</h1>
          <p className="text-gray-600 mb-8">{totalElements} sản phẩm</p>

          {!loading && favoriteProducts.length === 0 ? (
            <div className="bg-white rounded-lg py-20">
              <Empty
                image={<HeartOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
                description={<span className="text-gray-600 text-lg">Bạn chưa có sản phẩm yêu thích nào</span>}
              >
                <p className="text-gray-500 mt-4">Hãy thêm sản phẩm vào danh sách yêu thích để xem lại sau</p>
              </Empty>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5">
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FavouritePage;
