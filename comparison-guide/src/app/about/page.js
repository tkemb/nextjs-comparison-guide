'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch('https://jolly-egg-8bf232f85b.strapiapp.com/api/pages?filters[slug][$eq]=about&populate=*');
        const data = await response.json();
        setPageData(data.data[0] || null);
      } catch (error) {
        console.error('Error fetching about page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Software.Fish
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/about" className="text-gray-900 font-medium">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {pageData ? (
            <>
              <h1>{pageData.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </>
          ) : (
            <>
              <h1>About Comparosion Page</h1>
              <p>
                Software.Fish is your go-to resource for discovering and comparing software tools across different categories. 
                We help you find the perfect solution for your needs.
              </p>
              
              <h2>Our Mission</h2>
              <p>
                We believe that finding the right software shouldn&apos;t be overwhelming. Our curated collection of tools 
                and detailed comparisons help you make informed decisions quickly and confidently.
              </p>
              
              <h2>What We Offer</h2>
              <ul>
                <li>Comprehensive software directory organized by category</li>
                <li>Detailed reviews and comparisons</li>
                <li>User-friendly search and filtering</li>
                <li>Regular updates with new tools and features</li>
              </ul>
              
              <h2>Get in Touch</h2>
              <p>
                Have questions or suggestions? We&apos;d love to hear from you. 
                <Link href="/contact" className="text-blue-600 hover:underline"> Contact us</Link> anytime.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}