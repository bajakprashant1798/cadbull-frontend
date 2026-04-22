import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useState } from "react";
import CategoriesLayout from "@/layouts/CategoriesLayouts";
import Icons from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import SearchBar from "@/components/SearchBar";
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
import { drawings } from "..";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { debounce, set } from "lodash";
import logo from "@/assets/images/logo.png";
import AdSense from "@/components/AdSense";
import { performance } from "@/utils/performance";
import { useComponentTimer } from "@/utils/apiTiming";

const Categories = ({
//   initialCategories,
//   initialProjects,
//   totalPages: initialTotalPages,
//   initialFavourites
  initialCategories,
  initialProjects,
  totalPages: initialTotalPages,
  // initialFavourites,
}) => {
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [catalog, setCatalog] = useState(initialCategories || []);
  const [projects, setProjects] = useState(initialProjects || []);
  const [fallbackType, setFallbackType] = useState(null);
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

  useEffect(() => {
    // Only run this if the user is logged in
    if (isAuthenticated) {
      getFavouriteItems()
        .then((favRes) => {
          dispatch(setFavouriteList(favRes.data.favorites || []));
        })
        .catch((error) => {
          console.error("Error fetching favorites on client side:", error);
        });
    }
  }, [isAuthenticated, dispatch]); // This hook runs when the authentication state changes


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

  // // ssg setup
  // useEffect(() => {
  //   if (isAuthenticated && initialFavourites?.length > 0) {
  //     dispatch(setFavouriteList(initialFavourites));
  //   }
  // }, [isAuthenticated, initialFavourites, dispatch]);

  // Memoize the loadRecords function to prevent re-creation on re-renders
  // API data loader: always use args from query
  const loadRecords = useCallback(
    (page, searchText, fileType, type) => {
      const { timer } = useComponentTimer("Categories-loadRecords");
      
      startLoading();
      timer.mark('loading-started');
      
      getallprojects(page, 9, searchText, fileType, type)
        .then((response) => {
          timer.mark('api-response-received');
          setProjects(response.data?.products);
          setTotalPages(response.data.totalPages);
          setFallbackType(response.data?.fallbackType || null);
          timer.mark('state-updated');
          stopLoading();
          
          timer.complete(true, {
            page,
            projectsCount: response.data?.products?.length || 0,
            totalPages: response.data.totalPages,
            searchText,
            fileType,
            type
          });
        })
        .catch((error) => {
          timer.mark('api-error-occurred');
          stopLoading();
          timer.error(error);
          console.error("Error fetching projects:", error);
        });
    },
    [startLoading, stopLoading]
  );


  
  // Load records on query param change
  useEffect(() => {
    loadRecords(currentPage, search, file_type, type);
  }, [currentPage, search, file_type, type]); // Call loadRecords whenever it changes or currentPage changes

  // Keep filter state in sync with query params
  useEffect(() => {
    setSortType(type);
    setSortTerm(file_type);
    setSearchTerm(search);
    setSearchedText(search);
  }, [type, file_type, search]); // The URL is the single source of truth for filters.

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

  const handleSearchSubmit = (val) => {
    debouncedSearch.cancel && debouncedSearch.cancel(); // Cancel any pending debounce
    setShowSearchBreadCrumb(true);
    
    // Safely extract string value if an event object was passed by accident
    let finalSearch = searchTerm;
    if (val && typeof val === 'string') {
        finalSearch = val;
    } else if (val && val.target && typeof val.target.value === 'string') {
        finalSearch = val.target.value;
    }

    router.push({
      pathname: '/categories/1',
      query: buildQuery({
        type: sortType,
        file_type: sortTerm,
        search: finalSearch,
      })
    }, undefined, { shallow: true });
  };

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    handleSearchSubmit(searchTerm);
  };

  const handlerSearchInput = (valueOrEvent) => {
    // Extremely defensive programming to handle both direct values and event objects
    let value = "";
    if (valueOrEvent && valueOrEvent.target !== undefined) {
        value = valueOrEvent.target.value;
    } else {
        value = valueOrEvent || "";
    }
    
    setSearchTerm(value);
    debouncedSearch(value);
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
        <title>{currentPage > 1 ? `Cadbull Categories | Free & Premium AutoCAD DWG Files - Page ${currentPage}` : 'Cadbull Categories | Free & Premium AutoCAD DWG Files'}</title>
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/categories`} />
        <meta name="description" content={currentPage > 1 ? `Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More. Page ${currentPage}.` : "Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More."} />

        {/* Pagination SEO: noindex for pagination pages */}
        {currentPage > 1 && (
          <>
            <meta name="robots" content="noindex,nofollow" />
          </>
        )}

        {/* Pagination SEO: Previous/Next links */}
        {currentPage > 1 && (
          <link rel="prev" href={currentPage === 2 ? `${process.env.NEXT_PUBLIC_FRONT_URL}/categories` : `${process.env.NEXT_PUBLIC_FRONT_URL}/categories/${currentPage - 1}`} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/categories/${currentPage + 1}`} />
        )}

        <meta property="og:title" content={currentPage > 1 ? `Cadbull Categories | Free & Premium AutoCAD DWG Files - Page ${currentPage}` : 'Cadbull Categories | Free & Premium AutoCAD DWG Files'} />
        <meta property="og:description" content={currentPage > 1 ? `Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More. Page ${currentPage}.` : "Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/categories`} />
        <meta property="og:image" content={logo} />
        <meta name="twitter:title" content={currentPage > 1 ? `Cadbull Categories | Free & Premium AutoCAD DWG Files - Page ${currentPage}` : 'Cadbull Categories | Free & Premium AutoCAD DWG Files'} />
        <meta name="twitter:description" content={currentPage > 1 ? `Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More. Page ${currentPage}.` : "Discover CAD Drawing Categories with free and premium DWG Files by Architecture, Structure, Interior & More."} />
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
                    ) : `All Files`}
                  </div>
                  <div className="w-100">
                    <div className="d-flex gap-3 justify-content-xl-end justify-content-center flex-column flex-md-row">
                      <form onSubmit={handleSearch}>
                        <SearchBar
                            value={searchTerm}
                            onChange={handlerSearchInput}
                            onSubmit={handleSearchSubmit}
                            placeholder="For ex. House Plan"
                            containerClassName=""
                        />
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
              
              {fallbackType === 'partial' && searchTerm && (
                <div className="alert alert-warning text-center w-100 mb-4" role="alert">
                  We couldn't find an exact match for <strong>"{searchTerm}"</strong>. Showing files that partially match your words.
                </div>
              )}
              {fallbackType === 'latest' && searchTerm && (
                <div className="alert alert-info text-center w-100 mb-4" role="alert">
                  We couldn't find any matches for <strong>"{searchTerm}"</strong>. Here are the latest files.
                </div>
              )}

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
                <div className="col-12 py-5 text-center">
                  <div className="mb-4 d-flex justify-content-center">
                    <div className="d-flex align-items-center justify-content-center bg-light rounded-circle shadow-sm" style={{ width: "100px", height: "100px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#8c8c8c" width={45} height={45}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="fw-bold text-dark mb-3">No Results Found</h3>
                  <p className="text-muted mx-auto mb-4" style={{ maxWidth: "500px", fontSize: "16px" }}>
                    Oops! We couldn't find any CAD files matching your search. Try adjusting your filters or searching with different keywords.
                  </p>
                  <button 
                    className="btn btn-primary px-4 py-2 rounded-pill fw-medium"
                    onClick={() => {
                        setSearchTerm('');
                        handleSearchSubmit('');
                    }}
                  >
                    Clear Search
                  </button>
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

// export async function getStaticPaths() {
//   // You can generate a few pages (for demo) or as many as you want.
//   // Example: Pre-render first 10 pages statically, and use fallback: "blocking" for others.
//   const paths = Array.from({ length: 10 }).map((_, idx) => ({
//     params: { page: `${idx + 1}` },
//   }));
//   return {
//     paths,
//     fallback: "blocking", // so other pages are generated on-demand
//   };
// }

// export async function getStaticProps({ params }) {
//   const currentPage = parseInt(params?.page || "1", 10);

//   const startTime = Date.now();
//   console.log(`🎯 AMPLIFY-EVENT-SSR_START: ${JSON.stringify({
//     timestamp: startTime,
//     type: "PAGE_EVENT",
//     page: "CategoriesPage",
//     event: "ISR_START",
//     pageNum: params?.page || 1,
//     environment: process.env.NODE_ENV
//   })}`);
//   console.log(`🧠 AMPLIFY-MEMORY: ${JSON.stringify({
//     timestamp: new Date().toISOString(),
//     type: "MEMORY_USAGE",
//     page: "CategoriesPage-Start",
//     ...process.memoryUsage(),
//     environment: process.env.NODE_ENV
//   })}`);


//   // ✅ PERFORMANCE MONITORING: Track categories page generation
//   return await performance.trackPagePerformance(
//     "CategoriesPage-ISR",
//     { 
//       pageType: "ISR", 
//       isSSR: false, 
//       cacheStatus: "generating",
//       userAgent: "unknown",
//       page: currentPage
//     },
//     async () => {
//       performance.logMemoryUsage("Categories-Start", { page: currentPage });

//       try {
//         // ✅ Track API calls with performance monitoring
//         const [categoriesRes, projectsRes] = await Promise.all([
//           performance.timeAPICall("GetAllCategories-Categories", 
//             () => getallCategories(""), 
//             "getallCategories"
//           ),
//           performance.timeAPICall("GetAllProjects-Categories", 
//             () => getallprojects(currentPage, 9, "", "", ""), 
//             `getallprojects?page=${currentPage}&limit=9`
//           ),
//         ]);

//         performance.logMemoryUsage("Categories-AfterAPIs", { page: currentPage });

//         const projectCount = projectsRes?.data?.products?.length || 0;
//         const categoryCount = categoriesRes?.data?.categories?.length || 0;

//         // ✅ Log cost-generating event for ISR
//         performance.logCostEvent("ISR-Generation", {
//           page: "CategoriesPage",
//           itemCount: projectCount,
//           categoryCount: categoryCount,
//           currentPage,
//         });

//         // ✅ Generate performance summary
//         const timings = { categoriesAPI: 50, projectsAPI: 100, total: 150 }; // Placeholder - would be real in production
//         performance.generateSummary("CategoriesPage-ISR", timings);

        
//         const totalTime = Date.now() - startTime;
//         const SLOW_MS = 1500;
//         if (totalTime > SLOW_MS) {
//           console.warn(`⚠️ [SLOW-PAGE-ALERT] CategoriesPage took ${totalTime}ms - OPTIMIZATION NEEDED`);
//         }

//         // 💰 Normalized cost log (easy to parse in CloudWatch)
//         console.log(`💰 AMPLIFY-COST: ${JSON.stringify({
//           timestamp: new Date().toISOString(),
//           type: "COST_METRICS",
//           page: "CategoriesPage",
//           computeTime: totalTime,
//           memoryUsed: process.memoryUsage().heapUsed / 1024 / 1024,
//           apiCalls: 2,
//           estimatedCost: {
//             requestCost: "0.00000020",
//             computeCost: "0.00000005",
//             totalCost: "0.00000025",
//             currency: "USD",
//           },
//           environment: process.env.NODE_ENV,
//         })}`);

//         // 🧠 Normalized memory log
//         console.log(`🧠 AMPLIFY-MEMORY: ${JSON.stringify({
//           timestamp: new Date().toISOString(),
//           type: "MEMORY_USAGE",
//           page: "CategoriesPage-End",
//           ...process.memoryUsage(),
//           environment: process.env.NODE_ENV,
//         })}`);

//         return {
//           props: {
//             initialCategories: categoriesRes?.data?.categories || [],
//             initialProjects: projectsRes?.data?.products || [],
//             // totalPages: projectsRes?.data?.totalPages || 1,
//             totalPages: Math.max(1, projectsRes?.data?.totalPages || 1),
//             currentPage,
//           },
//           revalidate: 180, // ✅ REVENUE OPTIMIZATION: 5 minutes for frequent ad refresh
//         };
//       } catch (err) {
//         console.error("❌ Error in getStaticProps:", err);
//         // Return a valid props object even on error to prevent crashes
//         return {
//           props: {
//             initialCategories: [],
//             initialProjects: [],
//             totalPages: 1,
//             currentPage,
//           },
//           revalidate: 3600,
//         };
//       }
//     }
//   );
// }

export async function getServerSideProps({ params, query, req, res }) {
  const startTime = Date.now();
  const currentPage = parseInt(params?.page || "1", 10);
  
  // ✅ Early validation to block invalid page numbers and reduce server load
  if (isNaN(currentPage) || currentPage < 1 || currentPage > 10000) {
    return { notFound: true };
  }

  // ✅ Block invalid/admin paths early
  const pageStr = params?.page?.toString().toLowerCase();
  const invalidPages = ['admin', 'wp-admin', 'phpmyadmin', 'api', 'null', 'undefined', 'login'];
  if (invalidPages.includes(pageStr) || /^\d{4,}$/.test(pageStr)) {
    return { notFound: true };
  }

  // ✅ Performance tracking start
  console.log(`🎯 SSR-START: Categories page ${currentPage} at ${new Date().toISOString()}`);
  
  // ✅ Browser caching headers for better performance
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=1800');

  // ✅ PERFORMANCE MONITORING: Track categories page generation
  return await performance.trackPagePerformance(
    "CategoriesPage-SSR",
    { 
      pageType: "SSR", 
      isSSR: true, 
      cacheStatus: "fresh",
      userAgent: req.headers['user-agent'] || "unknown",
      page: currentPage
    },
    async () => {
      performance.logMemoryUsage("Categories-SSR-Start", { page: currentPage });

      try {
        // ✅ Track API calls with performance monitoring and parallel execution with timeout protection
        const apiCalls = [
          performance.timeAPICall("GetAllCategories-Categories-SSR", 
            () => getallCategories(""), 
            "getallCategories"
          ),
          performance.timeAPICall("GetAllProjects-Categories-SSR", 
            () => getallprojects(currentPage, 9, "", "", ""), 
            `getallprojects?page=${currentPage}&limit=9`
          ),
        ];

        // ✅ PRODUCTION: Set 3-second timeout for categories API calls (production servers are slower)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('CATEGORIES_API_TIMEOUT')), 3000);
        });
        
        const results = await Promise.race([
          Promise.allSettled(apiCalls),
          timeoutPromise
        ]);
        
        const [categoriesRes, projectsRes] = results;

        performance.logMemoryUsage("Categories-SSR-AfterAPIs", { page: currentPage });

        // ✅ Handle potential API failures gracefully
        const categoriesData = categoriesRes.status === 'fulfilled' ? categoriesRes.value?.data?.categories || [] : [];
        const projectsData = projectsRes.status === 'fulfilled' ? projectsRes.value?.data || {} : {};
        
        const projects = projectsData.products || [];
        const totalPages = Math.max(1, projectsData.totalPages || 1);

        // ✅ Log cost-generating event for SSR
        performance.logCostEvent("SSR-Generation", {
          page: "CategoriesPage",
          itemCount: projects.length,
          categoryCount: categoriesData.length,
          currentPage,
        });

        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        // ✅ Performance logging
        console.log(`🚀 SSR-COMPLETE: Categories page ${currentPage} generated in ${totalTime.toFixed(0)}ms`);
        
        if (totalTime > 1000) {
          console.warn(`⚠️ [SLOW-SSR-ALERT] Categories page ${currentPage} took ${totalTime.toFixed(0)}ms - may need optimization`);
        }

        // ✅ Generate performance summary
        performance.generateSummary("CategoriesPage-SSR", { 
          categoriesAPI: categoriesRes.status === 'fulfilled' ? 50 : 0, 
          projectsAPI: projectsRes.status === 'fulfilled' ? 100 : 0, 
          total: totalTime 
        });

        return {
          props: {
            initialCategories: categoriesData,
            initialProjects: projects,
            totalPages,
            currentPage,
          },
        };
      } catch (err) {
        console.error("❌ Error in Categories getServerSideProps:", err);
        
        // ✅ Graceful fallback for any unexpected errors
        return {
          props: {
            initialCategories: [],
            initialProjects: [],
            totalPages: 1,
            currentPage,
          },
        };
      }
    }
  );
}

Categories.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Categories;