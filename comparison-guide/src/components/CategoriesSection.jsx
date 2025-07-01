// src/components/CategoriesSection.jsx

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getStrapiImageUrl } from '@/lib/strapi';
import { cachedAPI } from '@/lib/cached-api';

export default function CategoriesSection({ categories: initialCategories }) {
  const [categories, setCategories] = useState(initialCategories || []);
  const [loading, setLoading] = useState(!initialCategories);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await cachedAPI.getCategories();
        setCategories(fetchedCategories || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!initialCategories || initialCategories.length === 0) {
      fetchCategories();
    }
  }, [initialCategories]);

  if (loading) {
    return (
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8">
        <div className="text-center text-red-600">
          <p>Failed to load categories. Please try again later.</p>
        </div>
      </section>
    );
  }

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

  const handleImageError = (e) => {
    console.error('Image failed to load:', imageUrl, e);
    setImageError(true);
  };


  return (
    <Link href={`/category/${slug || documentId}`} className="group">
      <div className="relative bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden h-32 group-hover:scale-105">
        <div className="absolute inset-0">
          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-center p-2">
              <span className="text-gray-400 text-sm font-medium">{name}</span>
            </div>
          )}
        </div>
     
        {/* Screen reader text */}
        <span className="sr-only">View {name} category</span>
      </div>
    </Link>
  );
}