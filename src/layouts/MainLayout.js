
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Fragment } from "react";

const MainLayout = ({children}) => {
  return (
    <Fragment>
        {/* <Provider store={store}>
        <Authprovider> */}
          
      <Header />
      <main>

         {children}
      </main>
      <Footer />
        {/* </Authprovider>
        </Provider> */}
    </Fragment>
  );
}

export default MainLayout;