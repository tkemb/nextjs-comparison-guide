'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await fetchFromStrapi('/about');
        // Handle different response structures
        setPageData(data.data || data || null);
      } catch (error) {
        console.error('Error fetching about page:', error);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-4 mb-6">
              <Link href="/" className="text-blue-600 hover:underline">
                ← Back to Home
              </Link>
            </div>

            {/* Page Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {pageData?.title}
              </h1>
              <p className="text-xl text-gray-600">
                {pageData?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="prose max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}