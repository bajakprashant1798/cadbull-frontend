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
import { downloadProject, getUploadedProjectList, removeProject } from "@/service/api";
import { addedFavouriteItem } from "../../../redux/app/features/projectsSlice";
import { downloadFile } from "@/utils/downloadfile";
import { handledownload } from "@/service/globalfunction";


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


const WorkSent = () => {

  const { token } = useSelector((store) => store.logininfo);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removeItemTrigger, setRemoveItemTrigger] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const datas = useSessionStorageData("userData")

  useEffect(() => {
    if (!tableData || tableData.length === 0) { // ✅ Additional check
        getUploadedProjectList(token, 1, 10)
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
  }, [tableData,token, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTableData([]); // Clear previous data before fetching new
  };
  

  const handleremoveitem = (id) => {
    removeProject(token, id)
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
                                  <button type="button" onClick={() => handledownload(res.id, token,router)} className="link-btn"><img src={downloadIcon.src} alt="download" /></button>
                                  <button type="button" onClick={() => handleremoveitem(res.id)} className="link-btn"> <img src={deleteIcon.src} alt="delete" /></button>
                                </div>
                              }
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
          <Pagination />
        </div>
      </section>
    </Fragment >
  );
}

WorkSent.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default WorkSent;