import { notFound } from 'next/navigation';
import { getPPCLandingPage, getProviders, getStrapiImageUrl } from '@/lib/strapi';
import PPCLandingPageComponent from '@/components/PPCLandingPage';

export async function generateMetadata({ params }) {
  const { subdomain } = await params;
  const landingPage = await getPPCLandingPage(subdomain);

  if (!landingPage) {
    return {
      title: 'Page Not Found',
    };
  }

  const { title, description } = landingPage;

  return {
    title: title || 'Landing Page',
    description: description || '',
    openGraph: {
      title: title || 'Landing Page',
      description: description || '',
    },
  };
}

export default async function PPCLandingPage({ params }) {
  const { subdomain } = await params;
  
  console.log('🔍 PPC Page - subdomain:', subdomain);
  
  const [landingPage, providers] = await Promise.all([
    getPPCLandingPage(subdomain),
    getProviders()
  ]);

  console.log('🔍 PPC Page - landingPage:', landingPage);
  console.log('🔍 PPC Page - providers length:', providers?.length);

  if (!landingPage) {
    console.log('❌ No landing page found for subdomain:', subdomain);
    // Create a placeholder landing page for testing
    const placeholderLandingPage = {
      title: `${subdomain.charAt(0).toUpperCase() + subdomain.slice(1).replace('-', ' ')} VPN Guide`,
      description: 'Find the best VPN providers',
      infobox: 'This is a test landing page for ' + subdomain,
      logo: null,
      placements: []
    };
    
    return (
      <PPCLandingPageComponent 
        landingPage={placeholderLandingPage} 
        providers={providers}
        subdomain={subdomain}
      />
    );
  }

  return (
    <PPCLandingPageComponent 
      landingPage={landingPage} 
      providers={providers}
      subdomain={subdomain}
    />
  );
}