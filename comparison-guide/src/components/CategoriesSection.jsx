// src/components/CategoriesSection.jsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getStrapiImageUrl } from '@/lib/strapi';

export default function CategoriesSection({ categories }) {
  if (!categories || categories.length === 0) {
    return null;
  }


  return (
    <section className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const name = category?.name || 'Unnamed Category';
          const slug = category?.slug;
          const documentId = category?.documentId || category?.id;
          const imageUrl = getStrapiImageUrl(category?.image_small);
          
          return (
            <CategoryCard
              key={documentId || Math.random()}
              name={name}
              slug={slug}
              documentId={documentId}
              imageUrl={imageUrl}
            />
          );
        })}
      </div>
    </section>
  );
}

function CategoryCard({ name, slug, documentId, imageUrl }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const showImage = imageUrl && !imageError;

  return (
    <Link href={`/category/${slug || documentId}`} className="group">
      <div className="relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden h-32">
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        </div>
     
        {/* Screen reader text */}
        <span className="sr-only">View {name} category</span>
      </div>
    </Link>
  );
}