// src/app/page.js

import { getFeaturedSoftware, getCategories, getSoftware } from '@/lib/strapi';
import { SoftwareGrid } from '@/components/SoftwareCard';
import SearchSection from '@/components/SearchSection';
import CategoriesSection from '@/components/CategoriesSection';

export default async function HomePage() {
  // Fetch data in parallel
  const [featuredSoftware, categories, allSoftware] = await Promise.all([
    getFeaturedSoftware(),
    getCategories(),
    getSoftware({ 'pagination[limit]': 6 }) // Limit to 6 for homepage
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Software.Fish
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Categories</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Software.Fish helps you find the right software
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover and compare software tools across different categories. Find the perfect solution for your needs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Grid */}
        {categories && categories.length > 0 && (
          <CategoriesSection categories={categories} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Design</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Development</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Marketing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Help</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Twitter</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">LinkedIn</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">&copy; 2025 Software.Fish. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}