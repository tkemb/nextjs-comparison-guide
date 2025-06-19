// src/lib/strapi.js

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://jolly-egg-8bf232f85b.strapiapp.com/api';

// Helper function to fetch data from Strapi
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Log the API URL being called (shows in terminal for server-side calls)
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
      console.warn(`❌ Strapi API error on ${endpoint}: ${response.status}`);
      return { data: [] }; // Return empty data structure
    }

    const data = await response.json();
    console.log(`✅ Strapi API Success: ${url}`);
    return data;
  } catch (error) {
    console.warn(`❌ Strapi API connection failed on ${endpoint}:`, error.message);
    return { data: [] }; // Return empty data structure
  }
}

// Get all software with optional filtering
export async function getSoftware(params = {}) {
  const query = new URLSearchParams();
  
  // Add any additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });

  const data = await fetchAPI(`/articles?${query.toString()}`);
  return data.data;
}

// Get single software by slug
export async function getSoftwareBySlug(slug) {
  const query = new URLSearchParams();
  query.append('filters[slug][$eq]', slug);

  const data = await fetchAPI(`/articles?${query.toString()}`);
  return data.data[0] || null;
}

// Get all categories
export async function getCategories() {
  const data = await fetchAPI('/categories?populate=*');
  return data.data;
}

// Get software by category
export async function getSoftwareByCategory(categorySlug) {
  const query = new URLSearchParams();
  query.append('filters[category][slug][$eq]', categorySlug);

  const data = await fetchAPI(`/articles?${query.toString()}`);
  return data.data;
}

// Get featured software
export async function getFeaturedSoftware() {
  // Since articles don't have featured field, return latest articles
  const query = new URLSearchParams();
  query.append('sort', 'publishedAt:desc');
  query.append('pagination[limit]', '3');

  const data = await fetchAPI(`/articles?${query.toString()}`);
  return data.data;
}

// Search software
export async function searchSoftware(searchTerm) {
  const query = new URLSearchParams();
  query.append('filters[$or][0][title][$containsi]', searchTerm);
  query.append('filters[$or][1][description][$containsi]', searchTerm);

  const data = await fetchAPI(`/articles?${query.toString()}`);
  return data.data;
}

// Helper function to get image URL
export function getStrapiImageUrl(imageData) {
  if (!imageData) return null;
  
  const { url } = imageData.attributes || imageData;
  
  if (!url) return null;
  
  // If it's a full URL, return as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // Otherwise, prepend the Strapi base URL
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace('/api', '') || 'https://jolly-egg-8bf232f85b.strapiapp.com';
  return `${baseUrl}${url}`;
}