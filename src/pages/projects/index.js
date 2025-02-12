import MainLayout from "@/layouts/MainLayout";
import ProjectsLayout from "@/layouts/ProjectsLayout";
import drawing from "@/assets/images/drawing-image.png";
import SectionHeading from "@/components/SectionHeading";
import Pagination from "@/components/Pagination";
import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import Icons from "@/components/Icons";
import { deleteUserProject, getUserProjects } from "@/service/api";
// import api from "@/service/api";
 
const CompletedProjects = () => {

  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  // For simplicity, assume pagination is not implemented on the backend;
  // Otherwise, adjust totalPages/currentPage accordingly.
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = async (page = 1) => {
    try {
      const response = await getUserProjects(page, 10);
      setProjects(response.data.projects);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await deleteUserProject(id);
      setMessage("Project deleted successfully");
      fetchProjects(currentPage);
    } catch (error) {
      console.error("Error deleting project:", error);
      setMessage("Error deleting project");
    }
  };

  const handleEdit = (project) => {
    // For example, redirect to an edit page:
    // router.push(`/projects/edit/${project.id}`);
    console.log("Edit project:", project);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
          {message && <p>{message}</p>}
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
                          {/* <td>Status</td> */}
                          <td>Action</td>
                        </tr>
                      </thead>
                      <tbody>
                      {projects.map((project) => (
                          <tr key={project.id}>
                            <td>
                              <img
                                src={project.photo_url}
                                width={100}
                                alt="project"
                              />
                            </td>
                            <td>{project.title}</td>
                            <td>{project.role}</td>
                            <td>{project.location}</td>
                            <td>{project.keywords}</td>
                            <td>{project.project_type}</td>
                            <td>
                              {/* <button onClick={() => handleEdit(project)} className="btn btn-sm btn-primary me-2">
                                <Icons.Edit />
                              </button> */}
                              <button onClick={() => handleDelete(project.id)} className="btn btn-sm btn-danger">
                                <Icons.Delete />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination  */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            dispatchCurrentPage={handlePageChange}
          />

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




// const tableData = [
//   {
//     drawing: drawing,
//     title: "Architect",
//     role: "Administrator",
//     location: "Ahmedabad",
//     keywords: "Designer",
//     type: "Designer",
//     status: "Complete"
//   },
//   {
//     drawing: drawing,
//     title: "Architect",
//     role: "Administrator",
//     location: "Ahmedabad",
//     keywords: "Designer",
//     type: "Designer",
//     status: "Complete"
//   },
//   {
//     drawing: drawing,
//     title: "Architect",
//     role: "Administrator",
//     location: "Ahmedabad",
//     keywords: "Designer",
//     type: "Designer",
//     status: "Complete"
//   },

// ]