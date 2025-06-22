'use client';

import { useEffect, useState } from 'react';

export default function CookieConsentWrapper({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server, only after hydration
  if (!isClient) {
    return null;
  }

  return <div suppressHydrationWarning>{children}</div>;
}