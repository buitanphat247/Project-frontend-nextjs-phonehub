import { unstable_cache } from 'next/cache';

// In-memory cache cho client-side
class MemoryCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  set(key: string, data: any, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Singleton instance cho client-side
const memoryCache = typeof window !== 'undefined' ? new MemoryCache() : null;

// Cache config
export const CACHE_CONFIG = {
  DEFAULT_TTL: 60000, // 60 giây
  PRODUCTS_TTL: 300000, // 5 phút cho products
  CATEGORIES_TTL: 600000, // 10 phút cho categories
};

// Generate cache key từ endpoint và params
export function generateCacheKey(endpoint: string, params?: Record<string, any>): string {
  const paramsStr = params ? JSON.stringify(params) : '';
  return `cache:${endpoint}:${paramsStr}`;
}

// Server-side cache với Next.js unstable_cache
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_CONFIG.DEFAULT_TTL,
  tags?: string[]
): Promise<T> {
  // Server-side: sử dụng Next.js cache
  if (typeof window === 'undefined') {
    const cached = unstable_cache(
      async () => fetcher(),
      [key],
      {
        revalidate: Math.floor(ttl / 1000), // Convert ms to seconds
        tags: tags || [key],
      }
    );
    return cached();
  }

  // Client-side: sử dụng memory cache
  if (memoryCache) {
    const cached = memoryCache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    memoryCache.set(key, data, ttl);
    return data;
  }

  // Fallback: không cache
  return fetcher();
}

// Clear cache
export function clearCache(key?: string): void {
  if (typeof window !== 'undefined' && memoryCache) {
    if (key) {
      memoryCache.delete(key);
    } else {
      memoryCache.clear();
    }
  }
}

// Get cache stats
export function getCacheStats(): { size: number; keys: string[] } | null {
  if (typeof window !== 'undefined' && memoryCache) {
    return {
      size: memoryCache.size(),
      keys: Array.from((memoryCache as any).cache.keys()),
    };
  }
  return null;
}

