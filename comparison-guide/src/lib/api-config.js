// API configuration for different environments
export const API_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jolly-egg-8bf232f85b.strapiapp.com/api';

// Helper function to build API URLs
export function buildApiUrl(endpoint) {
  return `${API_BASE_URL}${endpoint}`;
}

// Helper function to fetch data from Strapi with error handling
export async function fetchFromStrapi(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  
  // Log the API URL being called
  console.log(`🌐 Strapi API Call: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Strapi API Success: ${url}`);
    return data;
  } catch (error) {
    console.error(`❌ Strapi API error on ${endpoint}:`, error.message);
    throw error;
  }
}

// Centralized API endpoints
export const API_ENDPOINTS = {
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_SLUG: (slug) => `/categories?filters[slug][$eq]=${slug}&populate=*`,
  
  // Articles
  ARTICLES: '/articles',
  ARTICLE_BY_SLUG: (slug) => `/articles?filters[slug][$eq]=${slug}&populate=*`,
  
  // Providers
  PROVIDERS: '/providers',
  PROVIDER_BY_SLUG: (slug) => `/providers?filters[slug][$eq]=${slug}&populate=*`,
  PROVIDERS_BY_CATEGORY: (categoryDocumentId) => `/providers?filters[category][documentId][$eq]=${categoryDocumentId}&populate=*`,
  
  // Use Cases
  USE_CASES: '/use-cases',
  USE_CASE_BY_SLUG: (slug) => `/use-cases?filters[slug][$eq]=${slug}&populate=*`,
  USE_CASES_BY_CATEGORY: (categoryDocumentId) => `/use-cases?filters[category][documentId][$eq]=${categoryDocumentId}&populate=*`,
  
  // Pages (About, Contact, etc.)
  PAGES: '/pages',
  PAGE_BY_SLUG: (slug) => `/pages?filters[slug][$eq]=${slug}`,
};