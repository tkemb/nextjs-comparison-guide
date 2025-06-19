'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch('https://jolly-egg-8bf232f85b.strapiapp.com/api/pages?filters[slug][$eq]=privacy&populate=*');
        const data = await response.json();
        setPageData(data.data[0] || null);
      } catch (error) {
        console.error('Error fetching privacy page:', error);
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
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
              <Link href="/privacy" className="text-gray-900 font-medium">Privacy</Link>
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
              <h1>Privacy Policy</h1>
              <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2>Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you contact us through our contact form.
                This may include your name, email address, and any message content you provide.
              </p>
              
              <h2>How We Use Your Information</h2>
              <ul>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve our website and services</li>
                <li>To send you updates about our platform (if you opt in)</li>
              </ul>
              
              <h2>Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                except as described in this policy.
              </p>
              
              <h2>Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
              
              <h2>Cookies</h2>
              <p>
                Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through 
                your browser settings, but this may affect some functionality of our site.
              </p>
              
              <h2>Third-Party Services</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices 
                of these external sites.
              </p>
              
              <h2>Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the 
                new policy on this page.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}