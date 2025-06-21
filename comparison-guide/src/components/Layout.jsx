// src/components/Layout.jsx

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cachedAPI } from '@/lib/cached-api';

export default function Layout({ children }) {
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCookiePreferences = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.CookieConsent) {
      window.CookieConsent.showPreferences();
    } else {
      console.warn('CookieConsent not loaded yet');
    }
  };

  // Preload category data on hover
  const handleCategoryHover = (categorySlug) => {
    cachedAPI.preloadCategory(categorySlug);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await cachedAPI.getCategories();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Comparison
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              
              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer">
                  Categories
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {showDropdown && (
                  <>
                    {/* Invisible bridge to prevent dropdown from closing */}
                    <div className="absolute top-full left-0 w-64 h-1 bg-transparent"></div>
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <Link
                            key={category.documentId}
                            href={`/category/${category.slug || category.documentId}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            onMouseEnter={() => handleCategoryHover(category.slug || category.documentId)}
                          >
                            {category.name || 'Unnamed Category'}
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-sm">Loading categories...</div>
                      )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left max-w-4xl mx-auto">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/imprint" className="text-sm text-gray-600 hover:text-gray-900">Imprint</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</Link></li>

                <li><a href="#" onClick={handleCookiePreferences} className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">Cookie Consent</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(0, 3).map((category) => (
                  <li key={category.documentId}>
                    <Link 
                      href={`/category/${category.slug || category.documentId}`} 
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onMouseEnter={() => handleCategoryHover(category.slug || category.documentId)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">Twitter</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">LinkedIn</Link></li>
                <li><Link href="#" className="text-sm text-gray-600 hover:text-gray-900">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2025 Performance3 All rights reserved. | 
              <Link href="/imprint" className="text-gray-600 hover:text-gray-900 ml-1">Imprint</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}