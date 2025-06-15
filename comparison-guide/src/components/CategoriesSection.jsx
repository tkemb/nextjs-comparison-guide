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
          const imageSmall = category?.image_small;
          
          return (
            <Link
              key={documentId || Math.random()}
              href={`/category/${documentId}`}
              className="group block aspect-square"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-4 h-full flex flex-col items-center justify-center text-center hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="w-12 h-12 mb-3 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {imageSmall ? (
                    <img 
                      src={imageSmall.startsWith('http') ? imageSmall : `https://jolly-egg-8bf232f85b.strapiapp.com${imageSmall}`}
                      alt={name || 'Category'}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl">
                      {getIconEmoji(name?.toLowerCase())}
                    </span>
                  )}
                </div>
                
                <h3 className="text-sm font-medium text-gray-900 leading-tight">
                  {name || 'Unnamed Category'}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}