import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import { Fragment, useEffect, useState, useRef, useMemo } from "react";
import SectionHeading from "@/components/SectionHeading";
import { assets } from "@/utils/assets";
import Link from "next/link";
import Icons from "@/components/Icons";
// import BIM1 from "@/assets/icons/BIM1.png";
// import BIM2 from "@/assets/icons/BIM2.png";
// import BIM3 from "@/assets/icons/BIM3.png";
// import BIM4 from "@/assets/icons/BIM4.png";
// import BIM5 from "@/assets/icons/BIM5.png";
// import principle from "@/assets/images/principal.png";
// import indvidual from "@/assets/icons/induvidual.png";
// import visualization from "@/assets/icons/visualization.png";
// import category1 from "@/assets/icons/3dDrawing.png";
// import category2 from "@/assets/icons/architecture.png";
// import category3 from "@/assets/icons/landscape.png";
// import category4 from "@/assets/icons/cadmachinery.png";
// import category5 from "@/assets/icons/details.png";
// import category6 from "@/assets/icons/DwgBlocks.png";
// import category7 from "@/assets/icons/ElectricalCad.png";
// import category8 from "@/assets/icons/furniture.png";
// import category9 from "@/assets/icons/interio.png";
// import category10 from "@/assets/icons/project.png";
// import category11 from "@/assets/icons/Stucture.png";
// import category12 from "@/assets/icons/Urbandesign.png";
// import ourSkills from "@/assets/images/our-skills.png";
// import housePlan from "@/assets/images/HOUSE-PLAN.png";
import ProjectCard from "@/components/ProjectCard";
import Pagination from '@/components/Pagination';
// import Architecture from "@/assets/images/Architecture.png";

// ✅ BIM icons
const BIM1 = assets.icons("BIM1.png");
const BIM2 = assets.icons("BIM2.png");
const BIM3 = assets.icons("BIM3.png");
const BIM4 = assets.icons("BIM4.png");
const BIM5 = assets.icons("BIM5.png");

// ✅ Category icons
const category1 = assets.icons("3dDrawing.png");
const category2 = assets.icons("architecture.png");
const category3 = assets.icons("landscape.png");
const category4 = assets.icons("cadmachinery.png");
const category5 = assets.icons("details.png");
const category6 = assets.icons("DwgBlocks.png");
const category7 = assets.icons("ElectricalCad.png");
const category8 = assets.icons("furniture.png");
const category9 = assets.icons("interio.png");
const category10 = assets.icons("project.png");
const category11 = assets.icons("Stucture.png");
const category12 = assets.icons("Urbandesign.png");

// ✅ Other images
const principle = assets.image("principal.png");
const indvidual = assets.icons("induvidual.png");
const visualization = assets.icons("visualization.png");
const ourSkills = assets.image("our-skills.png");
const housePlan = assets.image("HOUSE-PLAN.png");
const Architecture = assets.image("Architecture.png");
const logo = assets.image("logo.png");

import { getallCategories, getallprojects } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import {  getserachTerm } from "../../redux/app/features/projectsSlice";
import { useRouter } from "next/router";
import { getFavouriteItems } from "@/service/api";
import { setFavouriteList } from "../../redux/app/features/projectsSlice";
// import logo from "@/assets/images/logo.png";
import Image from "next/image";
import AdSense from "@/components/AdSense";
import { trackSearch } from "@/lib/fbpixel";
import { performance } from "@/utils/performance";
import { logPagePerformance, logCostMetrics, logAPICall, logMemoryUsage, logISRPerformance, trackPageEvent } from "@/utils/amplifyLogger";

export const drawings = [
  { img: BIM1, type: "DWG", description: "DWG", value: "DWG" },
  { img: BIM3, type: "SKP", description: "3D MODELS", value: "3d sketchup" },
  { img: BIM4, type: "MAX", description: "3D MODELS", value: "3d max" },
  { img: BIM1, type: "Revit", description: "Revit", value: "Revit" },
  { img: BIM1, type: "PDF", description: "PDF", value: "PDF" },
  // { img: BIM2, type: "BIM", description: "BIM", value: "BIM" },
  // {
  //   img: BIM5,
  //   type: "3DS",
  //   description: "3D STUDIO MAX",
  //   value: "3d sketchup",
  // },
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
  { image: category1, title: "3d Drawings", slug: "3d-Drawings", count: "20,000+" },
  { image: category2, title: "CAD Architecture", slug: "Cad-Architecture", count: "25,256+" },
  { image: category3, title: "CAD Landscape", slug: "Cad-Landscaping", count: "2,987+" },
  { image: category4, title: "CAD Machinery", slug: "Autocad-Machinery-Blocks-&-DWG-Models", count: "56,258+" },
  { image: category5, title: "Detail", slug: "Detail", count: "56,258+" },
  { image: category6, title: "DWG Blocks", slug: "DWG-Blocks", count: "48,654+" },
  { image: category7, title: "Electrical CAD", slug: "Electrical-Cad", count: "56,258+" },
  { image: category8, title: "Furnitures", slug: "Autocad-Furniture-Blocks--&-DWG-Models", count: "56,258+" },
  { image: category9, title: "Interior Design", slug: "Interior-design", count: "56,258+" },
  { image: category10, title: "Projects", slug: "Projects", count: "56,258+" },
  { image: category11, title: "Structure Detail", slug: "Structure-detail", count: "56,258+" },
  { image: category12, title: "Urban Design", slug: "Urban-design", count: "56,258+" },
];

// A simple debounce helper function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};


export default function Home({
    initialProjects,
    totalPages: initialTotalPages,
    totalProducts, // You can use this prop directly
    lastProductId,
    housePlanFiles,
    initialCategories,
    currentPage: initialCurrentPage = 1, // default to 1 if not passed
    filters = {},
}) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading,startLoading,stopLoading]=useLoading();
  
//   const [searchTerm,setSearchTerm]=useState('');
//   const [sortTerm,setSortTerm]=useState('');
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  
  const [searchInput, setSearchInput] = useState('');
  // const favouriteList = useSelector((store) => store.projectinfo.favouriteList);

  //// csr setup
  // const [projects,setProjects]=useState([]);
  // const [productCount, setProductCount] = useState(0);
  // const [currentPage,setCurrentPage]=useState(1);


  // ssg setup
  const [projects, setProjects] = useState(initialProjects);
  const [lastId, setLastId] = useState(lastProductId);

  // const [lastProductId, setLastProductId] = useState(0);

  const projectOfDayRef = useRef(null);

  const displayCategories = useMemo(() => {
    if (!initialCategories || initialCategories.length === 0) {
      return categories; // Fallback to the original hardcoded array
    }
    const categoryDataMap = new Map(initialCategories.map(c => [c.slug, c]));
    return categories.map(cat => {
      const apiData = categoryDataMap.get(cat.slug);
      return {
        ...cat,
        // Format the count and add a '+' sign
        count: apiData ? `${Number(apiData.pcount).toLocaleString('en-US')}+` : cat.count,
      };
    });
  }, [initialCategories]);

  useEffect(() => {
    setCurrentPage(initialCurrentPage || 1);
  }, [initialCurrentPage]);

  
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((state) => state.logininfo.isAuthenticated);
  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
    // console.log("favouriteList index: ", favouriteList);

  const dispatch=useDispatch();
  const router = useRouter();

    const initialSearch = filters?.search || router.query.search || '';
    const initialSort = filters?.sort || router.query.sort || '';

    const [currentPage, setCurrentPage] = useState(Number(router.query.page) || 1);
    const [searchTerm, setSearchTerm] = useState("");
    const [projectSearchInput, setProjectSearchInput] = useState('');
    const [sortTerm, setSortTerm] = useState(router.query.file_type || "");

    useEffect(() => {
      setCurrentPage(Number(router.query.page) || 1);
      setSearchTerm(router.query.search || "");
      setSortTerm(router.query.file_type || "");
    }, [router.query]);

    const buildQuery = (params) => {
        const query = {};
        // if (params.type) query.type = params.type;
        if (params.file_type) query.file_type = params.file_type;
        if (params.search) query.search = params.search;
        // page will be in path
        return query;
    };

  const [favouritesFetched, setFavouritesFetched] = useState(false);

  useEffect(() => {
    // console.log("isAuthenticated index:",isAuthenticated);
    
    if ( !favouritesFetched && isAuthenticated ) {
      // console.log("isAuthenticated index:",isAuthenticated);
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
  }, [ favouritesFetched, dispatch]);

    const loadProjects = async (page, pageSize = 9) => {
        startLoading(true);
        try {
            const response = await getallprojects(
            page,
            pageSize,
            searchTerm,
            sortTerm
            // you can add type if needed
            );
            setProjects(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            stopLoading(false);
        }
    };

  // Initial load and page change effect
  useEffect(() => {
    // Load projects whenever currentPage, searchTerm, or sortTerm change
    loadProjects(currentPage, 9);
  }, [currentPage, searchTerm, sortTerm]);


  const handlePageChange = (newPage) => {
    const newQuery = { ...router.query, page: newPage };

    // Remove "page" if 1 (so homepage stays "/")
    if (newPage === 1) delete newQuery.page;

    // Remove empty/undefined params
    Object.keys(newQuery).forEach((k) => {
      if (!newQuery[k]) delete newQuery[k];
    });

    if (typeof window !== "undefined") {
      sessionStorage.setItem("scrollToProjectOfDay", "1");
    }
    router.push({ pathname: '/', query: newQuery }, undefined, { shallow: false });
  };


  useEffect(() => {
    // Only try this on the client side
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("scrollToProjectOfDay") === "1") {
        // Scroll and remove flag
        if (projectOfDayRef.current) {
          projectOfDayRef.current.scrollIntoView({ behavior: "smooth" });
        }
        sessionStorage.removeItem("scrollToProjectOfDay");
      }
    }
  }, [currentPage, sortTerm]); // or [router.query.page] if you want



  // Debounced search function
  // const debouncedSearch = useCallback(
  //   debounce((value) => {
  //     setSearchTerm(value);
  //   }, 500),
  //   []
  // );
  // Adjust search handler to use debounce
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   const trimmedSearch = searchInput.trim();
  //   if (trimmedSearch) {
  //     // Go to the search page with query param
  //     router.push({
  //       pathname: '/categories/search',
  //       query: { search: trimmedSearch }
  //     });
  //   }
  //   // Optionally: clear search input after redirect
  //   // setSearchInput('');
  // };
    const handleSearch = (e) => {
      e.preventDefault();
      const trimmedSearch = searchInput.trim();
      if (trimmedSearch) {
        // Track search with Meta Pixel
        trackSearch(trimmedSearch);
      }
      setSearchTerm(trimmedSearch);
      dispatch(getserachTerm(trimmedSearch));
      // Now pass the search as a query parameter!
      router.push({
        pathname: '/categories/search',
        query: trimmedSearch ? { search: trimmedSearch } : {}, // only if not empty
      });
    };

    const handleProjectSearch = (e) => {
      e.preventDefault();
      const trimmed = projectSearchInput.trim();
      if (trimmed) {
        // Track search with Meta Pixel
        trackSearch(trimmed);
      }
      setSearchTerm(trimmed);
      dispatch(getserachTerm(trimmed));
      router.push({
        pathname: '/categories/search',
        query: trimmed ? { search: trimmed } : {},
      });
    };



  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const newQuery = { ...router.query, file_type: newSort, page: 1 }; // Reset to page 1

    // Remove "file_type" if "All" (empty string)
    if (!newSort) delete newQuery.file_type;

    // Remove empty/undefined params
    Object.keys(newQuery).forEach((k) => {
      if (!newQuery[k]) delete newQuery[k];
    });

    // ⭐ Set scroll flag in sessionStorage before navigation (same as handlePageChange)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("scrollToProjectOfDay", "1");
    }

    router.push({ pathname: '/', query: newQuery }, undefined, { shallow: false });
  };



  return (
    <Fragment>
      <Head>
        <title>{currentPage > 1 ? `Autocad 2D and 3D CAD Blocks & Models Library - Page ${currentPage} | Cadbull` : 'Autocad 2D and 3D CAD Blocks & Models Library | Cadbull'}</title>
        
        {/* ✅ SEO PAGINATION: Only index the main page, noindex pagination pages */}
        {currentPage > 1 && (
          <meta name="robots" content="noindex, nofollow" />
        )}
        
        {/* ✅ CANONICAL: Always point to main page for pagination */}
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}`} />
        
        <meta name="description" content={currentPage > 1 ? `Discover 269,000+ free & premium CAD files at Cadbull, 2D & 3D drawings, CAD blocks, & models across architecture, engineering & more. Page ${currentPage}.` : "Discover 269,000+ free & premium CAD files at Cadbull, 2D & 3D drawings, CAD blocks, & models across architecture, engineering & more."} />

        {/* Pagination SEO: Previous/Next links */}
        {currentPage > 1 && (
          <link rel="prev" href={currentPage === 2 ? `${process.env.NEXT_PUBLIC_FRONT_URL}` : `${process.env.NEXT_PUBLIC_FRONT_URL}?page=${currentPage - 1}`} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${process.env.NEXT_PUBLIC_FRONT_URL}?page=${currentPage + 1}`} />
        )}

        <meta property="og:title" content={currentPage > 1 ? `Autocad 2D and 3D CAD Blocks & Models Library - Page ${currentPage} | Cadbull` : 'Autocad 2D and 3D CAD Blocks & Models Library | Cadbull'} />
        <meta property="og:description" content={currentPage > 1 ? `Discover 269,000+ free & premium CAD files at Cadbull, 2D & 3D drawings, CAD blocks, & models across architecture, engineering & more. Page ${currentPage}.` : "Discover 269,000+ free & premium CAD files at Cadbull, 2D & 3D drawings, CAD blocks, & models across architecture, engineering & more."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}`} />
        <meta property="og:image" content={projects && projects.length > 0 ? projects[0]?.photo_url || logo : logo} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="CAD Blocks & Models Library - Free & Premium AutoCAD Files" />
        <meta property="og:site_name" content="Cadbull" />
        <meta property="fb:app_id" content="1018457459282520" />
        
        {/* Pinterest specific tags */}
        <meta name="pinterest-rich-pin" content="true" />
        <meta property="og:locale" content="en_US" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cadbull" />
        <meta name="twitter:creator" content="@cadbull" />
        <meta name="twitter:title" content={currentPage > 1 ? `Autocad 2D and 3D CAD Blocks & Models Library - Page ${currentPage} | Cadbull` : 'Autocad 2D and 3D CAD Blocks & Models Library | Cadbull'} />
        <meta name="twitter:description" content={currentPage > 1 ? `Discover 269,000+ free & premium CAD files at Cadbull, 2D & 3D drawings, CAD blocks, & models across architecture, engineering & more. Page ${currentPage}.` : "Discover 269,000+ free & premium CAD files at Cadbull, 2D & 3D drawings, CAD blocks, & models across architecture, engineering & more."} />
        <meta name="twitter:image" content={projects && projects.length > 0 ? projects[0]?.photo_url || logo : logo} />
        <meta name="twitter:image:alt" content="CAD Blocks & Models Library - Free & Premium AutoCAD Files" />
        <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad furniture" />
      </Head>

      {/* Hero section  */}
      <section className="hero py-3 py-md-5">
      {isLoading && <Loader/>}
        <div className="container py-3 py-md-5">
          <div className="row">
            <div className="col-md-12">
              <div className="text-center mb-md-5 mb-5">
                {/* <p className="mb-3 fw-light text-primary">
                  World Largest 2d <br />
                  <span className="fw-bold">CAD Library.</span>
                </p> */}

                <h1 className="h2 mb-0 fw-light text-primary">
                  World Largest 2d large<br />
                </h1>
                <h2 className="mb-2 h7 fw-bold fw-light text-primary">CAD Library.</h2>

                <p className="mb-4 mb-md-5">
                  {/* User */}
                  <span className="text-danger">{Number(lastId).toLocaleString("en-US")}+</span> <span className="fw-light"> Free & Premium
                  CADFiles
                  </span>
                </p>
                <Link href="/categories" className="btn btn-primary">
                  Explore Files
                </Link>
              </div>
              {/* Form  */}
              <form className="mx-auto mb-md-5" onSubmit={handleSearch}>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white">
                    <Icons.Search />
                  </span>
                  {/* <input
                    type="text"
                    className="form-control  border-start-0 border-end-0 rounded-end-0 ps-0"
                    placeholder="For e.g. House Design"
                    aria-label="For e.g. House Design"
                    onChange={(e) => {setSearchTerm(e.target.value.trim())}}
                  /> */}
                  <input
                    type="text"
                    className="form-control border-start-0 border-end-0 rounded-end-0 ps-0"
                    placeholder="For e.g. House Design"
                    aria-label="For e.g. House Design"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      // debouncedSearch(e.target.value.trim());
                    }}
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
                    <div className="col mb-2" key={index}>
                      <Link href={`/categories/1?file_type=${drawing.value}`}>
                        <div
                          className="d-flex justify-content-lg-center align-items-center gap-md-2"
                        >
                          <Image
                            src={drawing.img}
                            alt="icon"
                            width={32}
                            height={32}
                            className="img-fluid d-none d-md-block"
                            loading="lazy"
                          />
                          <div>
                            <span className="mb-1 ">{drawing.type}</span>
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
        {/* <div className="border-top border-bottom py-2"> */}
          <AdSense slot="1744284284" format="fluid" layout="in-article" />
        {/* </div> */}
      </section>

      {/* Project of the Day  */}
      <section className="py-md-5 py-3" ref={projectOfDayRef}>
       
        <div className="container">
          <div className="row mb-4 mb-md-5">
            <div className="col-md-12">
              <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-5">
                <div className="ps-5">
                  <SectionHeading
                    subHeading={"DISCOVER"}
                    mainHeading={"Files of the day"}
                    mainHeadingBold={"Cadbull"}
                  />
                </div>
                <div className="w-100">
                  <div className="d-flex gap-3 justify-content-end flex-column flex-md-row">
                    <form onSubmit={handleProjectSearch}>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <Icons.Search />
                        </span>
                        <input
                          type="text"
                          className="form-control  border-start-0 border-end-0 rounded-end-0 ps-0"
                          placeholder="For e.g. House Design"
                          aria-label="For e.g. House Design"
                          // onChange={(e) =>
                          //  setSearchTerm(e.target.value.trim())
                          // }
                          value={projectSearchInput}
                          onChange={(e) => setProjectSearchInput(e.target.value)}
                        />
                        <span className="input-group-text p-0">
                          <button
                            type="submit"
                            className="btn btn-secondary rounded-start-0"
                            // onClick={handleProjectSearch}
                            onClick={handleProjectSearch}
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
                        // onChange={(e) => setSortTerm(e.target.value)}
                        onChange={handleSortChange}
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
 
          {/* <div className="row g-4">
            {projects.map((project) => {
              return (
                <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                  <ProjectCard {...project} />
                </div>
              );
            })}
          </div> */}
          <div className="row g-4">
            {projects.slice(0, 9).map((project) => (
              <div className="col-md-6 col-lg-4" key={project.id}>
                <ProjectCard {...project} favorites={favouriteList} />
              </div>
            ))}
          </div>


          {/* Pagination  */}
          {/* <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            dispatchCurrentPage={handlePageChange}
          /> */}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          
          
          {/* <LoadMore
          currentPage={currentPage}
          totalPage={totalPages}
           loadMoreHandler={()=>{
            setCurrentPage((prev)=>prev+1)
           }}
          /> */}
        </div>
      </section>

      {/* <div className="border-top border-bottom py-2"> */}
        <AdSense slot="8339598320" format="fluid" layout="in-article" />
      {/* </div> */}

      {/* Categories */}
      <section className="py-md-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="mb-md-5 mb-4 d-flex ps-5">
                <SectionHeading
                  subHeading={"Explore All"}
                  mainHeading={"Categories"}
                  mainHeadingBold={"Cadbull"}
                  alignment="mx-auto"
                />
              </div>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {displayCategories.map((category, index) => {
              // Convert title to a slug (e.g., "3d Drawing" -> "3d-drawing")
              // const slug = category.slug.replace(/\s+/g, "-");
              const slug = category.slug
              return (
                <div className="col-lg-3 col-md-4 col-sm-6 col-10" key={index}>
                  {/* <Link href={`/categories/sub/${slug}`}> */}
                  <Link href={`/${slug}`}>
                    <div className="d-flex align-items-center gap-2 category-wrapper">
                      <Image
                        src={category.image}
                        alt="icon"
                        width={55}
                        height={55}
                        className="img-fluid"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="mb-1 h6">{category.title}</h4>
                        <p>{category.count}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* <div className="border-top border-bottom py-2"> */}
        <AdSense slot="8049838180" format="fluid" layout="in-article" />
      {/* </div> */}

      {/* Main PRINCIPLES  */}
      <section className="py-md-5 py-3">
        <div className="container">
          <div className="row gy-5 gx-lg-5">
            <div className="col-lg-6">
              <div className="main-principle-image-wrapper">
                <Image
                  src={principle}
                  width={600}
                  height={450}
                  className="img-fluid"
                  alt="principle"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="main-principle-content-wrapper">
                <div className="mb-md-4 mb-3 ps-5">
                  <SectionHeading
                    subHeading={"About Cadbull"}
                    mainHeading={"Don’t draw from scratch, draw from"}
                    mainHeadingBold={"Cadbull."}
                  />
                </div>
                <div className="mb-4">
                  <p className="mb-2">
                    Cadbull is a leading online platform offering a vast collection of free and premium CAD files, including AutoCAD drawings, DWG blocks, 2D designs, 3D models, and architectural plans. Ideal for architects, engineers, interior designers, and students, Cadbull provides easy access to house plans, furniture layouts, structural details, and electrical schematics. With over 270,000+ CAD files, the site helps professionals save time and boost productivity. Its user-friendly interface and well-organized categories make file browsing simple. Whether for residential or commercial projects, Cadbull is a trusted source for high-quality CAD resources and design inspiration. Visit www.cadbull.com to explore more.
                  </p>
                  {/* <p>
                    Cadbull is an advanced professional platform to interact and
                    excel with, offering a wide range of high quality auto cad
                    utility areas like architecture, interior and product
                    designing, 3D drawing, building plan, blocks, electrical,
                    furniture, landscaping, machinery, structural details, 3D
                    images, symbols and urban designs. Catering to more than 100
                    such categories to begin with, Cadbull is just starting out!
                  </p> */}
                </div>
                <div className="row row-cols-2">
                  {/* 1  */}
                  <div className="col">
                    <div className="d-flex flex-column h-100">
                      <div className="mb-3">
                        <Image
                          src={visualization}
                          alt="icon"
                          width={55}
                          height={55}
                          className="img-fluid"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="fw-bold text-primary text-capitalize h6">
                          Cad Visualization
                        </h4>
                        <p className="mb-2">
                          High-quality CAD drawings for precise interior and architectural design.
                        </p>
                      </div>
                      {/* <div className="mt-auto">
                        <button className="btn transparent-btn shadow-none">
                          READ MORE
                        </button>
                      </div> */}
                    </div>
                  </div>
                  {/* 1  */}
                  <div className="col">
                    <div className="d-flex flex-column h-100">
                      <div className="mb-3">
                        <Image
                          src={indvidual.src}
                          alt="icon"
                          width={55}
                          height={55}
                          className="img-fluid"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="fw-bold text-primary text-capitalize h6">
                          Customized Projects
                        </h4>
                        <p className="mb-2">
                          Editable CAD files tailored for all types of design projects.
                        </p>
                      </div>
                      {/* <div className="mt-auto">
                        <button className="btn transparent-btn shadow-none">
                          READ MORE
                        </button>
                      </div> */}
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
                  {/* Get Incredible Files Right Now! */}
                  Custom CAD Drawing Services for Your Project Needs
                </h3>
                <p className="mb-4 mb-md-5 text-white">
                  {/* At every stage, we could supervise your project – controlling
                  all the details and consulting the builders. */}
                  Our team is equipped to develop drawings tailored to your specific requirements. Please feel free to contact us to discuss your project needs.
                </p>
                <Link href="/contact-us" passHref>
                  <button className="btn btn-light">GET IN TOUCH</button>
                </Link>
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
                    subHeading={"OUR EXPERTISE"}
                    mainHeading={"The Core Strengths of"}
                    mainHeadingBold={"Cadbull"}
                  />
                </div>
                <p className="mb-1 mb-md-2">
                  <strong>Cadbull</strong> is a trusted global platform offering 270,000+ ready-to-use CAD blocks, AutoCAD drawings, 2D floor plans, and 3D models. Whether you’re an architect, engineer, interior designer, or student, Cadbull makes designing faster, smarter, and more professional. From residential layouts to mechanical schematics and landscaping plans, we provide high-quality resources to power every project.
                </p>
                <p className="mb-3 mb-md-3 pb-3 pb-md-3 border-bottom ">
                  Join thousands of professionals who rely on Cadbull for precise drafting, creative inspiration, and time-saving CAD solutions.
                </p>
              </div>

              <div className="d-flex flex-column gap-4">
                {/* CAD Planing Design */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h4 className="text-gray h5 mb-0">CAD Planning & Drafting</h4>
                      <p>Complete sets of architectural, civil, and structural planning files to <br /> suit all building types.</p>
                    </div>
                    <h4 className="text-gray h5 mb-0">98%</h4>
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
                    <div>
                      <h4 className="text-gray h5 mb-0">3D Modeling & Visualization</h4>
                      <p>Explore a wide range of 3D blocks and designs for realistic modeling and presentation.</p>
                    </div>
                    <h4 className="text-gray h5 mb-0">95%</h4>
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
                    <div>
                      <h4 className="text-gray h5 mb-0">2D Floor Plans & Layout Design</h4>
                      <p>Accurate, scalable 2D drawings ready for residential, commercial,<br /> and industrial projects.</p>
                    </div>
                    <h4 className="text-gray h5 mb-0">90%</h4>
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
                <Image src={ourSkills} alt="skills" className="img-fluid" width={550} height={500} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Your Business */}
      {/* <section className="py-3 py-md-4">
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
      </section> */}

      {/* Architecture House Plan */}
      <section className="py-3 py-md-4">
        <div className="container">
          <div className="row d-lg-none">
            <div className="col-md-12">
              <div>
                <Image
                  src={Architecture}
                  className="w-100 img-fluid"
                  width={1200}
                  height={400}
                  alt="cta"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="row bg-danger rounded-xl align-items-center d-none d-lg-flex">
            <div className="col-lg-5 ps-0">
              <Image src={housePlan} width={500} height={200} className="w-100" alt="house plan" loading="lazy" />
            </div>
            <div className="col-lg-4">
              <div className="text-center">
                <h4 className="text-white mb-2 fw-normal">
                  Architecture House Plan CAD Drawings CAD Blocks &
                </h4>
                <h4 className="text-white">
                  {/* <b>{Number(housePlanFiles).toLocaleString()} Files</b> */}
                  <b>
                    {/* {Number(housePlanFiles).toLocaleString("en-US")} */}
                    30000+ Files
                  </b>
                </h4>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="text-center">
                <Link href="/Architecture-House-Plan-CAD-Drawings" passHref>
                  <button className="btn btn-danger">GET YOUR HOUSE PLAN</button>
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Project of the Day  */}
      {/* <section className="py-md-5 py-3">
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
      </section> */}

      {/* Get Off */}
      {/* <GetOff /> */}
    </Fragment>
  );
}

// // ✅ COST OPTIMIZATION: Convert to ISR for 95% cost reduction + Better AdSense performance
// export async function getStaticProps({ params }) {
//   // ===== TEST LOGS FOR CLOUDWATCH DEBUGGING =====
//   console.log('🧪 [TEST-LOG] Homepage getStaticProps started');
//   console.log('🧪 [TEST-LOG] Environment:', process.env.NODE_ENV);
//   console.log('🧪 [TEST-LOG] Timestamp:', new Date().toISOString());
//   console.log('🧪 [TEST-LOG] AWS Request ID:', process.env.AWS_REQUEST_ID || 'local');
  
//   const timings = {};
//   const startTime = Date.now();
  
//   return await performance.trackPagePerformance('Homepage', { 
//     pageType: 'ISR', 
//     isSSR: false, 
//     cacheStatus: 'generating' 
//   }, async () => {
//     try {
//       console.log('🧪 [TEST-LOG] Inside performance tracking function');
      
//       // Static generation with ISR = much cheaper than SSR but maintains fresh content
//       const page = 1; // Homepage always shows page 1 for ISR
//       const search = "";
//       const file_type = "";

//       // 🧠 Memory tracking for both systems
//       performance.logMemoryUsage('Homepage-Start');
//       const initialMemory = process.memoryUsage();
//       logMemoryUsage('Homepage', initialMemory);

//       console.info('🧪 [AMPLIFY-LOG] About to call projects API');
      
//       // Track projects API call with both systems
//       const projectsStartTime = Date.now();
//       const projectRes = await performance.timeAPICall(
//         'GetAllProjects-Homepage',
//         () => getallprojects(page, 9, search, file_type),
//         `getallprojects?page=${page}&limit=9`
//       );
//       const projectsDuration = Date.now() - projectsStartTime;
//       timings.projectsAPI = projectsDuration;

//       // 🌐 Amplify: Log API call performance
//       logAPICall('getallprojects', projectsDuration, 200, JSON.stringify(projectRes.data).length);

//       console.info('🧪 [AMPLIFY-LOG] Projects API completed, calling categories API');

//       // Track categories API call with both systems
//       const categoriesStartTime = Date.now();
//       const categoryRes = await performance.timeAPICall(
//         'GetAllCategories-Homepage',
//         () => getallCategories(),
//         'getallCategories'
//       );
//       const categoriesDuration = Date.now() - categoriesStartTime;
//       timings.categoriesAPI = categoriesDuration;

//       // 🌐 Amplify: Log API call performance
//       logAPICall('getallCategories', categoriesDuration, 200, JSON.stringify(categoryRes.data).length);

//       // 🧠 Memory tracking after APIs
//       performance.logMemoryUsage('Homepage-AfterAPIs');
//       const afterAPIMemory = process.memoryUsage();
//       logMemoryUsage('Homepage-AfterAPIs', afterAPIMemory);

//       console.info('🧪 [AMPLIFY-LOG] Both APIs completed successfully');

//       // Log cost event for ISR generation (existing)
//       performance.logCostEvent('ISR-Generation', {
//         page: 'Homepage',
//         itemCount: projectRes.data.products?.length || 0,
//         categoryCount: categoryRes.data.categories?.length || 0,
//       });

//       const totalTime = Date.now() - startTime;
      
//       // 📊 Amplify: Log ISR performance
//       logISRPerformance('Homepage', {
//         generationTime: totalTime,
//         cacheHit: false, // This is always a miss for ISR generation
//         projectsCount: projectRes.data.products?.length || 0,
//         categoriesCount: categoryRes.data.categories?.length || 0,
//         memoryUsed: afterAPIMemory.heapUsed,
//         apiCallsCount: 2
//       });

//       // 💰 Amplify: Log cost metrics
//       logCostMetrics('Homepage', {
//         computeTime: totalTime,
//         memoryUsed: afterAPIMemory.heapUsed / 1024 / 1024, // Convert to MB
//         apiCalls: 2,
//         dataSize: (JSON.stringify(projectRes.data).length + JSON.stringify(categoryRes.data).length) / 1024 // KB
//       });

//       const result = {
//         props: {
//           initialProjects: projectRes.data.products || [],
//           totalPages: projectRes.data.totalPages || 1,
//           totalProducts: projectRes.data.totalProducts || 0,
//           lastProductId: projectRes.data.lastProductId || 0,
//           housePlanFiles: projectRes.data.housePlanFiles || 0,
//           currentPage: page,
//           filters: { search, file_type },
//           initialCategories: categoryRes.data.categories || [],
//         },
//         // ✅ ISR: Regenerate every 30 minutes for fresh content + AdSense revenue
//         revalidate: 1800, // 30 minutes = fresh content without constant server load
//       };

//       timings.total = totalTime;
//       performance.generateSummary('Homepage-ISR', timings);
      
//       // 🚀 Amplify: Log final performance summary
//       logPagePerformance('Homepage', {
//         totalTime,
//         projectsAPITime: projectsDuration,
//         categoriesAPITime: categoriesDuration,
//         memoryPeak: afterAPIMemory.heapUsed,
//         dataTransferred: (JSON.stringify(result.props).length / 1024).toFixed(2) + 'KB',
//         isrRevalidate: 1800
//       });
      
//       console.info('🧪 [AMPLIFY-LOG] Homepage getStaticProps completed successfully');
      
//       return result;
//     } catch (error) {
//       console.error('🧪 [AMPLIFY-ERROR] ERROR in homepage getStaticProps:', error);
//       console.error('Error in homepage getStaticProps:', error);
      
//       // Log error with both systems
//       performance.logCostEvent('ISR-Error', {
//         page: 'Homepage',
//         error: error.message,
//       });
      
//       // 📊 Amplify: Log error details
//       logCostMetrics('Homepage-Error', {
//         computeTime: Date.now() - startTime,
//         memoryUsed: process.memoryUsage().heapUsed / 1024 / 1024,
//         apiCalls: 0,
//         dataSize: 0
//       });
      
//       return {
//         props: {
//           initialProjects: [],
//           totalProducts: 0,
//           lastProductId: 0,
//           housePlanFiles: 0,
//           currentPage: 1,
//           filters: { search: "", file_type: "" },
//           initialCategories: [],
//         },
//         revalidate: 1800, // Still revalidate on error
//       };
//     }
//   });
// }

// pages/index.js
export async function getServerSideProps({ req, res, query }) {
  const page = Number(query.page || 1);
  const search = (query.search || "").toString();
  const file_type = (query.file_type || "").toString();

  // ⚠️ Important: short CDN cache + generous stale window
  // CloudFront/Proxy will cache HTML for 60s and can serve stale for 5 min while revalidating
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  try {
    const [projectRes, categoryRes] = await Promise.all([
      getallprojects(page, 9, search, file_type),
      getallCategories()
    ]);

    return {
      props: {
        initialProjects: projectRes?.data?.products || [],
        totalPages: projectRes?.data?.totalPages || 1,
        totalProducts: projectRes?.data?.totalProducts || 0,
        lastProductId: projectRes?.data?.lastProductId || 0,
        housePlanFiles: projectRes?.data?.housePlanFiles || 0,
        currentPage: page,
        filters: { search, file_type },
        initialCategories: categoryRes?.data?.categories || [],
      },
    };
  } catch (e) {
    // Graceful fallback
    return {
      props: {
        initialProjects: [],
        totalPages: 1,
        totalProducts: 0,
        lastProductId: 0,
        housePlanFiles: 0,
        currentPage: 1,
        filters: { search: "", file_type: "" },
        initialCategories: [],
      },
    };
  }
}


Home.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export { debounce };