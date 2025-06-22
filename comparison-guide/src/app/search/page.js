'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { fetchFromStrapi } from '@/lib/api-config';
import { getStrapiImageUrl } from '@/lib/strapi';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState({ categories: [], providers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.trim().length < 1) {
        setResults({ categories: [], providers: [] });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [categoriesData, providersData] = await Promise.allSettled([
          fetchFromStrapi(`/categories?filters[name][$containsi]=${encodeURIComponent(query)}&populate=*`),
          fetchFromStrapi(`/providers?filters[$or][0][name][$containsi]=${encodeURIComponent(query)}&filters[$or][1][description][$containsi]=${encodeURIComponent(query)}&populate=*`)
        ]);

        const categories = categoriesData.status === 'fulfilled' ? categoriesData.value.data || [] : [];
        const providers = providersData.status === 'fulfilled' ? providersData.value.data || [] : [];

        setResults({ categories, providers });
      } catch (err) {
        setError('Failed to search. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const totalResults = results.categories.length + results.providers.length;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-xl text-gray-600">
                {loading ? (
                  `Searching for "${query}"...`
                ) : (
                  `${totalResults} result${totalResults !== 1 ? 's' : ''} for "${query}"`
                )}
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          ) : !query || query.trim().length < 1 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Enter a search term</h3>
                <p className="text-gray-600">Please enter at least 1 characters to search for categories and providers.</p>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.881-6.127 2.325.396-.145.803-.275 1.207-.388C8.055 16.647 9.883 16 12 16s3.945.647 4.92.937c.404.113.811.243 1.207.388A7.962 7.962 0 0120 13.291V8a2 2 0 00-2-2h-8a2 2 0 00-2 2v5.291z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse our categories.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Categories Results */}
              {results.categories.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Categories ({results.categories.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.categories.map((category) => (
                      <Link
                        key={category.documentId}
                        href={`/category/${category.slug || category.documentId}`}
                        className="group block"
                      >
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {category.name}
                            </h3>
                          </div>
                          {category.description && (
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Providers Results */}
              {results.providers.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Providers ({results.providers.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.providers.map((provider) => (
                      <Link
                        key={provider.documentId}
                        href={`/provider/${provider.slug || provider.documentId}`}
                        className="group block"
                      >
                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300">
                          <div className="flex items-start mb-4">
                            {provider.logo ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white p-2 flex items-center justify-center mr-4 flex-shrink-0">
                                <Image
                                  src={getStrapiImageUrl(provider.logo)}
                                  alt={`${provider.name || 'Provider'} logo`}
                                  width={48}
                                  height={48}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <span className="text-green-600 font-bold text-lg">
                                  {(provider.name || 'P').charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-1">
                                {provider.name || provider.title || 'Untitled Provider'}
                              </h3>
                              {provider.rating && (
                                <div className="flex items-center mb-2">
                                  <div className="flex mr-2">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.floor(provider.rating)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {provider.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {provider.description && (
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {provider.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading search...</p>
            </div>
          </div>
        </div>
      </Layout>
    }>
      <SearchContent />
    </Suspense>
  );
}