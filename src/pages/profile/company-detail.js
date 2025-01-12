import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment } from "react";
import profile from "@/assets/images/profile-arch.png"
import project from "@/assets/images/blog-1.png";
import SectionHeading from "@/components/SectionHeading";
import banner from "@/assets/images/banner.png"
import banner3 from "@/assets/images/banner-3.png"
import slide from "@/assets/images/slide-image.png"
import Architects from "@/assets/icons/company-profile/Architects.png"
import servies from "@/assets/icons/company-profile/servies.png"
import Year from "@/assets/icons/company-profile/Year.png"
import Photographs from "@/assets/icons/company-profile/Photographs.png"
import Manufacturers from "@/assets/icons/company-profile/Manufacturers.png"
import Engineering from "@/assets/icons/company-profile/Engineering.png"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Navigation } from 'swiper/modules';
import ConsultModal from "@/components/ConsultModal";
import PageHeading from "@/components/PageHeading";

const images = [
  {
    image: slide,
  },
  {
    image: slide,
  },
  {
    image: slide,
  },
  {
    image: slide,
  },
  {
    image: slide,
  },
  {
    image: slide,
  },
  {
    image: slide,
  },
  {
    image: slide,
  },
  {
    image: slide,
  },
  {
    image: slide,
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

const CompanyDetail = () => {
  return (
    <Fragment>
      <Head>
        <title>Company Profile | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      <section className="py-md-5 py-3 company-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading title={"BEEAH Headquarters / Zaha Hadid Architects"} description={"Curated by Paula Pintos"} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mb-3 mb-md-4">
                <img src={banner.src} className="w-100 object-fit-cover rounded-4" height={300} alt="banner" />
              </div>

              <Swiper
                slidesPerView={4}
                spaceBetween={10}
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
                    slidesPerView: 3,
                    spaceBetween: 25,
                  },
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                  },
                }}
                className="mySwiper px-md-5 px-4 mb-4">
                {
                  images.map((res,index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div>
                          <div className="text-center slider-image">
                            <img src={res.image.src} className="rounded-4 w-100 mb-2 object-fit-cover" alt="image" />
                          </div>
                        </div>
                      </SwiperSlide>
                    )
                  })
                }
              </Swiper>
              <div className="row mb-3 mb-md-4 gy-4 gy-md-3">
                <div className="col-md-12">
                  <div className="mb-4">
                    <h5><span className="text-primary fw-semibold">OFFICE BUILDINGS</span> SHARJAH, UNITED ARAB EMIRATES</h5>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-5 col-md-6">
                  <div className="d-flex flex-column gap-3">
                    {/* 1  */}
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <img src={Architects.src} width={50} height={50} className="img-fluid drop-shadow rounded-circle object-fit-cover" alt="icon" />
                      <div>
                        <p className="text-grey mb-0 fw-fw-medium lh-sm">Architects :
                        </p>
                        <h6 className="text-primary m-0 fw-semibold">Zaha Hadid Architects</h6>
                      </div>
                    </div>
                    {/* 2 */}
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <img src={Year.src} width={50} height={50} className="img-fluid drop-shadow rounded-circle object-fit-cover" alt="icon" />
                      <div>
                        <p className="text-grey mb-0 fw-fw-medium lh-sm">Year :
                        </p>
                        <h6 className="text-primary m-0 fw-semibold">Zaha Hadid Architects</h6>
                      </div>
                    </div>
                    {/* 3 */}
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <img src={Photographs.src} width={50} height={50} className="img-fluid drop-shadow rounded-circle object-fit-cover" alt="icon" />
                      <div>
                        <p className="text-grey mb-0 fw-fw-medium lh-sm">Photographs :
                        </p>
                        <h6 className="text-primary m-0 fw-semibold">Zaha Hadid Architects</h6>
                      </div>
                    </div>
                    {/* 4 */}
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <img src={Manufacturers.src} width={50} height={50} className="img-fluid drop-shadow rounded-circle object-fit-cover" alt="icon" />
                      <div>
                        <p className="text-grey mb-0 fw-fw-medium lh-sm">Manufacturers :
                        </p>
                        <h6 className="text-primary m-0 fw-semibold">Zaha Hadid Architects</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-7 col-md-6">
                  <div>
                    <div className="d-flex gap-1 align-items-start">
                      <img src={Engineering.src} width={50} height={50} className="img-fluid drop-shadow rounded-circle object-fit-cover" alt="icon" />
                      {/* 1 */}
                      <div>
                        <div className="mb-4">
                          <p className="text-grey mb-0 fw-fw-medium lh-sm">Structural Engineering :
                          </p>
                          <h6 className="text-primary m-0 fw-semibold">Buro Happold</h6>
                        </div>
                        <div className="row row-cols-2 gy-4 mt-3">
                          {/* 2.1  */}
                          <div className="border-start border-danger border-3">
                            <p className="text-grey mb-0 fw-fw-medium lh-sm">Acoustics :
                            </p>
                            <h6 className="text-primary m-0 fw-semibold">Buro Happold</h6>
                          </div>
                          {/* 2.2  */}
                          <div className="border-start border-danger border-3">
                            <p className="text-grey mb-0 fw-fw-medium lh-sm">Civil Engineering :
                            </p>
                            <h6 className="text-primary m-0 fw-semibold">Buro Happold</h6>
                          </div>
                          {/* 2.3  */}
                          <div className="border-start border-danger border-3">
                            <p className="text-grey mb-0 fw-fw-medium lh-sm">Civil Engineering :
                            </p>
                            <h6 className="text-primary m-0 fw-semibold">Buro Happold</h6>
                          </div>
                          {/* 2.4  */}
                          <div className="border-start border-danger border-3">
                            <p className="text-grey mb-0 fw-fw-medium lh-sm">Civil Engineering :
                            </p>
                            <h6 className="text-primary m-0 fw-semibold">Buro Happold</h6>
                          </div>
                          {/* 2.5  */}
                          <div className="border-start border-danger border-3">
                            <p className="text-grey mb-0 fw-fw-medium lh-sm">Civil Engineering :
                            </p>
                            <h6 className="text-primary m-0 fw-semibold">Buro Happold</h6>
                          </div>
                          {/* 2.6  */}
                          <div className="border-start border-danger border-3">
                            <p className="text-grey mb-0 fw-fw-medium lh-sm">Civil Engineering :
                            </p>
                            <h6 className="text-primary m-0 fw-semibold">Buro Happold</h6>
                          </div>
                          {/* 2.7  */}
                          <div className="border-start border-danger border-3">
                            <p className="text-grey mb-0 fw-fw-medium lh-sm">Civil Engineering :
                            </p>
                            <h6 className="text-primary m-0 fw-semibold">Buro Happold</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-12 col-md-12">
                  <div>
                    <div className="d-flex gap-2 align-items-start">
                      <img src={Manufacturers.src} width={50} height={50} className="img-fluid drop-shadow rounded-circle object-fit-cover" alt="icon" />
                      <div>
                        <h6 className="text-primary m-0 fw-semibold">Products used in this Project</h6>
                        <div className="my-3">
                          <img src={servies.src} className="img-fluid rounded-3 w-100 object-fit-cover" height={250} alt="img" />
                        </div>
                        <p className="text-primary m-0 fw-semibold">Mineral Concrete Stain - Concretal®-Lasur | KEIM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <img src={banner3.src} className="w-100 object-fit-cover rounded-4 info-image" alt="banner" />
              </div>

            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="bg-white shadow-sm pe-2 pe-md-5 px-5 py-4 py-md-3 rounded-1 border-start border-5 border-start-primary">
                <div className="px-3">
                  <SectionHeading mainHeading={""} subHeading={" "} mainHeadingBold={"Description"} />
                  <p>This architectural drawing is a 2D block of garden benches in AutoCAD drawing, CAD file, and dwg file. For more details and information download the drawing file. Thank you for visiting our website cadbull.com.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      <section className="pb-4 pb-md-5">
        <div className="container">
          <div className="row mb-md-5 mb-4">
            <div className="col-md-12">
              <div className="ps-5 ps-xxl-0">
                <SectionHeading subHeading="" mainHeading="Project" mainHeadingBold="location" />
              </div>
            </div>
          </div>
          <div className="row gy-4">
            <div className="col-md-6">
              <div className="h-100">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30771532.608255956!2d61.100352727251355!3d19.70024819710164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1689752159777!5m2!1sen!2sin" height="220" className="rounded-3 w-100" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-md-4 p-3 rounded-3 w-100 border border-secondary h-100 d-flex align-items-start align-items-center justify-content-lg-between gap-3">
                <div>
                  <img src={profile.src} className="rounded-circle object-fit-cover company-logo-info" alt="profile" />
                </div>
               <div className="d-flex flex-column flex-lg-row gap-3">
                  <div>
                    <h4 className="text-primary fw-semibold">Zaha Hadid Architects</h4>
                    <p>Architecture Office· London, United Kingdom</p>
                  </div>
                  <div>
                    <button type="button" className="btn-profile active">Follow</button>
                  </div>
               </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment >
  );
}

CompanyDetail.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default CompanyDetail;