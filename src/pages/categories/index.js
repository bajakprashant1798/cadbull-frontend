import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useState } from "react";
import drawing1 from "@/assets/images/drawing-image.png";
import CategoriesLayout from "@/layouts/CategoriesLayouts";
import Icons from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import icon from "@/assets/icons/categories.png";
import { useRouter } from "next/router";
import { getallCategories, getallprojects, getallsubCategories } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllSubCategoriesData,
  getProjects,
  resetCategoriesList,
  updateSortList,
  updatesubcatpage,
  updatesubcatserachTerm,
} from "../../../redux/app/features/projectsSlice";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { drawings } from "..";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import LoadMore from "@/components/LoadMore";
const Categories = () => {
  const { sortList } = useSelector((store) => store.projectinfo);
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [catalog, setCatalog] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sortTerm, setSortTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearchBreadCrumb, setShowSearchBreadCrumb] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const dispatch = useDispatch();

  


  // Memoize the loadRecords function to prevent re-creation on re-renders
  const loadRecords = useCallback(
    (page) => {
      startLoading();
      getallprojects(page, 6, searchedText, sortTerm, sortType)
        .then((response) => {
          if (page === 1) {
            setProjects(response.data?.products);
          } else {
            setProjects((prevProjects) => [
              ...prevProjects,
              ...response.data?.products,
            ]);
          }
          setTotalPages(response.data.totalPages);
          stopLoading();
        })
        .catch((error) => {
          stopLoading();
          console.error("Error fetching projects:", error);
        });
    },
    [searchedText, sortTerm, sortType]
  ); // Dependency array

  useEffect(() => {
    // Load records when the component mounts or when filtering/sorting conditions change
    loadRecords(currentPage);
  }, [loadRecords, currentPage]); // Call loadRecords whenever it changes or currentPage changes

  // Handle changes to search term, sort term, and sort type
  useEffect(() => {
    // Reset currentPage to 1 when search term, sort term, or sort type changes
    setCurrentPage(1);
  }, [searchedText]);
  // //update sortTerm state by redux state change
  useEffect(() => {
    setCurrentPage(1);
    setSortTerm(sortList);
  }, [sortList]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setShowSearchBreadCrumb(true);
    setSearchedText(searchTerm);
  };
  const handlerSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (searchTerm.length == 0) {
      setShowSearchBreadCrumb(false);
      setSearchedText("");
      // setCurrentPage(1)
      //  loadRecords()
    }
  }, [searchTerm]);
  //cleanup states
  useEffect(() => {
    return () => {
      dispatch(addAllSubCategoriesData([]));
      dispatch(updateSortList(""));
      dispatch(updatesubcatserachTerm(""));
      dispatch(updatesubcatpage(1));
    };
  }, []);
  useEffect(() => {
    return () => {
      dispatch(resetCategoriesList()); // ✅ Clears list when leaving the page
    };
  }, []);
  
  const CategoriesProps = showSearchBreadCrumb
    ? {
        title: "Search Results",
        description:
          "Cadbull presents variety of online drawing including DWG drawing, Cad drawing, AutoCAD drawing, 3D Drawing. Wide range of 3D Drawing, DWG drawing, Cad drawing, AutoCAD drawing available as per your need.",
        categories: catalog,
        type: "Categories",
        pageName: "Search Results",
      }
    : {
        title: "Categories",
        description:
          "Choose your category according to your choice & need. In each category you will found your desire one among multiple option.",

        categories: catalog,
        type: "Categories",
      };

  return (
    <Fragment>
      <Head>
        <title>Categories | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <CategoriesLayout {...CategoriesProps}>
        {isLoading && <Loader />}
        <section>
          <div className="container">
            <div className="row mb-4 mb-md-5">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-5">
                  <div>
                    {searchedText.length ? (
                      <>
                        <h5 className="text-nowrap">
                          <span className="fw-semibold text-primary">
                            {searchedText}
                          </span>{" "}
                          <small className="text-grey fs-12">{`(${projects.length} RESULTS)`}</small>
                        </h5>
                      </>
                    ) : null}
                  </div>
                  <div className="w-100">
                    <div className="d-flex gap-3 justify-content-xl-end justify-content-center flex-column flex-md-row">
                      <form onSubmit={handleSearch}>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <Icons.Search />
                          </span>
                          <input
                            type="text"
                            className="form-control  border-start-0 border-end-0 rounded-end-0 ps-0"
                            placeholder="For e.g. House Design"
                            aria-label="For e.g. House Design"
                            value={searchTerm}
                            onChange={handlerSearchInput}
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
                      {/* Sort by : DWG */}
                      <div className="d-none d-xl-flex gap-2">
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            Type :
                          </span>
                          <select
                            onChange={(e) => {
                              setCurrentPage(1);
                              setSortType(e.target.value);
                            }}
                            className="form-select border-start-0 rounded-start-0"
                            aria-label=".form-select-sm example"
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
                            onChange={(e) => {
                              setCurrentPage(1);
                              setSortTerm(e.target.value);
                            }}
                            className="form-select border-start-0 rounded-start-0"
                            aria-label=".form-select-sm example"
                            value={sortTerm}
                          >
                            <option value="">All</option>
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
              {isLoading ? null : projects.length > 0 ? (
                <>
                  {projects.map((project) => (
                    <div
                      className="col-md-6 col-lg-4 col-xl-4"
                      key={project.id}
                    >
                      <ProjectCard {...project} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-12 text-center">
                  <p>Record not found</p>
                </div>
              )}
            </div>

            <div className="row mt-4 justify-content-center mt-md-5">
              <div className="col-md-6 col-lg-5 col-xl-4">
                <div className="text-center">
                  {/* <Link href="" className="btn btn-secondary">
                    BROWSE
                  </Link> */}
                  {!isLoading && (
                    <LoadMore
                      totalPage={totalPages}
                      currentPage={currentPage}
                      loadMoreHandler={() => {
                        setCurrentPage((prev) => prev + 1);
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

Categories.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Categories;
