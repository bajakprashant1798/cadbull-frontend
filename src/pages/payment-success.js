import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { getCheckoutSessionDetails, getUserData } from "@/service/api";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import withAuth from "@/HOC/withAuth";
import { loginSuccess } from "../../redux/app/features/authSlice";

const customAnimationStyles = `
@keyframes iconPulse {
  0% { transform: scale(0.95); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 0; }
}
.animate-pulse {
  animation: iconPulse 2s infinite;
}
.bg-grid-pattern {
  background-image: linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 25px 25px;
}
.success-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: #dcfce7;
  color: #16a34a;
  border-radius: 50%;
  margin-bottom: 1.5rem;
}
.success-icon-pulse {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  border: 4px solid #16a34a;
}
`;

const PaymentSuccess = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState(null);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);

  useEffect(() => {
    if (!router.isReady) return;

    const { session_id } = router.query;

    if (!session_id || session_id.trim() === "") {
      toast.error("Invalid checkout session.");
      router.replace("/pricing");
      return;
    }

    const trackedStr = localStorage.getItem("tracked_checkout_sessions") || "[]";
    let tracked = [];
    try {
      tracked = JSON.parse(trackedStr);
    } catch (e) {
      tracked = [];
    }
    if (!Array.isArray(tracked)) tracked = [];

    // 1. Fetch Session details securely
    getCheckoutSessionDetails(session_id)
      .then((res) => {
        const data = res.data;
        if (!data || data.status !== "paid") {
          toast.error("Your payment session was not completed or has expired.");
          router.replace("/pricing");
          return;
        }

        setTransactionData(data);
        setLoading(false);

        // 2. Prevent double tracking
        if (!tracked.includes(session_id)) {
          // Push standard GA4 ecommerce purchase event
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "purchase",
            ecommerce: {
              transaction_id: data.transaction_id,
              value: Number(data.value),
              currency: data.currency,
              items: [
                {
                  item_id: data.stripe_price_id,
                  item_name: data.plan_name,
                  price: Number(data.value),
                  quantity: 1,
                  item_category: "Subscription",
                  item_category2: data.billing_interval,
                  item_variant: data.plan_name,
                },
              ],
            },
            subscription_id: data.subscription_id,
            billing_interval: data.billing_interval,
          });
          console.log("✅ GTM dataLayer purchase event pushed:", data);

          // Trigger Facebook Pixel Purchase event
          if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Purchase", {
              value: Number(data.value),
              currency: data.currency,
              content_name: data.plan_name,
              content_category: "Subscription",
              content_ids: [data.stripe_price_id],
              content_type: "product",
              predicted_ltv: data.billing_interval === "yearly" ? Number(data.value) * 1.5 : Number(data.value)
            });
            console.log("✅ Facebook Pixel Purchase event tracked");
          }

          // Caching tracked session
          tracked.push(session_id);
          localStorage.setItem("tracked_checkout_sessions", JSON.stringify(tracked));
        }

        // 3. Fetch updated user details to refresh the subscription status
        getUserData()
          .then((userRes) => {
            if (userRes.data && userRes.data.user) {
              localStorage.setItem("userData", JSON.stringify(userRes.data.user));
              dispatch(loginSuccess({ user: userRes.data.user, status: "authenticated" }));
              console.log("✅ User state refreshed and acc_exp_date updated:", userRes.data.user.acc_exp_date);
            }
          })
          .catch((err) => {
            console.error("❌ Failed to refresh user data after purchase:", err);
          });

        // 4. Clean query params silently
        const { pathname } = router;
        const cleanQuery = { ...router.query };
        delete cleanQuery.session_id;
        router.replace({ pathname, query: cleanQuery }, undefined, { shallow: true });
      })
      .catch((err) => {
        console.error("❌ Checkout verification failed:", err);
        toast.error("Could not verify payment session. Please check your Dashboard.");
        router.replace("/profile/billing");
      });
  }, [router.isReady, router.query]);

  return (
    <Fragment>
      <Head>
        <title>Payment Successful | Cadbull</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: customAnimationStyles }} />

      <div className="bg-light bg-grid-pattern py-5 min-vh-100 d-flex align-items-center position-relative">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center text-secondary py-5 text-center">
                  <div className="spinner-border text-dark mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4 className="fw-bold text-dark">Verifying your payment...</h4>
                  <p className="small text-muted mt-1">This will take just a second</p>
                </div>
              ) : (
                <div className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 text-center bg-white position-relative" style={{ zIndex: 10 }}>

                  {/* Success Icon */}
                  <div className="success-icon-wrapper mx-auto">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                    <div className="success-icon-pulse animate-pulse"></div>
                  </div>

                  <h1 className="fw-extrabold text-dark mb-2 display-6">Payment Successful!</h1>
                  <p className="text-secondary mb-4 px-2">
                    Thank you for subscribing! Your account has been upgraded and is now fully active.
                  </p>

                  {transactionData && (
                    <div className="bg-light rounded-3 p-4 mb-4 border border-1 text-start">
                      <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-light">
                        <span className="text-uppercase text-secondary fw-semibold small tracking-wider">Plan Name</span>
                        <span className="fw-bold text-dark">{transactionData.plan_name}</span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                        <span className="text-uppercase text-secondary fw-semibold small tracking-wider">Amount Paid</span>
                        <span className="fw-bold text-dark fs-5">
                          {transactionData.currency === "INR" ? "₹" : "$"}
                          {Number(transactionData.value).toFixed(2)}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                        <span className="text-uppercase text-secondary fw-semibold small tracking-wider">Billing Interval</span>
                        <span className="fw-bold text-dark text-capitalize">{transactionData.billing_interval}</span>
                      </div>

                      {transactionData.subscription_id && (
                        <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                          <span className="text-uppercase text-secondary fw-semibold small tracking-wider">Subscription ID</span>
                          <span className="font-monospace small text-dark text-break">{transactionData.subscription_id}</span>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center pt-3">
                        <span className="text-uppercase text-secondary fw-semibold small tracking-wider">Secure Transaction</span>
                        <span className="text-success fw-bold d-flex align-items-center gap-1">
                          <ShieldCheck size={18} /> Verified
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-2">
                    <a
                      href="https://ai.cadbull.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-dark btn-lg d-inline-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded-3"
                    >
                      <Sparkles size={18} />
                      Launch AI Studio
                    </a>

                    <Link
                      href="/"
                      className="btn btn-outline-secondary btn-lg d-inline-flex align-items-center justify-content-center gap-2 py-3 px-4 rounded-3"
                    >
                      Explore CAD Library
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </Link>
                  </div>

                  <div className="mt-4 pt-2">
                    <Link href="/profile/billing" className="text-decoration-none small text-secondary fw-semibold hover-text-dark">
                      Manage Subscriptions & Billing
                    </Link>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

PaymentSuccess.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuth(PaymentSuccess);
