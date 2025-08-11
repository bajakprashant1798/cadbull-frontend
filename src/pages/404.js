// pages/404.js
import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment } from "react";

export default function Custom404() {
  return (
    <Fragment>
      <Head>
        <title>404 - Page Not Found | Cadbull</title>
        <meta name="description" content="The page you're looking for doesn't exist. Browse our CAD library or search for specific files." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/404`} />
      </Head>
      
      <MainLayout>
        <section className="py-5 text-center">
          <h1 className="display-1 text-danger mb-4">404</h1>
          <h2 className="mb-3">Page Not Found</h2>
          <p className="mb-4">
            Sorry, the page or file you're looking for does not exist or has been removed.
          </p>
          <p className="text-muted mb-4">
            If you're looking for CAD files, please browse our categories or use the search function.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
            <Link href="/categories" className="btn btn-outline-primary">
              Browse Categories
            </Link>
          </div>
        </section>
      </MainLayout>
    </Fragment>
  );
}
