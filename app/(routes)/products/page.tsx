'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ProductCard from './components/ProductCard'
import Filters from './components/Filters'
import Pagination from './components/Pagination'
import { Product } from './interface/IProduct'

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    brand: '',
    search: ''
  })
  
  const pathname = usePathname()
  const category = pathname.split('/').pop() || 'all'
  
  const productsPerPage = 12

  // Generate sample products based on category
  useEffect(() => {
    const generateProducts = () => {
             const baseProducts: Record<string, Omit<Product, 'discountPercent' | 'isOnSale' | 'rating' | 'reviews'>[]> = {
              phones: [
                { id: 1, name: 'iPhone 15 Pro Max', price: 29990000, originalPrice: 32990000, image: '📱', brand: 'Apple', category: 'phones' },
                { id: 2, name: 'Samsung Galaxy S24 Ultra', price: 24990000, originalPrice: 27990000, image: '📱', brand: 'Samsung', category: 'phones' },
                { id: 3, name: 'Xiaomi 14 Pro', price: 19990000, originalPrice: 22990000, image: '📱', brand: 'Xiaomi', category: 'phones' },
                { id: 4, name: 'Google Pixel 8 Pro', price: 22990000, originalPrice: 25990000, image: '📱', brand: 'Google', category: 'phones' },
                { id: 5, name: 'OnePlus 12', price: 18990000, originalPrice: 21990000, image: '📱', brand: 'OnePlus', category: 'phones' },
                { id: 6, name: 'Huawei P60 Pro', price: 17990000, originalPrice: 20990000, image: '📱', brand: 'Huawei', category: 'phones' },
                { id: 7, name: 'iPhone 15 Pro', price: 26990000, originalPrice: 29990000, image: '📱', brand: 'Apple', category: 'phones' },
                { id: 8, name: 'Samsung Galaxy S24', price: 19990000, originalPrice: 22990000, image: '📱', brand: 'Samsung', category: 'phones' },
                { id: 9, name: 'Xiaomi 13 Ultra', price: 17990000, originalPrice: 20990000, image: '📱', brand: 'Xiaomi', category: 'phones' },
                { id: 10, name: 'Google Pixel 8', price: 18990000, originalPrice: 21990000, image: '📱', brand: 'Google', category: 'phones' },
                { id: 11, name: 'OnePlus 11', price: 15990000, originalPrice: 18990000, image: '📱', brand: 'OnePlus', category: 'phones' },
                { id: 12, name: 'Huawei Mate 60 Pro', price: 16990000, originalPrice: 19990000, image: '📱', brand: 'Huawei', category: 'phones' },
                { id: 13, name: 'iPhone 15', price: 22990000, originalPrice: 25990000, image: '📱', brand: 'Apple', category: 'phones' },
                { id: 14, name: 'Samsung Galaxy A54', price: 8990000, originalPrice: 10990000, image: '📱', brand: 'Samsung', category: 'phones' },
                { id: 15, name: 'Xiaomi Redmi Note 13 Pro', price: 6990000, originalPrice: 8990000, image: '📱', brand: 'Xiaomi', category: 'phones' },
                { id: 16, name: 'Google Pixel 7a', price: 12990000, originalPrice: 15990000, image: '📱', brand: 'Google', category: 'phones' },
                { id: 17, name: 'OnePlus Nord 3', price: 9990000, originalPrice: 12990000, image: '📱', brand: 'OnePlus', category: 'phones' },
                { id: 18, name: 'Huawei Nova 11', price: 7990000, originalPrice: 9990000, image: '📱', brand: 'Huawei', category: 'phones' },
              ],
              
              laptops: [
                { id: 1, name: 'MacBook Pro M3', price: 45990000, originalPrice: 49990000, image: '💻', brand: 'Apple', category: 'laptops' },
                { id: 2, name: 'Dell XPS 13', price: 32990000, originalPrice: 35990000, image: '💻', brand: 'Dell', category: 'laptops' },
                { id: 3, name: 'HP Spectre x360', price: 28990000, originalPrice: 31990000, image: '💻', brand: 'HP', category: 'laptops' },
                { id: 4, name: 'Lenovo ThinkPad X1', price: 25990000, originalPrice: 28990000, image: '💻', brand: 'Lenovo', category: 'laptops' },
                { id: 5, name: 'ASUS ZenBook Pro', price: 23990000, originalPrice: 26990000, image: '💻', brand: 'ASUS', category: 'laptops' },
                { id: 6, name: 'MSI Creator 15', price: 21990000, originalPrice: 24990000, image: '💻', brand: 'MSI', category: 'laptops' },
                { id: 7, name: 'MacBook Air M2', price: 29990000, originalPrice: 32990000, image: '💻', brand: 'Apple', category: 'laptops' },
                { id: 8, name: 'Dell Inspiron 15', price: 18990000, originalPrice: 21990000, image: '💻', brand: 'Dell', category: 'laptops' },
                { id: 9, name: 'HP Pavilion 15', price: 15990000, originalPrice: 18990000, image: '💻', brand: 'HP', category: 'laptops' },
                { id: 10, name: 'Lenovo IdeaPad 5', price: 17990000, originalPrice: 20990000, image: '💻', brand: 'Lenovo', category: 'laptops' },
                { id: 11, name: 'ASUS VivoBook S15', price: 19990000, originalPrice: 22990000, image: '💻', brand: 'ASUS', category: 'laptops' },
                { id: 12, name: 'MSI Gaming GF63', price: 21990000, originalPrice: 24990000, image: '💻', brand: 'MSI', category: 'laptops' },
                { id: 13, name: 'MacBook Pro M2', price: 39990000, originalPrice: 43990000, image: '💻', brand: 'Apple', category: 'laptops' },
                { id: 14, name: 'Dell Latitude 5520', price: 24990000, originalPrice: 27990000, image: '💻', brand: 'Dell', category: 'laptops' },
                { id: 15, name: 'HP EliteBook 850', price: 22990000, originalPrice: 25990000, image: '💻', brand: 'HP', category: 'laptops' },
                { id: 16, name: 'Lenovo Legion 5', price: 26990000, originalPrice: 29990000, image: '💻', brand: 'Lenovo', category: 'laptops' },
                { id: 17, name: 'ASUS ROG Strix G15', price: 28990000, originalPrice: 31990000, image: '💻', brand: 'ASUS', category: 'laptops' },
                { id: 18, name: 'MSI Stealth 15M', price: 25990000, originalPrice: 28990000, image: '💻', brand: 'MSI', category: 'laptops' },
              ],
              
              ipads: [
                { id: 1, name: 'iPad Pro 12.9" M2', price: 22990000, originalPrice: 25990000, image: '📱', brand: 'Apple', category: 'ipads' },
                { id: 2, name: 'iPad Air 5th Gen', price: 15990000, originalPrice: 17990000, image: '📱', brand: 'Apple', category: 'ipads' },
                { id: 3, name: 'iPad 10th Gen', price: 11990000, originalPrice: 13990000, image: '📱', brand: 'Apple', category: 'ipads' },
                { id: 4, name: 'iPad mini 6th Gen', price: 13990000, originalPrice: 15990000, image: '📱', brand: 'Apple', category: 'ipads' },
                { id: 5, name: 'iPad Pro 11" M2', price: 19990000, originalPrice: 22990000, image: '📱', brand: 'Apple', category: 'ipads' },
                { id: 6, name: 'iPad Air 4th Gen', price: 13990000, originalPrice: 15990000, image: '📱', brand: 'Apple', category: 'ipads' },
                { id: 7, name: 'iPad 9th Gen', price: 9990000, originalPrice: 11990000, image: '📱', brand: 'Apple', category: 'ipads' },
                { id: 8, name: 'iPad mini 5th Gen', price: 11990000, originalPrice: 13990000, image: '📱', brand: 'Apple', category: 'ipads' },
              ],
              
              accessories: [
                { id: 1, name: 'AirPods Pro 2', price: 5990000, originalPrice: 6990000, image: '🎧', brand: 'Apple', category: 'accessories' },
                { id: 2, name: 'Samsung Galaxy Buds Pro', price: 3990000, originalPrice: 4990000, image: '🎧', brand: 'Samsung', category: 'accessories' },
                { id: 3, name: 'Apple Watch Series 9', price: 8990000, originalPrice: 9990000, image: '⌚', brand: 'Apple', category: 'accessories' },
                { id: 4, name: 'Magic Keyboard', price: 3990000, originalPrice: 4990000, image: '⌨️', brand: 'Apple', category: 'accessories' },
                { id: 5, name: 'Apple Pencil 2', price: 2990000, originalPrice: 3490000, image: '✏️', brand: 'Apple', category: 'accessories' },
                { id: 6, name: 'Wireless Charger', price: 1990000, originalPrice: 2490000, image: '🔌', brand: 'Generic', category: 'accessories' },
                { id: 7, name: 'AirPods 3rd Gen', price: 4990000, originalPrice: 5990000, image: '🎧', brand: 'Apple', category: 'accessories' },
                { id: 8, name: 'Samsung Galaxy Buds 2', price: 2990000, originalPrice: 3990000, image: '🎧', brand: 'Samsung', category: 'accessories' },
                { id: 9, name: 'Apple Watch SE', price: 5990000, originalPrice: 6990000, image: '⌚', brand: 'Apple', category: 'accessories' },
                { id: 10, name: 'Magic Mouse', price: 2490000, originalPrice: 2990000, image: '🖱️', brand: 'Apple', category: 'accessories' },
                { id: 11, name: 'Apple Pencil 1', price: 1990000, originalPrice: 2490000, image: '✏️', brand: 'Apple', category: 'accessories' },
                { id: 12, name: 'USB-C Hub', price: 1490000, originalPrice: 1990000, image: '🔌', brand: 'Generic', category: 'accessories' },
                { id: 13, name: 'AirPods Max', price: 8990000, originalPrice: 9990000, image: '🎧', brand: 'Apple', category: 'accessories' },
                { id: 14, name: 'Sony WH-1000XM5', price: 7990000, originalPrice: 8990000, image: '🎧', brand: 'Sony', category: 'accessories' },
                { id: 15, name: 'Apple Watch Ultra', price: 19990000, originalPrice: 21990000, image: '⌚', brand: 'Apple', category: 'accessories' },
                { id: 16, name: 'Magic Trackpad', price: 4990000, originalPrice: 5990000, image: '🖱️', brand: 'Apple', category: 'accessories' },
              ]
              
      }

      let products: Omit<Product, 'discountPercent' | 'isOnSale' | 'rating' | 'reviews'>[] = []
      
      if (category === 'all' || category === 'products') {
        products = [...baseProducts.phones, ...baseProducts.laptops, ...baseProducts.ipads, ...baseProducts.accessories]
      } else if (category in baseProducts) {
        products = baseProducts[category as keyof typeof baseProducts]
      }

      // Add deterministic discount and sale status
      return products.map((product, index) => ({
        ...product,
        discountPercent: Math.floor((product.originalPrice - product.price) / product.originalPrice * 100),
        isOnSale: index % 3 === 0,
        rating: 4 + (index % 5) * 0.2,
        reviews: Math.floor(Math.random() * 1000) + 100
      })) as Product[]
    }

    const products = generateProducts()
    setAllProducts(products)
    setFilteredProducts(products)
  }, [category])

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...allProducts]

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(product => product.brand.toLowerCase() === filters.brand.toLowerCase())
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [allProducts, filters])

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (allProducts.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
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
            {category === 'all' || category === 'products' ? 'Tất Cả Sản Phẩm' : 
             category === 'phones' ? 'Điện Thoại' :
             category === 'laptops' ? 'Laptop' :
             category === 'ipads' ? 'iPad' :
             category === 'accessories' ? 'Phụ Kiện' : 'Sản Phẩm'}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} sản phẩm được tìm thấy
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
            {currentProducts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
