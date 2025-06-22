import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/strapi';

// Pure API intermediate handler - returns only HTTP redirects, no HTML/CSS/JS
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clickId = searchParams.get('clickId');
    const providerId = searchParams.get('provider') || 'default';
    
    if (!clickId) {
      return NextResponse.redirect(new URL('/', request.url), 307);
    }

    // Check referrer to ensure proper redirect chain
    const referrer = request.headers.get('referer') || '';
    const expectedReferrer = new URL('/c', request.url).href;
    const isReferrerCorrect = referrer.includes('/c');
    
    console.log('Referrer check:', {
      actual: referrer,
      expected: expectedReferrer,
      isCorrect: isReferrerCorrect
    });

    // Get provider from Strapi
    let providerUrl;
    
    try {
      const provider = await getProvider(providerId);
      
      if (!provider || !provider.link) {
        console.error('Provider not found or missing link in Strapi:', providerId);
        return NextResponse.redirect(new URL('/', request.url), 307);
      } else {
        // Use provider.link directly from Strapi and replace $subid with click ID
        providerUrl = provider.link.replace('$subid', clickId);
      }
    } catch (error) {
      console.error('Error fetching provider from Strapi:', error);
      return NextResponse.redirect(new URL('/', request.url), 307);
    }
    
    // Fire-and-forget database update (don't wait)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/clicks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clickId,
        status: 'forwarded',
        providerUrl,
        forwardedAt: new Date().toISOString(),
        metadata: { forwardedTimestamp: new Date().toISOString() }
      })
    }).catch(error => {
      console.error('Failed to update forwarded status:', error);
    });

    // Check if referrer is correct for proper affiliate tracking
    if (!isReferrerCorrect) {
      console.log('Incorrect referrer detected, using HTML meta refresh for proper referrer setting');
      
      // Return HTML with meta refresh to set proper referrer
      return new NextResponse(
        `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=${providerUrl}">
    <meta name="robots" content="noindex, nofollow">
    <title>Redirecting...</title>
  </head>
  <body>
    <script>
      setTimeout(function() { 
        window.location.href = '${providerUrl}'; 
      }, 100);
    </script>
  </body>
</html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        }
      );
    }

    // Return pure HTTP redirect to provider URL - referrer is correct
    return NextResponse.redirect(providerUrl, 307);

  } catch (error) {
    console.error('Intermediate handling error:', error);
    return NextResponse.redirect(new URL('/', request.url), 307);
  }
}

