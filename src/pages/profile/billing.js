import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelSubscriptionRequest,
  getPaymentInformation,
  getRedeemRequestList,
  getSubscriptionDetail,
  getWalletBalance,
  redeemWalletBalance,
} from "@/service/api";
import withAuth from "@/HOC/withAuth";
import { toast } from "react-toastify";
import { openModalHandler } from "../../../redux/app/features/modalSlice";
import Modal from "@/components/common/Modal";
import CancelSubsConfirm from "@/components/CancelSubsConfirm";
import { useRouter } from "next/router";
import { parse } from "cookie";

const ManageBilling = ({ initialSubscribedPlan }) => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const router=useRouter()
  const [subscribedPlan, setSubscribedPlan] = useState(
    initialSubscribedPlan || 
    {
      subscription_id: "",
      interval: "",
      payment_status: "",
      amount: "",
      created_time: "",
      expires_at: "",
      cancelled_at: null,
      plan_name: "",
      invoice_url: "",
    }
  );
  const dispatch = useDispatch();
  // useEffect(() => {
  //   getSubscriptionDetail(token)
  //     .then((res) => {
  //       console.log("subscribed plan res", res.data);
  //       setSubscribedPlan(res.data.plan);
  //     })
  //     .catch((err) => {
  //       console.log("error", err);
  //     });
  // }, []);
  useEffect(()=>{
    if((router.query.session_id && router.query.session_id.trim()!=='') && typeof window !==undefined){
      const userData=JSON.parse(localStorage.getItem('userData')) || {};
     console.log('user Data',userData)
      getPaymentInformation(userData?.id, router.query.session_id).then((res)=>{
        // console.log('api res',res.data)
      getSubscriptionDetail()
      .then((subRes) => {
        console.log("subscribed plan res", subRes.data);
        setSubscribedPlan(subRes.data.plan);
      })
      .catch((err) => {
        console.log("error", err);
      });
       }).catch((err)=>{
        console.log('error',err)
       })
    }
    else{
      getSubscriptionDetail()
      .then((subRes) => {
        console.log("subscribed plan res", subRes.data);
        setSubscribedPlan(subRes.data.plan);
      })
      .catch((err) => {
        console.log("error", err);
      });
    }
},[router.query])

const handleCancelSubscription = () => {
  if (!subscribedPlan.subscription_id) {
    toast.error("No active subscription found.");
    return;
  }

  cancelSubscriptionRequest(subscribedPlan.subscription_id)
    .then(response => {
      console.log("✅ Subscription Cancelled at End of Billing Cycle:", response.data);

      // 🟢 Update UI to show "Cancelled" state
      setSubscribedPlan(prevState => ({
        ...prevState,
        cancelled_at: response.data.cancel_at
      }));

      toast.success("Your subscription will be cancelled at the end of the billing period.");
    })
    .catch(error => {
      console.error("❌ Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    });
};


  return (
    <Fragment>
      <Head>
        <title>Manage Billing | Cadbull</title>
        <meta name="description" content="World Largest 2D CAD Library." />
      </Head>

      <section className="py-lg-5 py-4 auth-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading
                title={"Current Subscription Details"}
                description={"Manage your subscription and billing"}
              />
            </div>
          </div>

          {subscribedPlan.subscription_id ? (
            <div className="row justify-content-center mx-2">
              <div className="col-md-9 col-lg-7 col-xl-6 col-xxl-5 form-wrapper rounded-xxl">
                <div className="p-sm-4">
                  <form
                    //   onSubmit={handleWithdraw}
                    className="row g-3 mb-3 mb-md-4 justify-content-center"
                  >
                    {/* Withdrawal Amount  */}
                    <div className="col-lg-12 col-xl-12">
                      <div>
                        <label>Current Subscribed Plan</label>
                      </div>
                      <input
                        type="text"
                        className={`form-control ${
                          subscribedPlan.cancelled_at ==null
                            ? "is-valid"
                            : "is-invalid"
                        }`}
                        readOnly
                        value={`${subscribedPlan.plan_name} (${subscribedPlan.amount}$/${subscribedPlan.interval}) `}
                      />
                      {subscribedPlan.cancelled_at== null ? (
                        <div class="valid-feedback">Your plan is active</div>
                      ) : (
                        <div class="invalid-feedback">
                          Your plan got cancelled
                        </div>
                      )}
                    </div>
                    <div className="col-lg-12 col-xl-12">
                      <div>
                        <label>Start Date</label>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={`${subscribedPlan.created_time}`}
                      />
                    </div>
                    <div className="col-lg-12 col-xl-12">
                      <div>
                        <label>Upcoming Billing Date</label>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        readOnly
                        value={`${subscribedPlan.expires_at}`}
                      />
                    </div>

                    <div className="col-lg-12 col-xl-12">
                      <div className="mt-2 mt-md-3 d-flex flex-column gap-2 form-button-group">
                        <div className="d-flex gap-2 flex-column flex-sm-row">
                          <button
                            type="button"
                            data-bs-toggle="#exampleModal"
                            className="btn btn-lg btn-primary w-100 rounded"
                            onClick={() => {
                              if (subscribedPlan.invoice_url) {
                                console.log("invoice: ", subscribedPlan.invoice_url);
                                
                                window.open(subscribedPlan.invoice_url, "_blank");
                              } else {
                                toast.error("Invoice not available yet. Please try again later.");
                              }
                            }}
                          >
                            Download Invoice
                          </button>
                         {subscribedPlan.cancelled_at?
                        //  <button
                        //     type="button"
                        //     data-bs-toggle="#exampleModal"
                        //     className="btn btn-lg btn-danger w-100 rounded"
                        //     disabled
                        //   >
                        //    Subscription Cancelled
                        //   </button>
                        <button
                          type="button"
                          className="btn btn-lg btn-danger-variant w-100"
                          onClick={() => {
                            if (!subscribedPlan.subscription_id) {
                                toast.error("No active subscription found.");
                                return;
                            }
                            cancelSubscriptionRequest(subscribedPlan.subscription_id)
                                .then(() => {
                                    toast.success("Subscription cancellation scheduled successfully.");
                                    setSubscribedPlan({ ...subscribedPlan, cancelled_at: new Date().toISOString() }); // Update UI
                                })
                                .catch((err) => {
                                    console.error("❌ Subscription cancellation failed:", err);
                                    toast.error("Failed to cancel subscription. Try again later.");
                                });
                          }}
                          disabled={!!subscribedPlan.cancelled_at} // Disable button if already cancelled
                          >
                              {subscribedPlan.cancelled_at ? "Subscription Cancelled" : "Cancel Subscription"}
                          </button>
                          : <Link
                            href={"/"}
                            
                            className="btn btn-lg btn-danger-variant w-100 "
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(openModalHandler());
                            }}
                          >
                            Cancel Subscription
                          </Link>}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <h5 className="text-center display-6">
              No subscription plan found ?{" "}
              <span>
                <Link href={"/pricing"}>Buy new plan</Link>
              </span>
            </h5>
          )}
        </div>
      </section>
      <Modal>
        <CancelSubsConfirm subscriptionId={subscribedPlan.subscription_id}/>
      </Modal>
    </Fragment>
  );
};

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || "");
  const accessToken = cookies.accessToken || "";

  if (!accessToken) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  try {
    const res = await getSubscriptionDetail(accessToken);
    return {
      props: {
        initialSubscribedPlan: res.data.plan || null,
      },
    };
  } catch (err) {
    console.error("SSR subscription fetch failed", err);
    return {
      props: {
        initialSubscribedPlan: null,
      },
    };
  }
}

ManageBilling.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuth(ManageBilling);
