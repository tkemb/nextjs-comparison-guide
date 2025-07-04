'use client';

import { useState, useEffect } from 'react';
import { fetchFromStrapi } from '@/lib/api-config';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';

export default function ContactPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const data = await fetchFromStrapi('/contact');
        setPageData(data.data || data || null);
      } catch (error) {
        console.error('Error fetching contact page:', error);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('https://jolly-egg-8bf232f85b.strapiapp.com/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb items={[{ label: 'Contact' }]} />
            </div>

            {/* Page Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {pageData?.title || 'Contact Us'}
              </h1>
              <p className="text-xl text-gray-600">
                {pageData?.description || 'Get in touch with our team'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                
                <div className="prose max-w-none text-gray-700">
                  {pageData?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
                  ) : (
                    <div className="space-y-6">
                      <p className="text-lg text-gray-600">
                        Have questions about our software directory? Want to suggest a new tool? 
                        We&apos;d love to hear from you!
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Email</h3>
                          <p className="text-gray-600">hello@software.fish</p>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">Response Time</h3>
                          <p className="text-gray-600">We typically respond within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {formStatus === 'success' && (
                <div className="text-green-600 text-sm">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {formStatus === 'error' && (
                <div className="text-red-600 text-sm">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}
            </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}