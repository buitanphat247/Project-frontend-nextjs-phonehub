"use client";

import ProductCard from "../products/components/ProductCard";
import ProductCardSkeleton from "../products/components/ProductCardSkeleton";
import SmartwatchesFilters from "./components/SmartwatchesFilters";
import Pagination from "../products/components/Pagination";
import { useSmartwatches } from "./hooks/useSmartwatches";

const SmartwatchesPage = () => {
  const {
    filteredProducts,
    currentProducts,
    brands,
    currentPage,
    totalPages,
    totalElements,
    filters,
    loading,
    searching,
    handleFilterChange,
    handlePageChange,
    isLoading,
  } = useSmartwatches();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đồng hồ thông minh</h1>
          <p className="text-gray-600">
            {totalElements} sản phẩm
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SmartwatchesFilters onFilterChange={handleFilterChange} currentFilters={filters} brands={brands} loadingBrands={searching} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                {[...Array(6)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-600">Hãy thử thay đổi bộ lọc để tìm sản phẩm khác</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartwatchesPage;

