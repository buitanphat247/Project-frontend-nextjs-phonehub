import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '../../products/interface/IProduct'
import { getProductsByCategory, searchProducts, getBrandsByCategory, getProductsByBrand } from '../../../../lib/api/products'
import type { ProductResponse } from '../../../../lib/api/products'

interface Filters {
  category: string
  priceRange: string
  brand: string
  search: string
}

interface UseIPadsOptions {
  productsPerPage?: number
}

// Category ID mapping - iPads category ID
const IPADS_CATEGORY_ID = 1 // Máy tính bảng (iPad) category ID từ API

// Helper to get URL params
const getUrlParams = () => {
  if (typeof window === 'undefined') {
    return { page: 1, search: '', brand: '', priceRange: '' }
  }
  const params = new URLSearchParams(window.location.search)
  return {
    page: parseInt(params.get('page') || '1'),
    search: params.get('search') || '',
    brand: params.get('brand') || '',
    priceRange: params.get('priceRange') || '',
  }
}

export function useIPads({ productsPerPage = 12 }: UseIPadsOptions = {}) {
  const router = useRouter()
  const urlParams = getUrlParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Array<{ value: string; label: string }>>([
    { value: 'all', label: 'Tất cả thương hiệu' }
  ])
  const [currentPage, setCurrentPage] = useState(urlParams.page)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [paging, setPaging] = useState(false)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState<Filters>({
    category: '',
    priceRange: urlParams.priceRange,
    brand: urlParams.brand,
    search: urlParams.search,
  })

  // Update URL when pagination or filters change
  const updateUrlParams = useCallback((page: number, search: string, brand: string, priceRange: string) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (search) params.set('search', search)
    if (brand && brand !== 'all') params.set('brand', brand)
    if (priceRange) params.set('priceRange', priceRange)
    
    const queryString = params.toString()
    const newUrl = `/ipads${queryString ? `?${queryString}` : ''}`
    router.push(newUrl, { scroll: false })
  }, [router])

  // Sync URL params when filters or page change
  useEffect(() => {
    // Skip initial mount to avoid updating URL on first load
    if (isInitialMount.current) {
      return
    }

    updateUrlParams(currentPage, filters.search, filters.brand, filters.priceRange)
  }, [currentPage, filters.search, filters.brand, filters.priceRange, updateUrlParams])

  // Fetch brands by category
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getBrandsByCategory(IPADS_CATEGORY_ID)
        
        if (response.success && response.data) {
          const brandOptions = [
            { value: 'all', label: 'Tất cả thương hiệu' },
            ...response.data.map((brand: string) => ({
              value: brand.toLowerCase().trim(),
              label: brand,
            })),
          ]
          setBrands(brandOptions)
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    }

    fetchBrands()
  }, [])

  // Validate brand when brands are loaded (only if on correct route)
  useEffect(() => {
    if (brands.length <= 1) return // Wait for brands to load
    if (typeof window === 'undefined') return
    if (!window.location.pathname.startsWith('/ipads')) return

    // Check if current brand from URL exists in brands list
    const currentBrand = filters.brand || urlParams.brand
    if (currentBrand && currentBrand !== 'all') {
      const brandExists = brands.some(b => b.value === currentBrand)
      if (!brandExists) {
        // Reset brand filter if it doesn't exist
        const newFilters = { ...filters, brand: 'all' }
        setFilters(newFilters)
        // Update URL to remove invalid brand
        updateUrlParams(currentPage, filters.search, 'all', filters.priceRange)
      }
    }
  }, [brands, urlParams.brand, filters.brand, filters.search, filters.priceRange, currentPage, updateUrlParams])

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

  // Debounce refs
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)
  const previousSearchRef = useRef<string>(urlParams.search)
  const previousPageRef = useRef<number>(urlParams.page)
  const previousBrandRef = useRef<string>(urlParams.brand)
  const previousPriceRangeRef = useRef<string>(urlParams.priceRange)
  const lastPathnameRef = useRef<string>('')

  // Reset filters when navigating from another category
  useEffect(() => {
    if (typeof window === 'undefined') return

    const currentPathname = window.location.pathname
    const lastPathname = lastPathnameRef.current

    // If pathname changed and it's a different category, reset filters
    if (lastPathname && lastPathname !== currentPathname) {
      const isCategoryChange = 
        (lastPathname.startsWith('/phones') && !currentPathname.startsWith('/phones')) ||
        (lastPathname.startsWith('/laptops') && !currentPathname.startsWith('/laptops')) ||
        (lastPathname.startsWith('/ipads') && !currentPathname.startsWith('/ipads'))

      if (isCategoryChange && currentPathname.startsWith('/ipads')) {
        // Reset all filters when coming from another category
        setFilters({
          category: '',
          priceRange: '',
          brand: 'all',
          search: '',
        })
        setCurrentPage(1)
        // Clear URL params
        router.push('/ipads', { scroll: false })
      }
    }

    lastPathnameRef.current = currentPathname
  }, [router])

  // Reset filters on initial mount - always start fresh when navigating to this page
  useEffect(() => {
    if (!isInitialMount.current) return
    
    // Always reset filters on mount to ensure clean state
    // This prevents filters from previous category from being applied
    setFilters({
      category: '',
      priceRange: '',
      brand: 'all',
      search: '',
    })
    setCurrentPage(1)
    
    // Clear URL params if they exist
    if (typeof window !== 'undefined') {
      const hasParams = urlParams.brand || urlParams.search || urlParams.priceRange || urlParams.page > 1
      if (hasParams && window.location.pathname.startsWith('/ipads')) {
        router.push('/ipads', { scroll: false })
      }
    }
  }, [router])

  // Fetch products from API using category endpoint with pagination
  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
      setSearching(false)
      setPaging(false)
    }

    const isSearchChange = previousSearchRef.current !== filters.search
    const isPageChange = previousPageRef.current !== currentPage
    const isBrandChange = previousBrandRef.current !== filters.brand
    const isPriceRangeChange = previousPriceRangeRef.current !== filters.priceRange

    // Reset to page 1 when any filter changes
    if (isSearchChange || isBrandChange || isPriceRangeChange) {
      setCurrentPage(1)
      previousSearchRef.current = filters.search
      previousBrandRef.current = filters.brand
      previousPriceRangeRef.current = filters.priceRange
      previousPageRef.current = 1
    }

    if (isSearchChange || isBrandChange || isPriceRangeChange) {
      setSearching(true)
    }

    if (isPageChange) {
      setPaging(true)
      previousPageRef.current = currentPage
    }

    const performFetch = async () => {
      setSearching(false)
      setPaging(false)
      setLoading(true)

      try {
        let response
        const hasBrandFilter = filters.brand && filters.brand !== 'all'
        
        if (filters.search && filters.search.trim()) {
          // Nếu có search, dùng search API với categoryId để lọc chính xác hơn
          response = await searchProducts(
            filters.search.trim(), 
            currentPage - 1, 
            productsPerPage,
            IPADS_CATEGORY_ID
          )
        } else if (hasBrandFilter) {
          // Nếu có brand filter, sử dụng API lọc theo brand với categoryId để lọc chính xác hơn
          response = await getProductsByBrand(
            filters.brand,
            currentPage - 1,
            productsPerPage,
            IPADS_CATEGORY_ID
          )
        } else {
          // Mặc định: lấy products theo category với pagination
          response = await getProductsByCategory(
            IPADS_CATEGORY_ID,
            currentPage - 1,
            productsPerPage
          )
        }
        
        if (response.success && response.data) {
          const transformedProducts = transformProducts(response.data.content)
          
          // API đã filter theo categoryId (nếu có search hoặc brand filter), không cần filter thêm
          setProducts(transformedProducts)
          setTotalElements(response.data.totalElements)
          setTotalPages(response.data.totalPages)
        } else {
          setProducts([])
          setTotalElements(0)
          setTotalPages(0)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setTotalElements(0)
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }

    if (isInitialMount.current) {
      isInitialMount.current = false
      performFetch()
    } else {
      const delay = (isSearchChange || isBrandChange || isPriceRangeChange) ? 500 : 200
      fetchTimeoutRef.current = setTimeout(performFetch, delay)
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
        setSearching(false)
        setPaging(false)
      }
    }
  }, [currentPage, filters.search, filters.brand, filters.priceRange, productsPerPage])

  // Filter products based on price range (client-side filtering)
  // Brand filter is now handled by API
  useEffect(() => {
    let filtered = [...products]

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

    setFilteredProducts(filtered)
  }, [products, filters.priceRange])

  // Current products to display (after client-side filtering)
  const currentProducts = useMemo(() => {
    return filteredProducts
  }, [filteredProducts])

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    filteredProducts,
    currentProducts,
    brands,
    currentPage,
    totalPages: filters.priceRange 
      ? Math.ceil(filteredProducts.length / productsPerPage) 
      : totalPages, // Use API pagination if no price filter
    totalElements,
    filters,
    loading: loading || searching || paging,
    searching,
    handleFilterChange,
    handlePageChange,
    isLoading: loading && products.length === 0,
  }
}

