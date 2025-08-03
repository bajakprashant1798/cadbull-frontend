import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading";
import drawing from "@/assets/images/drawing-image.png";
import deleteIcon from "@/assets/icons/delete.png";
import downloadIcon from "@/assets/icons/download.png";
import Pagination from "@/components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import useSessionStorageData from "@/utils/useSessionStorageData";
import { claimCreditsApi, downloadProject, getUploadedProjectList, removeProject } from "@/service/api";
import { addedFavouriteItem, deleteFavouriteItem } from "../../../redux/app/features/projectsSlice";
import { downloadFile } from "@/utils/downloadfile";
import { handledownload } from "@/service/globalfunction";
import { debounce } from "lodash"; // ✅ Import debounce for optimization
import { parse } from 'cookie';
import { toast } from "react-toastify";

const tableData = [
  {
    drawing: drawing,
    id: 256924,
    title: "Fountain and walkway with landscaping design details in AutoCAD, dwg file.",
    fileType: "DWG",
    categories: "Cad Landscaping CAD Blocks & CAD Model",
    subCtegories: "Public garden CAD Blocks & CAD Model",
    status: "Complete",
    earning: "25,263.00"
  },
  {
    drawing: drawing,
    id: 256924,
    title: "Fountain and walkway with landscaping design details in AutoCAD, dwg file.",
    fileType: "DWG",
    categories: "Cad Landscaping CAD Blocks & CAD Model",
    subCtegories: "Public garden CAD Blocks & CAD Model",
    status: "Complete",
    earning: "25,263.00"
  },
  {
    drawing: drawing,
    id: 256924,
    title: "Fountain and walkway with landscaping design details in AutoCAD, dwg file.",
    fileType: "DWG",
    categories: "Cad Landscaping CAD Blocks & CAD Model",
    subCtegories: "Public garden CAD Blocks & CAD Model",
    status: "Complete",
    earning: "25,263.00"
  },
  {
    drawing: drawing,
    id: 256924,
    title: "Fountain and walkway with landscaping design details in AutoCAD, dwg file.",
    fileType: "DWG",
    categories: "Cad Landscaping CAD Blocks & CAD Model",
    subCtegories: "Public garden CAD Blocks & CAD Model",
    status: "Complete",
    earning: "25,263.00"
  },

]


const WorkSent = ({ initialProjects = [], initialTotalPages = 1 }) => {
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated); 
  const { token } = useSelector((store) => store.logininfo);
  const [tableData, setTableData] = useState(initialProjects || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const [removeItemTrigger, setRemoveItemTrigger] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const datas = useSessionStorageData("userData")

  // ✅ Fetch Projects List with Debounce (Optimized API Calls)
  const fetchProjects = debounce((page) => {
    // console.log("Fetching projects for page:", page);
    
    getUploadedProjectList( page, 10)
      .then((res) => {
        if (res?.data?.projects) {
          setTableData(res.data.projects);
          dispatch(addedFavouriteItem(res.data.projects));
          setTotalPages(res.data.totalPages);
          // console.log("Projects fetched successfully:", res.data.projects);
          
        } else {
          setTableData([]); // ✅ Handle empty response
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching projects:", err);
      });
  }, 300); // ✅ Delay API calls by 300ms to prevent excessive requests

  // ✅ Fetch Data on Mount and When `currentPage` Changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects(currentPage);
    }
  }, [isAuthenticated, currentPage]);

  // ✅ Handle Page Change for Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  

  // ✅ Remove Project (Optimized)
  const handleremoveitem = (id) => {
    removeProject( id)
      .then(() => {
        setTableData((prev) => prev.filter((project) => project.id !== id)); // ✅ Only remove deleted project
        dispatch(deleteFavouriteItem(id));
        toast.success("Project removed successfully.", { position: "top-right" });
      })
      .catch((err) => {
        console.error("❌ Error removing project:", err);
      });
  };

  // const handledownload = (id) => {
  //   downloadProject(token, id, router)
  //     .then((res) => {
  //       console.log("download: ",res);
        
  //       const zipUrl = res.data.zip_url;
  //       downloadFile(zipUrl);
  //       downloadHistory(token, id)
  //         .then((res) => {
  //           console.log("download", res.data);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // ✅ ADD THIS NEW HANDLER
  const handleClaimCredits = async (projectId) => {
    try {
      const res = await claimCreditsApi(projectId);
      toast.success(res.data.message);
      // Update the UI locally to hide the button immediately after claiming
      setTableData(prevData =>
        prevData.map(p =>
          p.id === projectId ? { ...p, credit_status: 0 } : p
        )
      );
      // console.log("Credits claimed successfully for project ID:", res);
      
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to claim credits.");
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Work Sent | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      <section className="py-lg-5 py-4 work-sent-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading title={"Work Sent"} description={"Choose from 254195+ Free & Premium CAD Files with new additions published every second month."} />
            </div>
          </div>
          {/* Table  */}
          <div className="row justify-content-center mx-2">
            <div className="col-md-12 form-wrapper rounded-xl p-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <td>Image</td>
                      <td>ID</td>
                      <td>Work Title</td>
                      <td>File Type </td>
                      <td>Categories</td>
                      <td>Sub Categories</td>
                      <td>Status</td>
                      <td>Earning</td>
                      <td>Action</td>
                      <td>Credits</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tableData.map(res => {
                        console.log(res);
                        
                        return (
                          <tr key={res.id}>
                            <td><img src={res.thumbnail_url} width={100} className="table-image" alt="drawing" /></td>
                            <td>{res.id}</td>
                            <td>
                              <div className="title-wrapper">
                                {res.work_title}
                              </div>
                            </td>
                            <td>{res.file_type}</td>
                            <td>
                              <div className="title-wrapper">{res.project_category_title}</div>
                            </td>
                            <td>
                              <div className="title-wrapper">
                                {res.project_sub_category_title}
                              </div></td>
                            <td>
                              {res.status === "1" ? (
                                <p className="text-success">Approved</p>
                              ) : res.status === "2" ? (
                                <p className="text-danger">Rejected</p>
                              ) : (
                                <p className="text-warning">Pending</p>
                              )}
                            </td>
                            <td>
                            {res.status === "1" ? (
                              <p className="text-success">$0.25</p>
                            ) : (
                              <p className="text-danger">$0</p>
                            )}
                            </td>
                            <td>
                              {!res.is_approved && 
                                <div className="d-inline-flex gap-2">  
                                  <button type="button" onClick={() => handledownload(res.id, isAuthenticated,router)} className="link-btn bg-success p-2 rounded">
                                    {/* <img src={downloadIcon.src} alt="download" /> */}
                                    <Icons.Download />
                                  </button>
                                  <button type="button" onClick={() => handleremoveitem(res.id)} className="link-btn bg-light p-2 rounded"> 
                                    {/* <img src={deleteIcon.src} alt="delete" /> */}
                                    <Icons.Delete />
                                  </button>
                                </div>
                              }
                            </td>

                            <td>
                              {res.credit_days > 0 ? (
                                // Case 1: Credit days have been granted
                                res.credit_status == 1 ? ( // Use == to handle "1" vs 1
                                  // A) Credits are UNUSED (status is 1) -> Show Button
                                  <button
                                    onClick={() => handleClaimCredits(res.id)}
                                    className="btn btn-sm btn-success"
                                  >
                                    Claim {res.credit_days} Days
                                  </button>
                                ) : (
                                  // B) Credits are USED (status is 0) -> Show Badge
                                  <span className="badge bg-secondary">Claimed</span>
                                )
                              ) : (
                                // Case 2: No credits were ever granted
                                <span className="text-muted small">No Credits</span>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    }

                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Pagination */}
          {/* ✅ Pagination with working state updates */}
          {/* <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            dispatchCurrentPage={setCurrentPage}
          /> */}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            dispatchCurrentPage={setCurrentPage}
          />

        </div>
      </section>
    </Fragment >
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  const accessToken = cookies.accessToken;

  if (!accessToken) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await getUploadedProjectList(1, 10); // Page 1, 10 items
    return {
      props: {
        accessToken,
        initialProjects: response.data.projects,
        initialTotalPages: response.data.totalPages || 1,
      },
    };
  } catch (err) {
    return {
      props: {
        accessToken,
        initialProjects: [],
        initialTotalPages: 1,
      },
    };
  }
}


WorkSent.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default WorkSent;