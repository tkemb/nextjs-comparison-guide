// src/components/Layout.jsx

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cachedAPI } from '@/lib/cached-api';
import SearchBar from './SearchBar';

export default function Layout({ children }) {
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Comparison
              </Link>
            </div>
            {/* Centered Search Bar */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <SearchBar className="w-96 max-w-md" />
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <nav className="flex space-x-8">
                <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              
              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 backdrop-blur-sm bg-white/20 z-40 md:hidden"
              onClick={() => setShowMobileMenu(false)}
            ></div>
            
            {/* Side Menu */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'}`}>
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Menu Content */}
              <div className="p-4 space-y-4">
                <div className="mb-4">
                  <SearchBar className="w-full" />
                </div>
                <Link
                  href="/"
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
                
                {/* Mobile Categories */}
                <div>
                  <div className="flex items-center text-gray-900 font-medium mb-3 px-3">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Categories
                  </div>
                  <div className="space-y-1 pl-3 border-l border-gray-200">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.documentId}
                          href={`/category/${category.slug || category.documentId}`}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={() => setShowMobileMenu(false)}
                          onMouseEnter={() => handleCategoryHover(category.slug || category.documentId)}
                        >
                          {category.name || 'Unnamed Category'}
                        </Link>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Loading categories...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
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
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2025 Performance3 All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
