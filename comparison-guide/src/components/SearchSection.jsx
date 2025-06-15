// src/components/SearchSection.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://jolly-egg-8bf232f85b.strapiapp.com/api/categories');
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCategoryClick = (category) => {
    router.push(`/category/${category.documentId}`);
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Discover Your Perfect Software
          </h2>
          <p className="text-xl text-blue-100">
            Search through hundreds of carefully curated software tools
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for project management, design tools, CRM..."
              className="w-full px-6 py-4 text-lg rounded-2xl border-0 shadow-lg focus:ring-4 focus:ring-white/30 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Popular categories */}
        <div className="mt-8 text-center">
          <p className="text-blue-100 mb-3">Browse categories:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {loading ? (
              <div className="text-blue-100">Loading categories...</div>
            ) : (
              categories.slice(0, 5).map((category) => (
                <button
                  key={category.documentId}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white/20 text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors"
                >
                  {category.name || category.title || `Category ${category.id}`}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}