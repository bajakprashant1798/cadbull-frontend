import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment, useState } from "react";
import PageHeading from "@/components/PageHeading";
import { resetPassword } from "@/service/api";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 const {token} = router.query;
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    resetPassword(token,password)
      .then((res) => {
        console.log("res", res);
       router.push("/auth/login")
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Check if passwords match
  // if (password !== confirmPassword) {
  //   alert("Passwords don't match. Please try again.");
  //   return;
  // }

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
                description={"No worries, we'll send you rest intructions."}
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
                  onSubmit={handleSubmit}
                  className="row g-3 mb-3 mb-md-4 justify-content-center"
                >
                  {/* Password  */}
                  <div className="col-md-12">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Password />
                      <label>Password</label>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter Your password"
                      onChange={(e)=>setPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Password />
                      <label>Confirm Password</label>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter Your confirm password"
                      onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="mt-2 mt-md-3">
                      <button
                        type="submit"
                        className="btn btn-lg btn-secondary w-100"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
                <div className="text-center"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

ResetPassword.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default ResetPassword;
