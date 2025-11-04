'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProductCard from './components/ProductCard'
import ProductCardSkeleton from './components/ProductCardSkeleton'
import Filters from './components/Filters'
import Pagination from './components/Pagination'
import { useProducts } from './hooks/useProducts'
import { categoryConfig, CategoryKey } from './constants/categoryConfig'

const ProductsPage = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const categorySlug = pathname.split('/').pop() || 'all'
  const category = (categorySlug === 'products' ? 'all' : categorySlug) as CategoryKey
  
  // Get initial page from URL query params
  const initialPage = parseInt(searchParams.get('page') || '1', 10)
  
  const {
    currentProducts,
    currentPage,
    totalPages,
    totalElements,
    filters,
    handleFilterChange,
    handlePageChange: internalHandlePageChange,
    isLoading,
  } = useProducts({ category, initialPage })

  // Update URL when page changes
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
    internalHandlePageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Sync URL with current page on mount (only once)
  useEffect(() => {
    if (currentPage !== initialPage && currentPage > 0) {
      const params = new URLSearchParams(searchParams.toString())
      if (currentPage === 1) {
        params.delete('page')
      } else {
        params.set('page', currentPage.toString())
      }
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const config = categoryConfig[category as CategoryKey] || categoryConfig.all

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {config.title}
          </h1>
          <p className="text-gray-600">
            {isLoading ? 'Đang tải...' : `${totalElements} sản phẩm`}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Filters 
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              category={category}
            />
        </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {[...Array(9)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentProducts.map((product) => (
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
