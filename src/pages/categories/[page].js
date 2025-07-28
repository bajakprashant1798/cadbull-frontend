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
import { getallCategories, getallprojects, getallsubCategories, getFavouriteItems } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllSubCategoriesData,
  getProjects,
  setFavouriteList,
  updateSortList,
  updatesubcatpage,
  updatesubcatserachTerm,
} from "../../../redux/app/features/projectsSlice";
import { loginSuccess } from "../../../redux/app/features/authSlice";
import { drawings } from "..";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import LoadMore from "@/components/LoadMore";
import Pagination from "@/components/Pagination";
import { debounce, set } from "lodash";
import logo from "@/assets/images/logo.png";
import AdSense from "@/components/AdSense";

const Categories = ({
//   initialCategories,
//   initialProjects,
//   totalPages: initialTotalPages,
//   initialFavourites
  initialCategories,
  initialProjects,
  totalPages: initialTotalPages,
  initialFavourites,
}) => {
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [catalog, setCatalog] = useState(initialCategories || []);
  const [projects, setProjects] = useState(initialProjects || []);
  const [sortTerm, setSortTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
//   const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [showSearchBreadCrumb, setShowSearchBreadCrumb] = useState(false);
  const [searchedText, setSearchedText] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const { page = "1", type = "", file_type = "", search = "" } = router.query;
  const currentPage = parseInt(page, 10);  // use from URL
  // const currentPage = parseInt(router.query.page || "1", 10); 

  // Retrieve token from login info:
  const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );

  // Retrieve favorites from Redux:
  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  // console.log("favouriteList cat", favouriteList);

  // Fetch favorites if not already fetched
  const [favouritesFetched, setFavouritesFetched] = useState(false);

  const buildQuery = (params) => {
    const query = {};
    if (params.type) query.type = params.type;
    if (params.file_type) query.file_type = params.file_type;
    if (params.search) query.search = params.search;
    // Don't include page as a query param, since it's in the path!
    return query;
  };


  // csr setup
  // useEffect(() => {
  //   if (isAuthenticated && !favouritesFetched) {
  //     getFavouriteItems()
  //       .then((favRes) => {
  //         dispatch(setFavouriteList(favRes.data.favorites || []));
  //         setFavouritesFetched(true); // Mark as fetched so we don't re-fetch
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching favorites:", error);
  //         // Optionally mark as fetched to avoid repeated attempts
  //         setFavouritesFetched(true);
  //       });
  //   }
  // }, [isAuthenticated, favouritesFetched, dispatch]);

  // ssg setup
  useEffect(() => {
    if (isAuthenticated && initialFavourites?.length > 0) {
      dispatch(setFavouriteList(initialFavourites));
    }
  }, [isAuthenticated, initialFavourites, dispatch]);

  // Memoize the loadRecords function to prevent re-creation on re-renders
  // API data loader: always use args from query
  const loadRecords = useCallback(
    (page, searchText, fileType, type) => {
      startLoading();
      getallprojects(page, 9, searchText, fileType, type)
        .then((response) => {
          setProjects(response.data?.products);
          setTotalPages(response.data.totalPages);
          stopLoading();
        })
        .catch((error) => {
          stopLoading();
          console.error("Error fetching projects:", error);
        });
    },
    [startLoading, stopLoading]
  );


  
  // Load records on query param change
  useEffect(() => {
    loadRecords(currentPage, search, file_type, type);
  }, [currentPage, search, file_type, type]); // Call loadRecords whenever it changes or currentPage changes

  // Handle changes to search term, sort term, and sort type
//   useEffect(() => {
//     // Reset currentPage to 1 when search term, sort term, or sort type changes
//     setCurrentPage(1);
//   }, [searchedText]);

  // //update sortTerm state by redux state change
  // useEffect(() => {
  //   setCurrentPage(1);
  //   // setSortTerm(sortList);
  // }, [searchedText]);

  // Keep filter state in sync with query params
  useEffect(() => {
    setSortType(type);
    setSortTerm(file_type);
    setSearchTerm(search);
    setSearchedText(search);
  }, [type, file_type, search]); // The URL is the single source of truth for filters.

  // // Debounced search
  // const debouncedSearch = useCallback(
  //   debounce((value) => {
  //     setSearchedText(value);
  //   //   setCurrentPage(1);
  //   }, 500),
  //   []
  // );
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchedText(value);

      // Optionally update Redux filters if you want
      // dispatch(updatesubcatpage(1));
      // dispatch(updatesubcatserachTerm(value));

      // Push new URL/search to trigger useEffect & reload results
      router.push({
        pathname: `/categories/1`,
        query: buildQuery({
          type: sortType,
          file_type: sortTerm,
          search: value,
        })
      }, undefined, { shallow: true });
    }, 500),
    [router, sortType, sortTerm] // Make sure these are in deps!
  );


  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   // setCurrentPage(1);
  //   setShowSearchBreadCrumb(true);
  //   setSearchedText(searchTerm);
  // };
  const handleSearch = (e) => {
    e.preventDefault();
    debouncedSearch.cancel && debouncedSearch.cancel(); // Cancel any pending debounce
    setShowSearchBreadCrumb(true);
    router.push({
      pathname: '/categories/1',
      query: buildQuery({
        type: sortType,
        file_type: sortTerm,
        search: searchTerm,
      })
    }, undefined, { shallow: true });
  };



  const handlerSearchInput = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };
  useEffect(() => {
    if (searchTerm.length === 0) {
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
  }, [dispatch]);
  // useEffect(() => {
  //   return () => {
  //     dispatch(resetCategoriesList()); // ✅ Clears list when leaving the page
  //   };
  // }, [dispatch]);
  
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

    // const handlePageChange = (newPage) => {
    //     if (newPage === 1) {
    //         router.push('/categories');
    //     } else {
    //         router.push(`/categories/${newPage}`);
    //     }
    //     // setCurrentPage(newPage);
    // };

    // useEffect(() => {
    //   setSortType(type);
    //   setSortTerm(file_type);
    //   setSearchTerm(search);
    // }, [type, file_type, search]);


    const handleTypeChange = (e) => {
      const newType = e.target.value;
      setSortType(newType);
      router.push({
        pathname: '/categories/1',
        query: buildQuery({
          type: newType,
          file_type: sortTerm,
          search: searchTerm,
        })
      }, undefined, { shallow: true });
    };


    const handleSortChange = (e) => {
      const newFileType = e.target.value;
      setSortTerm(newFileType);
      router.push({
        pathname: '/categories/1',
        query: buildQuery({
          type: sortType,
          file_type: newFileType,
          search: searchTerm,
        })
      }, undefined, { shallow: true });
    };


    // Pagination handler
    const handlePageChange = (newPage) => {
      router.push({
        pathname: `/categories/${newPage}`,
        query: buildQuery({
          type: sortType,
          file_type: sortTerm,
          search: searchTerm,
        })
      }, undefined, { shallow: true });
    };

  
    

  return (
    <Fragment>
      <Head>
        <title>Cadbull Categories | Free & Premium AutoCAD DWG Files </title>
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/categories`} />
        <meta name="description" content="Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More." />

        <meta property="og:title" content="Cadbull Categories | Free & Premium AutoCAD DWG Files" />
        <meta property="og:description" content="Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/categories`} />
        <meta property="og:image" content={logo} />
        <meta name="twitter:title" content="Cadbull Categories | Free & Premium AutoCAD DWG Files" />
        <meta name="twitter:description" content="Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More." />
        <meta name="twitter:image" content={logo} />
        <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad furniture" />
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
                    ) : `All Projects`}
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
                            // onChange={(e) => {
                            //   setSortType(e.target.value);
                            //   if (currentPage !== 1) {
                            //     router.push('/categories'); // Go to first page on filter change
                            //   } else {
                            //     // If already on page 1, just reload data (if needed)
                            //     loadRecords(1); // Or whatever your data-fetching function is called
                            //   }
                            // }}
                            value={sortType}
                            onChange={handleTypeChange}
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
                            // onChange={(e) => {
                            //   setSortType(e.target.value);
                            //   if (currentPage !== 1) {
                            //     router.push('/categories'); // Go to first page on filter change
                            //   } else {
                            //     // If already on page 1, just reload data (if needed)
                            //     loadRecords(1); // Or whatever your data-fetching function is called
                            //   }
                            // }}
                            onChange={handleSortChange}
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

            <div className="row g-4 justify-content-center mb-4">
              {isLoading ? null : projects.length > 0 ? (
                <>
                  {projects.map((project) => (
                    <div
                      className="col-md-6 col-lg-4 col-xl-4"
                      key={project.id}
                    >
                      <ProjectCard {...project} favorites={favouriteList} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-12 text-center">
                  <p>Record not found</p>
                </div>
              )}
            </div>

            <AdSense slot="7739180135" format="fluid" layout="in-article" />

            {/* Pagination Component */}
            <div className="row  justify-content-center ">
              <div className="col-md-6 col-lg-5 col-xl-4">
                <div className="text-center">
                  {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    goToPreviousPage={() => handlePageChange(currentPage - 1)}
                    goToNextPage={() => handlePageChange(currentPage + 1)}
                    dispatchCurrentPage={handlePageChange}
                  /> */}

                  <Pagination
                    basePath="/categories"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
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

// pages/categories/index.js

export async function getStaticPaths() {
  // You can generate a few pages (for demo) or as many as you want.
  // Example: Pre-render first 10 pages statically, and use fallback: "blocking" for others.
  const paths = Array.from({ length: 10 }).map((_, idx) => ({
    params: { page: `${idx + 1}` },
  }));
  return {
    paths,
    fallback: "blocking", // so other pages are generated on-demand
  };
}

export async function getStaticProps({ params }) {
  const currentPage = parseInt(params?.page || "1", 10); // default to 1 if undefined

  try {
    const [categoriesRes, projectsRes, favouritesRes] = await Promise.all([
      getallCategories(""),
      getallprojects(currentPage, 9, "", "", ""),
      getFavouriteItems(),
    ]);
    return {
      props: {
        initialCategories: categoriesRes?.data?.categories || [],
        initialProjects: projectsRes?.data?.products || [],
        totalPages: projectsRes?.data?.totalPages || 1,
        initialFavourites: favouritesRes?.data?.favorites || [],
        currentPage, // add this if you want to use in component
      },
      revalidate: 300,
    };
  } catch (err) {
    console.error("❌ Error in getStaticProps:", err);
    return {
      props: {
        initialCategories: [],
        initialProjects: [],
        totalPages: 1,
        initialFavourites: [],
        currentPage,
      },
      revalidate: 300,
    };
  }
}


// export async function getStaticProps() {
//   try {
//     const [categoriesRes, projectsRes, favouritesRes] = await Promise.all([
//       getallCategories(""),             // Fetch all categories
//       getallprojects(1, 9, "", "", ""), // Fetch first page of projects
//       getFavouriteItems()               // Fetch favorites if needed (optional, only if token is not required)
//     ]);

//     return {
//       props: {
//         initialCategories: categoriesRes?.data?.categories || [],
//         initialProjects: projectsRes?.data?.products || [],
//         totalPages: projectsRes?.data?.totalPages || 1,
//         initialFavourites: favouritesRes?.data?.favorites || []
//       },
//       revalidate: 300 // Rebuild page every 5 mins
//     };
//   } catch (err) {
//     console.error("❌ Error in getStaticProps:", err);
//     return {
//       props: {
//         initialCategories: [],
//         initialProjects: [],
//         totalPages: 1,
//         initialFavourites: []
//       },
//       revalidate: 300
//     };
//   }
// }


Categories.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Categories;