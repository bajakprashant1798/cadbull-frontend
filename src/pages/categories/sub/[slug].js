import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import drawing1 from "@/assets/images/drawing-image.png";
import CategoriesLayout, { makeTitle } from "@/layouts/CategoriesLayouts";
import Icons from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import icon from "@/assets/icons/categories.png";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/router";
import { getSubCategories, getallsubCategories } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllSubCategoriesData,
  getSubCategory,
  resetsubcatfilter,
  updatesubcatpage,
  updatesubcatpagetype,
  updatesubcatserachTerm,
  updatesubcatsortTerm,
} from "../../../../redux/app/features/projectsSlice";
import { drawings } from "@/pages";
import LoadMore from "@/components/LoadMore";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";

const CadLandscaping = () => {
  const router = useRouter();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const { slug } = router.query;
  const subcat = useSelector((store) => store.projectinfo.subcat);
  const subcatfilter = useSelector((store) => store.projectinfo.subcatfilter);
  const [showSearchBreadCrumb, setShowSearchBreadCrumb] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");
  const loadProjects = () => {
    startLoading();
    getSubCategories(subcatfilter)
      .then((response) => {
        // console.log("====subcategories res", response.data);
        if (subcatfilter.currentPage === 1) {
          dispatch(getSubCategory(response.data.projects));
        } else {
          dispatch(getSubCategory([...subcat, ...response.data.projects]));
        }
        stopLoading();
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        stopLoading();
        // console.log("error", error);
      });
  };

  // useEffect(() => {
  //   loadProjects()
  // }
  // , [subcatfilter]);
  let timers;
  useEffect(() => {
    loadProjects();
  }, [subcatfilter, slug]);

  useEffect(() => {
    return () => {
      dispatch(resetsubcatfilter());
      dispatch(addAllSubCategoriesData([]));
    };
  }, []);
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.length >= 3) {
      setSearchedText(searchText);
      dispatch(updatesubcatpage(1));
      dispatch(updatesubcatserachTerm(searchText));
      setShowSearchBreadCrumb(true);
    }
  };
  useEffect(()=>{
    if(searchText.length===0){
      dispatch(updatesubcatpage(1));
      dispatch(updatesubcatserachTerm(""));
      setShowSearchBreadCrumb(false);
      setSearchedText("");
    }
  },[searchText])
  const CategoriesProps = showSearchBreadCrumb
    ? {
        title: "Search Results",
        description:
          "Cadbull presents variety of online drawing including DWG drawing, Cad drawing, AutoCAD drawing, 3D Drawing. Wide range of 3D Drawing, DWG drawing, Cad drawing, AutoCAD drawing available as per your need.",
        categories: categories,
        type: "Sub Categories",
        pageName: "Search Results",
      }
    : {
        title: slug,
        description:
          "Improving the aesthetic appearance of an area by changing its contours, adding ornamental features, or planting trees and shrubs that create beautiful landscape.",

        categories: categories,
        type: "Sub Categories",
      };
  return (
    <Fragment>
      <Head>
        <title>Cad Landscaping | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <CategoriesLayout {...CategoriesProps}>
        {isLoading && <Loader />}
        <section>
          <div className="container">
            <div className="row mb-4 mb-md-5">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-2">
                  <div className="col-lg-3">
                    {searchedText.length ? (
                      <>
                        <h5 className="text-nowrap">
                          <span className="fw-semibold text-primary">
                            {searchedText}
                          </span>{" "}
                          <small className="text-grey fs-12">{`(${subcat?.length} RESULTS)`}</small>
                        </h5>
                      </>
                    ) : (
                      <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mt-2  mt-md-0 mb-md-0">
                          <li className="breadcrumb-item">
                            <Link href="/categories">Categories</Link>
                          </li>
                          {slug && (
                            <li className="breadcrumb-item">
                              {makeTitle(slug)}
                            </li>
                          )}
                        </ol>
                      </nav>
                    )}
                  </div>
                  <div>
                    <div className="d-flex gap-2 justify-content-end flex-column flex-md-row">
                      <form>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <Icons.Search />
                          </span>
                          <input
                            type="text"
                            onChange={(e) => {
                              setSearchText(e.target.value.trim());
                            }}
                            className="form-control  border-start-0 border-end-0 rounded-end-0 ps-0"
                            placeholder="For e.g. House Design"
                            aria-label="For e.g. House Design"
                          />
                          <span className="input-group-text p-0">
                            <button
                              type="submit"
                              onClick={handleSearch}
                              className="btn btn-secondary rounded-start-0"
                            >
                              SEARCH
                            </button>
                          </span>
                        </div>
                      </form>
                      <div className="d-none d-xl-flex gap-2">
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            Type :
                          </span>
                          <select
                            defaultValue=""
                            className="form-select border-start-0  rounded-start-0"
                            aria-label=".form-select-sm example"
                            onChange={(e) => {
                              dispatch(updatesubcatpage(1));
                              dispatch(updatesubcatpagetype(e.target.value));
                            }}
                          >
                            <option value="">All</option>
                            <option value="Free">Free</option>
                            <option value="Gold">Gold</option>
                          </select>
                        </div>
                        {/* Sort by : DWG */}
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            Sort by :
                          </span>
                          <select
                            defaultValue="DWG"
                            className="form-select border-start-0 rounded-start-0"
                            aria-label=".form-select-sm example"
                            onChange={(e) => {
                              dispatch(updatesubcatpage(1));
                              dispatch(updatesubcatsortTerm(e.target.value));
                            }}
                          >
                            <option value={""}>All</option>
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
            </div>

            <div className="row g-4 justify-content-center">
              {subcat?.map((project) => {
                return (
                  <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                    <ProjectCard {...project} />
                  </div>
                );
              })}
            </div>
            {/* <Pagination 
            currentPage={subcatfilter.currentPage}
            totalPages={totalPages}
            dispatchCurrentPage={updatesubcatpage}
            goToPreviousPage={() => dispatch(updatesubcatpage(subcatfilter.currentPage - 1))}
            goToNextPage={() =>dispatch(updatesubcatpage(subcatfilter.currentPage + 1))}
            /> */}
            <div className="row mt-4 justify-content-center mt-md-5">
              <div className="col-md-6 col-lg-5 col-xl-4">
                <div className="text-center">
                  {!isLoading && (
                    <LoadMore
                      totalPage={totalPages}
                      currentPage={subcatfilter.currentPage}
                      loadMoreHandler={() => {
                        dispatch(
                          updatesubcatpage(subcatfilter.currentPage + 1)
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </CategoriesLayout>
    </Fragment>
  );
};

CadLandscaping.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default CadLandscaping;
