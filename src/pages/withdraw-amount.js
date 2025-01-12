import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading";
import { useSelector } from "react-redux";
import {
  getRedeemRequestList,
  getWalletBalance,
  redeemWalletBalance,
} from "@/service/api";
import withAuth from "@/HOC/withAuth";
import { toast } from "react-toastify";

const WithdrawAmount = () => {
  const { token } = useSelector((store) => store.logininfo.user);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(""); 
  const [tableData, setTableData] = useState([]); 

  useEffect(() => {
    if (token) {
      getWalletBalance(token).then((res)=>{
        setBalance(res.data.amount);
      }).catch((err)=>{
          console.log('error',err)
      });
         
      getRedeemRequestList(token)
      .then((res) => {
        setTableData(res.data.withdrawRequests);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [token,balance]);

  const handleWithdraw = (e) => {
    e.preventDefault();

    // Validate the input
    if (amount < 10) {
      setError("You must withdraw at least 10 USD.");
    } else {
      // Clear any previous error messages
      setError("");

      // Proceed with withdrawal
      redeemWalletBalance(token, amount)
        .then((res) => {
          setBalance(res.data.updatedWallet.amount);
          toast.success("Withdrawal request submitted successfully.");
        })
        .catch((err) => {
          console.error(err);
          console.log("error message", err.response.data.error);
          toast.error(`${err?.response?.data?.error}`);
        });
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Withdraw Amount | Cadbull</title>
        <meta name="description" content="World Largest 2D CAD Library." />
      </Head>
      <section className="py-lg-5 py-4 auth-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading
                title={"Withdraw Amount"}
                description={"How much amount would you like to Withdraw?"}
              />
            </div>
          </div>
          <div className="row justify-content-center mx-2">
            <div className="col-md-9 col-lg-7 col-xl-6 col-xxl-5 form-wrapper rounded-xxl">
              <div className="p-sm-4">
                <div className="row justify-content-center">
                  <div className="col-lg-12 col-xl-12">
                    <div className="mb-3 mb-md-4 text-center">
                      <h5 className="text-primary">
                        <span>Available balance:</span> <span>${balance}</span>
                      </h5>
                    </div>
                  </div>
                </div>
                <form
                  onSubmit={handleWithdraw}
                  className="row g-3 mb-3 mb-md-4 justify-content-center"
                >
                  {/* Withdrawal Amount  */}
                  <div className="col-lg-12 col-xl-12">
                    <div>
                      <label>Withdrawal Amount</label>
                    </div>
                    <input
                      onChange={(e) => setAmount(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Withdrawal Amount"
                    />
                    <h6 className="text-primary mt-2 fw-medium">
                      $1 USD Fee per withdrawal
                    </h6>
                  </div>
                  <div className="col-lg-12 col-xl-12">
                    <p className="text-danger lh-sm">
                      You must have more than $10 USD to redeem money.
                    </p>
                  </div>
                  <div className="col-lg-12 col-xl-12">
                    <div className="mt-2 mt-md-3 d-flex flex-column gap-2 form-button-group">
                      <div className="d-flex gap-2 flex-column flex-sm-row">
                        <button
                          type="submit"
                          className="btn btn-lg btn-primary w-100 rounded"
                        >
                          Submit Withdrawal
                        </button>
                        <Link
                          href={"/"}
                          className="btn btn-lg btn-danger-variant w-100"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Display error message */}
                {error && <p className="text-danger">{error}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mx-auto mt-5 container">
          <div className="col-md-12 form-wrapper rounded-xl p-0 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <td>ID</td>
                    <td>Amount</td>
                    <td>status</td>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((res) => {
                    return (
                      <tr key={res.id}>
                        <td>{res.id}</td>
                        <td>
                          <div className="title-wrapper">{res.amount}</div>
                        </td>
                        <td>
                          <div className="title-wrapper">{res.status}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

WithdrawAmount.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuth(WithdrawAmount);