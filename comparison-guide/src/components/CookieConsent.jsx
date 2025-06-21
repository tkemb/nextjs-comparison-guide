'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function CookieConsent() {
  useEffect(() => {
    // Initialize cookie consent after the script loads
    const initCookieConsent = () => {
      if (typeof window !== 'undefined' && window.CookieConsent) {
        window.CookieConsent.run({
          // Add your cookie consent configuration here
          categories: {
            necessary: {
              enabled: true,
              readOnly: true
            },
            analytics: {
              enabled: false
            }
          },
          onAccept: function() {
            console.log('Cookies accepted');
          },
          onFirstAction: function() {
            console.log('First action');
          },
          onChange: function() {
            console.log('Preferences changed');
          }
        });
      }
    };

    // Check if script is already loaded
    if (window.CookieConsent) {
      initCookieConsent();
    } else {
      // Wait for script to load
      const checkScript = setInterval(() => {
        if (window.CookieConsent) {
          clearInterval(checkScript);
          initCookieConsent();
        }
      }, 100);

      // Cleanup
      return () => clearInterval(checkScript);
    }
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.css"
      />
      <Script
        src="https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Cookie consent script loaded');
        }}
      />
    </>
  );
}