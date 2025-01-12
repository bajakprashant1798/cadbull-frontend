import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment } from "react";
import drawing1 from "@/assets/images/drawing-image.png";
import CategoriesLayout from "@/layouts/CategoriesLayouts";
import Icons from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import icon from "@/assets/icons/categories.png";
import Pagination from "@/components/Pagination";

const projects = [
  {
    id: 1,
    image: drawing1,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369,
    url: '/categories/view/1'
  },
  {
    id: 2,
    image: drawing1,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369,
    url: '/categories/view/1'
  },
  {
    id: 3,
    image: drawing1,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369,
    url: '/categories/view/1'
  },
  {
    id: 4,
    image: drawing1,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369,
    url: '/categories/view/1'
  },
  {
    id: 5,
    image: drawing1,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369,
    url: '/categories/view/1'
  },
  {
    id: 6,
    image: drawing1,
    title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
    type: "DWG",
    views: 369,
    url: '/categories/view/1'
  }
]


const categories = [
  {
    title: '3d Drawing',
    icon: icon,
    counts: '20,000+',
    url: '/categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'CAD Architecture',
    icon: icon,
    counts: '73,145+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'CAD Landscape',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: true
  },
  {
    title: 'CAD Mechinery',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Detail',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'DWG Blocks',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Electrical CAD',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Furnitures',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Interior Design',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Projects',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Structure Detail',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Urban Design',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Construction CAD',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  },
  {
    title: 'Advance Tech',
    icon: icon,
    counts: '20,000+',
    url: 'categories/sub/cad-landscaping',
    active: false
  }

]



const SearchCategories = () => {
  return (
    <Fragment>
      <Head>
        <title>Categories555 | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <CategoriesLayout title={"Search Results"} description={"Cadbull presents variety of online drawing including DWG drawing, Cad drawing, AutoCAD drawing, 3D Drawing. Wide range of 3D Drawing, DWG drawing, Cad drawing, AutoCAD drawing available as per your need."} categories={categories} type={"Categories"} pageName="Search Results">
        <section>
          <div className="container">
            <div className="row mb-4 mb-md-5">
              <div className="col-lg-12">
                <div className='d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-3'>
                  <div >
                    <h5 className="text-nowrap"><span className="fw-semibold text-primary">House</span> <small className="text-grey fs-12">(14375 RESULTS)</small></h5>
                  </div>
                  <div className='w-100'>
                    <div className='d-flex gap-3 justify-content-end flex-column flex-md-row'>
                      <form>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <Icons.Search />656
                          </span>
                          <input type="text" className="form-control  border-start-0 border-end-0 rounded-end-0 ps-0" placeholder="For e.g. House Design" aria-label="For e.g. House Design" />
                          <span className="input-group-text p-0">
                            <button type='submit' className='btn btn-secondary rounded-start-0'>SEARCH</button>
                          </span>
                        </div>
                      </form>
                      {/* Sort by : DWG */}
                      <div className="d-none d-xl-flex gap-2">
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            Type :
                          </span>
                          <select defaultValue="Gold" className="form-select border-start-0 rounded-start-0" aria-label=".form-select-sm example">
                            <option value="1">Gold</option>
                            <option value="2">Silver</option>
                            <option value="3">Bronze</option>
                          </select>
                        </div>
                        {/* Sort by : DWG */}
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            Sort by :
                          </span>
                          <select defaultValue="DWG" className="form-select border-start-0 rounded-start-0" aria-label=".form-select-sm example">
                            <option value="1">BIM</option>
                            <option value="2">SKP</option>
                            <option value="3">MAX</option>
                            <option value="3">3DS</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 justify-content-center">
              {
                projects.map((project) => {
                  return (
                    <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                      <ProjectCard {...project} />
                    </div>
                  )
                })
              }
            </div>

           <Pagination/>
          </div>
        </section>
      </CategoriesLayout >
    </Fragment >
  );
}

SearchCategories.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}


export default SearchCategories;