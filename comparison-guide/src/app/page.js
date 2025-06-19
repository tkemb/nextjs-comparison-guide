// src/app/page.js

import { getCategories } from '@/lib/strapi';
import CategoriesSection from '@/components/CategoriesSection';
import Layout from '@/components/Layout';

export default async function HomePage() {
  // Fetch categories for homepage
  const categories = await getCategories();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            We help you find the right software
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover and compare software tools across different categories. Find the perfect solution for your needs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Grid */}
        {categories && categories.length > 0 && (
          <CategoriesSection categories={categories} />
        )}
      </div>
    </Layout>
  );
}