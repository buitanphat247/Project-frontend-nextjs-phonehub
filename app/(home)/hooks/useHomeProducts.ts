import { useState, useEffect } from 'react'
import { getProductsByCategory } from '../../../lib/api/products'
import type { ProductResponse } from '../../../lib/api/products'
import { Product } from '../products/interface/IProduct'

const PHONES_CATEGORY_ID = 2
const LAPTOPS_CATEGORY_ID = 3
const IPADS_CATEGORY_ID = 1
const SMARTWATCHES_CATEGORY_ID = 5

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

export function useHomeProducts() {
  const [phonesProducts, setPhonesProducts] = useState<Product[]>([])
  const [laptopsProducts, setLaptopsProducts] = useState<Product[]>([])
  const [ipadsProducts, setIpadProducts] = useState<Product[]>([])
  const [smartwatchesProducts, setSmartwatchesProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Fetch top 10 products for each category
        const [phonesRes, laptopsRes, ipadsRes, smartwatchesRes] = await Promise.all([
          getProductsByCategory(PHONES_CATEGORY_ID, 0, 10).catch(err => {
            console.error(`Error fetching phones (category ${PHONES_CATEGORY_ID}):`, err)
            return { success: false, data: null }
          }),
          getProductsByCategory(LAPTOPS_CATEGORY_ID, 0, 10).catch(err => {
            console.error(`Error fetching laptops (category ${LAPTOPS_CATEGORY_ID}):`, err)
            return { success: false, data: null }
          }),
          getProductsByCategory(IPADS_CATEGORY_ID, 0, 10).catch(err => {
            console.error(`Error fetching ipads (category ${IPADS_CATEGORY_ID}):`, err)
            return { success: false, data: null }
          }),
          getProductsByCategory(SMARTWATCHES_CATEGORY_ID, 0, 10).catch(err => {
            console.error(`Error fetching smartwatches (category ${SMARTWATCHES_CATEGORY_ID}):`, err)
            return { success: false, data: null }
          }),
        ])

        if (phonesRes.success && phonesRes.data) {
          setPhonesProducts(transformProducts(phonesRes.data.content))
        } else {
          console.warn('Phones response failed or empty:', phonesRes)
          setPhonesProducts([])
        }

        if (laptopsRes.success && laptopsRes.data) {
          setLaptopsProducts(transformProducts(laptopsRes.data.content))
        } else {
          console.warn('Laptops response failed or empty:', laptopsRes)
          setLaptopsProducts([])
        }

        if (ipadsRes.success && ipadsRes.data) {
          setIpadProducts(transformProducts(ipadsRes.data.content))
        } else {
          console.warn('iPads response failed or empty:', ipadsRes)
          setIpadProducts([])
        }

        if (smartwatchesRes.success && smartwatchesRes.data) {
          setSmartwatchesProducts(transformProducts(smartwatchesRes.data.content))
        } else {
          console.warn('Smartwatches response failed or empty:', smartwatchesRes)
          setSmartwatchesProducts([])
        }
      } catch (error: any) {
        console.error('Error fetching home products:', error)
        // Set empty arrays on error
        setPhonesProducts([])
        setLaptopsProducts([])
        setIpadProducts([])
        setSmartwatchesProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return {
    phonesProducts,
    laptopsProducts,
    ipadsProducts,
    smartwatchesProducts,
    loading,
  }
}

