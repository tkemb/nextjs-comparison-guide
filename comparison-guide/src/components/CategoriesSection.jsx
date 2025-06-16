// src/components/CategoriesSection.jsx

import Link from 'next/link';

export default function CategoriesSection({ categories }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const getIconEmoji = (iconName) => {
    const iconMap = {
      'design': '🎨',
      'productivity': '⚡',
      'communication': '💬',
      'analytics': '📊',
      'development': '💻',
      'marketing': '📢',
      'finance': '💰',
      'crm': '👥',
      'project-management': '📋',
      'security': '🔒',
      'default': '📁'
    };
    
    return iconMap[iconName?.toLowerCase()] || iconMap.default;
  };

  return (
    <section className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          // Handle the actual data structure from API
          const name = category?.name;
          const documentId = category?.documentId || category?.id;
          const imageSmall = category?.image_small?.url;
          
          return (
            <div className="group relative rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
              {imageSmall ? (
                <img 
                  src={imageSmall}
                  alt={name || 'Category'}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-6xl">
                    {getIconEmoji(name?.toLowerCase())}
                  </span>
                </div>
              )}
              
              {/* Link overlay covering the entire image */}
              <Link
                key={documentId || Math.random()}
                href={`/category/${documentId}`}
                className="absolute inset-0 z-10"
              >
                <span className="sr-only">{name || 'Unnamed Category'}</span>
              </Link>
              
              {/* Category name overlay - only show when there's no image */}
              {!imageSmall && (
                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-2 text-center rounded-b-lg">
                  <h3 className="text-sm font-medium leading-tight">
                    {name || 'Unnamed Category'}
                  </h3>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}