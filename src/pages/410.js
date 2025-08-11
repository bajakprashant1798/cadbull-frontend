import { Fragment } from 'react';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';

const Gone410 = () => {
  return (
    <Fragment>
      <Head>
        <title>410 - Resource Gone | Cadbull</title>
        <meta name="description" content="This resource has been permanently removed and is no longer available." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <section className="py-lg-5 py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="text-center">
                <div className="mb-4">
                  <h1 className="display-1 fw-bold text-primary">410</h1>
                  <h2 className="h4 mb-3">Resource Gone</h2>
                  <p className="text-muted mb-4">
                    The resource you're looking for has been permanently removed and is no longer available.
                    This may be because the content was rejected, removed, or no longer meets our quality standards.
                  </p>
                </div>
                
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Link href="/" className="btn btn-primary px-4">
                    Go to Homepage
                  </Link>
                  <Link href="/categories" className="btn btn-outline-primary px-4">
                    Browse Categories
                  </Link>
                </div>
                
                <div className="mt-5">
                  <p className="text-muted small">
                    If you believe this is an error, please <Link href="/contact-us" className="text-decoration-none">contact us</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

Gone410.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Gone410;
