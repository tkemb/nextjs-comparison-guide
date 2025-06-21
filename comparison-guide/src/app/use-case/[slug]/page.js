'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/strapi';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import { cachedAPI } from '@/lib/cached-api';

export default function UseCasePage() {
  const params = useParams();
  const { slug } = params;
  const [useCase, setUseCase] = useState(null);
  const [category, setCategory] = useState(null);
  const [relatedProviders, setRelatedProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleProviderHover = (providerSlug) => {
    cachedAPI.preloadProvider(providerSlug);
  };

  useEffect(() => {
    const fetchUseCaseData = async () => {
      try {
        setLoading(true);
        
        // Use cached API for optimized data fetching
        const { useCase: useCaseItem, category: categoryData, relatedProviders: providersData } = 
          await cachedAPI.getUseCaseWithRelatedData(slug);
        
        setUseCase(useCaseItem);
        setCategory(categoryData);
        setRelatedProviders(providersData);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchUseCaseData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading use case...</p>
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

  if (!useCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Use case not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
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
                  { label: useCase?.title || 'Use Case' }
                ]} 
              />
            </div>

            {/* Use Case Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {useCase.title || 'Use Case'}
              </h1>
              {useCase.description && (
                <p className="text-xl text-gray-600">
                  {useCase.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section - Using use case content */}
              {useCase.content && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Use Case Details</h2>
                  <div className="prose max-w-none text-gray-700">
                    {typeof useCase.content === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: useCase.content }} />
                    ) : (
                      <div>{useCase.content}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Problem Statement */}
              {useCase.problem && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Problem Statement</h2>
                  <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                    <div className="prose max-w-none text-gray-700">
                      {typeof useCase.problem === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: useCase.problem }} />
                      ) : (
                        <div>{useCase.problem}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Solution */}
              {useCase.solution && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Solution</h2>
                  <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg">
                    <div className="prose max-w-none text-gray-700">
                      {typeof useCase.solution === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: useCase.solution }} />
                      ) : (
                        <div>{useCase.solution}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {useCase.benefits && (
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                    <div className="prose max-w-none text-gray-700">
                      {typeof useCase.benefits === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: useCase.benefits }} />
                      ) : (
                        <div>{useCase.benefits}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Information Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Category</h4>
                      <Link 
                        href={`/category/${category.slug || category.documentId}`}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        {category.name}
                      </Link>
                    </div>
                  )}

                  {useCase.difficulty && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Difficulty Level</h4>
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        useCase.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        useCase.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        useCase.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {useCase.difficulty}
                      </span>
                    </div>
                  )}

                  {useCase.timeline && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Estimated Timeline</h4>
                      <p className="text-gray-900 font-medium">{useCase.timeline}</p>
                    </div>
                  )}

                  {useCase.cost && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Cost Range</h4>
                      <p className="text-gray-900 font-medium">{useCase.cost}</p>
                    </div>
                  )}
                </div>

                {useCase.tags && useCase.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {useCase.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {useCase.relatedLinks && useCase.relatedLinks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Related Links</h4>
                    <ul className="space-y-2">
                      {useCase.relatedLinks.map((link, index) => (
                        <li key={index}>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
                          >
                            {link.title || link.url}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Sidebar - Same as Category and Provider Pages */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {category ? `Top ${category.name} Providers` : 'Related Providers'}
                  </h3>
                  {relatedProviders.length > 0 ? (
                    <div className="space-y-3">
                      {relatedProviders
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .slice(0, 6)
                        .map((provider) => (
                          <Link
                            key={provider.documentId}
                            href={`/provider/${provider.slug || provider.documentId}`}
                            className="group block"
                            onMouseEnter={() => handleProviderHover(provider.slug || provider.documentId)}
                          >
                            <div className="flex items-center gap-4 p-4 rounded-lg border border-transparent hover:bg-gray-50 hover:border-blue-300 transition-all duration-200">
                              {provider.logo ? (
                                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <Image
                                    src={getStrapiImageUrl(provider.logo)}
                                    alt={`${provider.name || 'Provider'} logo`}
                                    width={56}
                                    height={56}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <span className="text-white font-bold text-lg">
                                    {(provider.name || 'P').charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                  {provider.name || 'Untitled Provider'}
                                </h4>
                                {provider.rating && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <div className="flex">
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
                                    <span className="text-sm text-gray-500 ml-1">
                                      {provider.rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No providers available</p>
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