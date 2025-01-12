import MainLayout from "@/layouts/MainLayout";
import ProjectsLayout from "@/layouts/ProjectsLayout";
import drawing from "@/assets/images/drawing-image.png";
import SectionHeading from "@/components/SectionHeading";
import Pagination from "@/components/Pagination";
import { Fragment } from "react";
import Head from "next/head";
const tableData = [
  {
    drawing: drawing,
    title: "Architect",
    role: "Administrator",
    location: "Ahmedabad",
    keywords: "Designer",
    type: "Designer",
    status: "Complete"
  },
  {
    drawing: drawing,
    title: "Architect",
    role: "Administrator",
    location: "Ahmedabad",
    keywords: "Designer",
    type: "Designer",
    status: "Complete"
  },
  {
    drawing: drawing,
    title: "Architect",
    role: "Administrator",
    location: "Ahmedabad",
    keywords: "Designer",
    type: "Designer",
    status: "Complete"
  },

]


const CompletedProjects = () => {
  return (
    <Fragment>
      <Head>
        <title>Projects | Cadbull </title>
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
          <div className="row mx-2">
            <div className="col-md-12">
              <div className="row justify-content-center">
                <div className="col-md-12 form-wrapper rounded-xl p-0 overflow-hidden">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                      <thead>
                        <tr>
                          <td>Image</td>
                          <td>Title</td>
                          <td>Role</td>
                          <td>Location</td>
                          <td>Keywords</td>
                          <td>Type</td>
                          <td>Status</td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          tableData.map(res => {
                            return (
                              <tr key={res.id}>
                                <td><img src={res.drawing.src} width={100} className="table-image" alt="drawing" /></td>
                                <td>

                                  {res.title}
                                </td>
                                <td>{res.role}</td>
                                <td>
                                  {res.location}
                                </td>
                                <td>
                                  {res.keywords}
                                </td>
                                <td>{res.type}</td>
                                <td>{res.status}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination  */}
          <Pagination />
        </div>
      </ProjectsLayout>
    </Fragment >
  );
}

CompletedProjects.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default CompletedProjects;