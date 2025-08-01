import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading";
import deleteIcon from "@/assets/icons/delete.png";
import {
  getUploadedProjectList,
  removeProject,
} from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addedFavouriteItem,
  deleteFavouriteItem,
} from "../../redux/app/features/projectsSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useSessionStorageData from "@/utils/useSessionStorageData";
import withAuth from "@/HOC/withAuth";



const myProjects = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removeItemTrigger, setRemoveItemTrigger] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const datas = useSessionStorageData("userData")

  useEffect(() => {
    if (!tableData || tableData.length === 0) { // ✅ Additional check
        getUploadedProjectList( 1, 10)
        .then((res) => {
          console.log("my-projects: ", res);
          if (Array.isArray(res.data.projects)) {
            setTableData(res.data.projects);
          } else {
            setTableData([]); // ✅ Fallback to empty array
          }
          dispatch(addedFavouriteItem(res.data.projects));
          setCurrentPage(res.data.currentPage);
          setTotalPages(res.data.totalPages);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tableData,isAuthenticated, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTableData([]); // Clear previous data before fetching new
  };
  

  const handleremoveitem = (id) => {
    removeProject( id)
      .then((res) => {
        // ✅ Remove only the deleted project from state instead of clearing everything
        // setTableData(tableData.filter(project => project.id !== id));
        // toast.success("Project removed successfully.", { position: "top-right" });
        setTableData([]);
        setRemoveItemTrigger(removeItemTrigger + 1);
        dispatch(deleteFavouriteItem(id));
        toast.success("Removed Favourite list", { position: "top-right" });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <Fragment>
      <Head>
        <title>my-projects | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      <section className="py-lg-5 py-4 favourites-page">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-12">
              <PageHeading
                title={"My Projects"}
                description={
                  "Choose from 254195+ Free & Premium CAD Files with new additions published every second month "
                }
              />
            </div>
          </div>
            {
              tableData.length == 0 ?(
                <>

                <div className="text-center">
                <button onClick={()=>router.push("/work/upload")}   className="btn btn-lg btn-secondary w-50">
                
                add your 1st Project here
                </button>
                </div>
    
                  
                
                </>
              ):(
                <>
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
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((res) => {
                      return (
                        <tr key={res.id}>
                          <td>
                            <img
                              src={res.thumbnail_url}
                              alt="drawing"
                              className="img-fluid"
                            />
                          </td>

                          <td>{res.id}</td>
                          <td>
                            <div className="title-wrapper">
                              {res.work_title}
                            </div>
                          </td>
                          <td>{res.file_type}</td>

                          <td>
                            <div className="title-wrapper">
                              {res.project_category_title}
                              {console.log("project_category: ", res)}
                            </div>
                          </td>
                          <td>
                            <div className="title-wrapper">
                              {res.project_sub_category_title}
                            </div>
                          </td>
                          <td>
                            <div className="title-wrapper">
                            {res.status === "1" ? (
                                <p className="text-success">Approved</p>
                            ) : res.status === "2" ? (
                                <p className="text-danger">Rejected</p>
                            ) : (
                                <p className="text-warning">Pending</p>
                            )}
                            </div>
                          </td>
                          <td>
                           {!res.is_approved &&  <div className="d-inline-flex gap-2">
                              
                              <button
                                onClick={() => handleremoveitem(res.id)}
                                type="button"
                                className="link-btn"
                              
                              >
                                {" "}
                                <img src={deleteIcon.src} alt="delete" />
                              </button>
                            </div>}
                          </td>
                    
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
              
          {/* <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
          /> */}
          </> 
          )}       
        </div>
      </section>
    </Fragment>
  );
};

myProjects.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuth(myProjects);
