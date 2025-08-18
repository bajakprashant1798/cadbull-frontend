import MainLayout from "@/layouts/MainLayout";
import ProjectsLayout from "@/layouts/ProjectsLayout";
// import drawing from "@/assets/images/drawing-image.png";
import SectionHeading from "@/components/SectionHeading";
import Pagination from "@/components/Pagination";
import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import Icons from "@/components/Icons";
import { deleteUserProject, getUserProjects } from "@/service/api";
import withAuth from "@/HOC/withAuth";
import { performance } from "@/utils/performance";
// import api from "@/service/api";

const CompletedProjects = ({ initialProjects, totalPages: initialTotalPages, }) => {

  const [projects, setProjects] = useState(initialProjects || []);
  const [message, setMessage] = useState("");
  // For simplicity, assume pagination is not implemented on the backend;
  // Otherwise, adjust totalPages/currentPage accordingly.
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);

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
    if (currentPage === 1) return; // Already loaded via SSR
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
    // console.log("Edit project:", project);
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
      <ProjectsLayout refreshProjects={() => fetchProjects(currentPage)}>
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
                                src={project.photo_url && project.photo_url.trim() !== '' ? project.photo_url : '/assets/images/product.jpg'}
                                width={100}
                                alt={project.title || "project"}
                                onError={(e) => { e.target.src = '/assets/images/product.jpg' }}
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
                              <button onClick={() => handleDelete(project.id)} className="link-btn">
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
            onPageChange={handlePageChange}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            dispatchCurrentPage={handlePageChange}
          />

        </div>
      </ProjectsLayout>
    </Fragment >
  );
}

export async function getServerSideProps(context) {
  // ✅ PERFORMANCE MONITORING: Track user projects page generation
  return await performance.trackPagePerformance(
    "UserProjectsPage-SSR",
    { 
      pageType: "SSR", 
      isSSR: true, 
      userAgent: context.req?.headers?.['user-agent'] || "unknown",
    },
    async () => {
      performance.logMemoryUsage("UserProjects-Start");

      try {
        // ✅ Track user projects API call with performance monitoring
        const response = await performance.timeAPICall(
          "GetUserProjects", 
          () => getUserProjects(1, 10),
          "userProjects?page=1&limit=10"
        );

        performance.logMemoryUsage("UserProjects-AfterAPI", { 
          projectsCount: response.data?.projects?.length || 0
        });

        const projectsCount = response.data?.projects?.length || 0;

        // ✅ Log cost-generating event for SSR
        performance.logCostEvent("SSR-Generation", {
          page: "UserProjectsPage",
          projectsCount,
        });

        // ✅ Generate performance summary
        const timings = { userProjectsAPI: 100, total: 100 }; // Placeholder - would be real in production
        performance.generateSummary("UserProjectsPage-SSR", timings);

        return {
          props: {
            initialProjects: response.data.projects,
            totalPages: response.data.totalPages || 1,
          },
        };
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
        return {
          props: {
            initialProjects: [],
            totalPages: 1,
          },
        };
      }
    }
  );
}


CompletedProjects.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


// export default CompletedProjects;
export default withAuth(CompletedProjects); // or AddProjects
