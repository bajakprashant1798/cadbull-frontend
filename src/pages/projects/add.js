import MainLayout from "@/layouts/MainLayout";
import ProjectsLayout from "@/layouts/ProjectsLayout";
import drawing from "@/assets/icons/company-profile/servies.png";
import SectionHeading from "@/components/SectionHeading";
import Pagination from "@/components/Pagination";
import { Fragment } from "react";
import Head from "next/head";
import premium from "@/assets/icons/premium.png";
import save from "@/assets/icons/save.png";
import heart from "@/assets/icons/heart.png";
import Icons from "@/components/Icons";


const projects = [
  {
    id: 1,
    image: drawing,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369,
    url: '/categories/view/1'
  },
  {
    id: 2,
    image: drawing,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369, url: '/categories/view/1'
  },
  {
    id: 3,
    image: drawing,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369,
    url: '/categories/view/1'
  },
  {
    id: 4,
    image: drawing,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369, url: '/categories/view/1'
  },
  {
    id: 5,
    image: drawing,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369, url: '/categories/view/1'
  },
  {
    id: 6,
    image: drawing,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369, url: '/categories/view/1'
  }
]


const AddProjects = () => {
  return (
    <Fragment>
      <Head>
        <title>Add Projects | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <ProjectsLayout>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="mb-4 mb-md-5 ps-5">
                <SectionHeading subHeading={""} mainHeading={"Completed"} mainHeadingBold={"Projects."}  />
              </div>
            </div>
          </div>
          <div className="row g-4">
            {
              projects.map((project,index) => {
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
                    </div>
                  </div>
                )
              })
            }
          </div>

          {/* Pagination  */}
          <Pagination />
        </div>
      </ProjectsLayout>
    </Fragment>
  );
}

AddProjects.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default AddProjects;