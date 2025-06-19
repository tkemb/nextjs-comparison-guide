'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function UseCasePage() {
  const params = useParams();
  const { documentId } = params;
  const [useCase, setUseCase] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUseCaseData = async () => {
      try {
        setLoading(true);
        
        // Fetch use case details
        const useCaseResponse = await fetch(`https://jolly-egg-8bf232f85b.strapiapp.com/api/use-cases/${documentId}?populate=*`);
        if (!useCaseResponse.ok) {
          throw new Error('Failed to fetch use case');
        }
        const useCaseData = await useCaseResponse.json();
        setUseCase(useCaseData.data);

        // Fetch category details if use case has a category
        if (useCaseData.data?.category?.documentId) {
          const categoryResponse = await fetch(`https://jolly-egg-8bf232f85b.strapiapp.com/api/categories/${useCaseData.data.category.documentId}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            setCategory(categoryData.data);
          }
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchUseCaseData();
    }
  }, [documentId]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
            {category && (
              <>
                <span className="text-gray-400">/</span>
                <Link href={`/category/${category.documentId}`} className="text-blue-600 hover:underline">
                  {category.name}
                </Link>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {useCase.title || 'Use Case'}
          </h1>
          {useCase.description && (
            <p className="text-lg text-gray-600 mt-2">
              {useCase.description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Use Case Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Main Content */}
              {useCase.content && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Use Case Details</h2>
                  <div className="prose max-w-none text-gray-700">
                    {useCase.content}
                  </div>
                </div>
              )}

              {/* Problem Statement */}
              {useCase.problem && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement</h2>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="prose max-w-none text-gray-700">
                      {useCase.problem}
                    </div>
                  </div>
                </div>
              )}

              {/* Solution */}
              {useCase.solution && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Solution</h2>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="prose max-w-none text-gray-700">
                      {useCase.solution}
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {useCase.benefits && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="prose max-w-none text-gray-700">
                      {useCase.benefits}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              {/* Sidebar Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Information</h3>
                
                {category && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                    <Link 
                      href={`/category/${category.documentId}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {category.name}
                    </Link>
                  </div>
                )}

                {useCase.difficulty && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Difficulty Level</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Estimated Timeline</h4>
                    <p className="text-gray-900">{useCase.timeline}</p>
                  </div>
                )}

                {useCase.cost && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Cost Range</h4>
                    <p className="text-gray-900">{useCase.cost}</p>
                  </div>
                )}

                {useCase.tags && useCase.tags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {useCase.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Related Links */}
              {useCase.relatedLinks && useCase.relatedLinks.length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Links</h3>
                  <ul className="space-y-2">
                    {useCase.relatedLinks.map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {link.title || link.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}