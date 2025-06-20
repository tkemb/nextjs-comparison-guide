'use client';

// Local storage cache with persistence and smart invalidation
class LocalCache {
  constructor(prefix = 'comparison-guide-', defaultTTL = 30 * 60 * 1000) { // 30 minutes default
    this.prefix = prefix;
    this.defaultTTL = defaultTTL;
    this.isClient = typeof window !== 'undefined';
  }

  // Generate cache key
  key(identifier) {
    return `${this.prefix}${identifier}`;
  }

  // Set item in cache with TTL
  set(identifier, data, ttl = this.defaultTTL) {
    if (!this.isClient) return;

    const item = {
      data,
      timestamp: Date.now(),
      ttl,
      version: '1.0' // For future cache structure changes
    };

    try {
      localStorage.setItem(this.key(identifier), JSON.stringify(item));
      console.log(`Cache SET: ${identifier} (TTL: ${ttl / 1000}s)`);
    } catch (error) {
      console.warn('Failed to save to cache:', error);
      // If storage is full, clear old items and retry
      this.cleanup();
      try {
        localStorage.setItem(this.key(identifier), JSON.stringify(item));
      } catch (retryError) {
        console.warn('Failed to save to cache after cleanup:', retryError);
      }
    }
  }

  // Get item from cache
  get(identifier) {
    if (!this.isClient) return null;

    try {
      const cached = localStorage.getItem(this.key(identifier));
      if (!cached) return null;

      const item = JSON.parse(cached);
      
      // Check if expired
      if (Date.now() - item.timestamp > item.ttl) {
        this.delete(identifier);
        console.log(`Cache EXPIRED: ${identifier}`);
        return null;
      }

      console.log(`Cache HIT: ${identifier}`);
      return item.data;
    } catch (error) {
      console.warn('Failed to read from cache:', error);
      this.delete(identifier);
      return null;
    }
  }

  // Delete specific item
  delete(identifier) {
    if (!this.isClient) return;
    localStorage.removeItem(this.key(identifier));
  }

  // Check if item exists and is not expired
  has(identifier) {
    return this.get(identifier) !== null;
  }

  // Get all cache keys
  getAllKeys() {
    if (!this.isClient) return [];
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }

  // Cleanup expired items
  cleanup() {
    if (!this.isClient) return;

    const keys = this.getAllKeys();
    let cleanedCount = 0;

    keys.forEach(identifier => {
      try {
        const cached = localStorage.getItem(this.key(identifier));
        if (cached) {
          const item = JSON.parse(cached);
          if (Date.now() - item.timestamp > item.ttl) {
            this.delete(identifier);
            cleanedCount++;
          }
        }
      } catch {
        // Delete corrupted entries
        this.delete(identifier);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`Cache cleanup: removed ${cleanedCount} expired items`);
    }
  }

  // Clear all cache
  clear() {
    if (!this.isClient) return;

    const keys = this.getAllKeys();
    keys.forEach(identifier => this.delete(identifier));
    console.log(`Cache cleared: ${keys.length} items removed`);
  }

  // Get cache statistics
  getStats() {
    if (!this.isClient) return { total: 0, expired: 0, valid: 0, size: 0 };

    const keys = this.getAllKeys();
    let expired = 0;
    let valid = 0;
    let totalSize = 0;

    keys.forEach(identifier => {
      try {
        const cached = localStorage.getItem(this.key(identifier));
        if (cached) {
          totalSize += cached.length;
          const item = JSON.parse(cached);
          if (Date.now() - item.timestamp > item.ttl) {
            expired++;
          } else {
            valid++;
          }
        }
      } catch {
        expired++;
      }
    });

    return {
      total: keys.length,
      expired,
      valid,
      size: Math.round(totalSize / 1024) // KB
    };
  }
}

// Create cache instances for different data types
const cache = new LocalCache('cg-');
const apiCache = new LocalCache('cg-api-', 15 * 60 * 1000); // 15 minutes for API calls
const imageCache = new LocalCache('cg-img-', 60 * 60 * 1000); // 1 hour for images

// Cache keys
const CACHE_KEYS = {
  CATEGORIES: 'categories',
  CATEGORY: (slug) => `category-${slug}`,
  PROVIDER: (slug) => `provider-${slug}`,
  USE_CASE: (slug) => `usecase-${slug}`,
  PROVIDERS_BY_CATEGORY: (categoryId) => `providers-cat-${categoryId}`,
  USE_CASES_BY_CATEGORY: (categoryId) => `usecases-cat-${categoryId}`,
  RELATED_PROVIDERS: (categoryId, excludeId) => `related-${categoryId}-${excludeId}`
};

// Enhanced caching functions
export const cacheManager = {
  // Categories
  getCategories: () => apiCache.get(CACHE_KEYS.CATEGORIES),
  setCategories: (data) => apiCache.set(CACHE_KEYS.CATEGORIES, data, 60 * 60 * 1000), // 1 hour

  // Category data
  getCategory: (slug) => apiCache.get(CACHE_KEYS.CATEGORY(slug)),
  setCategory: (slug, data) => apiCache.set(CACHE_KEYS.CATEGORY(slug), data),

  // Provider data
  getProvider: (slug) => apiCache.get(CACHE_KEYS.PROVIDER(slug)),
  setProvider: (slug, data) => apiCache.set(CACHE_KEYS.PROVIDER(slug), data),

  // Use case data
  getUseCase: (slug) => apiCache.get(CACHE_KEYS.USE_CASE(slug)),
  setUseCase: (slug, data) => apiCache.set(CACHE_KEYS.USE_CASE(slug), data),

  // Providers by category
  getProvidersByCategory: (categoryId) => apiCache.get(CACHE_KEYS.PROVIDERS_BY_CATEGORY(categoryId)),
  setProvidersByCategory: (categoryId, data) => apiCache.set(CACHE_KEYS.PROVIDERS_BY_CATEGORY(categoryId), data),

  // Use cases by category
  getUseCasesByCategory: (categoryId) => apiCache.get(CACHE_KEYS.USE_CASES_BY_CATEGORY(categoryId)),
  setUseCasesByCategory: (categoryId, data) => apiCache.set(CACHE_KEYS.USE_CASES_BY_CATEGORY(categoryId), data),

  // Related providers
  getRelatedProviders: (categoryId, excludeId) => apiCache.get(CACHE_KEYS.RELATED_PROVIDERS(categoryId, excludeId)),
  setRelatedProviders: (categoryId, excludeId, data) => apiCache.set(CACHE_KEYS.RELATED_PROVIDERS(categoryId, excludeId), data),

  // Cache management
  cleanup: () => {
    cache.cleanup();
    apiCache.cleanup();
    imageCache.cleanup();
  },

  clear: () => {
    cache.clear();
    apiCache.clear();
    imageCache.clear();
  },

  getStats: () => ({
    general: cache.getStats(),
    api: apiCache.getStats(),
    images: imageCache.getStats()
  }),

  // Invalidate specific data
  invalidateCategory: (slug) => {
    apiCache.delete(CACHE_KEYS.CATEGORY(slug));
  },

  invalidateProvider: (slug) => {
    apiCache.delete(CACHE_KEYS.PROVIDER(slug));
  },

  invalidateUseCase: (slug) => {
    apiCache.delete(CACHE_KEYS.USE_CASE(slug));
  },

  // Background cleanup (run periodically)
  scheduleCleanup: () => {
    if (typeof window !== 'undefined') {
      // Run cleanup every 5 minutes
      setInterval(() => {
        cacheManager.cleanup();
      }, 5 * 60 * 1000);
    }
  }
};

// Auto-schedule cleanup on initialization
if (typeof window !== 'undefined') {
  // Initial cleanup on page load
  setTimeout(() => cacheManager.cleanup(), 1000);
  
  // Schedule regular cleanups
  cacheManager.scheduleCleanup();
  
  // Cleanup when page unloads
  window.addEventListener('beforeunload', () => {
    cacheManager.cleanup();
  });
}

export default cacheManager;