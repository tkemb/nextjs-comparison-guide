'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchFromStrapi, API_ENDPOINTS } from '@/lib/api-config';
import { getStrapiImageUrl } from '@/lib/strapi';
import Layout from '@/components/Layout';

export default function ProviderPage() {
  const params = useParams();
  const { slug } = params;
  const [provider, setProvider] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);
        
        // Fetch provider details by slug
        const providerData = await fetchFromStrapi(API_ENDPOINTS.PROVIDER_BY_SLUG(slug));
        
        if (!providerData.data || providerData.data.length === 0) {
          throw new Error('Provider not found');
        }
        
        const providerItem = providerData.data[0];
        setProvider(providerItem);

        // Fetch category details if provider has a category
        if (providerItem?.category?.documentId) {
          try {
            const categoryData = await fetchFromStrapi(`/categories/${providerItem.category.documentId}`);
            setCategory(categoryData.data);
          } catch (error) {
            console.warn('Failed to fetch category:', error);
          }
        }
        
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

  return (
    <Layout>
      <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
            {category && (
              <>
                <span className="text-gray-400">/</span>
                <Link href={`/category/${category.slug || category.documentId}`} className="text-blue-600 hover:underline">
                  {category.name}
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {provider.logo && (
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={getStrapiImageUrl(provider.logo)}
                  alt={`${provider.name || 'Provider'} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {provider.name || 'Provider'}
            </h1>
          </div>
          {provider.description && (
            <p className="text-lg text-gray-600 mt-2">
              {provider.description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Provider Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Provider Information</h2>
              
              {provider.website && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Website</h3>
                  <a 
                    href={provider.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {provider.website}
                  </a>
                </div>
              )}

              {provider.email && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Email</h3>
                  <a href={`mailto:${provider.email}`} className="text-blue-600 hover:underline">
                    {provider.email}
                  </a>
                </div>
              )}

              {provider.phone && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                  <p className="text-gray-900">{provider.phone}</p>
                </div>
              )}

              {provider.address && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                  <p className="text-gray-900">{provider.address}</p>
                </div>
              )}

              {category && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                  <Link 
                    href={`/category/${category.slug || category.documentId}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                  >
                    {category.name}
                  </Link>
                </div>
              )}
            </div>

            <div>
              {provider.content && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Provider</h2>
                  <div className="prose max-w-none text-gray-700">
                    {provider.content}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services or Features */}
          {provider.services && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
              <div className="prose max-w-none text-gray-700">
                {provider.services}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </Layout>
  );
}