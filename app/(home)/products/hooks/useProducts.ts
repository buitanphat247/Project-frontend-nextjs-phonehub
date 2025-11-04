import { useState, useEffect } from "react";
import { Product } from "../interface/IProduct";
import { getProducts, getProductsByCategory } from "../../../../lib/api/products";
import type { ProductResponse } from "../../../../lib/api/products";
import { CategoryKey } from "../constants/categoryConfig";

interface Filters {
  category: string;
  priceRange: string;
  brand: string;
  search: string;
}

interface UseProductsOptions {
  category: CategoryKey;
  productsPerPage?: number;
  initialPage?: number;
}

// Map category keys to API category IDs
const CATEGORY_ID_MAP: Record<CategoryKey, number | null> = {
  phones: 2,
  laptops: 3,
  ipads: 1,
  smartwatches: 5,
  accessories: null, // Không có category này trong API
  all: null,
};

export function useProducts({ category, productsPerPage = 12, initialPage = 1 }: UseProductsOptions) {
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Sync currentPage when initialPage changes (from URL)
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    priceRange: "",
    brand: "",
    search: "",
  });

  // Helper to transform API response
  const transformProducts = (content: ProductResponse[]): Product[] => {
    if (!content || content.length === 0) {
      return [];
    }

    return content.map((product: ProductResponse) => {
      const discountPercent = product.priceOld > 0 ? Math.floor(((product.priceOld - product.price) / product.priceOld) * 100) : 0;

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
        discount: product.discount || "",
        discountPercent,
        isOnSale: product.priceOld > 0 && product.price < product.priceOld,
        isPublished: product.isPublished,
      };
    });
  };

  // Fetch products from API with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Convert page from 1-based (UI) to 0-based (API)
        const apiPage = currentPage - 1;
        
        let response;
        if (category !== "all") {
          const categoryId = CATEGORY_ID_MAP[category];
          if (categoryId !== null) {
            // Fetch by category
            response = await getProductsByCategory(categoryId, apiPage, productsPerPage);
          } else {
            // Fallback to all products
            response = await getProducts(apiPage, productsPerPage);
          }
        } else {
          // Fetch all products
          response = await getProducts(apiPage, productsPerPage);
        }

        if (response.success && response.data) {
          const products = transformProducts(response.data.content);
          setCurrentProducts(products);
          setTotalPages(response.data.totalPages);
          setTotalElements(response.data.totalElements);
        } else {
          setCurrentProducts([]);
          setTotalPages(0);
          setTotalElements(0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setCurrentProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage, productsPerPage]);

  // Reset to page 1 when filters or category change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, category]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    currentProducts,
    currentPage,
    totalPages,
    totalElements,
    filters,
    loading,
    handleFilterChange,
    handlePageChange,
    isLoading: loading,
    // For backward compatibility
    filteredProducts: currentProducts,
    allProducts: currentProducts,
  };
}
