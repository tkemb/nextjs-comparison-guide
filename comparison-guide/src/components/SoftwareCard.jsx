// src/components/SoftwareCard.jsx

import Link from 'next/link';

export default function SoftwareCard({ software }) {
  // Handle both article data structure and legacy software structure
  const title = software?.title || software?.attributes?.name || software?.name;
  const slug = software?.slug || software?.attributes?.slug;
  const description = software?.description || software?.attributes?.short_description;
  const documentId = software?.documentId || software?.id;

  // For articles, we don't have logo, pricing, or rating data
  // Show a simple card layout instead

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
            <span className="text-white font-bold text-lg">
              {title?.charAt(0) || 'A'}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title || 'Untitled Article'}
          </h3>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Link 
            href={`/article/${slug || documentId}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Read Article
          </Link>
        </div>
      </div>
    </div>
  );
}

// Grid component for displaying multiple software cards
export function SoftwareGrid({ software, title }) {
  if (!software || software.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No software found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {software.map((item) => (
          <SoftwareCard key={item?.id || Math.random()} software={item} />
        ))}
      </div>
    </div>
  );
}