'use client'

import { Spin } from 'antd'
import ProductCard from '../products/components/ProductCard'
import IPadsFilters from './components/IPadsFilters'
import Pagination from '../products/components/Pagination'
import { useIPads } from './hooks/useIPads'

const IPadsPage = () => {
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
  } = useIPads()

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="text-gray-600 mt-4">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Máy tính bảng
          </h1>
          <p className="text-gray-600">
            {totalElements} sản phẩm
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <IPadsFilters 
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              brands={brands}
              loadingBrands={searching}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <Spin spinning={loading} tip="Đang tải sản phẩm...">
              {currentProducts.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                    {currentProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-gray-600">
                    Hãy thử thay đổi bộ lọc để tìm sản phẩm khác
                  </p>
                </div>
              )}
            </Spin>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IPadsPage

