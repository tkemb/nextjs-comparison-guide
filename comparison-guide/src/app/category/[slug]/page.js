'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchFromStrapi, API_ENDPOINTS } from '@/lib/api-config';
import { getStrapiImageUrl } from '@/lib/strapi';
import Layout from '@/components/Layout';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = params;
  const [category, setCategory] = useState(null);
  const [providers, setProviders] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get active tab from URL parameter, default to 'overview'
  const activeTab = searchParams.get('tab') || 'overview';

  // Function to update URL when tab changes
  const handleTabChange = (newTab) => {
    const params = new URLSearchParams(searchParams);
    if (newTab === 'overview') {
      params.delete('tab'); // Remove tab param for default tab
    } else {
      params.set('tab', newTab);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/category/${slug}${newUrl}`, { scroll: false });
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details by slug
        const categoryData = await fetchFromStrapi(API_ENDPOINTS.CATEGORY_BY_SLUG(slug));
        
        if (!categoryData.data || categoryData.data.length === 0) {
          throw new Error('Category not found');
        }
        
        const categoryItem = categoryData.data[0];
        setCategory(categoryItem);

        // Fetch providers for this category using category documentId
        try {
          const providersData = await fetchFromStrapi(API_ENDPOINTS.PROVIDERS_BY_CATEGORY(categoryItem.documentId));
          setProviders(providersData.data || []);
        } catch (error) {
          console.warn('Failed to fetch providers:', error);
          setProviders([]);
        }

        // Fetch use-cases for this category using category documentId
        try {
          const useCasesData = await fetchFromStrapi(API_ENDPOINTS.USE_CASES_BY_CATEGORY(categoryItem.documentId));
          setUseCases(useCasesData.data || []);
        } catch (error) {
          console.warn('Failed to fetch use cases:', error);
          setUseCases([]);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {category.name || 'Category'}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 mt-2">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('providers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'providers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Providers ({providers.length})
            </button>
            <button
              onClick={() => handleTabChange('use-cases')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'use-cases'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Use Cases ({useCases.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'overview' && (
          <div>
            {/* Hero Image over Text Content */}
            {getStrapiImageUrl(category.image_header) && (
              <div className="relative mb-8 h-64 md:h-96 overflow-hidden rounded-xl">
                <Image
                  src={getStrapiImageUrl(category.image_header)}
                  alt={category.name || 'Category'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            {/* Category Text Content */}
            {category.text ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: category.text }}>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    No content available
                  </h2>
                  <p className="text-gray-600">
                    There is currently no content for this category.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'providers' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Providers in {category.name}
            </h2>
            {providers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {providers.map((provider) => (
                  <Link
                    key={provider.documentId}
                    href={`/provider/${provider.slug || provider.documentId}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group-hover:scale-105 overflow-hidden">
                      {provider.logo ? (
                        <div className="aspect-square flex items-center justify-center p-8 bg-gray-50">
                          <img
                            src={getStrapiImageUrl(provider.logo)}
                            alt={`${provider.name || 'Provider'} logo`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square flex items-center justify-center p-8 bg-gray-100">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 mx-auto">
                              <span className="text-white font-bold text-xl">
                                {(provider.name || 'Provider').charAt(0)}
                              </span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {provider.name || 'Untitled Provider'}
                            </h3>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4 bg-white">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-center">
                          {provider.name || 'Untitled Provider'}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  No providers found
                </h2>
                <p className="text-gray-600">
                  There are currently no providers in this category.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'use-cases' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Use Cases for {category.name}
            </h2>
            {useCases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {useCases.map((useCase) => (
                  <Link
                    key={useCase.documentId}
                    href={`/use-case/${useCase.slug || useCase.documentId}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group-hover:scale-105">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {useCase.title || 'Untitled Use Case'}
                      </h3>
                      {useCase.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {useCase.description}
                        </p>
                      )}
                      <div className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        View use case →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  No use cases found
                </h2>
                <p className="text-gray-600">
                  There are currently no use cases in this category.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
}