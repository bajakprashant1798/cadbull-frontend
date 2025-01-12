"use client"
import MainLayout from "@/layouts/MainLayout";
import offer from "@/assets/images/20-off.png"
import { Fragment } from "react";
import Icons from "@/components/Icons";
import { handleSubscription } from "@/service/api";
import { toast } from "react-toastify";
import useSessionStorageData from "@/utils/useSessionStorageData";
import { useRouter } from "next/router";
const progress = '80';


const Pricing = () => {
  const userData= useSessionStorageData("userData");
  const router=useRouter()
  return (<Fragment>
    <section className="py-lg-4 py-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="text-center">
              <div className="mb-3 mb-md-4">
                <h1>Choose Your Pricing Plan</h1>
                <p>Choose the Right plan. No commission</p>
              </div>
            </div>
            </div>
            <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-5">
              <div className="switch-wraper d-flex gap-2 justify-content-start justify-content-sm-center align-items-center mb-3 mb-md-4 position-relative">
                <p className="text-primary fw-semibold">Pay Monthly</p>
                <div className="form-check form-switch mb-0 py-0" style={{ minHeight: "unset" }}>
                  <input className="form-check-input shadow-none" type="checkbox" role="switch" />
                </div>
                <p className="fw-semibold">Pay Yearly</p>
                <div className="position-absolute end-0">
                  <img src={offer.src}
                    alt="off"
                    width={110}
                    className="img-fluid" />
                </div>
              </div>
            </div>
            <div className="col-sm-11 col-md-10 col-lg-9 col-xl-8">
              <div className="pricing-slider text-start mb-5">
                <p className="mb-2 text-grey">Number of monthly visitors</p>
                <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar" data-attr={progress + 'K'} style={{ width: progress + '%' }} ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>

    {/* Plans */}
    <section className="py-3 py-lg-4">
      <div className="container py-md-5">
        <div className="row gy-4 align-items-center">
          {/* 1 */}
          <div className="col-lg-4 col-md-6">
            <div className="pricing-card">
              <div className="h-100 inner-wrapper" style={{ borderTopColor: '#1D1D5' }}>
                <div className="d-flex justify-content-between">
                  <h5 className="text-primary">Starter</h5>
                  <button type="button" className="btn-pricing"><span className="me-1">Auto-Renewal</span><Icons.Renewal /></button>
                </div>
                <div className="my-2">
                  <h4 className="text-primary">
                    <span className="fw-bold">$15</span>
                    <small className="fs-5">/ Weekly</small>
                  </h4>
                </div>
                <div className="mb-3">
                  <p className="text-primary fw-medium">Ideal for individual creators.</p>
                </div>
                <div>
                  <ul className="list-unstyled mb-4 mb-md-5 d-flex flex-column gap-2">
                    <li><Icons.ListBullet /><span className="ms-1">75.000+ free files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">1.50.000+ gold files</span></li>
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
                       handleSubscription("price_1NuCnUSBAUwjb2fP6XDa5f1V").then((res)=>{
                      
                        window.location.href=res.data
                       }).catch((err)=>{
                        console.log('error',err)
                       })
                  }}
                   type="button" className="btn btn-primary">GET STARTED WEEKLY</button>
                </div>
              </div>
            </div>
          </div>
          {/* 2  */}
          <div className="col-lg-4 col-md-6">
            <div className="pricing-card">
              <div className="header-wrapper" style={{ background: '#3D6098' }}>
                <h5 className="text-white">MOST POPULAR</h5>
              </div>
              <div className="h-100 inner-wrapper py-5" style={{ borderTopColor: '#4A4A4A', background: '#4A4A4A' }}>
                <div className="d-flex justify-content-between">
                  <h5 className="text-white">Pro</h5>
                  <button type="button" className="btn-pricing"><span className="me-1">Auto-Renewal</span><Icons.Renewal /></button>
                </div>
                <div className="my-2">
                  <h4 className="text-white">
                    <span className="fw-bold">$19</span>
                    <small className="fs-5">/ Month</small>
                  </h4>
                </div>
                <div className="mb-3">
                  <p className="text-white fw-medium">Ideal for individual creators.</p>
                </div>
                <div>
                  <ul className="list-unstyled mb-4 mb-md-5 d-flex flex-column gap-2">
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">75.000+ free files</span></li>
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">1.50.000+ gold files</span></li>
                    <li className="text-white"><Icons.ListBullet /><span className="ms-1">Upto 200 files/day</span></li>
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
                    handleSubscription("price_1NuColSBAUwjb2fPgI55JSCS").then((res)=>{
                    
                      window.location.href=res.data
                     }).catch((err)=>{
                      console.log('error',err)
                     })
                  }}
                  type="button" className="btn btn-light">GET STARTED MONTHLY</button>
                </div>
              </div>
            </div>
          </div>
          {/* 3  */}
          <div className="col-lg-4 col-md-6">
            <div className="pricing-card">
              <div className="h-100 inner-wrapper" style={{ borderTopColor: '#3D6098' }}>
                <div className="d-flex justify-content-between">
                  <h5 className="text-primary">Enterprice</h5>
                  <button type="button" className="btn-pricing"><span className="me-1">Auto-Renewal</span><Icons.Renewal /></button>
                </div>
                <div className="my-2">
                  <h4 className="text-primary">
                    <span className="fw-bold">$99</span>
                    <small className="fs-5">/ Annual</small>
                  </h4>
                </div>
                <div className="mb-3">
                  <p className="text-primary fw-medium">Ideal for individual creators.</p>
                </div>
                <div>
                  <ul className="list-unstyled mb-4 mb-md-5 d-flex flex-column gap-2">
                    <li><Icons.ListBullet /><span className="ms-1">75.000+ free files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">1.50.000+ gold files</span></li>
                    <li><Icons.ListBullet /><span className="ms-1">Upto 300 files/day</span></li>
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
                    handleSubscription("price_1NuCx4SBAUwjb2fP4QCS6AGs").then((res)=>{
                    
                      window.location.href=res.data
                     }).catch((err)=>{
                      console.log('error',err)
                     })
                  }}
                  type="button" className="btn btn-primary">GET STARTED ANNUAL</button>
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