"use client";

import MainLayout from '@/layouts/MainLayout'; // Assuming you want the same layout
import Link from 'next/link';

const CancelPage = () => {
  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h1 className="display-4 text-warning">Payment Canceled</h1>
            <p className="lead mt-3">
              Your payment process was canceled. You have not been charged.
            </p>
            <p>
              You can return to the pricing page to select a plan at any time.
            </p>
            <div className="mt-4">
              <Link href="/pricing" className="btn btn-primary">
                Back to Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// This applies your standard layout to the page
CancelPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default CancelPage;