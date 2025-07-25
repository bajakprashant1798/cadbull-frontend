import MainLayout from "@/layouts/MainLayout";
import { Fragment } from "react";
import Head from "next/head";
import about from "@/assets/images/about-us.png"
import aboutmobile from "@/assets/images/about-mobile.png"
import logo from "@/assets/images/logo.png";

const About = () => {
  return (
    <Fragment>
      <Head>
        <title>About Cadbull | High-Quality AutoCAD Files for Architecture & Design</title>
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/about-us`} />
        <meta name="description" content="Learn about the leading online platform offering free AutoCAD DWG files for architects, engineers. Explore thousands of CAD drawings across categories." />

        <meta property="og:title" content="About Cadbull | High-Quality AutoCAD Files for Architecture & Design" />
        <meta property="og:description" content="Learn about the leading online platform offering free AutoCAD DWG files for architects, engineers. Explore thousands of CAD drawings across categories." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/about-us`} />
        <meta property="og:image" content={logo} />
        <meta name="twitter:title" content="About Cadbull | High-Quality AutoCAD Files for Architecture & Design" />
        <meta name="twitter:description" content="Learn about the leading online platform offering free AutoCAD DWG files for architects, engineers. Explore thousands of CAD drawings across categories." />
        <meta name="twitter:image" content={logo} />
        <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad furniture" />
      </Head>
      {/* py-md-4 removed from below classname */}
      <section className="bg-light py-5  category-page company-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="text-center">
                <h3 className="text-primary fw-bold mb-2">Impress Your Imagination</h3>
                <p>Imagination and technological prowess to create something radical so that an idea is worth executing.</p>
              </div>
            </div>
          </div>
        </div >
      </section >

      <section className="py-4">
        <div className="container">
          <div className="row mx-1 mb-5 shadow-sm p-3 p-md-5 rounded-5 justify-content-center border position-relative bg-white">
            <div className="col-md-10">
              <div className="text-center">
                <h4 className="text-secondary fw-semibold mb-2">Join us to make the <span className="text-danger">world</span> a better and more <span className="text-danger">beautiful</span> place.</h4>
                <p className="fw-medium mb-3">Imagination and technological prowess to create something radical so that an idea is worth executing. Welcome to creative world of cadbull.com, a complete forum to keep you up-date with the prompt cad solution. Cadbull is platform to bring together cad community to work, showcase and explore new boundaries in architectural design world. Upload your projects and get gold account credits*.</p>
              </div>
            </div>
            <div className="col-md-9">
            <div className="text-center">
                {/* <img src={about.src} className="img-fluid d-md-inline d-none" alt="about" /> */}
                {/* <img src={aboutmobile.src} className="img-fluid d-inline d-md-none mt-4" alt="about" /> */}

                <section class="about-statistics py-5">
                  <div class="container">
                    <div class="row justify-content-center">
                      <div class="col-md-12">
                        <div class="statistics-wrapper d-flex flex-wrap justify-content-center text-center">
                          <div class="stat-item">
                            <div class="stat-circle">
                              <h3>300K+</h3>
                              <p>Downloadable Files</p>
                            </div>
                          </div>
                          <div class="stat-item">
                            <div class="stat-circle">
                              <h3>2.5M+</h3>
                              <p>Registered Users</p>
                            </div>
                          </div>
                          <div class="stat-item">
                            <div class="stat-circle">
                              <h3>700K+</h3>
                              <p>Visits Each Month</p>
                            </div>
                          </div>
                          <div class="stat-item">
                            <div class="stat-circle">
                              <h3>100M+</h3>
                              <p>Total Visits Since Launch</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
            </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                <h5 className="mb-3 text-black fw-medium text-uppercase">Interact with online 2D and 3D artist community.</h5>
                <p className="mb-3 fw-medium">Sign-up for free and create your account, start showcasing your work. You can also subscribe all the files by choosing different flexible subscription package. Create your account and start fast and easy access to thousand cad files.
                </p>
                <p className="mb-3 fw-medium"> Cadbull help people create profile, interact with creative auto cad designer communities and passion. The curiosity all things happening around so that they can happen too with the crafting touch of creative mad Cadbull. Cadbull creative community interact with auto cad, 3d drawing, architecture, blocks, electrical, furniture, interior design, machinery, blocks, landscaping, structure detail, urban design and more.</p>
                <p className="fw-medium">Along the way, you can create, build and establish along with mad amount of fresh, out-of-box, bold that besotted by the power of creative ideas. Let’s craft and create a better perspective that help you to mark a true impression.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment >
  );
}

About.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}

export async function getStaticProps() {
  // No dynamic data to fetch, but enabling SSG + ISR
  return {
    props: {},         // You can add props later if needed
    revalidate: 300,   // Regenerate page every 5 minutes
  };
}

// export async function getStaticProps() {
//   // No dynamic data to fetch here – you can return an empty props object.
//   // Optionally, you could fetch data that rarely changes (e.g. team info).
//   return {
//     props: {},
//     revalidate: 300, // Revalidate every 5 minutes if needed
//   };
// }

export default About;