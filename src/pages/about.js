import MainLayout from "@/layouts/MainLayout";
import { Fragment } from "react";
import Head from "next/head";
import about from "@/assets/images/about-us.png"
import aboutmobile from "@/assets/images/about-mobile.png"

const About = () => {
  return (
    <Fragment>
      <Head>
        <title>About Us | Cadbull</title>
        <meta name="description" content="Impress Your Imagination with Cadbull." />
      </Head>
      <section className="bg-light py-3 py-md-4 category-page company-page">
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
                <img src={about.src} className="img-fluid d-md-inline d-none" alt="about" />
                <img src={aboutmobile.src} className="img-fluid d-inline d-md-none mt-4" alt="about" />
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

// export async function getStaticProps() {
//   // No dynamic data to fetch here – you can return an empty props object.
//   // Optionally, you could fetch data that rarely changes (e.g. team info).
//   return {
//     props: {},
//     revalidate: 300, // Revalidate every 5 minutes if needed
//   };
// }


export default About;