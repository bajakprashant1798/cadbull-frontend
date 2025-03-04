
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "@/styles/globals.scss";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Fragment, useEffect } from "react";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Authprovider from "@/component/Authprovider/Authprovider";
import { Provider, useDispatch } from "react-redux";
import { store } from "../../redux/app/store";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
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

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // const dispatch = useDispatch(); // Redux Dispatch
  
  React.useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.min")
      : null;
  }, [router.events]);

  
  // Create a component to rehydrate state from localStorage
function RehydrateState() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUserData && storedToken) {
      try {
        const parsedData = JSON.parse(storedUserData);
        // Dispatch loginSuccess so that the Redux state is rehydrated
        dispatch(
          loginSuccess({
            user: parsedData,
            accessToken: storedToken,
            status: "authenticated",
          })
        );
        console.log("parsedData", parsedData);
        
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return null;
}
  
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <Fragment>
      {/* <Authprovider> */}
      <Provider store={store}>
      <RehydrateState />
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
      <ToastContainer />
      </Provider>
      {/* </Authprovider> */}
    </Fragment>
  );
}
