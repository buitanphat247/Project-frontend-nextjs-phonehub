import { useState, useEffect, useMemo } from 'react'
import { Product } from '../interface/IProduct'
import { getProducts } from '../../../../lib/api/products'
import type { ProductResponse } from '../../../../lib/api/products'
import { CategoryKey } from '../constants/categoryConfig'

interface Filters {
  category: string
  priceRange: string
  brand: string
  search: string
}

interface UseProductsOptions {
  category: CategoryKey;
  productsPerPage?: number;
}

// Map category keys to API category IDs
const CATEGORY_ID_MAP: Record<CategoryKey, number | null> = {
  phones: 2,
  laptops: 3,
  ipads: 1,
  smartwatches: 5,
  accessories: null, // Không có category này trong API
  all: null,
}

export function useProducts({ category, productsPerPage = 12 }: UseProductsOptions) {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    category: '',
    priceRange: '',
    brand: '',
    search: '',
  })

  // Helper to transform API response
  const transformProducts = (content: ProductResponse[]): Product[] => {
    if (!content || content.length === 0) {
      return []
    }

    return content.map((product: ProductResponse) => {
      const discountPercent = product.priceOld > 0 
        ? Math.floor((product.priceOld - product.price) / product.priceOld * 100)
        : 0

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.priceOld || product.price,
        thumbnailImage: product.thumbnailImage,
        brand: product.brand,
        category: {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        },
        discount: product.discount || '',
        discountPercent,
        isOnSale: product.priceOld > 0 && product.price < product.priceOld,
        isPublished: product.isPublished,
      }
    })
  }

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Fetch products - nếu category !== 'all' thì filter client-side
        const response = await getProducts(0, 100)
        
        if (response.success && response.data) {
          let products = transformProducts(response.data.content)
          
          // Filter by category if not 'all'
          if (category !== 'all') {
            const categoryId = CATEGORY_ID_MAP[category]
            if (categoryId !== null) {
              products = products.filter(p => {
                if (typeof p.category === 'string') return false
                return p.category.id === categoryId
              })
            }
          }
          
          setAllProducts(products)
          setFilteredProducts(products)
        } else {
          setAllProducts([])
          setFilteredProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setAllProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...allProducts]

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
  const currentProducts = useMemo(
    () => filteredProducts.slice(startIndex, endIndex),
    [filteredProducts, startIndex, endIndex]
  )

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    allProducts,
    filteredProducts,
    currentProducts,
    currentPage,
    totalPages,
    filters,
    loading,
    handleFilterChange,
    handlePageChange,
    isLoading: loading,
  }
}

