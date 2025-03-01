import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useState } from "react";
import profile from "@/assets/images/profile-arch.png"
import award1 from "@/assets/images/award-1.png"
import award2 from "@/assets/images/award-2.png";
import project from "@/assets/images/blog-1.png";
import save from "@/assets/icons/save.png";
import heart from "@/assets/icons/heart.png";
import SectionHeading from "@/components/SectionHeading";
import professionals from "@/assets/images/professionals.png"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Navigation } from 'swiper/modules';
import ConsultModal from "@/components/ConsultModal";
import Icons from "@/components/Icons";
import SortByAZ from "@/components/drawer/SortByAZ";
import SortByDate from "@/components/drawer/SortByDate";

const profiles = [
  {
    image: professionals,
    title: "Sudio Corda",
  },
  {
    image: professionals,
    title: "JMP",
  },
  {
    image: professionals,
    title: "Lite Structures",
  },
  {
    image: professionals,
    title: "Poly Theatre",
  },
  {
    image: professionals,
    title: "Liby Limited",
  },
  {
    image: professionals,
    title: "Sudio Corda",
  },
  {
    image: professionals,
    title: "JMP",
  },
  {
    image: professionals,
    title: "Lite Structures",
  },
  {
    image: professionals,
    title: "Poly Theatre",
  },
  {
    image: professionals,
    title: "Liby Limited",
  },

]
const projects = [
  {
    image: project,
    title: "Niederhafen River Promenade Zaha Hadid Architects",
    type: "DUBAI",
  },
  {
    image: project,
    title: "Niederhafen River Promenade Zaha Hadid Architects",
    type: "GERMANY",
  },
  {
    image: project,
    title: "Niederhafen River Promenade Zaha Hadid Architects",
    type: "INDIA",
  },
  {
    image: project,
    title: "Niederhafen River Promenade Zaha Hadid Architects",
    type: "DUBAI",
  },
  {
    image: project,
    title: "Niederhafen River Promenade Zaha Hadid Architects",
    type: "GERMANY",
  },
  {
    image: project,
    title: "Niederhafen River Promenade Zaha Hadid Architects",
    type: "INDIA",
  }
]

const CompanyProfile = () => {
  
  return (
    <Fragment>
      <Head>
        <title>{profile ? profile.companyName : "Company Profile"} | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <section className="py-lg-5 py-4 company-page">
        <div className="container">
          <div className="form-wrapper rounded-xxl p-md-5">
          <div className="row mb-4 gy-3 ">
            <div className="col-md-2">
              <div className="profile-image-wrapper d-flex gap-2">
                <img src={profile.src} className="rounded-circle company-logo-info { object-fit-cover"  alt="profile" />
                <div className="d-md-none">
                  <h4 className="fw-semibold text-primary">Zaha Hadid Architects</h4>
                  <p>Architecture Office· London, United Kingdom</p>
                </div>
              </div>
            </div>
            <div className="col-md-10">
              <div>
                <div className="d-flex gap-lg-5 mb-4">
                  {/* Name  */}
                  <div className="d-none d-md-block">
                    <h3 className="fw-semibold text-primary">Zaha Hadid Architects</h3>
                    <p>Architecture Office· London, United Kingdom</p>
                  </div>
                  {/* Project Detail  */}
                  <div className="d-flex gap-3 align-items-center">
                    <div>
                      <h6 className="text-primary fw-semibold lh-sm">500</h6>
                      <p className="text-grey">Projects</p>
                    </div>
                    {/* <div>
                      <h6 className="text-primary fw-semibold lh-sm">48.7 m</h6>
                      <p className="text-grey">Project views</p>
                    </div> */}
                  </div>
                </div>

                {/* Buttons  */}
                {/* <div>
                  <ul className="list-unstyled mb-0 d-flex gap-2 mb-4">
                    <li>
                      <button type="primary" className="btn-profile active" data-bs-toggle="modal" data-bs-target="#exampleModal">Contact</button>
                      <ConsultModal />
                    </li>
                    <li>
                      <button type="primary" className="btn-profile">Follow</button>
                    </li>
                    <li>
                      <button type="primary" className="btn-profile">Share</button>
                    </li>
                  </ul>
                  <div className="my-3">
                    <h6 className="text-primary fw-semibold mb-1">Zaha Hadid Architects has 50 projects published in our site, focused on: Cultural architecture, Offices, Infrastructure.</h6>
                    <p className="text-black">Their headquarters are based in London, United Kingdom.</p>
                  </div>
                  <div>
                    <h6 className="text-secondary mb-2 fw-bold">Awards</h6>
                    <div className="d-inline-flex gap-3">
                      <img src={award1.src} width={70} alt="award" className="img-fluid object-fit-contain" />
                      <img src={award2.src} width={70} alt="award" className="img-fluid object-fit-contain" />
                      <img src={award2.src} width={70} alt="award" className="img-fluid object-fit-contain" />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="row py-3 py-md-4">
            <div className="col-md-12">
              <div className="d-flex justify-content-between gap-4 gap-md-2 flex flex-column flex-md-row">
                <div className="nav nav-pills flex-nowrap" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  {/* <button className="nav-link " id="v-pills-image-tab" data-bs-toggle="pill" data-bs-target="#v-pills-image" type="button" role="tab" aria-controls="v-pills-image" aria-selected="true">Image (500)</button> */}
                  <button className="nav-link active" id="v-pills-cad-tab" data-bs-toggle="pill" data-bs-target="#v-pills-cad" type="button" role="tab" aria-controls="v-pills-cad" aria-selected="false">CAD File (360)</button>
                </div>
                  <div className='d-lg-none'>
                    <ul className='list-unstyled gap-1 gap-md-3 justify-content-center d-flex gap-3 gap-md-2 align-items-center justify-content-md-center mb-md-0'>
                      <li>
                        <button type='button' data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop4" aria-controls="staticBackdrop" className='link-btn d-inline-flex align-items-center'>
                          <Icons.Date />
                          <span className='ms-2 fw-bold text-primary'>Date</span>
                        </button>
                      </li>
                      <li className='text-grey'>|</li>
                      <li>
                        <button type='button' data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop3" aria-controls="staticBackdrop" className='link-btn d-inline-flex align-items-center'>
                          <Icons.Categories />
                          <span className='ms-2 fw-bold text-primary'>Sort by</span>
                        </button>
                      </li>
                    </ul>
                    <hr />
                    <SortByAZ/>
                    <SortByDate/>
                  </div>
                <div className="d-none d-lg-flex gap-2 justify-content-center justify-content-md-end">
                  <div className="d-flex">
                    <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                      Date :
                    </span>
                    <input type="date" className="form-control shadow-none border-start-0 rounded-start-0"/>
                  </div>
                  <div className="d-flex">
                    <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                      Sort by :
                    </span>
                    <select defaultValue="A to Z" className="form-select border-start-0 rounded-start-0" aria-label=".form-select-sm example">
                      <option value="1">A to Z</option>
                      <option value="2">Z to A</option>
                      <option value="3">A to Z</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="tab-content" id="v-pills-tabContent">
                {/* <div className="tab-pane fade " id="v-pills-image" role="tabpanel" aria-labelledby="v-pills-image-tab" tabIndex="0">
                  <div className="row g-4">
                    {
                      projects.map((project) => {
                        return (
                          <div className="col-lg-4 col-sm-6" key={project.id}>
                            <div className='project-day-card h-100'>
                              <div className='project-day-card-image mb-3 position-relative'>
                                <img src={project.image.src} alt="project" className='w-100 img-fluid' />
                                <div className='action-buttons-wrapper position-absolute bottom-0 end-0 d-inline-flex flex-column gap-1 pe-2 pb-2'>
                                  <button className='border-0 bg-transparent p-0 shadow-none d-in'><img src={heart.src} className='border-0' alt="icon" /></button>
                                  <button className='border-0 bg-transparent p-0 shadow-none'><img src={save.src} className='border-0' alt='icon' /></button>
                                </div>
                              </div>
                              <div className='project-day-card-description my-3 ps-2'>
                                <div className="d-flex justify-content-between gap-2">
                                  <h6 className="text-primary fw-bold">{project.title}</h6>
                                  <div className="d-flex flex-column gap-1">
                                    <span className='badge bg-secondary text-white'>{project.type}</span>
                                    <span className="mt-auto"> <Icons.Eye /> 365</span>
                                  </div>
                                </div>
                              </div>
                              <div className='project-day-card-link'>
                                <p className='pe-2'>MORE DETAILS</p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div> */}
                <div className="tab-pane fade show active" id="v-pills-cad" role="tabpanel" aria-labelledby="v-pills-cad-tab" tabIndex="0">
                  <div className="row g-4">
                    {
                      projects.map((project) => {
                        return (
                          <div className="col-lg-4 col-sm-6" key={project.id}>
                            <div className='project-day-card h-100'>
                              <div className='project-day-card-image mb-3 position-relative'>
                                <img src={project.image.src} alt="project" className='w-100 img-fluid' />
                                <div className='action-buttons-wrapper position-absolute bottom-0 end-0 d-inline-flex flex-column gap-1 pe-2 pb-2'>
                                  <button className='border-0 bg-transparent p-0 shadow-none d-in'><img src={heart.src} className='border-0' alt="icon" /></button>
                                  <button className='border-0 bg-transparent p-0 shadow-none'><img src={save.src} className='border-0' alt='icon' /></button>
                                </div>
                              </div>
                              <div className='project-day-card-description my-3 ps-3'>
                                <div className="d-flex justify-content-between gap-2">
                                  <h6 className="text-primary fw-bold">{project.title}</h6>
                                  <div className="d-flex flex-column gap-1">
                                    <span className='badge bg-secondary text-white'>{project.type}</span>
                                    {/* <span className="mt-auto"> <Icons.Eye /> 365</span> */}
                                  </div>
                                </div>
                              </div>
                              <div className='project-day-card-link'>
                                <p className='pe-2'>MORE DETAILS</p>
                              </div>
                            </div>
                          </div>

                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* <section className="py-3 py-md-4">
        <div className="container">
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="mb-3 mb-md-4 ps-md-3 ps-5 px-xxl-0">
                <SectionHeading subHeading="" mainHeading="Professionals" mainHeadingBold="Similar Profile" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Swiper
                slidesPerView={3}
                spaceBetween={20}
                loop={true}
                arrow={true}
                navigation={true}
                modules={[Autoplay, Navigation]}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  640: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 6,
                    spaceBetween: 30,
                  },
                }}
                className="mySwiper px-md-5 px-4">
                {
                  profiles.map((res,index) => {
                    return (
                      <SwiperSlide key={index}>
                          <div className="text-center">
                            <img src={res.image.src} className="rounded-circle mb-1 mb-md-2 professionals-images" alt="professionals" />
                            <h6 className="text-primary fw-bold text-">{res.title}</h6>
                          </div>
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
            </div>
          </div>
        </div>
      </section> */}
    </Fragment>
  );
}

CompanyProfile.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default CompanyProfile;