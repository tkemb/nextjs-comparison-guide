import { fetchFromStrapi, API_ENDPOINTS } from '@/lib/api-config';
import { cacheManager } from '@/lib/local-cache';

// Check if caching is enabled via environment variable
const CACHE_ENABLED = process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false';

// Helper for development-only logging
const devLog = (message) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message);
  }
};

const devWarn = (message, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(message, error);
  }
};

// Helper to check cache if enabled
const getCachedData = (cacheGetter) => {
  return CACHE_ENABLED ? cacheGetter() : null;
};

// Helper to set cache if enabled
const setCachedData = (cacheSetter, ...args) => {
  if (CACHE_ENABLED) {
    cacheSetter(...args);
  }
};

// Enhanced API functions with caching
export const cachedAPI = {
  // Get categories with caching
  async getCategories() {
    const cached = getCachedData(() => cacheManager.getCategories());
    if (cached) {
      devLog('Using cached categories');
      return cached;
    }

    devLog(`Fetching categories from API${CACHE_ENABLED ? ' (cache enabled)' : ' (cache disabled)'}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.CATEGORIES);
    setCachedData(cacheManager.setCategories.bind(cacheManager), data);
    return data;
  },

  // Get category by slug with caching
  async getCategory(slug) {
    const cached = getCachedData(() => cacheManager.getCategory(slug));
    if (cached) {
      devLog(`Using cached category: ${slug}`);
      return cached;
    }

    devLog(`Fetching category from API: ${slug}${CACHE_ENABLED ? ' (cache enabled)' : ' (cache disabled)'}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.CATEGORY_BY_SLUG(slug));
    setCachedData(cacheManager.setCategory.bind(cacheManager), slug, data);
    return data;
  },

  // Get provider by slug with caching
  async getProvider(slug) {
    const cached = getCachedData(() => cacheManager.getProvider(slug));
    if (cached) {
      devLog(`Using cached provider: ${slug}`);
      return cached;
    }

    devLog(`Fetching provider from API: ${slug}${CACHE_ENABLED ? ' (cache enabled)' : ' (cache disabled)'}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.PROVIDER_BY_SLUG(slug));
    setCachedData(cacheManager.setProvider.bind(cacheManager), slug, data);
    return data;
  },

  // Get use case by slug with caching
  async getUseCase(slug) {
    const cached = getCachedData(() => cacheManager.getUseCase(slug));
    if (cached) {
      devLog(`Using cached use case: ${slug}`);
      return cached;
    }

    devLog(`Fetching use case from API: ${slug}${CACHE_ENABLED ? ' (cache enabled)' : ' (cache disabled)'}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.USE_CASE_BY_SLUG(slug));
    setCachedData(cacheManager.setUseCase.bind(cacheManager), slug, data);
    return data;
  },

  // Get providers by category with caching
  async getProvidersByCategory(categoryId) {
    const cached = getCachedData(() => cacheManager.getProvidersByCategory(categoryId));
    if (cached) {
      devLog(`Using cached providers for category: ${categoryId}`);
      return cached;
    }

    devLog(`Fetching providers from API for category: ${categoryId}${CACHE_ENABLED ? ' (cache enabled)' : ' (cache disabled)'}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.PROVIDERS_BY_CATEGORY(categoryId));
    setCachedData(cacheManager.setProvidersByCategory.bind(cacheManager), categoryId, data);
    return data;
  },

  // Get use cases by category with caching
  async getUseCasesByCategory(categoryId) {
    const cached = getCachedData(() => cacheManager.getUseCasesByCategory(categoryId));
    if (cached) {
      devLog(`Using cached use cases for category: ${categoryId}`);
      return cached;
    }

    devLog(`Fetching use cases from API for category: ${categoryId}${CACHE_ENABLED ? ' (cache enabled)' : ' (cache disabled)'}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.USE_CASES_BY_CATEGORY(categoryId));
    setCachedData(cacheManager.setUseCasesByCategory.bind(cacheManager), categoryId, data);
    return data;
  },

  // Get category details with related data (optimized batch fetch)
  async getCategoryWithRelatedData(slug) {
    // Check if complete category data is cached (only if cache is enabled)
    if (CACHE_ENABLED) {
      const cachedCategory = cacheManager.getCategory(slug);
      if (cachedCategory && cachedCategory.data && cachedCategory.data.length > 0) {
        const categoryItem = cachedCategory.data[0];
        const cachedProviders = cacheManager.getProvidersByCategory(categoryItem.documentId);
        const cachedUseCases = cacheManager.getUseCasesByCategory(categoryItem.documentId);
        
        if (cachedProviders && cachedUseCases) {
          devLog(`Using complete cached data for category: ${slug}`);
          return {
            category: categoryItem,
            providers: cachedProviders.data || [],
            useCases: cachedUseCases.data || []
          };
        }
      }
    }

    // Fetch category first
    const categoryData = await this.getCategory(slug);
    if (!categoryData.data || categoryData.data.length === 0) {
      throw new Error('Category not found');
    }

    const categoryItem = categoryData.data[0];

    // Fetch related data in parallel
    const [providersData, useCasesData] = await Promise.allSettled([
      this.getProvidersByCategory(categoryItem.documentId),
      this.getUseCasesByCategory(categoryItem.documentId)
    ]);

    return {
      category: categoryItem,
      providers: providersData.status === 'fulfilled' ? providersData.value.data || [] : [],
      useCases: useCasesData.status === 'fulfilled' ? useCasesData.value.data || [] : []
    };
  },

  // Get provider with related data (optimized batch fetch)
  async getProviderWithRelatedData(slug) {
    if (CACHE_ENABLED) {
      const cachedProvider = cacheManager.getProvider(slug);
      if (cachedProvider && cachedProvider.data && cachedProvider.data.length > 0) {
        const providerItem = cachedProvider.data[0];
        
        if (providerItem?.category?.documentId) {
          const cachedCategory = await this.getCategoryById(providerItem.category.documentId);
          const cachedRelated = cacheManager.getRelatedProviders(
            providerItem.category.documentId, 
            providerItem.documentId
          );
          
          if (cachedCategory && cachedRelated) {
            devLog(`Using complete cached data for provider: ${slug}`);
            return {
              provider: providerItem,
              category: cachedCategory,
              relatedProviders: cachedRelated
            };
          }
        }
      }
    }

    // Fetch provider first
    const providerData = await this.getProvider(slug);
    if (!providerData.data || providerData.data.length === 0) {
      throw new Error('Provider not found');
    }

    const providerItem = providerData.data[0];
    let categoryData = null;
    let relatedProviders = [];

    if (providerItem?.category?.documentId) {
      const [categoryResult, allProvidersResult] = await Promise.allSettled([
        this.getCategoryById(providerItem.category.documentId),
        this.getProvidersByCategory(providerItem.category.documentId)
      ]);

      categoryData = categoryResult.status === 'fulfilled' ? categoryResult.value : null;
      if (allProvidersResult.status === 'fulfilled') {
        relatedProviders = (allProvidersResult.value.data || [])
          .filter(p => p.documentId !== providerItem.documentId);
        
        // Cache the filtered related providers
        setCachedData(
          cacheManager.setRelatedProviders.bind(cacheManager),
          providerItem.category.documentId,
          providerItem.documentId,
          relatedProviders
        );
      }
    }

    return {
      provider: providerItem,
      category: categoryData,
      relatedProviders
    };
  },

  // Get use case with related data (optimized batch fetch)
  async getUseCaseWithRelatedData(slug) {
    if (CACHE_ENABLED) {
      const cachedUseCase = cacheManager.getUseCase(slug);
      if (cachedUseCase && cachedUseCase.data && cachedUseCase.data.length > 0) {
        const useCaseItem = cachedUseCase.data[0];
        
        if (useCaseItem?.category?.documentId) {
          const cachedCategory = await this.getCategoryById(useCaseItem.category.documentId);
          const cachedProviders = cacheManager.getProvidersByCategory(useCaseItem.category.documentId);
          
          if (cachedCategory && cachedProviders) {
            devLog(`Using complete cached data for use case: ${slug}`);
            return {
              useCase: useCaseItem,
              category: cachedCategory,
              relatedProviders: cachedProviders.data || []
            };
          }
        }
      }
    }

    // Fetch use case first
    const useCaseData = await this.getUseCase(slug);
    if (!useCaseData.data || useCaseData.data.length === 0) {
      throw new Error('Use case not found');
    }

    const useCaseItem = useCaseData.data[0];
    let categoryData = null;
    let relatedProviders = [];

    if (useCaseItem?.category?.documentId) {
      const [categoryResult, providersResult] = await Promise.allSettled([
        this.getCategoryById(useCaseItem.category.documentId),
        this.getProvidersByCategory(useCaseItem.category.documentId)
      ]);

      categoryData = categoryResult.status === 'fulfilled' ? categoryResult.value : null;
      relatedProviders = providersResult.status === 'fulfilled' ? providersResult.value.data || [] : [];
    }

    return {
      useCase: useCaseItem,
      category: categoryData,
      relatedProviders
    };
  },

  // Helper: Get category by ID
  async getCategoryById(categoryId) {
    // Try to find in categories cache first (only if cache is enabled)
    if (CACHE_ENABLED) {
      const categoriesCache = cacheManager.getCategories();
      if (categoriesCache && categoriesCache.data) {
        const category = categoriesCache.data.find(cat => cat.documentId === categoryId);
        if (category) {
          devLog(`Found category ${categoryId} in categories cache`);
          return category;
        }
      }
    }

    // Fetch from API
    devLog(`Fetching category by ID from API: ${categoryId}`);
    const data = await fetchFromStrapi(`/categories/${categoryId}`);
    return data.data;
  },

  // Preload functions (non-blocking) - only if cache is enabled
  async preloadCategory(slug) {
    if (CACHE_ENABLED && !cacheManager.getCategory(slug)) {
      try {
        await this.getCategoryWithRelatedData(slug);
      } catch (error) {
        devWarn(`Failed to preload category ${slug}:`, error);
      }
    }
  },

  async preloadProvider(slug) {
    if (CACHE_ENABLED && !cacheManager.getProvider(slug)) {
      try {
        await this.getProviderWithRelatedData(slug);
      } catch (error) {
        devWarn(`Failed to preload provider ${slug}:`, error);
      }
    }
  },

  async preloadUseCase(slug) {
    if (CACHE_ENABLED && !cacheManager.getUseCase(slug)) {
      try {
        await this.getUseCaseWithRelatedData(slug);
      } catch (error) {
        devWarn(`Failed to preload use case ${slug}:`, error);
      }
    }
  }
};

export default cachedAPI;