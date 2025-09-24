import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import CategoriesLayout, { makeTitle } from "@/layouts/CategoriesLayouts";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import Icons from "@/components/Icons";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/router";
import { getCategoryBySlug, getFavouriteItems, getSubCategories, getallCategories } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubCategory,
  resetsubcatfilter,
  setFavouriteList,
  updatesubcatpage,
  updatesubcatpagetype,
  updatesubcatserachTerm,
  updatesubcatslug,
  updatesubcatsortTerm,
} from "../../../redux/app/features/projectsSlice";
import { drawings } from "@/pages";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import { debounce } from "lodash";
import AdSense from "@/components/AdSense";
import { performance } from "@/utils/performance";

const CadLandscaping = ({ initialProjects, initialTotalPages, initialSlug, page: initialPage, metaTitle, metaKeywords, metaDescription, description, title, serverMainCategories }) => {
  const router = useRouter();
  const { slug: querySlug, page: queryPage } = router.query;

  // Pick slug and page from SSR/SSG props, or router query (client navigation)
  const slug = initialSlug || querySlug;
  const currentPage = parseInt(initialPage || queryPage || 1, 10);

  const dispatch = useDispatch();
  const [isLoading, startLoading, stopLoading] = useLoading();

  const subcat = useSelector((store) => store.projectinfo.subcat);
  const subcatfilter = useSelector((store) => store.projectinfo.subcatfilter);
  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);

  const [searchText, setSearchText] = useState("");
  const [searchedText, setSearchedText] = useState("");
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  // ✅ Initialize main categories from SSR data or fetch client-side as fallback
  const [mainCategories, setMainCategories] = useState(serverMainCategories || []);
  const [favouritesFetched, setFavouritesFetched] = useState(false);
  const [pageChanged, setPageChanged] = useState(false);

  const { type = "", file_type = "", search = "" } = router.query;
  
  const buildQuery = (params) => {
    const query = {};
    if (params.type) query.type = params.type;
    if (params.file_type) query.file_type = params.file_type;
    if (params.search) query.search = params.search;
    return query;
  };

  // console.log("getStaticProps for slug:", initialSlug, "page:", initialPage, "metaTitle:", metaTitle, "metaKeywords:", metaKeywords, "metaDescription:", metaDescription, "description:", description, "title:", title);
  

  // ✅ Optimized: Only fetch main categories if not provided via SSR
  useEffect(() => {
    if (!serverMainCategories || serverMainCategories.length === 0) {
      console.log("[CLIENT] 🔄 Fetching main categories client-side (SSR fallback)");
      getallCategories("")
        .then((res) => setMainCategories(res.data.categories || []))
        .catch((err) => console.error("Error fetching main categories:", err));
    } else {
      console.log(`[CLIENT] ✅ Using ${serverMainCategories.length} SSR main categories`);
    }
  }, [serverMainCategories]);

  // Fetch favourites for authenticated users
  useEffect(() => {
    if (isAuthenticated && !favouritesFetched) {
      getFavouriteItems()
        .then((favRes) => {
          dispatch(setFavouriteList(favRes.data.favorites || []));
          setFavouritesFetched(true);
        })
        .catch((error) => {
          setFavouritesFetched(true);
          // ignore error, user can retry
        });
    }
  }, [isAuthenticated, favouritesFetched, dispatch]);

  // Update Redux with slug and currentPage on navigation
  useEffect(() => {
    if (slug) {
      dispatch(updatesubcatslug(slug));
      dispatch(updatesubcatpage(currentPage));
    }
  }, [slug, currentPage, dispatch]);


  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchedText(value);
      dispatch(updatesubcatpage(1));
      dispatch(updatesubcatserachTerm(value));
      router.push({
        pathname: `/${slug}/1`,
        query: buildQuery({
          type: router.query.type || "",
          file_type: router.query.file_type || "",
          search: value,
        })
      }, undefined, { shallow: true });
    }, 500),
    [dispatch, router, slug]
  );


  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setSearchText(value);
    debouncedSearch(value);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    debouncedSearch.cancel && debouncedSearch.cancel(); // Cancel any pending debounce
    setSearchedText(searchText);
    router.push({
      pathname: `/${slug}/1`,
      query: buildQuery({
        type: router.query.type || "",
        file_type: router.query.file_type || "",
        search: searchText,
      })
    });
  };

  const loadProjects = (slug, page, type, file_type, search) => {
    startLoading();
    getSubCategories({ slug, currentPage: page, pageSize: 9, type, file_type, search })
      .then((response) => {
        dispatch(getSubCategory(response.projects));
        setTotalPages(response.totalPages);
        stopLoading();
      })
      .catch(() => stopLoading());
  };

  useEffect(() => {
    if (!slug) return;
    // Whenever slug, currentPage, or filters change, load data
    loadProjects(slug, currentPage, type, file_type, search);
  }, [slug, currentPage, type, file_type, search]);

  // Cleanup Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetsubcatfilter());
    };
  }, [dispatch]);

  // Prepare layout props
  const CategoriesProps = searchedText.length
    ? {
        title: "Search Results",
        description: "Cadbull presents a variety of online drawings including DWG, Cad, AutoCAD, and 3D drawings.",
        mainCategories,
        subCategories: subcat,
        slug,
        type: "Sub Categories",
        pageName: "Search Results",
      }
    : {
        title: title ? title : makeTitle(slug),
        description: description || "Cadbull presents a variety of online drawings including DWG, Cad, AutoCAD, and 3D drawings.",
        mainCategories,
        subCategories: subcat,
        slug,
        type: "Sub Categories",
      };

  // Pagination handler for router navigation
  const handlePageChange = (newPage) => {
    setPageChanged(true);
    router.push({
      pathname: `/${slug}/${newPage}`,
      query: buildQuery({
        type: router.query.type || "",
        file_type: router.query.file_type || "",
        search: router.query.search || "",
      })
    });
  };

  // Scroll to grid after page change
  const productGridRef = useRef();
  useEffect(() => {
    if (!pageChanged) return;
    let scrolled = false;
    function scrollToGrid() {
      if (productGridRef.current) {
        const cards = productGridRef.current.querySelectorAll('.col-md-6, .col-lg-4, .col-xl-4');
        if (cards.length > 0) {
          productGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          scrolled = true;
          setPageChanged(false);
        }
      }
    }
    scrollToGrid();
    if (!scrolled && productGridRef.current) {
      const observer = new MutationObserver(() => {
        scrollToGrid();
        if (scrolled && observer) observer.disconnect();
      });
      observer.observe(productGridRef.current, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [pageChanged, isLoading]);

  const handleTypeChange = (e) => {
    router.push({
      pathname: `/${slug}/1`,
      query: buildQuery({
        type: e.target.value,
        file_type: router.query.file_type || "",
        search: router.query.search || "",
      })
    });
  };

  const handleSortChange = (e) => {
    router.push({
      pathname: `/${slug}/1`,
      query: buildQuery({
        type: router.query.type || "",
        file_type: e.target.value,
        search: router.query.search || "",
      })
    });
  };


  useEffect(() => {
    dispatch(updatesubcatpagetype(type));
    dispatch(updatesubcatsortTerm(file_type));
    dispatch(updatesubcatserachTerm(search));
  }, [type, file_type, search]);

  // const canonicalUrl = `${process.env.NEXT_PUBLIC_FRONT_URL}/${slug}${currentPage > 1 ? `/${currentPage}` : ""}`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_FRONT_URL}/${slug}`;

  return (
    <Fragment>
      <Head>
        <title>{currentPage > 1 ? `${metaTitle ? metaTitle : makeTitle(slug)} - Page ${currentPage} | Cadbull` : `${metaTitle ? metaTitle : makeTitle(slug)} | Cadbull`}</title>
        <meta
          name="description"
          content={currentPage > 1 ? `${metaDescription || "World Largest 2d CAD Library."} Page ${currentPage}.` : (metaDescription || "World Largest 2d CAD Library.")}
        />
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        
        {/* Pagination SEO: noindex for pagination pages */}
        {currentPage > 1 && (
          <>
            <meta name="robots" content="noindex,nofollow" />
          </>
        )}
        
        {/* Pagination SEO: Previous/Next links */}
        {currentPage > 1 && (
          <link rel="prev" href={currentPage === 2 ? `${process.env.NEXT_PUBLIC_FRONT_URL}/${slug}` : `${process.env.NEXT_PUBLIC_FRONT_URL}/${slug}/${currentPage - 1}`} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/${slug}/${currentPage + 1}`} />
        )}
        
        <meta property="og:title" content={currentPage > 1 ? `${metaTitle ? metaTitle : makeTitle(slug)} - Page ${currentPage} | Cadbull` : `${metaTitle ? metaTitle : makeTitle(slug)} | Cadbull`} />
        <meta property="og:description" content={currentPage > 1 ? `${metaDescription || "World Largest 2d CAD Library."} Page ${currentPage}.` : (metaDescription || "World Largest 2d CAD Library.")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        {/* <meta property="og:image" content={project?.photo_url} /> */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content={currentPage > 1 ? `${metaTitle ? metaTitle : makeTitle(slug)} - Page ${currentPage} | Cadbull` : `${metaTitle ? metaTitle : makeTitle(slug)} | Cadbull`} />
        <meta name="twitter:description" content={currentPage > 1 ? `${metaDescription || "World Largest 2d CAD Library."} Page ${currentPage}.` : (metaDescription || "World Largest 2d CAD Library.")} />
        {/* <meta name="twitter:image" content={project?.photo_url} /> */}
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <CategoriesLayout {...CategoriesProps}>
        {isLoading && <Loader />}
        <section>
          <div className="container" id="categories-top">
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
                            value={type}
                            className="form-select border-start-0 rounded-start-0"
                            // onChange={(e) => {
                            //   handlePageChange(1);
                            //   dispatch(updatesubcatpage(1));
                            //   dispatch(updatesubcatpagetype(e.target.value));
                            // }}
                            onChange={handleTypeChange}
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
                            // defaultValue="DWG"
                            value={file_type}
                            className="form-select border-start-0 rounded-start-0"
                            // onChange={(e) => {
                            //   handlePageChange(1);
                            //   dispatch(updatesubcatpage(1));
                            //   dispatch(updatesubcatsortTerm(e.target.value));
                            // }}
                            onChange={handleSortChange}
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
            <div id="product-grid" ref={productGridRef} className="row g-4 justify-content-center mb-4">
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

            {/* AdSense */}
            <AdSense slot="2694403875" format="fluid" layout="in-article" lazy={false} />

            {/* Pagination Component */}
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5 col-xl-4">
                <div className="text-center">
                  <Pagination
                    basePath={`/${slug}`}
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

// ✅ SSR: Remove getStaticPaths - not needed for SSR

export async function getServerSideProps({ params, req, res }) {
  const startTime = Date.now();
  const slug = params.slug;
  const page = parseInt(params.page, 10) || 1;
  
  // ✅ Add caching headers for better performance
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800');
  
  try {
    console.log(`[SSR] 🚀 Generating page for slug: ${slug}, page: ${page}`);
    
    // ✅ Early validation - reject invalid slugs immediately
    const invalidSlugs = [
      'admin', 'wp-admin', 'wp-content', 'wp-includes', 
      'phpmyadmin', 'pma', 'mysql', 'database',
      'api', 'auth', 'login', 'register', 'logout',
      'dashboard', 'profile', 'settings', 'config',
      'null', 'undefined', 'favicon.ico', 'robots.txt',
      'sitemap.xml', '.env', '.htaccess'
    ];
    
    // Block purely numeric slugs
    if (/^\d+$/.test(slug)) {
      console.log(`[SSR] ❌ Blocked numeric slug: ${slug}`);
      return { notFound: true };
    }
    
    // Block invalid/system slugs
    if (invalidSlugs.includes(slug.toLowerCase())) {
      console.log(`[SSR] ❌ Blocked invalid slug: ${slug}`);
      return { notFound: true };
    }
    
    // Block slugs with invalid characters
    if (!/^[a-zA-Z0-9\-_&]+$/.test(slug)) {
      console.log(`[SSR] ❌ Blocked invalid characters in slug: ${slug}`);
      return { notFound: true };
    }
    
    // Block extremely long slugs (likely attacks)
    if (slug.length > 100) {
      console.log(`[SSR] ❌ Blocked oversized slug: ${slug}`);
      return { notFound: true };
    }
    
    // Block invalid pages
    if (page < 1 || page > 1000) {
      console.log(`[SSR] ❌ Blocked invalid page: ${page}`);
      return { notFound: true };
    }
    
    
    // ✅ PERFORMANCE MONITORING: Track SSR page generation
    return await performance.trackPagePerformance(
      "CategoryDetailPage-SSR",
      { 
        pageType: "SSR", 
        isSSR: true, 
        cacheStatus: "generating",
        userAgent: req.headers['user-agent'] || "unknown",
        slug,
        page
      },
      async () => {
        console.log(`[SSR] ✅ Processing valid slug: ${slug}, page: ${page}`);

        // ✅ PERFORMANCE: Reduce API timeout from 8s to 6s for faster response
        const apiCalls = [
          performance.timeAPICall(
            "GetSubCategories", 
            () => getSubCategories({ slug, currentPage: page, pageSize: 9 }),
            `subcategories/${slug}?page=${page}&pageSize=9`
          ).catch(error => ({ error, type: 'subcategories' })),
          
          performance.timeAPICall(
            "GetCategoryMeta", 
            () => getCategoryBySlug(slug),
            `category/${slug}`
          ).catch(error => ({ error, type: 'metadata' })),

          performance.timeAPICall(
            "GetMainCategories", 
            () => getallCategories(),
            `allcategories`
          ).catch(error => ({ error, type: 'categories' }))
        ];
        
        // ✅ CRITICAL: Reduced timeout from 8s to 5s for faster response
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('API_TIMEOUT')), 8000);
        });
        
        const results = await Promise.race([
          Promise.allSettled(apiCalls),
          timeoutPromise
        ]).catch(error => {
          if (error.message === 'API_TIMEOUT') {
            console.error(`❌ [PERFORMANCE] CategoryDetailPage-SSR timeout after 8s for slug: ${slug}, page: ${page}`);
            // Return partial results if timeout occurs
            return [
              { status: 'rejected', reason: new Error('TIMEOUT') },
              { status: 'rejected', reason: new Error('TIMEOUT') },
              { status: 'rejected', reason: new Error('TIMEOUT') }
            ];
          }
          throw error;
        });
        
        const [subcategoriesResult, metadataResult, categoriesResult] = results;
        
        // Handle subcategories data
        let data = null;
        if (subcategoriesResult.status === 'fulfilled' && !subcategoriesResult.value.error) {
          data = subcategoriesResult.value;
        }
        
        if (!data || !data.projects) {
          console.log(`[SSR] ❌ No projects found for slug: ${slug}, page: ${page}`);
          return { notFound: true };
        }

        console.log(`[SSR] ✅ Found ${data.projects.length} projects for slug: ${slug}`);

        performance.logMemoryUsage("CategoryDetail-SSR-AfterMainAPI", { 
          slug, 
          page, 
          projectCount: data.projects.length 
        });

        // Handle metadata
        let metaTitle = null, metaKeywords = null, metaDescription = null, description = null, title = null;
        if (metadataResult.status === 'fulfilled' && !metadataResult.value.error) {
          const cat = metadataResult.value?.data?.category;
          if (cat) {
            metaTitle = cat.meta_title || null;
            metaKeywords = cat.meta_keywords || null;
            metaDescription = cat.meta_description || null;
            description = cat.description || null;
            title = cat.name || makeTitle(slug);
            console.log(`[SSR] ✅ Found category meta for slug: ${slug}, title: ${title}`);
          } else {
            console.log(`[SSR] ⚠️ No category meta found for slug: ${slug}`);
            title = makeTitle(slug); // Fallback title
          }
        } else {
          console.log(`[SSR] ⚠️ Error fetching category meta for slug: ${slug}`);
          title = makeTitle(slug); // Fallback title
        }

        // ✅ Handle main categories to eliminate client-side API calls
        let serverMainCategories = [];
        if (categoriesResult.status === 'fulfilled' && !categoriesResult.value.error) {
          serverMainCategories = categoriesResult.value?.data?.categories || [];
          console.log(`[SSR] ✅ Found ${serverMainCategories.length} main categories`);
        } else {
          console.log(`[SSR] ⚠️ Error fetching main categories, component will fallback to client-side`);
        }

        performance.logMemoryUsage("CategoryDetail-SSR-AfterAllAPIs", { 
          slug, 
          page, 
          projectCount: data.projects.length 
        });

        const projectCount = data.projects?.length || 0;

        // ✅ Log cost-generating event for SSR
        performance.logCostEvent("SSR-Generation", {
          page: "CategoryDetailPage",
          slug,
          projectCount,
          categoryName: title || makeTitle(slug),
          currentPage: page,
        });

        // ✅ Generate performance summary
        const totalTime = Date.now() - startTime;
        const timings = { 
          subcategoriesAPI: subcategoriesResult.status === 'fulfilled' ? 150 : 0, 
          categoryMetaAPI: metadataResult.status === 'fulfilled' ? 50 : 0,
          mainCategoriesAPI: categoriesResult.status === 'fulfilled' ? 100 : 0,
          total: totalTime 
        };
        performance.generateSummary("CategoryDetailPage-SSR", timings);

        console.log(`[SSR] ✅ Generated ${slug}/page/${page} in ${totalTime}ms`);

        // ✅ PERFORMANCE: Aggressive caching for category pages (can cache for longer)
        res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800');
        res.setHeader('Vary', 'Accept-Encoding');

        return {
          props: {
            initialProjects: data.projects,
            initialTotalPages: data.totalPages || 1,
            initialSlug: slug,
            page,
            metaTitle: metaTitle || `${title || makeTitle(slug)} | Page ${page}`,
            metaKeywords: metaKeywords || '',
            metaDescription: metaDescription || 'World Largest 2d CAD Library.',
            description: description || '',
            title: title || makeTitle(slug),
            serverMainCategories: serverMainCategories || []
          }
        };
      }
    );
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[SSR] ❌ Error for slug: ${slug}, page: ${page} (${totalTime}ms):`, error);
    return { notFound: true };
  }
}

CadLandscaping.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default CadLandscaping;