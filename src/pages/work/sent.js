import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment } from "react";
import PageHeading from "@/components/PageHeading";
import drawing from "@/assets/images/drawing-image.png";
import deleteIcon from "@/assets/icons/delete.png";
import downloadIcon from "@/assets/icons/download.png";
import Pagination from "@/components/Pagination";


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
                        return (
                          <tr key={res.id}>
                            <td><img src={res.drawing.src} width={100} className="table-image" alt="drawing" /></td>
                            <td>{res.id}</td>
                            <td>
                              <div className="title-wrapper">
                                {res.title}
                              </div>
                            </td>
                            <td>{res.fileType}</td>
                            <td>
                              <div className="title-wrapper">{res.categories}</div>
                            </td>
                            <td>
                              <div className="title-wrapper">
                                {res.subCtegories}
                              </div></td>
                            <td>{res.status}</td>
                            <td>{res.earning}</td>
                            <td>
                              <div className="d-inline-flex gap-2">
                                <button type="button" className="link-btn"><img src={downloadIcon.src} alt="download" /></button>
                                <button type="button" className="link-btn"> <img src={deleteIcon.src} alt="delete" /></button>
                              </div>
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