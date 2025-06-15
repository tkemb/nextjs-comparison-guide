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
    <section>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Browse by Category
        </h2>
        <p className="text-xl text-gray-600">
          Find software organized by what you need to accomplish
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          // Handle the actual data structure from API
          const name = category?.name;
          const slug = category?.slug;
          const description = category?.description;
          const documentId = category?.documentId || category?.id;
          
          return (
            <Link
              key={documentId || Math.random()}
              href={`/category/${slug || documentId}`}
              className="group block"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg hover:border-blue-300 transition-all duration-200 group-hover:scale-105">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl bg-gray-100 border-2 border-gray-200"
                >
                  {getIconEmoji(name?.toLowerCase())}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {name || 'Unnamed Category'}
                </h3>
                
                {description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {description}
                  </p>
                )}
                
                <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  Explore Category →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}