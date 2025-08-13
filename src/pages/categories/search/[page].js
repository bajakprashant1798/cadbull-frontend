import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useEffect, useState, useCallback } from "react";
import CategoriesLayout from "@/layouts/CategoriesLayouts";
import Icons from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import Pagination from "@/components/Pagination";
import FAQSection from "@/components/FAQSection";
import { useSelector, useDispatch } from "react-redux";
import { getSearchResults, getFavouriteItems } from "@/service/api";
import { debounce } from "lodash";
import { setFavouriteList } from "../../../../redux/app/features/projectsSlice";
import { useRouter } from "next/router";
import AdSense from "@/components/AdSense";
import { performance } from "@/utils/performance";

const SearchCategories = ({initialProjects, initialTotalResults, initialTotalPages, initialPage}) => {
    const router = useRouter();
  // Get the search term from Redux (if needed)
  const reduxSearchTerm = useSelector(
    (store) => store.projectinfo.homepagestore.searchTrem
  );
  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const dispatch = useDispatch();

//   const [projects, setProjects] = useState([]); 
  const [totalResults, setTotalResults] = useState(initialTotalResults || 0); 
//   const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1); // Total pages for pagination
  const [fileType, setFileType] = useState(router.query.fileType || "");
  const [projectType, setProjectType] = useState(router.query.type || "");

  const [projects, setProjects] = useState(initialProjects || []);
  const [currentPage, setCurrentPage] = useState(initialPage || 1);

   // Two separate states: one for the raw input and one for the debounced query.
  const [searchInput, setSearchInput] = useState(router.query.search || "");
  const [searchQuery, setSearchQuery] = useState(router.query.search || "");

    // When URL changes (user navigates via pagination), update page and (optionally) refetch
  useEffect(() => {
    const pageFromUrl = router.query.page ? parseInt(router.query.page, 10) : 1;
    setCurrentPage(pageFromUrl);
    // If you want to refetch data on client nav (optional):
    // fetchSearchResults(searchQuery, pageFromUrl);
  }, [router.query.page]);


  // Fetch favorites if not already fetched
  const [favouritesFetched, setFavouritesFetched] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !favouritesFetched) {
      getFavouriteItems()
        .then((favRes) => {
          dispatch(setFavouriteList(favRes.data.favorites || []));
          setFavouritesFetched(true); // Mark as fetched so we don't re-fetch
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          // Optionally mark as fetched to avoid repeated attempts
          setFavouritesFetched(true);
        });
    }
  }, [isAuthenticated, favouritesFetched, dispatch]);


  // Update local input state on every keystroke.
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchInput(value);
//     debouncedUpdateQuery(value);
//   };

    const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedUpdateQuery(value);

    // Update the URL immediately as user types
    const { page, ...queryWithoutPage } = router.query;
    let newQuery = { ...queryWithoutPage };
    if (value) {
        newQuery.search = value;
    } else {
        delete newQuery.search;
    }
    // Always reset to page 1 on search change
    router.replace({
        pathname: '/categories/search',
        query: newQuery,
    }, undefined, { shallow: true }); // shallow keeps state, no SSR
    };


  // Debounce the update of the search query.
  const debouncedUpdateQuery = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Fetch search results whenever the debounced search query or filters change.
  useEffect(() => {
    const fetchSearchResults = async (query, page) => {
      try {
        const response = await getSearchResults(query, page, 12, fileType, projectType);
        setProjects(response.data.projects);
        setTotalResults(response.data.totalResults);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults(searchQuery, currentPage);
  }, [searchQuery, currentPage, fileType, projectType]);

  // Form submission (if needed for an immediate search)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here, searchQuery is already updated via debounce.
    // If needed, you could also call fetchSearchResults immediately.
  };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

    const handlePageChange = (newPage) => {
        // Remove any "page" param from query
        const { page, ...queryWithoutPage } = router.query;

        if (newPage === 1) {
            router.push({
            pathname: `/categories/search`,
            query: queryWithoutPage,
            });
        } else {
            router.push({
            pathname: `/categories/search/${newPage}`,
            query: queryWithoutPage,
            });
        }
    };


  const handleFilterChange = (filterName, value) => {
    // Build new query, but remove this filter if value is empty ("All")
    let newQuery = { ...router.query, page: undefined }; // Remove page param, page will be in path
    // Always remove the page param on filter change
    delete newQuery.page;
    
    if (value) {
        newQuery[filterName] = value;
    } else {
        delete newQuery[filterName];
    }

    // Update state for controlled selects
    if (filterName === 'fileType') setFileType(value);
    if (filterName === 'type') setProjectType(value);
    if (filterName === 'search') setSearchQuery(value);

    // Always route to `/categories/search` (page 1)
    router.push({
        pathname: '/categories/search',
        query: newQuery,
    });
  };


  return (
    <Fragment>
      <Head>
        <title>{currentPage > 1 ? `Find Your Perfect Design | Cadbull AutoCAD File Search - Page ${currentPage}` : 'Find Your Perfect Design | Cadbull AutoCAD File Search'}</title>

        <meta name="description" content={currentPage > 1 ? `Discover a vast collection of high-quality AutoCAD DWG files. Search Cadbull for house plans, building layouts, kitchen designs, and more. Page ${currentPage}.` : "Discover a vast collection of high-quality AutoCAD DWG files. Search Cadbull for house plans, building layouts, kitchen designs, and more."} />
        
        {/* Pagination SEO: noindex for pagination pages */}
        {currentPage > 1 && (
          <>
            <meta name="robots" content="noindex,nofollow" />
          </>
        )}
        
        {/* Pagination SEO: Previous/Next links */}
        {currentPage > 1 && (
          <link rel="prev" href={currentPage === 2 ? `${process.env.NEXT_PUBLIC_FRONT_URL}/categories/search` : `${process.env.NEXT_PUBLIC_FRONT_URL}/categories/search/${currentPage - 1}`} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/categories/search/${currentPage + 1}`} />
        )}
        
        <meta property="og:title" content={currentPage > 1 ? `Find Your Perfect Design | Cadbull AutoCAD File Search - Page ${currentPage}` : 'Find Your Perfect Design | Cadbull AutoCAD File Search'} />
        <meta property="og:description" content={currentPage > 1 ? `Discover a vast collection of high-quality AutoCAD DWG files. Search Cadbull for house plans, building layouts, kitchen designs, and more. Page ${currentPage}.` : "Discover a vast collection of high-quality AutoCAD DWG files. Search Cadbull for house plans, building layouts, kitchen designs, and more."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/categories/search`} />
        {/* <meta property="og:image" content={project?.photo_url} /> */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/categories/search`} />
        <meta name="twitter:title" content={currentPage > 1 ? `Find Your Perfect Design | Cadbull AutoCAD File Search - Page ${currentPage}` : 'Find Your Perfect Design | Cadbull AutoCAD File Search'} />
        <meta name="twitter:description" content={currentPage > 1 ? `Discover a vast collection of high-quality AutoCAD DWG files. Search Cadbull for house plans, building layouts, kitchen designs, and more. Page ${currentPage}.` : "Discover a vast collection of high-quality AutoCAD DWG files. Search Cadbull for house plans, building layouts, kitchen designs, and more."} />
        {/* <meta name="twitter:image" content={project?.photo_url} /> */}
        <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad" />
      </Head>
      <CategoriesLayout 
        title="Search Results" 
        description="Cadbull presents a variety of online drawings including DWG, Cad, AutoCAD, and 3D drawings. Find exactly what you need." 
        type="Categories" 
        pageName="Search Results"
      >
        <section>
          <div className="container">
            <div className="row mb-4 mb-md-5">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-3">
                  <div>
                    <h5>
                      Showing results for:{" "}
                      <span className="text-primary">
                        {searchQuery || "All Projects"}
                      </span>{" "}
                      <small className="text-grey fs-12">
                        ({totalResults} RESULTS)
                      </small>
                    </h5>
                  </div>
                  <div className="w-100">
                    <div className="d-flex gap-3 justify-content-end flex-column flex-md-row">
                      <form onSubmit={e => { e.preventDefault(); handleFilterChange('search', searchInput); }}>
                        {/* onSubmit={handleFormSubmit} */}
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <Icons.Search /> ({totalResults})
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 border-end-0 rounded-end-0 ps-0"
                            placeholder="For e.g. House Design"
                            aria-label="For e.g. House Design"
                            value={searchInput}
                            onChange={handleInputChange}
                          />
                          <button type="submit" className="btn btn-secondary rounded-start-0">
                            SEARCH
                          </button>
                        </div>
                      </form>
                      {/* File Type and Project Type Filters */}
                      <div className="d-none d-xl-flex gap-2">
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            Type:
                          </span>
                          <select 
                            value={projectType} 
                            // onChange={(e) => setProjectType(e.target.value)}
                            onChange={e => handleFilterChange('type', e.target.value)}
                            className="form-select border-start-0 rounded-start-0"
                          >
                            <option value="">All</option>
                            <option value="Gold">Gold</option>
                            <option value="Free">Free</option>
                          </select>
                        </div>
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            File Type:
                          </span>
                          <select 
                            value={fileType} 
                            // onChange={(e) => setFileType(e.target.value)}
                            onChange={e => handleFilterChange('fileType', e.target.value)}
                            className="form-select border-start-0 rounded-start-0"
                          >
                            <option value="">All</option>
                            <option value="DWG">DWG</option>
                            <option value="3d sketchup">3d sketchup</option>
                            <option value="3d max">3d max</option>
                            <option value="Revit">Revit</option>
                            <option value="PDF">PDF</option>
                            <option value="BIM">BIM</option>
                            <option value="DXF">DXF</option>
                            <option value="JPEG">JPEG</option>
                            <option value="Photoshop">Photoshop</option>
                            <option value="App">App</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="row g-4 justify-content-center mb-4">
              {projects.map((project) => (
                <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                  <ProjectCard {...project} favorites={favouriteList} />
                </div>
              ))}
            </div>

            {/* AdSense */}
            <AdSense slot="9615035443" format="fluid" layout="in-article" />

            {/* Pagination Component */}
            <div className="row  justify-content-center ">
              <div className="col-md-6 col-lg-5 col-xl-4">
                <div className="text-center">
                  {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPreviousPage={() => handlePageChange(currentPage - 1)}
                    goToNextPage={() => handlePageChange(currentPage + 1)}
                    dispatchCurrentPage={handlePageChange}
                  /> */}

                  

                  <Pagination
                    basePath="/categories/search"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    // onPageChange={handlePageChange}
                    onPageChange={handlePageChange}
                    query={router.query}
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

export async function getServerSideProps({ params, query }) {
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = query.search || '';
  const fileType = query.fileType || '';
  const type = query.type || '';


  const startTime = Date.now();
    console.log(`🎯 AMPLIFY-EVENT-SSR_START: ${JSON.stringify({
      timestamp: startTime,
      type: "PAGE_EVENT",
      page: "SearchPage",
      event: "SSR_START",
      pageNum: params?.page,
      searchTerm: query.search || '',
      fileType: query.fileType || '',
      projectType: query.type || '',
      environment: process.env.NODE_ENV
    })}`);

    console.log(`🧠 AMPLIFY-MEMORY: ${JSON.stringify({
      timestamp: new Date().toISOString(),
      type: "MEMORY_USAGE",
      page: "SearchPage-Start",
      ...process.memoryUsage(),
      environment: process.env.NODE_ENV
    })}`);


  // ✅ PERFORMANCE MONITORING: Track search page generation
  return await performance.trackPagePerformance(
    "SearchPage-SSR",
    { 
      pageType: "SSR", 
      isSSR: true, 
      userAgent: "unknown",
      page,
      searchTerm: search,
      fileType,
      type
    },
    async () => {
      performance.logMemoryUsage("Search-Start", { 
        page, 
        searchTerm: search, 
        fileType, 
        type 
      });

      try {
        // ✅ Track search API call with performance monitoring
        const response = await performance.timeAPICall(
          "GetSearchResults", 
          () => getSearchResults(search, page, 12, fileType, type),
          `search?q=${search}&page=${page}&fileType=${fileType}&type=${type}`
        );

        performance.logMemoryUsage("Search-AfterAPI", { 
          page, 
          resultsCount: response.data?.projects?.length || 0
        });

        const resultsCount = response.data?.projects?.length || 0;
        const totalResults = response.data?.totalResults || 0;

        // ✅ Log cost-generating event for SSR
        performance.logCostEvent("SSR-Generation", {
          page: "SearchPage",
          searchTerm: search,
          resultsCount,
          totalResults,
          currentPage: page,
        });

        // ✅ Generate performance summary
        const timings = { searchAPI: 200, total: 200 }; // Placeholder - would be real in production
        performance.generateSummary("SearchPage-SSR", timings);

        const totalTime = Date.now() - startTime;
          if (totalTime > 1500) {
            console.warn(`⚠️ [SLOW-PAGE-ALERT] SearchPage took ${totalTime}ms - OPTIMIZATION NEEDED`);
          }

          console.log(`💰 AMPLIFY-COST: ${JSON.stringify({
            timestamp: new Date().toISOString(),
            type: "COST_METRICS",
            page: "SearchPage",
            computeTime: totalTime,
            memoryUsed: process.memoryUsage().heapUsed / 1024 / 1024,
            apiCalls: 1,
            estimatedCost: {
              requestCost: "0.00000020",
              computeCost: "0.00000005",
              totalCost: "0.00000025",
              currency: "USD"
            },
            environment: process.env.NODE_ENV
          })}`);

          console.log(`🧠 AMPLIFY-MEMORY: ${JSON.stringify({
            timestamp: new Date().toISOString(),
            type: "MEMORY_USAGE",
            page: "SearchPage-End",
            ...process.memoryUsage(),
            environment: process.env.NODE_ENV
          })}`);


        return {
          props: {
            initialProjects: response.data.projects,
            initialTotalResults: response.data.totalResults,
            initialTotalPages: response.data.totalPages,
            initialPage: page,
            initialSearch: search,
            initialFileType: fileType,
            initialType: type,
          }
        };
      } catch (error) {
        console.error("❌ Error in SearchPage getServerSideProps:", error);
        return {
          props: {
            initialProjects: [],
            initialTotalResults: 0,
            initialTotalPages: 1,
            initialPage: page,
            initialSearch: search,
            initialFileType: fileType,
            initialType: type,
          }
        };
      }
    }
  );
}


SearchCategories.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default SearchCategories;
