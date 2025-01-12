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


const EarningsStatement = () => {
  return (
    <Fragment>
      <Head>
        <title>Earnings Statement | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      <section className="py-lg-5 py-4 earnings-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading title={"Earnings Statement"} description={"Choose from 254195+ Free & Premium CAD Files with new additions published every second month"} />
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

EarningsStatement.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default EarningsStatement;