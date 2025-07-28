
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "@/styles/globals.scss";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Authprovider from "@/component/Authprovider/Authprovider";
import { Provider, useDispatch } from "react-redux";
import { store, persistor } from "../../redux/app/store";
import { PersistGate } from "redux-persist/integration/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import CanonicalTag from "@/components/CanonicalTag";
import Script from "next/script";


config.autoAddCss = false;
import { loginSuccess, logout } from "../../redux/app/features/authSlice"; // Import Redux actions

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  preload: true,
  fallback: ["system-ui", "arial"],
});

// const PUBLIC_PAGES = ["/", "/categories", "/pricing", "/contact"];

// function AppContent({ Component, pageProps }) {
//   const dispatch = useDispatch();
//   const [rehydrated, setRehydrated] = useState(false);

//   useEffect(() => {
//     const storedUserData = localStorage.getItem("userData");
//     if (storedUserData) {
//       try {
//         const parsedData = JSON.parse(storedUserData);
//         dispatch(
//           loginSuccess({
//             user: parsedData,
//             status: "authenticated",
//           })
//         );
//         console.log("Rehydrated user data:", parsedData);
//       } catch (error) {
//         console.error("Error parsing stored user data:", error);
//         dispatch(logout());
//       }
//     } else {
//       dispatch(logout());
//       console.log("No user data found, logging out");
//     }
//     setRehydrated(true);
//   }, [dispatch]);

//   if (!rehydrated) {
//     return <div>Loading...</div>;
//   }

//   // Render the page only after rehydration is done
//   const getLayout = Component.getLayout || ((page) => page);
//   return getLayout(<Component {...pageProps} />);
// }

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // const dispatch = useDispatch(); // Redux Dispatch
  
  React.useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.min")
      : null;
  }, [router.events]);

  
  // Create a component to rehydrate state from localStorage
// function RehydrateState() {
//   const dispatch = useDispatch();

//   const [rehydrated, setRehydrated] = useState(false);

//   useEffect(() => {
//     const storedUserData = localStorage.getItem("userData");
//     // const storedToken = localStorage.getItem("accessToken");

//     if (storedUserData) {
//       try {
//         const parsedData = JSON.parse(storedUserData);
//         // Dispatch loginSuccess so that the Redux state is rehydrated
//         dispatch(
//           loginSuccess({
//             user: parsedData,
//             status: "authenticated",
//           })
//         );
//         console.log("parsedData", parsedData);
//         setRehydrated(true)
//       } catch (error) {
//         console.error("Error parsing stored user data:", error);
//         dispatch(logout());
//       }
//     } else {
//       dispatch(logout());
//       console.log("logged out from root");
      
//     }
//   }, [dispatch]);

//   return rehydrated ? null : <div>Loading...</div>;
// }
  
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
          
          {/* <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
            crossOrigin="anonymous"
          /> */}
        </Head>

        {/* Canonical Tag here */}
        {/* <CanonicalTag baseUrl="https://beta.cadbull.com" /> */}

        <style jsx global>{`
          * {
            font-family: ${poppins.style.fontFamily} !important;
          }
        `}</style>
        {getLayout(<Component {...pageProps} />)}
      <Script
        id="adsense-script-amp"
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        crossOrigin="anonymous"
      />
      </Fragment>
    );
  }
  return (
    <Fragment>
      {/* <Authprovider> */}
      <Provider store={store}>
      {/* <PersistGate loading={<div>Loading...</div>} persistor={persistor}> */}
      {/* <RehydrateState /> */}
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Cadbull</title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      
      {/* Canonical Tag here */}
      {/* <CanonicalTag baseUrl="https://beta.cadbull.com" /> */}
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
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        crossOrigin="anonymous"
      />
      <ToastContainer />
      {/* </PersistGate> */}
      </Provider>
      {/* </Authprovider> */}
    </Fragment>
  );
}
