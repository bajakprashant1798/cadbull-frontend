import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        router.push(`/auth/login?redirect=${router.asPath}`);
      } else {
        setIsLoading(false);
      }
    }, []);

    if (isLoading) {
      return (
        <div className="d-flex justify-content-center  align-items-center" style={{ height: "100vh" }}>
          <div className="spinner-border" role="status">
            {/* <span className="sr-only">Loading...</span> */}
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  // Preserve any static methods from the WrappedComponent
  if (WrappedComponent.getLayout) {
    Wrapper.getLayout = WrappedComponent.getLayout;
  }

  return Wrapper;
};

export default withAuth;
