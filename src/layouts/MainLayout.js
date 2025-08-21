
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import GlobalRouteLoader from "@/components/GlobalRouteLoader";
import { Fragment } from "react";

const MainLayout = ({children}) => {
  return (
    <Fragment>
        {/* <Provider store={store}>
        <Authprovider> */}
          
      <Header />
      <main>
          <GlobalRouteLoader />
         {children}
      </main>
      <Footer />
        {/* </Authprovider>
        </Provider> */}
    </Fragment>
  );
}

export default MainLayout;