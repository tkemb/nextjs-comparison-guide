import Link from 'next/link';
import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/strapi';

export default function PPCLandingPage({ landingPage, providers, subdomain }) {
  const {
    title,
    description,
    infobox,
    logo,
    placements
  } = landingPage;

  // Debug logging
  console.log('🔍 Landing Page Data:', landingPage);
  console.log('🔍 Placements:', placements);
  console.log('🔍 Providers:', providers);

  const allProviders = placements?.map((placement, index) => {
    // The provider is directly accessible from placement.provider (no .data wrapper)
    const provider = placement.provider;
    
    console.log(`🔍 Placement ${index}:`, placement);
    console.log(`🔍 Provider ${index}:`, provider);
    console.log(`🔍 Provider name ${index}:`, provider?.name);
    
    return {
      id: provider?.id || placement.id || index,
      title: provider?.name || `Provider ${index + 1}`,
      slug: provider?.slug || `provider-${index + 1}`,
      image: provider?.logo?.data?.attributes || provider?.logo || provider?.image,
      rating: provider?.rating || (9.8 - index * 0.4),
      servers: provider?.servers || '7400',
      countries: provider?.countries || '118',
      description: provider?.description || '',
      outgoing_link: provider?.link || provider?.transformedUrl,
      placement: placement
    };
  }) || providers.slice(0, 7);

  console.log('🔍 All Providers after mapping:', allProviders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {logo && (
                <div className="relative w-10 h-10 mr-4 p-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                  <Image
                    src={getStrapiImageUrl(logo)}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  VPN
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  pro
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live seit August 2025
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex-1 max-w-2xl mb-12 lg:mb-0">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Aktuelle Top-Empfehlungen 2025
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {title || "Entdecken Sie die besten"}
                </span>
                <br />
                <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  VPN-Anbieter
                </span>
              </h1>
              
              <div className="space-y-4 mb-10">
                {[
                  { icon: "🛡️", text: "Die beste VPN-Auswahl insgesamt, die Ihre Grenzen überwindet" },
                  { icon: "🔐", text: "Verschlüsselte Verbindungen für absolute Anonymität" },
                  { icon: "⚡", text: "Ultraschnelle Geschwindigkeiten und keine digitalen Spuren" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 text-lg font-medium group-hover:text-gray-900 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                  <span className="text-sm font-semibold text-gray-700 mr-2">📅 Aktualisiert:</span>
                  <span className="text-sm text-gray-600">August 2025</span>
                </div>
                <div className="text-xs text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                  <span>💼 Provisionen für Empfehlungen • </span>
                  <a href="#" className="underline hover:text-gray-700 transition-colors">Mehr erfahren</a>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative w-96 h-72">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl shadow-2xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-2xl shadow-xl transform -rotate-3"></div>
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-200">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🌍</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Weltweite Abdeckung</h3>
                    <p className="text-gray-600 text-sm">Server in über 100 Ländern</p>
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={i} className={`h-2 rounded-full ${i < 7 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Provider Comparison */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Die besten VPN-Anbieter im Vergleich
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Unsere Experten haben die Top-VPN-Services getestet und bewertet. 
              Hier sind die Gewinner basierend auf Sicherheit, Geschwindigkeit und Benutzerfreundlichkeit.
            </p>
          </div>
          
          <div className="space-y-6">
            {allProviders.map((provider, index) => (
              <ProviderCard 
                key={provider.id} 
                provider={provider} 
                rank={index + 1}
                subdomain={subdomain}
                isTop={index === 0}
              />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Warum diese Bewertungen vertrauen?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-white text-xl">🔬</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Unabhängige Tests</h4>
                  <p className="text-gray-600 text-sm">Wir testen jeden VPN-Service persönlich</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Datenbasierte Analyse</h4>
                  <p className="text-gray-600 text-sm">Objektive Bewertungskriterien</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-white text-xl">🔄</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Regelmäßige Updates</h4>
                  <p className="text-gray-600 text-sm">Monatliche Überprüfung aller Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use VPN Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Warum Sie den Bewertungen der VPNpro-Experten vertrauen können
          </h2>
          <p className="text-gray-700 mb-6">
            Unsere Cybersecurity-Experten nutzen datengestützte Methoden, um VPNs umfassend zu testen und zu überprüfen, damit Ihre Daten jederzeit in sicheren Händen sind. Wir machen es uns außerdem zur Aufgabe, VPN-Unternehmen eingehend zu prüfen, bevor wir einen Anbieter auf unsere Liste setzen.
          </p>
          
          <ul className="space-y-3 mb-8 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-1">•</span>
              Rigorose, marktweite Untersuchung der wichtigsten VPNs
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-1">•</span>
              Praktische Tests der VPN-Funktionalität, der Sicherheitsprotokolle und der Leistung
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-1">•</span>
              Gewissenhafte Bewertung der VPN-Kosten, Angebote und des Preis-Leistungs-Verhältnisses
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-1">•</span>
              Überprüfung des Rufs und der Glaubwürdigkeit des Anbieters
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Warum ein VPN verwenden?
          </h3>
          <p className="text-gray-700 mb-4">
            Es gibt viele gute Gründe, ein VPN zu nutzen, aber die wichtigsten Vorteile sind:
          </p>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">Stärkere Sicherheit:</span>
              Gute VPNs verwenden Verschlüsselungsprotokolle auf militärischem Niveau, die es Betrügern praktisch unmöglich machen, Ihre Daten zu nehmen. Das ist wichtig, wenn Sie sich mit wilden WLAN-Netzwerken verbinden.
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">Maximale Privatsphäre:</span>
              Zuverlässige VPNs verbergen nicht nur Ihre Daten vor allen neugierigen Blicken (einschließlich Ihres Internetanbieters), sie sammeln auch keine Protokolle und keine Daten über Ihre Aktivitäten. Das bedeutet, dass Ihre Internetaktivitäten verschleiert sind und für jeden außer Ihnen selbst unsichtbar sind.
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
}

function ProviderCard({ provider, rank, subdomain, isTop }) {
  const { title, image, rating, servers, countries, placement, outgoing_link, description } = provider;
  const badges = isTop && rank === 1 ? "Wahl der Redaktion" : null;
  
  const getScoreColor = (score) => {
    if (score >= 4.5) return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
    if (score >= 4.0) return "bg-gradient-to-r from-blue-400 to-indigo-500 text-white";
    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
  };

  const getFeatures = (rank, providerName) => {
    // Use placement features if available, otherwise create provider-specific features
    if (placement?.features && placement.features.length > 0) {
      return placement.features;
    }
    
    // Provider-specific features based on actual VPN providers
    const providerFeatures = {
      'ExpressVPN': [
        "3.000+ Server in 105 Ländern",
        "Lightway-Protokoll für maximale Geschwindigkeit", 
        "MediaStreamer Smart DNS",
        "TrustedServer-Technologie (RAM-only)",
        "24/7 Live-Chat Support",
        "30-Tage-Geld-zurück-Garantie"
      ],
      'Surfshark': [
        "3.200+ Server in 100+ Ländern",
        "Unbegrenzte gleichzeitige Verbindungen",
        "CleanWeb Ad-Blocker",
        "MultiHop (Double VPN)",
        "Camouflage Modus", 
        "30-Tage-Geld-zurück-Garantie"
      ],
      'CyberGhost': [
        "9.000+ Server in 91 Ländern",
        "Spezialisierte Streaming-Server",
        "45-Tage-Geld-zurück-Garantie",
        "7 gleichzeitige Verbindungen",
        "NoSpy Server-Standorte",
        "24/7 Live-Chat Support"
      ]
    };
    
    return providerFeatures[providerName] || providerFeatures['ExpressVPN'];
  };

  // Use the actual rating from the API
  const score = rating || (9.8 - (rank - 1) * 0.4);
  const displayRating = score >= 4.5 ? "AUSGEZEICHNET" : score >= 4.0 ? "SEHR GUT" : "GUT";

  return (
    <div className={`group relative bg-white rounded-2xl border-2 ${
      isTop 
        ? 'border-gradient-to-r from-orange-300 to-red-300 shadow-xl shadow-orange-100/50' 
        : 'border-gray-200 hover:border-blue-300'
    } p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
      
      {badges && (
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 inline-flex items-center shadow-lg">
          <span className="mr-2">🏆</span>
          {badges}
        </div>
      )}
      
      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-6 shadow-lg ${
              rank === 1 
                ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                : rank <= 3 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}>
              {rank}
            </div>
            
            {image && (
              <div className="relative h-16 w-32 mr-6 p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <Image
                  src={getStrapiImageUrl(image)}
                  alt={title}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
              {description && (
                <p className="text-gray-600 text-sm">{description}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {getFeatures(rank, title).map((feature, index) => (
              <div key={index} className="flex items-start group/feature">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg mr-3 mt-0.5 group-hover/feature:scale-110 transition-transform">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-gray-700 font-medium group-hover/feature:text-gray-900 transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className={`inline-flex items-center px-4 py-3 rounded-2xl text-xl font-bold mb-3 shadow-lg ${getScoreColor(score)}`}>
            <span className="mr-2">⭐</span>
            {score.toFixed(1)}
          </div>
          
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            {displayRating}
          </div>
          
          <div className="flex items-center justify-end mb-6">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 mr-0.5 ${i < Math.floor(score) ? 'text-yellow-400' : 'text-gray-300'} drop-shadow-sm`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <Link
            href={outgoing_link || `/c?provider=${provider.slug}&clickId=${subdomain}-card-${rank}-${Date.now()}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-8 py-4 rounded-2xl font-bold text-white transition-all transform hover:scale-105 hover:shadow-xl group/button ${
              rank === 1 
                ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-200' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-200'
            }`}
          >
            <span>Zu Website</span>
            <svg className="w-5 h-5 ml-2 group-hover/button:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          <div className="text-xs text-blue-600 mt-3 font-medium">
            🌐 {outgoing_link ? new URL(outgoing_link).hostname : `${title?.toLowerCase().replace(/\s+/g, '') || 'provider'}.com`}
          </div>
        </div>
      </div>
    </div>
  );
}