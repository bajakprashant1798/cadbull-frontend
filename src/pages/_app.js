
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "@/styles/globals.scss";
import "@/styles/react-quill.css"; // React Quill styles
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { Poppins } from "next/font/google";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Authprovider from "@/component/Authprovider/Authprovider";
import { Provider } from "react-redux";
import { store } from "../../redux/app/store";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Script from "next/script";
import dynamic from "next/dynamic";
// import WhatsAppButton from "@/components/WhatsAppButton";
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), { ssr: false });
const ToastContainer = dynamic(() => import("react-toastify").then((mod) => mod.ToastContainer), { ssr: false });
import { GTM_ID, pageview } from '../lib/gtm';
import { trackPageView } from '../lib/fbpixel';
// Remove conflicting adsense lib import
// import { initializeAdSense } from '../lib/adsense';

config.autoAddCss = false;
// ✅ SPEED OPTIMIZATION: Keep all font weights but optimize loading
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"], // Keep all weights for UI consistency
  style: ["normal", "italic"], // Keep both styles to prevent UI issues
  subsets: ["latin"],
  preload: true,
  display: "swap", // ✅ Critical: Prevents font render blocking while keeping all weights
  fallback: ["system-ui", "arial"],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // const dispatch = useDispatch(); // Redux Dispatch

  React.useEffect(() => {
    // ✅ SPEED OPTIMIZATION: Defer non-critical bootstrap loading
    const loadBootstrap = () => {
      if (typeof document !== 'undefined') {
        import("bootstrap/dist/js/bootstrap.bundle.min");
      }
    };

    // Load bootstrap after initial render
    setTimeout(loadBootstrap, 100);

    // ✅ REMOVED: initializeAdSense() - using component-based loading instead

    // Track route changes
    const handleRouteChange = (url) => {
      pageview(url);
      // Track page view with Meta Pixel
      trackPageView();

      //// ✅ ADDED: Force AdSense refresh on route change for SSG pages
      // setTimeout(() => {
      //   if (typeof window !== 'undefined' && window.adsbygoogle) {
      //     try {
      //       // Remove existing status attributes to force refresh
      //       const allAds = document.querySelectorAll('.adsbygoogle');
      //       allAds.forEach(ad => {
      //         if (ad.hasAttribute('data-adsbygoogle-status')) {
      //           ad.removeAttribute('data-adsbygoogle-status');
      //         }
      //       });
      //       console.log('🔄 AdSense refresh triggered for SSG page');
      //     } catch (error) {
      //       console.warn('AdSense refresh failed:', error);
      //     }
      //   }
      // }, 1000);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // --- Detect AMP route ---
  const isAmpRoute = router.pathname.startsWith('/amp'); // Adjust if needed

  const getLayout = Component.getLayout || ((page) => page);

  // If it's an AMP route, do NOT wrap in Redux/Persist
  if (isAmpRoute) {
    return (
      <Fragment>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
          <title>Cadbull</title>
          <meta name="description" content="World Largest 2d CAD Library." />

        </Head>

        {/* <style jsx global>{`
          * {
            font-family: ${poppins.style.fontFamily} !important;
          }
        `}</style> */}
        {getLayout(<Component {...pageProps} />)}
        {/* ✅ Single AdSense Script - Only for AMP pages */}
        {/* <Script
        id="adsense-script-amp"
        async
        strategy="lazyOnload"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        crossOrigin="anonymous"
        onLoad={() => {
          // console.log('AdSense AMP script loaded');
        }}
      /> */}
      </Fragment>
    );
  }
  return (
    <Fragment>
      {/* ✅ START: ADD GOOGLE ANALYTICS SCRIPTS */}
      {/* <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      /> */}

      {/* ✅ SPEED OPTIMIZATION: Direct GA4 Implementation */}
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-ESHYNTB32B"
      />
      <Script
        id="gtag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ESHYNTB32B', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* ✅ Google Ads Conversion Tracking */}
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=AW-16484980681"
      />
      <Script
        id="google-ads-conversion"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16484980681');
          `,
        }}
      />

      {/* ✅ SINGLE GTM Script - Revenue Optimized */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        // strategy="lazyOnload" // ✅ PERFORMANCE: Moved to lazyOnload
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TX9TH7B');
          `,
        }}
      />

      {/* ✅ SINGLE AdSense Script - CRITICAL: Revenue Protection */}
      <Script
        id="adsense-script"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        onLoad={() => {
          // console.log('✅ AdSense script loaded successfully');
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.loaded = true;
        }}
        onError={(e) => {
          console.error('❌ AdSense script failed to load:', e);
        }}
      />

      {/* ✅ SINGLE AdSense Funding Choices Script */}
      <Script
        id="adsense-funding-choices"
        async
        strategy="afterInteractive"
        // src="https://fundingchoicesmessages.google.com/i/pub-2488270605722778?ers=1"
        src={`https://fundingchoicesmessages.google.com/i/${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID.replace('ca-', '')}?ers=1`}
        onLoad={() => {
          // console.log('✅ AdSense Funding Choices loaded');
        }}
      />
      {/* ✅ END: ADD GOOGLE ANALYTICS SCRIPTS */}

      {/* ✅ PushAlert Script (NON-AMP ONLY, Revenue Safe) */}
      {!isAmpRoute && (
        <Script
          id="pushalert-script"
          strategy="afterInteractive"
          src="https://cdn.pushalert.co/integrate_182209e50efe761570815b891ddf44fd.js"
        />
      )}

      <Script
        id="fb-pixel"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '295971664520262'); fbq('track', 'PageView');
          `
        }}
      />

      {/* <Authprovider> */}
      <Provider store={store}>

        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <title>Cadbull</title>
          <meta name="description" content="World Largest 2d CAD Library." />
        </Head>

        <style jsx global>{`
        * {
          font-family: 'Poppins', system-ui, arial !important;
        }
      `}</style>
        {getLayout(<Component {...pageProps} />)}

        {/* ✅ AdSense Signal Script for Ad Blocking Recovery */}
        <Script
          id="adsense-signal-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              function signalGooglefcPresent() {
                if (!window.frames['googlefcPresent']) {
                  if (document.body) {
                    const iframe = document.createElement('iframe');
                    iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                    iframe.style.display = 'none';
                    iframe.name = 'googlefcPresent';
                    document.body.appendChild(iframe);
                  } else {
                    setTimeout(signalGooglefcPresent, 0);
                  }
                }
              }
              signalGooglefcPresent();
            })();
          `,
          }}
        />

        <ToastContainer />
        <WhatsAppButton />
        {/* </PersistGate> */}
      </Provider>
      {/* </Authprovider> */}
    </Fragment>
  );
}