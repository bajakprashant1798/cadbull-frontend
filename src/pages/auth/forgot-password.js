import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment, useState, useEffect } from "react";
import PageHeading from "@/components/PageHeading";
import { forgetPassword } from "@/service/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const requestData = { email: email };
    setIsResetting(true);

    forgetPassword(requestData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let timer;

    if (isResetting && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isResetting, countdown]);

  useEffect(() => {
    if (countdown === 0) {
      setIsResetting(false);
      setCountdown(30);
    }
  }, [countdown]);

  return (
    <Fragment>
      <Head>
        <title>Forgot Password | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      <section className="py-md-5 py-4 auth-page">
        <div className="container">
          <div className="row mb-md-4">
            <div className="col-md-12">
              <PageHeading
                title={"Recover Password?"}
                description={"No worries, we'll send you rest instructions."}
              />
            </div>
          </div>

          <div className="row justify-content-center mx-2">
            <div className="col-sm-9 col-md-8 col-lg-7 col-xl-6 col-xxl-5 form-wrapper rounded-xxl">
              <div className="p-md-4 p-3">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <div className="mb-3 mb-md-4 text-center">
                      <p>
                        Please enter the email address for your account. A
                        temporary password will be sent to you.
                      </p>
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={handleFormSubmit}
                  className="row g-3 mb-3 mb-md-4 justify-content-center"
                >
                  {/* Email  */}
                  <div className="col-md-12">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Email />
                      <label>Email Id</label>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="mt-2 mt-md-3">
                      <button
                        type="submit"
                        className="btn btn-lg btn-secondary w-100"
                        disabled={isResetting}
                      >
                        {isResetting
                          ? `Resetting in ${countdown} seconds`
                          : "Reset Password"}
                      </button>
                    </div>
                  </div>
                </form>
                <div className="text-center">
                  <p>
                    <span>Didn't receive the email?</span>{" "}
                    <button
                      type="button"
                      className="text-danger bg-transparent border-0 p-0"
                    >
                      Click to Resend
                    </button>
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

ForgotPassword.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default ForgotPassword;
