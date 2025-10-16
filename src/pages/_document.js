import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(props) {
  const { __NEXT_DATA__ } = props;
  const isAmp = __NEXT_DATA__?.props?.pageProps?.ampHtml || 
               __NEXT_DATA__?.page?.startsWith('/amp') ||
               __NEXT_DATA__?.query?.amp !== undefined;

  return (
    <Html lang="en">
      <Head>
        <meta name="google-adsense-account" content="ca-pub-2488270605722778" />

        {/* ✅ CRITICAL CSS: Inline critical styles for LCP optimization */}
        {!isAmp && (
        <style dangerouslySetInnerHTML={{
          __html: `
            body{font-family:'Poppins',system-ui,arial,sans-serif!important;margin:0;padding:0}
            .container{max-width:1200px;margin:0 auto;padding:0 15px}
            .row{display:flex;flex-wrap:wrap;margin:0 -15px}
            .col-lg-9{flex:0 0 75%;max-width:75%;padding:0 15px}
            .col-lg-3{flex:0 0 25%;max-width:25%;padding:0 15px}
            @media(max-width:991px){.col-lg-9,.col-lg-3{flex:0 0 100%;max-width:100%}}
            .bg-light{background-color:#f8f9fa!important}
            .p-3{padding:1rem!important}
            .rounded-2{border-radius:0.375rem!important}
            .shadow-sm{box-shadow:0 0.125rem 0.25rem rgba(0,0,0,0.075)!important}
            .img-fluid{max-width:100%;height:auto}
            .text-primary{color:#0d6efd!important}
            .fw-bold{font-weight:700!important}
          `
        }} />
        )}

        
        {/* Only load fonts for non-AMP pages to prevent duplicate amp-custom */}
        {!isAmp && (
          <>
            {/* ✅ CHROME PERFORMANCE: Critical preconnects for faster loading */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://assets.cadbull.com" crossOrigin="anonymous" />
            
            {/* ✅ CHROME: AdSense preconnects to reduce initial blocking */}
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://fundingchoicesmessages.google.com" crossOrigin="anonymous" />
            
            {/* ✅ CHROME: DNS prefetch for third-party resources */}
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://connect.facebook.net" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
            
            {/* ✅ CHROME: Preload critical API endpoints */}
            {/* <link rel="prefetch" href="/api/projects/latest?page=1&limit=6" /> */}
            
            {/* ✅ PERFORMANCE: Preload critical resources */}
            <link rel="preload" href="/favicon.ico" as="image" />
            {/* <link rel="modulepreload" href="/_next/static/chunks/main.js" /> */}
            
            {/* ✅ SPEED OPTIMIZATION: Optimized font loading with display=swap and reduced weight variations */}
            <link
              rel="preload"
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
              as="style"
              onLoad="this.onload=null;this.rel='stylesheet'"
            />
            <noscript>
              <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                rel="stylesheet"
              />
            </noscript>
          </>
        )}
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Corporation",
              "name": "Cadbull",
              "alternateName": "Cadbull",
              "url": "https://cadbull.com/",
              "logo": "https://cadbull.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.380b44c9.png&w=384&q=75",
              "description": "Download Free & Premium CAD Files, DWG Files, and AutoCAD Blocks for Architecture, Interior Design, and Engineering Projects. Access 1000+ high-quality CAD drawings and design resources.",
              "foundingDate": "2014",
              "knowsAbout": ["CAD files", "DWG files", "AutoCAD blocks", "Architecture plans", "Interior design", "Engineering drawings"],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "403 Fortune Business Hub Beside Shell Petrol Pump Science City Road, Sola",
                "addressLocality": "Ahmedabad",
                "addressCountry": "India"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-989-874-8697",
                "contactType": "customer service",
                "email": "support@cadbull.com"
              },
              "sameAs": [
                "https://www.facebook.com/cadbull/"
              ],
              "keywords": ["CAD files", "DWG files", "AutoCAD blocks", "Architecture plans", "Interior design", "Engineering drawings", "Free CAD downloads", "Premium CAD files"]
            })
          }}
        />

        {/* Meta Pixel Code - Only for non-AMP pages */}
        {/* {!isAmp && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '295971664520262');
                fbq('track', 'PageView');
              `,
            }}
          />
        )} */}
      </Head>
      <body>
        {/* Google Tag Manager (noscript) Fallback - Only for non-AMP pages */}
        {!isAmp && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=GTM-TX9TH7B`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        )}
        
        {/* Meta Pixel (noscript) Fallback - Only for non-AMP pages */}
        {!isAmp && (
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=295971664520262&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
        )}
        
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
