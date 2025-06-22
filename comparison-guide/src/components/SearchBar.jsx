'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cachedAPI } from '@/lib/cached-api';
import { fetchFromStrapi, API_ENDPOINTS } from '@/lib/api-config';

export default function SearchBar({ className = '' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        // Search both categories and providers
        const [categoriesData, providersData] = await Promise.allSettled([
          fetchFromStrapi(`/categories?filters[name][$containsi]=${encodeURIComponent(searchTerm)}&pagination[limit]=3`),
          fetchFromStrapi(`/providers?filters[$or][0][name][$containsi]=${encodeURIComponent(searchTerm)}&filters[$or][1][description][$containsi]=${encodeURIComponent(searchTerm)}&pagination[limit]=5`)
        ]);

        const suggestions = [];
        
        // Add categories to suggestions
        if (categoriesData.status === 'fulfilled' && categoriesData.value.data) {
          categoriesData.value.data.forEach(category => {
            suggestions.push({
              type: 'category',
              id: category.documentId,
              name: category.name,
              slug: category.slug,
              description: category.description
            });
          });
        }

        // Add providers to suggestions
        if (providersData.status === 'fulfilled' && providersData.value.data) {
          providersData.value.data.forEach(provider => {
            suggestions.push({
              type: 'provider',
              id: provider.documentId,
              name: provider.name || provider.title,
              slug: provider.slug,
              description: provider.description,
              logo: provider.logo
            });
          });
        }

        setSuggestions(suggestions.slice(0, 6));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const url = suggestion.type === 'category' 
      ? `/category/${suggestion.slug || suggestion.id}` 
      : `/provider/${suggestion.slug || suggestion.id}`;
    router.push(url);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search software..."
            className="w-full px-4 py-2 pl-10 pr-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ fontSize: '16px' }}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {suggestion.type === 'category' ? (
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.name}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          suggestion.type === 'category' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {suggestion.type}
                        </span>
                      </div>
                      {suggestion.description && (
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {suggestion.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {searchTerm.trim() && (
                <div
                  onClick={handleSubmit}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-50 border-t border-gray-100"
                >
                  <div className="text-sm text-blue-600 truncate">
                    Search for "{searchTerm}"
                  </div>
                </div>
              )}
            </>
          ) : searchTerm.length >= 2 && (
            <div className="px-4 py-2 text-sm text-gray-500">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}