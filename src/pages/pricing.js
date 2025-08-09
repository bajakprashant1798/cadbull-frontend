"use client"
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import Icons from "@/components/Icons";
import { handleSubscription } from "@/service/api";
import { toast } from "react-toastify";
import useSessionStorageData from "@/utils/useSessionStorageData";
import { useRouter } from "next/router";
import { getUserDetails } from "@/service/api";
import { useSelector } from "react-redux";
import logo from "@/assets/images/logo.png";

const progress = '80';

const Pricing = () => {
  const router = useRouter();
  const userData = useSessionStorageData("userData");
  const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [activeSubscription, setActiveSubscription] = useState(false); // ✅ Check if user has an active plan
  const [showMessage, setShowMessage] = useState(true); // ✅ Control message visibility

  // const status = useSelector((store) => store.logininfo)
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isAuthenticated) return;  // ✅ Prevent unnecessary API calls

      try {
        const response = await getUserDetails();
        if (!response) {
          console.error("❌ No response from getUserDetails API.");
          return;
        }

        // console.log(response);
        

        setUser(response.data);
        const expDate = new Date(response.data.acc_exp_date);
        const today = new Date();

        // 🟢 Check if the user has an active subscription
        if (response.data.acc_exp_date && expDate > today) {
          setActiveSubscription(true);
          setMessage(`✅ Your Gold account expires on ${expDate.toDateString()}`);
        } else {
          setActiveSubscription(false);
          setMessage("✖ Oops! Looks like you’re not on an active subscription yet. But no worries – you're just one click away from accessing our entire CAD library! Subscribe today and explore without limits!");
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated]);  // ✅ Run only when `token` is available


  // useEffect(() => {
  //   console.log("📌 Token from Redux:", token);
  //   if (token) {
  //     fetchUserDetails();
  //   }
  // }, [token]);
  

  const purchasePlan = async (priceId) => {
    if (!userData) {
      router.push(`/auth/login?redirect=${router.asPath}`);
      return;
    }
    
    if (activeSubscription) {
      toast.error("You already have an active subscription. Cancel your current plan first.");
      return;
    }

    try {
      const res = await handleSubscription(priceId, user.id);
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Subscription error:", err);
    }
  };

  return (<Fragment>
    <Head>
      <title>Cadbull Pricing Plans | Affordable AutoCAD Files for Architecture</title>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/pricing`} />
      <meta name="description" content="Learn Pricing Plans free & premiums architectural 2D & 3D CAD models in DWG File .Pick the perfect Cadbull plan to power up your design projects." />

      <meta property="og:title" content="Cadbull Pricing Plans | Affordable AutoCAD Files for Architecture" />
      <meta property="og:description" content="Learn Pricing Plans free & premiums architectural 2D & 3D CAD models in DWG File .Pick the perfect Cadbull plan to power up your design projects." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/pricing`} />
      <meta property="og:image" content={logo} />
      <meta name="twitter:title" content="Cadbull Pricing Plans | Affordable AutoCAD Files for Architecture" />
      <meta name="twitter:description" content="Learn Pricing Plans free & premiums architectural 2D & 3D CAD models in DWG File .Pick the perfect Cadbull plan to power up your design projects." />
      <meta name="twitter:image" content={logo} />
      <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad furniture" />
    </Head>
    <section className="py-lg-4 py-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="text-center">
              <div className="mb-3 mb-md-4 mt-3 mt-md-5">
              <div>
                {/* {message && <p className="alert alert-warning text-center">{message}</p>} */}
                {message && showMessage && (
                  <div className="position-relative mb-4">
                    <div 
                      className={`alert ${activeSubscription ? 'alert-success' : 'alert-danger'} text-center mb-0`}
                      style={!activeSubscription ? { backgroundColor: '#FF6961', color: 'white', borderColor: '#FF6961' } : {}}
                    >
                      <p 
                        className="mb-0" 
                        style={{ 
                          color: activeSubscription ? 'black' : 'white' 
                        }}
                      >
                        {message}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="button btn-light rounded-circle d-flex align-items-center justify-content-center position-absolute"
                      aria-label="Close"
                      style={{ 
                        width: '30px',
                        height: '30px',
                        top: '-10px',
                        right: '-10px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '2px solid white',
                        zIndex: 10
                      }}
                      onClick={() => setShowMessage(false)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
                {/* <h1>Choose Your Pricing Plan</h1>
                <p>Choose the Right plan. No commission</p> */}
                <h1>New Files Delivered Daily, No Exceptions!</h1>
                <p className="h5 mt-2">Choose Your Pricing Plan</p>
              </div>
            </div>
            </div>
          </div>
        </div>
    </section>

    {/* Plans */}
    <section className="">
      <div className="container py-md-4">
        <div className="row gy-4 align-items-center">
          {/* 1 */}
          <div className="col-lg-3 col-md-6">
            <div className="pricing-card">
              <div className="h-100 inner-wrapper" style={{ borderTopColor: '#3D6098' }}>
                <div className="d-flex justify-content-between">
                  <h5 className="text-primary">Silver Plan</h5>
                  {/* <button type="button" className="btn-pricing"><span className="me-1">Auto-Renewal</span><Icons.Renewal /></button> */}
                </div>
                <div className="my-2 mb-3">
                  <h4 className="text-primary">
                    <span className="fw-bold">$13</span>
                    <small className="fs-5">/ 15 Days</small>
                  </h4>
                </div>
                {/* <div className="mb-3">
                  <p className="text-primary fw-medium">Ideal for individual creators.</p>
                </div> */}
                <div>
                  <ul className="list-unstyled mb-4 mb-md-5 d-flex flex-column gap-2">
                    <li><Icons.ListBullet /><span className="ms-1">All 65000+ Free Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">All 225000+ Premium Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Create Library</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Upload Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Create Projects Library</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Upto 200 files/day</span></li>
                  </ul>
                </div>
                <div>
                  <button onClick={()=>{
                    // checkout({
                    //   lineItems:[
                    //     {
                    //       price:"price_1Np5QWSEURYCTKPMiRR7rvYI",quantity:1
                    //     }
                    //   ]
                    // })
                    if(userData ===null){
                      router.push(`/auth/login?redirect=${router.asPath}`)
                      // toast.error('Login is required');
                      
                      return
                    }
                       handleSubscription("price_1QLNQAFy6VKViPpJGQCXH5KE", user.id).then((res)=>{
                        // console.log("API Response:", res.data); // Log response
                        window.location.href=res.data.url
                       }).catch((err)=>{
                        // console.log('error',err)
                       })
                  }}
                  //  disabled={activeSubscription}
                   type="button" className="btn btn-primary">
                    {/* {activeSubscription ? "ALREADY SUBSCRIBED" : "GET STARTED WEEKLY"} */}
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* 2  */}
          <div className="col-lg-3 col-md-6">
            <div className="pricing-card">
              <div className="h-100 inner-wrapper" style={{ borderTopColor: '#3D6098' }}>
                <div className="d-flex justify-content-between">
                  <h5 className="text-primary">Gold Plan</h5>
                  {/* <button type="button" className="btn-pricing"><span className="me-1">Auto-Renewal</span><Icons.Renewal /></button> */}
                </div>
                <div className="my-2 mb-3">
                  <h4 className="text-primary">
                    <span className="fw-bold">$20</span>
                    <small className="fs-5">/ Month</small>
                  </h4>
                </div>
                {/* <div className="mb-3">
                  <p className="text-primary fw-medium">Ideal for individual creators.</p>
                </div> */}
                <div>
                  <ul className="list-unstyled mb-4 mb-md-5 d-flex flex-column gap-2">
                    <li><Icons.ListBullet /><span className="ms-1">All 65000+ Free Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">All 225000+ Premium Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Create Library</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Upload Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Create Projects Library</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Upto 250 files/day</span></li>
                  </ul>
                </div>
                <div>
                  <button
                  
                  onClick={()=>{
                    if(userData ===null){
                      // toast.error('Login is required');
                      router.push(`/auth/login?redirect=${router.asPath}`)
                      return
                    }
                    handleSubscription("price_1Q8P4NFy6VKViPpJeRzGAybE", user.id).then((res)=>{
                    
                      window.location.href=res.data.url
                     }).catch((err)=>{
                      // console.log('error',err)
                     })
                  }}
                  // disabled={activeSubscription}
                  type="button" className="btn btn-primary">
                    {/* {activeSubscription ? "ALREADY SUBSCRIBED" : "GET STARTED ANNUAL"} */}
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3  */}
          <div className="col-lg-3 col-md-6">
            <div className="pricing-card">
              <div className="header-wrapper" style={{ background: '#3D6098' }}>
                <h5 className="text-white">MOST POPULAR</h5>
              </div>
              <div className="h-100 inner-wrapper py-5" style={{ borderTopColor: '#4A4A4A', background: '#4A4A4A' }}>
                <div className="d-flex justify-content-between">
                  <h5 className="text-white">Platinum Plan</h5>
                  {/* <button type="button" className="btn-pricing"><span className="me-1">Auto-Renewal</span><Icons.Renewal /></button> */}
                </div>
                <div className="my-2 mb-3">
                  <h4 className="text-white">
                    <span className="fw-bold">$50</span>
                    <small className="fs-5">/ 3 Months</small>
                  </h4>
                </div>
                {/* <div className="mb-3">
                  <p className="text-white fw-medium">Ideal for individual creators.</p>
                </div> */}
                <div>
                  <ul className="list-unstyled mb-4 mb-md-5 d-flex flex-column gap-2">
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">All 65000+ Free Files</span></li>
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">All 225000+ Premium Files</span></li>
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">Create Library</span></li>
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">Upload Files</span></li>
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">Create Projects Library</span></li>
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">Upto 300 files/day</span></li>
                  </ul>
                </div>
                <div className="pb-5">
                  <button
                  onClick={()=>{
                    if(userData ===null){
                      // toast.error('Login is required');
                      router.push(`/auth/login?redirect=${router.asPath}`)
                      return
                    }
                    handleSubscription("price_1Q8H9gFy6VKViPpJwEh4k3c1", user.id).then((res)=>{
                    
                      window.location.href=res.data.url
                     }).catch((err)=>{
                      // console.log('error',err)
                     })
                  }}
                  // disabled={activeSubscription}
                  type="button" className="btn btn-light">
                    {/* {activeSubscription ? "ALREADY SUBSCRIBED" : "GET STARTED MONTHLY"} */}
                    BUY NOW
                    </button>
                </div>
              </div>
            </div>
          </div>
          {/* 4  */}
          <div className="col-lg-3 col-md-6">
            <div className="pricing-card">
              <div className="h-100 inner-wrapper" style={{ borderTopColor: '#3D6098' }}>
                <div className="d-flex justify-content-between">
                  <h5 className="text-primary">Dimond Plan</h5>
                  {/* <button type="button" className="btn-pricing"><span className="me-1">Auto-Renewal</span><Icons.Renewal /></button> */}
                </div>
                <div className="my-2 mb-3">
                  <h4 className="text-primary">
                    <span className="fw-bold">$99</span>
                    <small className="fs-5">/ Year</small>
                  </h4>
                </div>
                {/* <div className="mb-3">
                  <p className="text-primary fw-medium">Ideal for individual creators.</p>
                </div> */}
                <div>
                  <ul className="list-unstyled mb-4 mb-md-5 d-flex flex-column gap-2">
                    <li><Icons.ListBullet /><span className="ms-1">All 65000+ Free Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">All 225000+ Premium Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Create Library</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Upload Files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Create Projects Library</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Upto 400 files/day</span></li>
                  </ul>
                </div>
                <div>
                  <button
                  
                  onClick={()=>{
                    if(userData ===null){
                      // toast.error('Login is required');
                      router.push(`/auth/login?redirect=${router.asPath}`)
                      return
                    }
                    handleSubscription("price_1Q8PNDFy6VKViPpJSYVg4mvU", user.id).then((res)=>{
                    
                      window.location.href=res.data.url
                     }).catch((err)=>{
                      // console.log('error',err)
                     })
                  }}
                  // disabled={activeSubscription}
                  type="button" className="btn btn-primary">
                    {/* {activeSubscription ? "ALREADY SUBSCRIBED" : "GET STARTED ANNUAL"} */}
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Fragment>
  );
}

Pricing.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default Pricing;