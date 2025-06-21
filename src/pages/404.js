// pages/404.js
import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";

export default function Custom404() {
  return (
    <MainLayout>
      <section className="py-5 text-center">
        <h1 className="display-1 text-danger mb-4">404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="mb-4">
          Sorry, the page or file you’re looking for does not exist or has been removed.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </section>
    </MainLayout>
  );
}
