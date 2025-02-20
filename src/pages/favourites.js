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
import {
  addFavouriteItem,
  downloadHistory,
  downloadProject,
  getFavouriteItems,
  removeFavouriteItem,
  useFileDownloader,
} from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addedFavouriteItem,
  deleteFavouriteItem,
} from "../../redux/app/features/projectsSlice";
import { downloadFile } from "@/utils/downloadfile";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import withAuth from "@/HOC/withAuth";
import { handledownload } from "@/service/globalfunction";

// {
//   drawing: drawing,
//   id: 256924,
//   title: "Fountain and walkway with landscaping design details in AutoCAD, dwg file.",
//   fileType: "DWG",
//   categories: "Cad Landscaping CAD Blocks & CAD Model",
//   subCtegories: "Public garden CAD Blocks & CAD Model",
// }

const Favourites = () => {
  const { token } = useSelector((store) => store.logininfo);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removeItemTrigger, setRemoveItemTrigger] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!tableData || tableData.length === 0) { // ✅ Additional check
      getFavouriteItems(token)
        .then((res) => {
          setTableData(res.data.favorites);
          console.log(res);
          
          dispatch(addedFavouriteItem(res.data.favorites));
          setCurrentPage(res.data.currentPage);
          setTotalPages(res.data.totalPages);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tableData]);

  const handleremoveitem = (id) => {
    console.log(id);
    
    removeFavouriteItem(token, id)
      .then((res) => {
        setTableData([]);
        setRemoveItemTrigger(removeItemTrigger + 1);
        dispatch(deleteFavouriteItem(id));
        toast.success("Removed Favourite list");
       
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setTableData([]); // Clear previous data before fetching new
  };

  // const handledownload = (id) => {
  //   downloadProject(token, id)
  //     .then((res) => {
  //       const zipUrl = res.data.zip_url;
  //       console.log("zipUrl", zipUrl, res);
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
        <title>Favourites | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      <section className="py-lg-5 py-4 favourites-page">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-12">
              <PageHeading
                title={"Favourites"}
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
                <button onClick={()=>router.push("/")}   className="btn btn-lg btn-secondary w-50">
                
                add your 1st favourite item
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
                            </div>
                          </td>
                          <td>
                            <div className="title-wrapper">
                              {res.project_sub_category_title}
                            </div>
                          </td>
                          <td>
                            <div className="d-inline-flex gap-2">
                              <button
                                onClick={() => handledownload(res.id,token, router)}
                                type="button"
                                className="link-btn bg-success p-2 rounded"
                              >
                                {/* <img src={downloadIcon.src} alt="download" /> */}
                                <Icons.Download />
                              </button>
                              <button
                                onClick={() => handleremoveitem(res.id)}
                                type="button"
                                className="link-btn bg-light p-2 rounded"
                              >
                                {" "}
                                <Icons.Delete />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
              
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
          />
          </> 
          )}       
        </div>
      </section>
    </Fragment>
  );
};

Favourites.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuth(Favourites);
