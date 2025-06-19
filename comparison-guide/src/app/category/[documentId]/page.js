'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const { documentId } = params;
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [providers, setProviders] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryResponse = await fetch(`https://jolly-egg-8bf232f85b.strapiapp.com/api/categories/${documentId}?populate=*`);
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category');
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData.data);

        // Fetch articles for this category
        const articlesResponse = await fetch(`https://jolly-egg-8bf232f85b.strapiapp.com/api/articles?filters[category][documentId][$eq]=${documentId}`);
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          setArticles(articlesData.data || []);
        }

        // Fetch providers for this category
        const providersResponse = await fetch(`https://jolly-egg-8bf232f85b.strapiapp.com/api/providers?filters[category][documentId][$eq]=${documentId}`);
        if (providersResponse.ok) {
          const providersData = await providersResponse.json();
          setProviders(providersData.data || []);
        }

        // Fetch use-cases for this category
        const useCasesResponse = await fetch(`https://jolly-egg-8bf232f85b.strapiapp.com/api/use-cases?filters[category][documentId][$eq]=${documentId}`);
        if (useCasesResponse.ok) {
          const useCasesData = await useCasesResponse.json();
          setUseCases(useCasesData.data || []);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchCategoryData();
    }
  }, [documentId]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
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
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'providers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Providers ({providers.length})
            </button>
            <button
              onClick={() => setActiveTab('use-cases')}
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
            {category.image_header?.url && (
              <div className="relative mb-8 h-64 md:h-96 overflow-hidden rounded-xl">
                <img
                  src={category.image_header.url}
                  alt={category.name || 'Category'}
                  className="w-full h-full object-cover"
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
                    href={`/provider/${provider.documentId}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group-hover:scale-105">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {provider.name || 'Untitled Provider'}
                      </h3>
                      {provider.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {provider.description}
                        </p>
                      )}
                      <div className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        View provider →
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
                    href={`/use-case/${useCase.documentId}`}
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
  );
}