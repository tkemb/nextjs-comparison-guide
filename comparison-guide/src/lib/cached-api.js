import { fetchFromStrapi, API_ENDPOINTS } from '@/lib/api-config';
import { cacheManager } from '@/lib/local-cache';

// Enhanced API functions with caching
export const cachedAPI = {
  // Get categories with caching
  async getCategories() {
    const cached = cacheManager.getCategories();
    if (cached) {
      console.log('Using cached categories');
      return cached;
    }

    console.log('Fetching categories from API');
    const data = await fetchFromStrapi(API_ENDPOINTS.CATEGORIES);
    cacheManager.setCategories(data);
    return data;
  },

  // Get category by slug with caching
  async getCategory(slug) {
    const cached = cacheManager.getCategory(slug);
    if (cached) {
      console.log(`Using cached category: ${slug}`);
      return cached;
    }

    console.log(`Fetching category from API: ${slug}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.CATEGORY_BY_SLUG(slug));
    cacheManager.setCategory(slug, data);
    return data;
  },

  // Get provider by slug with caching
  async getProvider(slug) {
    const cached = cacheManager.getProvider(slug);
    if (cached) {
      console.log(`Using cached provider: ${slug}`);
      return cached;
    }

    console.log(`Fetching provider from API: ${slug}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.PROVIDER_BY_SLUG(slug));
    cacheManager.setProvider(slug, data);
    return data;
  },

  // Get use case by slug with caching
  async getUseCase(slug) {
    const cached = cacheManager.getUseCase(slug);
    if (cached) {
      console.log(`Using cached use case: ${slug}`);
      return cached;
    }

    console.log(`Fetching use case from API: ${slug}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.USE_CASE_BY_SLUG(slug));
    cacheManager.setUseCase(slug, data);
    return data;
  },

  // Get providers by category with caching
  async getProvidersByCategory(categoryId) {
    const cached = cacheManager.getProvidersByCategory(categoryId);
    if (cached) {
      console.log(`Using cached providers for category: ${categoryId}`);
      return cached;
    }

    console.log(`Fetching providers from API for category: ${categoryId}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.PROVIDERS_BY_CATEGORY(categoryId));
    cacheManager.setProvidersByCategory(categoryId, data);
    return data;
  },

  // Get use cases by category with caching
  async getUseCasesByCategory(categoryId) {
    const cached = cacheManager.getUseCasesByCategory(categoryId);
    if (cached) {
      console.log(`Using cached use cases for category: ${categoryId}`);
      return cached;
    }

    console.log(`Fetching use cases from API for category: ${categoryId}`);
    const data = await fetchFromStrapi(API_ENDPOINTS.USE_CASES_BY_CATEGORY(categoryId));
    cacheManager.setUseCasesByCategory(categoryId, data);
    return data;
  },

  // Get category details with related data (optimized batch fetch)
  async getCategoryWithRelatedData(slug) {
    // Check if complete category data is cached
    const cachedCategory = cacheManager.getCategory(slug);
    if (cachedCategory && cachedCategory.data && cachedCategory.data.length > 0) {
      const categoryItem = cachedCategory.data[0];
      const cachedProviders = cacheManager.getProvidersByCategory(categoryItem.documentId);
      const cachedUseCases = cacheManager.getUseCasesByCategory(categoryItem.documentId);
      
      if (cachedProviders && cachedUseCases) {
        console.log(`Using complete cached data for category: ${slug}`);
        return {
          category: categoryItem,
          providers: cachedProviders.data || [],
          useCases: cachedUseCases.data || []
        };
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
          console.log(`Using complete cached data for provider: ${slug}`);
          return {
            provider: providerItem,
            category: cachedCategory,
            relatedProviders: cachedRelated
          };
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
        cacheManager.setRelatedProviders(
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
    const cachedUseCase = cacheManager.getUseCase(slug);
    if (cachedUseCase && cachedUseCase.data && cachedUseCase.data.length > 0) {
      const useCaseItem = cachedUseCase.data[0];
      
      if (useCaseItem?.category?.documentId) {
        const cachedCategory = await this.getCategoryById(useCaseItem.category.documentId);
        const cachedProviders = cacheManager.getProvidersByCategory(useCaseItem.category.documentId);
        
        if (cachedCategory && cachedProviders) {
          console.log(`Using complete cached data for use case: ${slug}`);
          return {
            useCase: useCaseItem,
            category: cachedCategory,
            relatedProviders: cachedProviders.data || []
          };
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
    // Try to find in categories cache first
    const categoriesCache = cacheManager.getCategories();
    if (categoriesCache && categoriesCache.data) {
      const category = categoriesCache.data.find(cat => cat.documentId === categoryId);
      if (category) {
        console.log(`Found category ${categoryId} in categories cache`);
        return category;
      }
    }

    // Fetch from API
    console.log(`Fetching category by ID from API: ${categoryId}`);
    const data = await fetchFromStrapi(`/categories/${categoryId}`);
    return data.data;
  },

  // Preload functions (non-blocking)
  async preloadCategory(slug) {
    if (!cacheManager.getCategory(slug)) {
      try {
        await this.getCategoryWithRelatedData(slug);
      } catch (error) {
        console.warn(`Failed to preload category ${slug}:`, error);
      }
    }
  },

  async preloadProvider(slug) {
    if (!cacheManager.getProvider(slug)) {
      try {
        await this.getProviderWithRelatedData(slug);
      } catch (error) {
        console.warn(`Failed to preload provider ${slug}:`, error);
      }
    }
  },

  async preloadUseCase(slug) {
    if (!cacheManager.getUseCase(slug)) {
      try {
        await this.getUseCaseWithRelatedData(slug);
      } catch (error) {
        console.warn(`Failed to preload use case ${slug}:`, error);
      }
    }
  }
};

export default cachedAPI;