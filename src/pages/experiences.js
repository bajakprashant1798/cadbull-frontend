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
import SectionHeading from "@/components/SectionHeading";

const tableData = [
  {
    id: 1,
    date: "21 Fab, 2023",
    name: "EleNatioN LLP (Hiren Panchal)",
    email: "eleNation.llp@gmail.com",
    type: "Online Transfer in Bank Of Baroda",
    price: "25,256.00",
  },
  {
    id: 2,
    date: "21 Fab, 2023",
    name: "EleNatioN LLP (Hiren Panchal)",
    email: "eleNation.llp@gmail.com",
    type: "Online Transfer in Bank Of Baroda",
    price: "25,256.00",
  },
  {
    id: 3,
    date: "21 Fab, 2023",
    name: "EleNatioN LLP (Hiren Panchal)",
    email: "eleNation.llp@gmail.com",
    type: "Online Transfer in Bank Of Baroda",
    price: "25,256.00",
  },
  {
    id: 4,
    date: "21 Fab, 2023",
    name: "EleNatioN LLP (Hiren Panchal)",
    email: "eleNation.llp@gmail.com",
    type: "Online Transfer in Bank Of Baroda",
    price: "25,256.00",
  },
  {
    id: 5,
    date: "21 Fab, 2023",
    name: "EleNatioN LLP (Hiren Panchal)",
    email: "eleNation.llp@gmail.com",
    type: "Online Transfer in Bank Of Baroda",
    price: "25,256.00",
  },
]


const Experiences = () => {
  return (
    <Fragment>
      <Head>
        <title>Experiences | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      <section className="py-lg-5 py-4 experience-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading title={"Experiences"} description={"Choose from 254195+ Free & Premium CAD Files with new additions published every second month"} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <form>
                <div className="form-wrapper rounded-xxl p-3 p-md-5">
                  <div className="row g-3">
                    {/* Add Experience */}
                    <div className="col-lg-12">
                      <div className="mt-3">
                        <h5 className="text-primary">Add <span className="fw-bold">Experience</span></h5>
                      </div>
                    </div>
                    {/* Company */}
                    <div className="col-md-6 col-lg-6">
                      <div>
                        <label>Company</label>
                      </div>
                      <input type="text" className="form-control" placeholder="Enter Your Company" value="" />
                    </div>
                    {/* Occupation */}
                    <div className="col-md-6 col-lg-6">
                      <div>
                        <label>Occupation</label>
                      </div>
                      <select defaultValue="Occupation 3" className="form-select" aria-label="City">
                        <option value="0">Select Occupation</option>
                        <option value="1">Occupation 1</option>
                        <option value="2">Occupation 2</option>
                        <option value="3">Occupation 3</option>
                      </select>
                    </div>
                    {/* From */}
                    <div className="col-md-6 col-lg-6">
                      <div>
                        <label>From</label>
                      </div>
                      <input type="date" className="form-control" placeholder="Enter From Date" value="" />
                    </div>
                    {/* To */}
                    <div className="col-md-6 col-lg-6">
                      <div>
                        <label>To</label>
                      </div>
                      <input type="date" className="form-control" placeholder="Enter To Date" value="" />
                    </div>
                    {/* Occupation */}
                    <div className="col-md-6 col-lg-6">
                      <div>
                        <label>Occupation</label>
                      </div>
                      <select defaultValue="Architect" className="form-select" aria-label="State">
                        <option value="0">Select Occupation</option>
                        <option value="1">Architect</option>
                        <option value="2">Designer</option>
                      </select>
                    </div>
                    {/* Post */}
                    <div className="col-md-6 col-lg-6">
                      <div>
                        <label>Post</label>
                      </div>
                      <input type="text" className="form-control" placeholder="Enter Your Post" value="" />
                    </div>
                    {/* Button  */}
                    <div className="col-12 col-md-4 col-lg-3 col-xl-2 form-button-group">
                      <div className="mt-2 mt-md-3">
                        <button type="submit" className="btn btn-secondary rounded-2 w-100">Add Experience</button>
                      </div>
                    </div>
                  </div>
                </div>


              </form>
            </div>
          </div>

        </div>
      </section>

      <section className="py-3 py-md-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="mb-4 mb-md-5 ps-5">
                <SectionHeading subHeading="" mainHeading="Current" mainHeadingBold="Experiences" />
              </div>
            </div>
          </div>
          {/* Table  */}
          <div className="row justify-content-center mx-2">
            <div className="col-md-12 form-wrapper rounded-xl p-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <td>Date</td>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Type</td>
                      <td>Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tableData.map(res => {
                        return (
                          <tr key={res.id}>
                            <td>{res.date}</td>
                            <td>{res.name}</td>
                            <td>

                              {res.email}
                            </td>
                            <td>{res.type}</td>
                            <td>
                              {res.price}
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

Experiences.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default Experiences;