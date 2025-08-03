
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "@/styles/globals.scss";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Authprovider from "@/component/Authprovider/Authprovider";
import { Provider } from "react-redux";
import { store } from "../../redux/app/store";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Script from "next/script";
import WhatsAppButton from "@/components/WhatsAppButton";
import * as gtag from '../utils/gtag';

config.autoAddCss = false;
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "arial"],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // const dispatch = useDispatch(); // Redux Dispatch
  
  React.useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.min")
      : null;
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
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <title>Cadbull</title>
          <meta name="description" content="World Largest 2d CAD Library." />
          
        </Head>

        <style jsx global>{`
          * {
            font-family: ${poppins.style.fontFamily} !important;
          }
        `}</style>
        {getLayout(<Component {...pageProps} />)}
      <Script
        id="adsense-script-amp"
        async
        strategy="lazyOnload"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        crossOrigin="anonymous"
      />
      </Fragment>
    );
  }
  return (
    <Fragment>
      {/* ✅ START: ADD GOOGLE ANALYTICS SCRIPTS */}
      <Script
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
      />
      {/* ✅ END: ADD GOOGLE ANALYTICS SCRIPTS */}
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
          font-family: ${poppins.style.fontFamily} !important;
        }
      `}</style>
      {getLayout(<Component {...pageProps} />)}
      {/* <AppContent Component={Component} pageProps={pageProps} /> */}
      <Script
        id="adsense-script"
        async
        strategy="afterInteractive"
        // strategy="lazyOnload"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        crossOrigin="anonymous"
      />
      <ToastContainer />
      <WhatsAppButton />
      {/* </PersistGate> */}
      </Provider>
      {/* </Authprovider> */}
    </Fragment>
  );
}
