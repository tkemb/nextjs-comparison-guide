'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/strapi';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { cachedAPI } from '@/lib/cached-api';

export default function ProviderPage() {
  const params = useParams();
  const { slug } = params;
  const [provider, setProvider] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProviders, setRelatedProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleProviderHover = (providerSlug) => {
    cachedAPI.preloadProvider(providerSlug);
  };

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);
        
        // Use cached API for optimized data fetching
        const { provider: providerItem, category: categoryData, relatedProviders: relatedData } = 
          await cachedAPI.getProviderWithRelatedData(slug);
        
        setProvider(providerItem);
        setCategory(categoryData);
        setRelatedProviders(relatedData);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProviderData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider...</p>
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

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Provider not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  // Debug: Log provider data to see what we're getting (development only)
  // Generate click tracker URL for provider
  const getTrackedProviderUrl = (provider) => {        
    console.log(`Generating tracked URL for provider: ${provider.name || provider.title}`);
    return `/c?provider=${provider.slug}&source=portal&campaign=provider-page`;
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Provider data:', provider);
    console.log('Provider keys:', Object.keys(provider || {}));
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb 
                items={[
                  ...(category ? [{ label: category.name, href: `/category/${category.slug || category.documentId}` }] : []),
                  { label: provider?.name || 'Provider' }
                ]} 
              />
            </div>

            {/* Provider Header */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-6 flex-1">
                {/* Logo */}
                {provider.logo && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white p-3 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Image
                      src={getStrapiImageUrl(provider.logo)}
                      alt={`${provider.name || 'Provider'} logo`}
                      width={96}
                      height={96}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {provider.name || provider.title || 'Provider'}
                  </h1>
                  
                  {provider.description && (
                    <p className="text-xl text-gray-600 mb-4">
                      {provider.description}
                    </p>
                  )}

                  {/* Rating */}
                  {provider.rating && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
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
                      <span className="text-lg font-medium text-gray-900">
                        {provider.rating.toFixed(1)}
                      </span>
                      {provider.review_count && (
                        <span className="text-gray-500">
                          ({provider.review_count} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions - Moved to the right */}
              <div className="flex flex-col gap-3 flex-shrink-0">
                  <a
                    href={getTrackedProviderUrl(provider)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center whitespace-nowrap"
                  >
                    Visit {provider.name || 'Provider'}
                  </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section - Using provider.content */}
              {provider.content && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About {provider.name}</h2>
                  <div className="prose max-w-none text-gray-700">
                    <div dangerouslySetInnerHTML={{ __html: provider.content }} />
                  </div>
                </div>
              )}

              {/* Fallback content if no content field */}
              {!provider.content && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About {provider.name || 'This Provider'}</h2>
                  <div className="text-gray-700">
                    <p>No detailed content is available for this provider yet.</p>
                    {(provider.link || provider.website) && (
                      <p className="mt-4">
                        Visit their website for more information: 
                        <a href={getTrackedProviderUrl(provider, 'fallback-content')} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                          {provider.website || 'Visit Provider'}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Features Section */}
              {provider.features && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
                  <div className="prose max-w-none text-gray-700">
                    {typeof provider.features === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: provider.features }} />
                    ) : (
                      <div>{provider.features}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Services Section */}
              {provider.services && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
                  <div className="prose max-w-none text-gray-700">
                    {typeof provider.services === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: provider.services }} />
                    ) : (
                      <div>{provider.services}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing Section */}
              {provider.pricing && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2>
                  <div className="prose max-w-none text-gray-700">
                    {typeof provider.pricing === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: provider.pricing }} />
                    ) : (
                      <div>{provider.pricing}</div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Sidebar - Same as Category Page */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {category ? `Other ${category.name} Providers` : 'Related Providers'}
                  </h3>
                  {relatedProviders.length > 0 ? (
                    <div className="space-y-3">
                      {relatedProviders
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .slice(0, 6)
                        .map((relatedProvider) => (
                          <Link
                            key={relatedProvider.documentId}
                            href={`/provider/${relatedProvider.slug || relatedProvider.documentId}`}
                            className="group block"
                            onMouseEnter={() => handleProviderHover(relatedProvider.slug || relatedProvider.documentId)}
                          >
                            <div className="flex items-center gap-4 p-4 rounded-lg border border-transparent hover:bg-gray-50 hover:border-blue-300 transition-all duration-200">
                              {relatedProvider.logo ? (
                                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <Image
                                    src={getStrapiImageUrl(relatedProvider.logo)}
                                    alt={`${relatedProvider.name || 'Provider'} logo`}
                                    width={56}
                                    height={56}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <span className="text-white font-bold text-lg">
                                    {(relatedProvider.name || 'P').charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                  {relatedProvider.name || 'Untitled Provider'}
                                </h4>
                                {relatedProvider.rating && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <svg
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < Math.floor(relatedProvider.rating)
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
                                    <span className="text-sm text-gray-500 ml-1">
                                      {relatedProvider.rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No related providers available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}