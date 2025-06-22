import { headers } from 'next/headers';

// Click handler page - returns HTML with meta refresh for proper referrer
export default async function ClickPage({ searchParams }) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  
  // Generate unique alphanumeric click ID
  const uniqueClickId = generateAlphanumericId();
  
  // Get request headers for tracking data
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const referrer = headersList.get('referer') || '';
  const xForwardedFor = headersList.get('x-forwarded-for');
  const xRealIp = headersList.get('x-real-ip');
  const ipAddress = xForwardedFor?.split(',')[0] || xRealIp || 'unknown';

  // Extract Zeropark tracking tokens from URL parameters
  const zeroparkTokens = {
    cid: params.cid, // Click ID from Zeropark
    traffic_type: params.traffic_type, // POPUP/DOMAIN
    visitor_type: params.visitor_type, // ADULT/NON-ADULT
    source: params.source, // Source ID
    target: params.target, // Target ID
    target_url: params.target_url, // Target URL
    creative_number: params.creative_number,
    geo: params.geo, // Country code
    campaign_id: params.campaign_id, // Numeric campaign ID
    long_campaign_id: params.long_campaign_id, // UUID campaign ID
    campaign_name: params.campaign_name,
    os: params.os, // Operating system
    carrier: params.carrier, // Mobile carrier
    device_id: params.device_id,
    browser: params.browser,
    city: params.city,
    region: params.region,
    keyword: params.keyword,
    keyword_match: params.keyword_match,
    visit_cost: params.visit_cost
  };

  // Remove undefined values to keep JSON clean
  Object.keys(zeroparkTokens).forEach(key => {
    if (zeroparkTokens[key] === undefined) {
      delete zeroparkTokens[key];
    }
  });

  // Determine traffic source - Zeropark sends 'cid' parameter
  const isZeropark = params.cid || params.campaign_id || params.traffic_type;
  const trafficSource = params.utm_source || (isZeropark ? 'zeropark' : params.source || 'direct');

  // Store click data in database
  const clickData = {
    clickId: uniqueClickId,
    source: trafficSource,
    providerId: params.provider || 'default',
    status: 'received',
    ipAddress,
    userAgent,
    referrer,
    requestUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/c?${new URLSearchParams(params).toString()}`,
    params: {
      ...params, // Store all original parameters
      traffic_source: trafficSource, // Explicit traffic source identification
      is_zeropark: isZeropark, // Boolean flag for easy filtering
      zeropark: zeroparkTokens // Store Zeropark tokens separately for easy access
    }
  };

  // Fire-and-forget database save (don't wait)
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/clicks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clickData)
  }).catch(error => {
    console.error('Database save error:', error);
  });

  // Build intermediate URL with click ID and provider
  const intermediateUrl = `/c/i?clickId=${uniqueClickId}&provider=${params.provider || 'default'}`;
  
  // Return HTML with meta refresh for proper referrer setting
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0; url=${intermediateUrl}`} />
        <meta name="robots" content="noindex, nofollow" />
        <title>Redirecting...</title>
      </head>
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(function() { window.location.href = '${intermediateUrl}'; }, 1);`
        }} />
      </body>
    </html>
  );
}

// Generate unique alphanumeric click ID (numbers and letters only)
function generateAlphanumericId() {
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const randomPart = Math.random().toString(36).substring(2, 10); // 8 random chars
  const extraRandom = Math.random().toString(36).substring(2, 6); // 4 more random chars
  
  // Combine all parts for maximum uniqueness (20+ characters, alphanumeric only)
  return (timestamp + randomPart + extraRandom).toUpperCase();
}