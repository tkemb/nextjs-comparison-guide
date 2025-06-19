'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchFromStrapi, API_ENDPOINTS } from '@/lib/api-config';

export default function ArticlePage() {
  const params = useParams();
  const { slug } = params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        // Fetch article by slug
        const data = await fetchFromStrapi(API_ENDPOINTS.ARTICLE_BY_SLUG(slug));
        
        if (!data.data || data.data.length === 0) {
          throw new Error('Article not found');
        }
        
        setArticle(data.data[0]);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
            {article.category && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  href={`/category/${article.category.slug || article.category.documentId}`}
                  className="text-blue-600 hover:underline"
                >
                  {article.category.name}
                </Link>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {article.title || 'Untitled Article'}
          </h1>
          {article.description && (
            <p className="text-lg text-gray-600 mt-2">
              {article.description}
            </p>
          )}
          {article.publishedAt && (
            <p className="text-sm text-gray-500 mt-4">
              Published on {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {article.content ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-gray-600">No content available for this article.</p>
          )}
        </div>
      </div>
    </div>
  );
}