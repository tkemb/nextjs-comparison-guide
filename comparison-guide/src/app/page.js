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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Article Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover interesting articles and stories. Browse through our curated collection of the latest content across various topics.
            </p>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <SearchSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Featured Articles */}
        {featuredSoftware && featuredSoftware.length > 0 && (
          <section>
            <SoftwareGrid 
              software={featuredSoftware} 
              title="🌟 Latest Articles"
            />
          </section>
        )}

        {/* Categories */}
        {categories && categories.length > 0 && (
          <section>
            <CategoriesSection categories={categories} />
          </section>
        )}

        {/* All Articles */}
        {allSoftware && allSoftware.length > 0 && (
          <section>
            <SoftwareGrid 
              software={allSoftware} 
              title="📄 More Articles"
            />
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Want to see more content?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Explore our categories to find articles that interest you most.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Browse Categories
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Article Hub. Discover great content across topics.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}