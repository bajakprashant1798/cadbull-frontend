import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import { Fragment, useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import Icons from "@/components/Icons";
import BIM1 from "@/assets/icons/BIM1.png";
import BIM2 from "@/assets/icons/BIM2.png";
import BIM3 from "@/assets/icons/BIM3.png";
import BIM4 from "@/assets/icons/BIM4.png";
import BIM5 from "@/assets/icons/BIM5.png";
import drawing1 from "@/assets/images/drawing-image.png";
import principle from "@/assets/images/principal.png";
import indvidual from "@/assets/icons/induvidual.png";
import visualization from "@/assets/icons/visualization.png";
import category1 from "@/assets/icons/3dDrawing.png";
import category2 from "@/assets/icons/architecture.png";
import category3 from "@/assets/icons/landscape.png";
import category4 from "@/assets/icons/cadmachinery.png";
import category5 from "@/assets/icons/details.png";
import category6 from "@/assets/icons/DwgBlocks.png";
import category7 from "@/assets/icons/ElectricalCad.png";
import category8 from "@/assets/icons/furniture.png";
import category9 from "@/assets/icons/interio.png";
import category10 from "@/assets/icons/project.png";
import category11 from "@/assets/icons/Stucture.png";
import category12 from "@/assets/icons/Urbandesign.png";
import ourSkills from "@/assets/images/our-skills.png";
import bussiness from "@/assets/images/Interior-Designer.png";
import housePlan from "@/assets/images/HOUSE-PLAN.png";
import GetOff from "@/components/GetOff";
import ProjectCard from "@/components/ProjectCard";
import Pagination from '@/components/Pagination';
import Architecture from "@/assets/images/Architecture.png";
import { getBlogs, getallprojects, getPaginatedProjects } from "@/service/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/app/features/authSlice";
import { get } from "react-hook-form";
import parser from "html-react-parser";
import LoadMore from "@/components/LoadMore";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import { updateSortList } from "../../redux/app/features/projectsSlice";

import axios from 'axios';

export const drawings = [
  { img: BIM1, type: "DWG", description: "DWG", value: "DWG" },
  { img: BIM3, type: "SKP", description: "3D MODELS", value: "3d sketchup" },
  { img: BIM4, type: "MAX", description: "3D MODELS", value: "3d max" },
  { img: BIM1, type: "Revit", description: "Revit", value: "Revit" },
  { img: BIM1, type: "PDF", description: "PDF", value: "PDF" },
  { img: BIM2, type: "BIM", description: "BIM", value: "BIM" },
  {
    img: BIM5,
    type: "3DS",
    description: "3D STUDIO MAX",
    value: "3d sketchup",
  },
  { img: BIM1, type: "DXF", description: "CAD BLOCKS", value: "DXF" },
  { img: BIM2, type: "JPEG", description: "BIM OBJECTS", value: "JPEG" },
  {
    img: BIM1,
    type: "Photoshop",
    description: "Photoshop",
    value: "Photoshop",
  },
  { img: BIM1, type: "App", description: "App", value: "App" },
  { img: BIM1, type: "Other", description: "Other", value: "Other" },
]
const categories = [
  { image: category1, title: "3d Drawing", count: "20,000+" },
  { image: category2, title: "CAD Architecture", count: "25,256+" },
  { image: category3, title: "CAD Landscape", count: "2,987+" },
  { image: category4, title: "CAD Machinery", count: "56,258+" },
  { image: category5, title: "Detail", count: "56,258+" },
  { image: category6, title: "DWG Blocks", count: "48,654+" },
  { image: category7, title: "Electrical CAD", count: "56,258+" },
  { image: category8, title: "Furnitures", count: "56,258+" },
  { image: category9, title: "Interior Design", count: "56,258+" },
  { image: category10, title: "Projects", count: "56,258+" },
  { image: category11, title: "Structure Detail", count: "56,258+" },
  { image: category12, title: "Urban Design", count: "56,258+" },
];

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const dispatch=useDispatch();
  const [isLoading,startLoading,stopLoading]=useLoading();
  const [projects,setProjects]=useState([]);
  const [searchTerm,setSearchTerm]=useState('');
  const [sortTerm,setSortTerm]=useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage,setCurrentPage]=useState(1);


  useEffect(() => {
    if (blogs.length === 0) {
      getBlogs()
        .then((response) => {
          setBlogs(response.data.blogs);
        })
        .catch((error) => {
          // console.error("error", error);
        });
    }
  }, [blogs]);

  // Fetch projects with pagination
  const loadProjects = async (page) => {
    startLoading(true);
    try {
      const response = await getPaginatedProjects(page);
      console.log("projects", response);
      
      setProjects(response.data.projects); // Set the projects for the page
      setTotalPages(response.data.totalPages); // Set total pages
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      stopLoading(false);
    }
  };

  // Initial load and page change effect
  useEffect(() => {
    loadProjects(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  

  //initial page fetching
  const loadRecords = () => {
    startLoading()
    getallprojects(currentPage,3, searchTerm, sortTerm)
    .then((response) => {
      // console.log('total projects',response)
      if(currentPage == 1)
        setProjects(response.data?.products)
      else
        setProjects([...projects,...response.data?.products])
      setTotalPages(response.data.totalPages); 
      stopLoading()
    })
    .catch((error) => {
      stopLoading()
      // console.error("Error fetching categories:", error);
    });
  }
  useEffect(() => {
    loadRecords();
  }, [currentPage]);
// fetching data when there is sorting plus pagination change 
useEffect(() => {
  setCurrentPage(1);
  loadRecords();
}, [sortTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadRecords();
  };

  return (
    <Fragment>
      <Head>
        <title>Cadbull | Home</title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      {/* Hero section  */}
      <section className="hero py-3 py-md-5">
      {isLoading && <Loader/>}
        <div className="container py-3 py-md-5">
          <div className="row">
            <div className="col-md-12">
              <div className="text-center mb-md-5 mb-4">
                <p className="mb-3 fw-light text-primary">
                  World Largest 2d <br />
                  <span className="fw-bold">CAD Library.</span>
                </p>
                <p className="mb-3 mb-md-5">
                  {/* User */}
                  <span className="text-danger">254195+</span> <span className="fw-light"> Free & Premium
                  CADFiles
                  </span>
                </p>
                <Link href="/categories" className="btn btn-primary">
                  VIEW PROJECTS
                </Link>
              </div>
              {/* Form  */}
              <form className="mx-auto mb-md-5" >
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white">
                    <Icons.Search />
                  </span>
                  <input
                    type="text"
                    className="form-control  border-start-0 border-end-0 rounded-end-0 ps-0"
                    placeholder="For e.g. House Design"
                    aria-label="For e.g. House Design"
                    onChange={(e) => {setSearchTerm(e.target.value.trim())}}
                  />
                  <span className="input-group-text p-0">
                    <button
                      type="submit"
                      className="btn btn-secondary rounded-start-0"
                      onClick={handleSearch}
                    >
                      SEARCH
                    </button>
                  </span>
                </div>
              </form>
              {/* Drawing Type  */}
              <div className="drawing-type-wrapper p-2 p-md-3 rounded row row-cols-12  row-cols-xl-5 row-cols-md-5  justify-content-lg-evenly  ">
                {drawings.slice(0, 5).map((drawing, index) => {
                  return (
                    <div className="col mb-2 ">
                      <Link href={"/categories"}>
                        <div
                          key={index}
                          className="d-flex justify-content-lg-center align-items-center gap-md-2"
                          onClick={() =>
                          // setSortTerm(drawing.value)
                          dispatch(updateSortList(drawing.value))
                          }
                        >
                          <img
                            src={drawing.img.src}
                            alt="icon"
                            className="img-fluid d-none d-md-block"
                          />
                          <div>
                            <h6 className="mb-1">{drawing.type}</h6>
                            <p>{drawing.description}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project of the Day  */}
      <section className="py-md-5 py-3">
       
        <div className="container">
          <div className="row mb-4 mb-md-5">
            <div className="col-md-12">
              <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-5">
                <div className="ps-5">
                  <SectionHeading
                    subHeading={"DISCOVER"}
                    mainHeading={"Project of the day"}
                    mainHeadingBold={"Cadbull"}
                  />
                </div>
                <div className="w-100">
                  <div className="d-flex gap-3 justify-content-end flex-column flex-md-row">
                    <form>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <Icons.Search />
                        </span>
                        <input
                          type="text"
                          className="form-control  border-start-0 border-end-0 rounded-end-0 ps-0"
                          placeholder="For e.g. House Design"
                          aria-label="For e.g. House Design"
                          onChange={(e) =>
                           setSearchTerm(e.target.value.trim())
                          }
                        />
                        <span className="input-group-text p-0">
                          <button
                            type="submit"
                            className="btn btn-secondary rounded-start-0"
                            onClick={handleSearch}
                          >
                            SEARCH
                          </button>
                        </span>
                      </div>
                    </form>
                    {/* Sort by : DWG */}
                    <div className="d-flex">
                      <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                        Sort by :
                      </span>
                      <select
                        className="form-select border-start-0 rounded-start-0"
                        aria-label=".form-select-sm example"
                        onChange={(e) => setSortTerm(e.target.value)}
                      >
                        <option value={''}>All</option>
                        {drawings.map(({ type, value }, index) => {
                          return (
                            <option key={index} value={value}>
                              {type}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
 
          <div className="row g-4">
            {projects.map((project) => {
              return (
                <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                  <ProjectCard {...project} />
                  {console.log("projectObject: ", project)}
                </div>
              );
            })}
          </div>

          {/* Pagination  */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            dispatchCurrentPage={handlePageChange}
          />
          <LoadMore
          currentPage={currentPage}
          totalPage={totalPages}
           loadMoreHandler={()=>{
            setCurrentPage((prev)=>prev+1)
           }}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="py-md-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="mb-md-5 mb-4 d-flex ps-5">
                <SectionHeading
                  subHeading={"find Latest"}
                  mainHeading={"Categories"}
                  mainHeadingBold={"Cadbull"}
                  alignment="mx-auto"
                />
              </div>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {categories.map((category, index) => {
              return (
                <div className="col-lg-3 col-md-4 col-sm-6 col-10" key={index}>
                  <div className="d-flex align-items-center gap-2 category-wrapper">
                    <img
                      src={category.image.src}
                      alt="icon"
                      className="img-fluid"
                    />
                    <div>
                      <h6 className="mb-1">{category.title}</h6>
                      <p>{category.count}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main PRINCIPLES  */}
      <section className="py-md-5 py-3">
        <div className="container">
          <div className="row gy-5 gx-lg-5">
            <div className="col-lg-6">
              <div className="main-principle-image-wrapper">
                <img
                  src={principle.src}
                  className="img-fluid"
                  alt="principle"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="main-principle-content-wrapper">
                <div className="mb-md-4 mb-3 ps-5">
                  <SectionHeading
                    subHeading={"MAIN PRINCIPLES"}
                    mainHeading={"Crafting Imagination to"}
                    mainHeadingBold={"Impression."}
                  />
                </div>
                <div className="mb-4">
                  <p className="mb-2">
                    Cadbull is an exclusive forum that connects the creative
                    community of innovative Auto cad designers, firms and
                    organizations. The forum connects people with innovative
                    designs and makes them share their creativity and
                    visualization across the globe.
                  </p>
                  <p>
                    Cadbull is an advanced professional platform to interact and
                    excel with, offering a wide range of high quality auto cad
                    utility areas like architecture, interior and product
                    designing, 3D drawing, building plan, blocks, electrical,
                    furniture, landscaping, machinery, structural details, 3D
                    images, symbols and urban designs. Catering to more than 100
                    such categories to begin with, Cadbull is just starting out!
                  </p>
                </div>
                <div className="row row-cols-2">
                  {/* 1  */}
                  <div className="col">
                    <div className="d-flex flex-column h-100">
                      <div className="mb-3">
                        <img
                          src={visualization.src}
                          alt="icon"
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <h6 className="fw-bold text-primary text-capitalize">
                          Cad Visualization
                        </h6>
                        <p className="mb-2">
                          Cad plan of each detail of your future interior.
                        </p>
                      </div>
                      <div className="mt-auto">
                        <button className="btn transparent-btn shadow-none">
                          READ MORE
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* 1  */}
                  <div className="col">
                    <div className="d-flex flex-column h-100">
                      <div className="mb-3">
                        <img
                          src={indvidual.src}
                          alt="icon"
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <h6 className="fw-bold text-primary text-capitalize">
                          Individual Project
                        </h6>
                        <p className="mb-2">
                          The basic philosophy of studio is to create individual
                          design.
                        </p>
                      </div>
                      <div className="mt-auto">
                        <button className="btn transparent-btn shadow-none">
                          READ MORE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA  */}
      <section className="py-3 py-md-4">
        <div className="container">
          <div className="row rounded-xl bg-primary p-4 p-md-5">
            <div className="col-md-12">
              <div className="text-center">
                <h3 className="text-white mb-2 mb-md-3">
                  Get Incredible CAD Plan Design Right Now!
                </h3>
                <p className="mb-4 mb-md-5 text-white">
                  At every stage, we could supervise your project – controlling
                  all the details and consulting the builders.
                </p>
                <button className="btn btn-light">GET IN TOUCH</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Skills */}
      <section className="py-md-5 py-4 our-skills">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-5 mb-3">
              <div>
                <div className="mb-md-4 mb-3 d-flex ps-5">
                  <SectionHeading
                    subHeading={"OUR SKILLS"}
                    mainHeading={"The Core Company Values"}
                    mainHeadingBold={"Cadbull"}
                  />
                </div>
                <p className="mb-3 mb-md-4">
                  One complete exquisite place to shape-up imagination, crafting
                  to express so that you can impress the rest with the best. Get
                  started, create your account and get the maximumof the
                  community. Share expertise and connect with your peers on
                  Cadbull Auto desk idea station.
                </p>
              </div>

              <div className="d-flex flex-column gap-4">
                {/* CAD Planing Design */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-gray">CAD Planing Design</h5>
                    <h5 className="text-gray">98%</h5>
                  </div>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="Basic example"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar"
                      style={{ width: "98%" }}
                    ></div>
                  </div>
                </div>
                {/* 3d Modeling Design */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-gray">3d Modeling Design</h5>
                    <h5 className="text-gray">95%</h5>
                  </div>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="Basic example"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>
                {/* 2d Planning Design */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-gray">2d Planning Design</h5>
                    <h5 className="text-gray">90%</h5>
                  </div>
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="Basic example"
                    aria-valuenow="0"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="our-skills-image-wrapper">
                <img src={ourSkills.src} alt="skills" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Your Business */}
      <section className="py-3 py-md-4">
        <div className="container">
          <div className="row rounded-xl bg-secondary p-4 p-md-5 align-items-center">
            <div className="col-lg-5">
              <div className="text-center">
                <img
                  src={bussiness.src}
                  alt="bussiness"
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="text-center">
                <h3 className="text-white mb-3 mb-md-4">
                  Are You Architecture Interior Designer?
                </h3>
                <h4
                  className="mx-auto mb-4 mb-md-5 text-white"
                  style={{ maxWidth: "20ch" }}
                >
                  Create Your Profile Here & Publish your work
                </h4>
                <button className="btn btn-light-rounded">
                  Showcase Your Business
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture House Plan */}
      <section className="py-3 py-md-4">
        <div className="container">
          <div className="row d-lg-none">
            <div className="col-md-12">
              <div>
                <img
                  src={Architecture.src}
                  className="w-100 img-fluid"
                  alt="cta"
                />
              </div>
            </div>
          </div>
          <div className="row bg-danger rounded-xl align-items-center d-none d-lg-flex">
            <div className="col-lg-5 ps-0">
              <img src={housePlan.src} className="w-100" alt="house plan" />
            </div>
            <div className="col-lg-4">
              <div className="text-center">
                <h4 className="text-white mb-2 fw-normal">
                  Architecture House Plan CAD Drawings CAD Blocks &
                </h4>
                <h4 className="text-white">
                  <b>21354 Files</b>
                </h4>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-center">
                <button className="btn btn-danger">GET YOUR HOUSE PLAN</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project of the Day  */}
      <section className="py-md-5 py-3">
        <div className="container">
          <div className="row mb-4 mb-md-5">
            <div className="col-md-12">
              <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-3  gap-md-5">
                <div className="ps-5">
                  <SectionHeading
                    subHeading={"FIND OUR ARTICLES"}
                    mainHeading={"Latest Articles"}
                    mainHeadingBold={"Blogs"}
                  />
                </div>
                <div className="w-100 text-center text-md-end">
                  <Link href="" className="btn btn-primary">
                    VIEW ALL ARTICLES
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {blogs.map((blog) => {
              return (
                <div className="col-lg-4 col-sm-6" key={blog.id}>
                  <div className="project-day-card h-100">
                    <div className="project-day-card-image mb-3 position-relative">
                      <img
                        src={blog.image_url}
                        alt="blog"
                        className="w-100 img-fluid"
                      />
                    </div>

                    <div className="project-day-card-title d-flex justify-content-between">
                      <h6 className="fs-6" style={{ width: "40ch" }}>
                        {blog.title}
                      </h6>
                      <div>
                        <span className="badge bg-secondary text-white text-uppercase">
                          {blog.type}
                        </span>
                      </div>
                    </div>
                    <div className="project-day-card-description my-3">
                      <p className="ps-3 w-100 " style={{ maxWidth: "100%" }}>
                        {parser(`${blog.content}`)}
                      </p>
                    </div>
                    <div className="project-day-card-link">
                      <p className="pe-2">MORE DETAILS</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Get Off */}
      <GetOff />
    </Fragment>
  );
}

Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
