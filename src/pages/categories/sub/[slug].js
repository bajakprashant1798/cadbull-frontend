import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useState } from "react";
import drawing1 from "@/assets/images/drawing-image.png";
import CategoriesLayout, { makeTitle } from "@/layouts/CategoriesLayouts";
import Icons from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import icon from "@/assets/icons/categories.png";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/router";
import { getFavouriteItems, getSubCategories, getallsubCategories } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllSubCategoriesData,
  getSubCategory,
  resetsubcatfilter,
  setFavouriteList,
  updatesubcatpage,
  updatesubcatpagetype,
  updatesubcatserachTerm,
  updatesubcatslug,
  updatesubcatsortTerm,
} from "../../../../redux/app/features/projectsSlice";
import { drawings } from "@/pages";
import LoadMore from "@/components/LoadMore";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import { debounce } from "lodash";

const CadLandscaping = ({ initialProjects, initialTotalPages, initialSlug }) => {
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();
  const [isLoading, startLoading, stopLoading] = useLoading();

  // Use Redux to store subcategory projects and filters.
  const subcat = useSelector((store) => store.projectinfo.subcat);
  const subcatfilter = useSelector((store) => store.projectinfo.subcatfilter);
  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  const { token } = useSelector((store) => store.logininfo);

  // Local state for search input
  const [searchText, setSearchText] = useState("");
  const [searchedText, setSearchedText] = useState("");

  // Pagination state (client-side)
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch favorites if not loaded
  useEffect(() => {
    if (token && (!favouriteList || favouriteList.length === 0)) {
      getFavouriteItems(token)
        .then((favRes) => {
          dispatch(setFavouriteList(favRes.data.favorites || []));
        })
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, [token, favouriteList, dispatch]);

  // Update Redux with the new slug and reset pagination
  useEffect(() => {
    if (slug || initialSlug) {
      const currentSlug = slug || initialSlug;
      dispatch(updatesubcatslug(currentSlug));
      dispatch(updatesubcatpage(1));
    }
  }, [slug, initialSlug, dispatch]);

  // Debounce search input so API calls are not made on every keystroke
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchedText(value);
      dispatch(updatesubcatpage(1));
      dispatch(updatesubcatserachTerm(value));
    }, 500),
    [dispatch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.length >= 3) {
      setSearchedText(searchText);
      dispatch(updatesubcatpage(1));
      dispatch(updatesubcatserachTerm(searchText));
    }
  };

  // Load projects dynamically based on current filters and search query
  const loadProjects = () => {
    startLoading();
    if (!subcatfilter.slug) {
      console.error("❌ Skipping API Call: Slug is empty or undefined");
      stopLoading();
      return;
    }
    getSubCategories(subcatfilter)
      .then((response) => {
        if (subcatfilter.currentPage === 1) {
          dispatch(getSubCategory(response.projects));
        } else {
          dispatch(getSubCategory([...subcat, ...response.projects]));
        }
        setTotalPages(response.totalPages);
        stopLoading();
      })
      .catch((error) => {
        stopLoading();
        console.error("Error fetching subcategories:", error);
      });
  };

  useEffect(() => {
    loadProjects();
  }, [subcatfilter, slug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetsubcatfilter());
      // Optionally clear any additional state
    };
  }, [dispatch]);

  // Define layout properties based on search state
  const CategoriesProps = searchedText.length
    ? {
        title: "Search Results",
        description:
          "Cadbull presents a variety of online drawings including DWG, Cad, AutoCAD, and 3D drawings.",
        categories: [],
        type: "Sub Categories",
        pageName: "Search Results",
      }
    : {
        title: slug ? makeTitle(slug) : "Sub Categories",
        description:
          "Improving the aesthetic appearance of an area by changing its contours, adding ornamental features, or planting trees and shrubs.",
        categories: [],
        type: "Sub Categories",
      };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(updatesubcatpage(newPage));
  };

  return (
    <Fragment>
      <Head>
        <title>Cad Landscaping | Cadbull</title>
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
                      <h5 className="text-nowrap">
                        <span className="fw-semibold text-primary">
                          {searchedText}
                        </span>{" "}
                        <small className="text-grey fs-12">
                          ({subcat?.length || 0} RESULTS)
                        </small>
                      </h5>
                    ) : (
                      <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mt-2 mt-md-0 mb-md-0">
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
                      <form onSubmit={handleSearch}>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <Icons.Search />
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 border-end-0 rounded-end-0 ps-0"
                            placeholder="For e.g. House Design"
                            aria-label="For e.g. House Design"
                            value={searchText}
                            onChange={handleInputChange}
                          />
                          <span className="input-group-text p-0">
                            <button type="submit" className="btn btn-secondary rounded-start-0">
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
                            className="form-select border-start-0 rounded-start-0"
                            onChange={(e) => {
                              setCurrentPage(1);
                              dispatch(updatesubcatpage(1));
                              dispatch(updatesubcatpagetype(e.target.value));
                            }}
                          >
                            <option value="">All</option>
                            <option value="Free">Free</option>
                            <option value="Gold">Gold</option>
                          </select>
                        </div>
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            Sort by :
                          </span>
                          <select
                            defaultValue="DWG"
                            className="form-select border-start-0 rounded-start-0"
                            onChange={(e) => {
                              setCurrentPage(1);
                              dispatch(updatesubcatpage(1));
                              dispatch(updatesubcatsortTerm(e.target.value));
                            }}
                          >
                            <option value="">All</option>
                            {drawings.map(({ type, value }, index) => (
                              <option key={index} value={value}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="row g-4 justify-content-center">
              {isLoading ? null : subcat && subcat.length > 0 ? (
                subcat.map((project) => (
                  <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                    <ProjectCard {...project} favorites={favouriteList} />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>Record not found</p>
                </div>
              )}
            </div>

            {/* Pagination Component */}
            <div className="row mt-4 justify-content-center mt-md-5">
              <div className="col-md-6 col-lg-5 col-xl-4">
                <div className="text-center">
                  <Pagination
                    currentPage={subcatfilter.currentPage}
                    totalPages={totalPages}
                    dispatchCurrentPage={updatesubcatpage}
                    goToPreviousPage={() => dispatch(updatesubcatpage(subcatfilter.currentPage - 1))}
                    goToNextPage={() => dispatch(updatesubcatpage(subcatfilter.currentPage + 1))}
                  />
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