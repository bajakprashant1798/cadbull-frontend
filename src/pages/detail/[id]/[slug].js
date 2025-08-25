import dynamic from 'next/dynamic';
import { assets } from "@/utils/assets";
import { Fragment, createElement, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Icons from "@/components/Icons";
// import profile_dummy from "@/assets/icons/profile.png";
import SectionHeading from "@/components/SectionHeading";
import FileDescription from "@/components/FileDescription";
// import autoCad from "@/assets/images/filetype/file_white.png";
// import cad from "@/assets/images/filetype/cad.png";
// import goldblocks from "@/assets/images/filetype/file.png";
import ProjectCard from "@/components/ProjectCard";
import MainLayout from "@/layouts/MainLayout";
// import link from "@/assets/icons/social/link.png";
import { useRouter } from "next/router";
import {
  addFavouriteItem,
  removeFavouriteItem,
  getCategoriesWithSubcategories,
  getallCategories,
  getsimilerllprojects,
  getsingleallprojects,
  getFavouriteItems,
  getallprojects, // ✅ Add this here
} from "@/service/api";
import { requireAuth } from "@/utils/redirectHelpers";
import { logPagePerformance, logCostMetrics, logAPICall, logMemoryUsage, trackPageEvent } from "@/utils/amplifyLogger";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllCategoriesData,
  addCategoryAndSubCategoryData,
  addedFavouriteItem,
  deleteFavouriteItem,
  getSimilarProjectsPage,
  setFavouriteList,
  updatesubcatpage,
  updatesubcatslug,
} from "../../../../redux/app/features/projectsSlice";

// ✅ SPEED OPTIMIZATION: Lazy load social share components for better performance
const EmailIcon = dynamic(() => import('react-share').then(mod => mod.EmailIcon), { 
  ssr: false,
  loading: () => <div className="social-icon-placeholder" style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f0f0f0' }} />
});
const EmailShareButton = dynamic(() => import('react-share').then(mod => mod.EmailShareButton), { ssr: false });
const FacebookIcon = dynamic(() => import('react-share').then(mod => mod.FacebookIcon), { 
  ssr: false,
  loading: () => <div className="social-icon-placeholder" style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#1877f2' }} />
});
const FacebookMessengerIcon = dynamic(() => import('react-share').then(mod => mod.FacebookMessengerIcon), { 
  ssr: false,
  loading: () => <div className="social-icon-placeholder" style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#00b2ff' }} />
});
const FacebookMessengerShareButton = dynamic(() => import('react-share').then(mod => mod.FacebookMessengerShareButton), { ssr: false });
const FacebookShareButton = dynamic(() => import('react-share').then(mod => mod.FacebookShareButton), { ssr: false });
const LinkedinIcon = dynamic(() => import('react-share').then(mod => mod.LinkedinIcon), { 
  ssr: false,
  loading: () => <div className="social-icon-placeholder" style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#0077b5' }} />
});
const LinkedinShareButton = dynamic(() => import('react-share').then(mod => mod.LinkedinShareButton), { ssr: false });
const PinterestIcon = dynamic(() => import('react-share').then(mod => mod.PinterestIcon), { 
  ssr: false,
  loading: () => <div className="social-icon-placeholder" style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#bd081c' }} />
});
const PinterestShareButton = dynamic(() => import('react-share').then(mod => mod.PinterestShareButton), { ssr: false });
const TwitterIcon = dynamic(() => import('react-share').then(mod => mod.TwitterIcon), { 
  ssr: false,
  loading: () => <div className="social-icon-placeholder" style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#1da1f2' }} />
});
const TwitterShareButton = dynamic(() => import('react-share').then(mod => mod.TwitterShareButton), { ssr: false });
const WhatsappIcon = dynamic(() => import('react-share').then(mod => mod.WhatsappIcon), { 
  ssr: false,
  loading: () => <div className="social-icon-placeholder" style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#25d366' }} />
});
const WhatsappShareButton = dynamic(() => import('react-share').then(mod => mod.WhatsappShareButton), { ssr: false });

import { FaLink } from 'react-icons/fa';
import { toast } from "react-toastify";
import { handledownload } from "@/service/globalfunction";
import Head from "next/head";
import product from "@/assets/images/product.jpg"
import { getSafeImageUrl, handleImageError, getSmallVersion } from "@/utils/imageUtils";

import parse from "html-react-parser";
import AdSense from "@/components/AdSense";
// ✅ PERFORMANCE OPTIMIZATION: Use native Next.js Image for maximum speed
import Image from 'next/image';

// CDN asset URLs (no local imports)
const autoCad       = assets.images.filetype("file_white.png");
const cad        = assets.images.filetype("cad.png");
const goldblocks       = assets.images.filetype("file.png");
const profile_dummy   = assets.images.icons("profile.png");
const link       = assets.images.social("link.png"); // if you ever need the image file


function transform(node, index) {
  if (node.type === "tag") {
    return createElement(
      node.name,
      {
        ...node.attribs, // This will pass all the attributes including `style`
        key: index,
      },
      node.children.map((child, i) =>
        child.type === "text" ? child.data : transform(child, i)
      )
    );
  }
}

const social = [
  // { image: fb, url: "/" },
  // { image: pin, url: "/" },
  { image: link, url: "/" },
  // { image: wp, url: "/" },
  // { image: gmail, url: "/" },
  // { image: linkedin, url: "/" },
  // { image: fbchat, url: "/" },
  // { image: pinit, url: "/" },
];

// --- Old site slug function (matches backend oldSiteSlugify) ---
function slugify(title) {
  if (!title) return '';
  return title
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/\-+/g, '-')           // Collapse multiple dashes
    .replace(/^\-+|\-+$/g, '');     // Trim dashes from start and end
    // .toLowerCase();
}



const ViewDrawing = ({ initialProject, initialSimilar, canonicalUrl }) => {
  const dispatch = useDispatch();
  const [project, setProject] = useState( initialProject || []);
  const [similarProjects, setSimilarProjects] = useState( initialSimilar || []);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [similarProjectId, setSimilarProjectId] = useState("");
  // ✅ ADD THESE NEW STATES
  const [currentPage, setCurrentPage] = useState(1); // To track the page of similar projects
  const [isLoading, setIsLoading] = useState(false); // To prevent multiple clicks while loading
  const [hasMore, setHasMore] = useState(true); // To hide the button when no more projects are left
  // ✅ ADD STATE FOR PROFILE IMAGE ERROR HANDLING
  const [profileImageError, setProfileImageError] = useState(false);

  const [showRelated, setShowRelated] = useState(false);

  useEffect(() => {
    const run = () => setShowRelated(true);
    if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1500 });
    else setTimeout(run, 1200);
  }, []);

  // At component top:
  const shownSimilarIdsRef = useRef(new Set());

  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { categoryAndSubCategory,categoriesList } = useSelector((store) => store.projectinfo);
  const { id } = router.query;

  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  const [isFavorited, setIsFavorited] = useState(false);

  // At the top, add a state to track whether favorites have been fetched
  const [favouritesFetched, setFavouritesFetched] = useState(false);

  // const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);

  // reset loader each time the main image url changes
  useEffect(() => {
    // setImgLoaded(false);
    setImgError(!project?.photo_url);
  }, [project?.photo_url]);

  // Optional: reset immediately when route change starts (before fetch completes)
  // useEffect(() => {
  //   const onStart = () => setImgLoaded(false);
  //   router.events.on("routeChangeStart", onStart);
  //   return () => router.events.off("routeChangeStart", onStart);
  // }, [router.events]);

  
  useEffect(() => {
    const handleRouteChange = () => {
      setFavouritesFetched(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Fetch favorites if not already loaded
  useEffect(() => {
    if (isAuthenticated) {
      getFavouriteItems()
        .then((favRes) => {
          dispatch(setFavouriteList(favRes.data.favorites || []));
          // setFavouritesFetched(true);
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          // setFavouritesFetched(true);
        });
    }
  }, [isAuthenticated, dispatch, id]);

  
  const projectId = Number(id);
  useEffect(() => {
    // if (favouriteList && Array.isArray(favouriteList)) {
      setIsFavorited(favouriteList.some((fav) => fav.id ===  Number(projectId)));
    // }
  }, [favouriteList, projectId, id]);

  // Reset profile image error when project changes
  useEffect(() => {
    setProfileImageError(false);
  }, [project?.profile_pic]);


  //current project fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = id;
        // Fetch the single project data
        const singleProjectResponse = await getsingleallprojects("", projectId);
        const singleProjectData = singleProjectResponse.data;
        setProject(singleProjectData);
        // console.log("singleProjectData: ", singleProjectData);
        // console.log(singleProjectData);

        // console.log("singleProjectData: ", singleProjectData);
        
        setSimilarProjectId(singleProjectData.product_sub_category_id);
      } catch (error) {
        // console.error("Error fetching project data", error);
      }
    };

    // fetchData();
    if (id) {
      fetchData();
    }
  }, [id]);
  
  const visitedIdsRef = useRef([Number(id)]); // always include current

  // When similarProjects are fetched/shown:
  useEffect(() => {
    similarProjects.forEach(p => shownSimilarIdsRef.current.add(p.id));
  }, [similarProjects]);


  // Fetch similar projects
  const fetchSimilarProjects = async () => {
    try {
      if (!similarProjectId) return;

      // // Exclude all visited
      // const excludeIds = visitedIdsRef.current.join(",");
      // const response = await getsimilerllprojects(1, 12, similarProjectId, excludeIds);
      
      // setSimilarProjects(response.data.projects);

      const excludeIdsArray = Array.from(shownSimilarIdsRef.current);
      // Always exclude the current project id as well
      if (!excludeIdsArray.includes(Number(id))) excludeIdsArray.push(Number(id));
      // Call your API
      const response = await getsimilerllprojects(
        1, // or current page
        12, // or whatever pageSize
        similarProjectId,
        excludeIdsArray.join(",")
      );
      setSimilarProjects(response.data.projects);

    } catch (error) {
        console.error("Error fetching similar projects:", error);
    }
  };
  

  useEffect(() => {
    // When route changes (clicked to another project), add the new id to the ref
    if (!visitedIdsRef.current.includes(Number(id))) {
      visitedIdsRef.current.push(Number(id));
    }
    fetchSimilarProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [similarProjectId, router.query.id]);

  // // Fetch similar projects when the subcategory ID changes
  // useEffect(() => {
  //   fetchSimilarProjects();
  // }, [similarProjectId, router.query.id]);

  // Reset pagination when the component unmounts
  useEffect(() => {
    return () => {
        dispatch(getSimilarProjectsPage(1));
    };
  }, []);

  const handlePageChange = (currentPage) => {
    dispatch(getSimilarProjectsPage(currentPage));
  };

  // Updated handleLike function with Redux dispatch
  const handleLike = async () => {
    if (!requireAuth(isAuthenticated, router)) {
      return;
    }
    try {
      if (isFavorited) {
        // await removeFavouriteItem( id);
        // setIsFavorited(false);
        // toast.success("Removed from Favorite list", { position: "top-right" });
        // // Dispatch Redux action to remove favorite using the project id
        // dispatch(deleteFavouriteItem(id));
        await removeFavouriteItem(id);
        toast.success("Removed from Favorite list", { position: "top-right" });
        dispatch(deleteFavouriteItem(id));
      } else {
        await addFavouriteItem({ product_id: id });
        setIsFavorited(true);
        toast.success("Added to Favorite list", { position: "top-right" });
        // Dispatch Redux action to add favorite (using project data)
        
        if (project) {
          dispatch(
            addedFavouriteItem({
              id: project.id,
              work_title: project.work_title,
              file_type: project.file_type,
              photo_url: project.photo_url,
              type: project.type,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  // New handler for "Add to libary" button
  const handleAddToLibrary = async () => {
    if (!requireAuth(isAuthenticated, router)) {
      return;
    }
    if (isFavorited) {
      toast.info("Product is already in library", { position: "top-right" });
      return;
    }
    try {
      await addFavouriteItem({ product_id: id });
      setIsFavorited(true);
      toast.success("Added to Favorite list", { position: "top-right" });
      // Dispatch Redux action to add favorite (using project data)
      if (project) {
        dispatch(
          addedFavouriteItem({
            id: project.id,
            work_title: project.work_title,
            file_type: project.file_type,
            photo_url: project.photo_url,
            type: project.type,
          })
        );
      }
    } catch (error) {
      console.error("Error adding to library:", error);
      toast.error("Failed to update favorite status");
    }
  };


  useEffect(() => {
    if (categoryAndSubCategory.length === 0) {
      getCategoriesWithSubcategories()
        .then((res) => {
          // console.log("sub", res);
          
          dispatch(addCategoryAndSubCategoryData(res));
          // console.log('api response upload==========',res)
        })
        .catch((err) => {
          // console.log(err)
        });
    }
    if(categoriesList.length===0){
     getallCategories('').then((res)=>{
      // console.log("res", res);
      
        dispatch(addAllCategoriesData(res.data.categories));
      }).catch((err)=>{

      }) 
    }
 
  }, [categoryAndSubCategory,categoriesList]);
  const onSearchSubmitHandler = (e) => {
    e.preventDefault();
    // console.log("selectedCategory", selectedCategory);
    // console.log("selectedSubCategory", selectedSubCategory);
    
    if (selectedCategory && selectedSubCategory) {
      dispatch(updatesubcatslug(selectedSubCategory));
      dispatch(updatesubcatpage(1));
      // router.push(`/categories/sub/${selectedCategory}`);
      router.push(`/${selectedCategory}`);
    } else if (selectedCategory) {
      // router.push(`/categories/sub/${selectedCategory}`);
      router.push(`/${selectedCategory}`);
    }
  };

  const handleLoadMore = async () => {
    // Prevent function from running if it's already loading or if there are no more pages
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = currentPage + 1;

    try {
      // Get the IDs of projects already shown to exclude them from the next fetch
      const excludeIdsArray = Array.from(shownSimilarIdsRef.current);
      if (!excludeIdsArray.includes(Number(id))) {
        excludeIdsArray.push(Number(id));
      }

      // Call your API to get the next page of projects
      const response = await getsimilerllprojects(
        nextPage, // The next page number
        9,        // Fetch 9 more projects as requested
        similarProjectId,
        excludeIdsArray.join(",")
      );

      const newProjects = response.data.projects;

      if (newProjects && newProjects.length > 0) {
        // Append new projects to the existing list
        setSimilarProjects(prevProjects => [...prevProjects, ...newProjects]);
        // Add new project IDs to the set of shown IDs
        newProjects.forEach(p => shownSimilarIdsRef.current.add(p.id));
        // Update the current page number
        setCurrentPage(nextPage);
      }

      // If the API returns fewer than 9 projects, it means we've reached the end
      if (!newProjects || newProjects.length < 9) {
        setHasMore(false);
      }

    } catch (error) {
      console.error("Failed to load more projects:", error);
      setHasMore(false); // Stop trying to load more if an error occurs
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <Fragment>
      <Head>
        <title>{project?.meta_title || project?.work_title}</title>
        <meta name="description" content={project?.meta_description || project?.description?.slice(0, 150)} />
        <meta property="og:title" content={project?.meta_title || project?.work_title} />
        <meta property="og:description" content={project?.meta_description || project?.description?.slice(0, 150)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`} />
        {/* <meta property="og:image" content={project?.photo_url || `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`} /> */}
        <meta property="og:image" content={getSafeImageUrl(project?.photo_url) || `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`} />

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${project?.work_title} - CAD Drawing from Cadbull`} />
        <meta property="og:site_name" content="Cadbull" />
        <meta property="fb:app_id" content="1018457459282520" />
        
        {/* Pinterest specific tags */}
        <meta name="pinterest-rich-pin" content="true" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cadbull" />
        <meta name="twitter:creator" content="@cadbull" />
        <meta name="twitter:title" content={project?.meta_title || project?.work_title} />
        <meta name="twitter:description" content={project?.meta_description || project?.description?.slice(0, 150)} />
        
        {/* <meta name="twitter:image" content={project?.photo_url || `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`} /> */}
        <meta name="twitter:image" content={getSafeImageUrl(project?.photo_url) || `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`} />

        <meta name="twitter:image:alt" content={`${project?.work_title} - CAD Drawing from Cadbull`} />
        <meta name="keywords" content={project?.tags || ""} />

        <link rel="canonical" href={canonicalUrl} />
        <link rel="preconnect" href="https://beta-assets.cadbull.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://beta-assets.cadbull.com"></link>
        {/* <link rel="preload" href="https://beta-assets.cadbull.com" as="image" />
         */}
        {/* ✅ SPEED OPTIMIZATION: Preload LCP image for faster loading */}
        {project?.photo_url && (
          <link
            rel="preload"
            as="image"
            href={getSafeImageUrl(project.photo_url)}
            fetchPriority="high"
          />
        )}

        <link rel="amphtml" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/amp/${project?.id}/${encodeURIComponent(project?.slug || project?.work_title || '')}`} />

      </Head>
      <section className="bg-light py-md-5 py-4 category-page category-page-border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div>
                <h1 className="text-primary fw-bold">{project?.work_title}</h1>
              </div>
              {/* Breadcrum  */}
              <div className="mt-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href="/categories">Categories</Link>
                    </li>
                    {project?.product_category_title && (
                      <li className="breadcrumb-item">
                        <Link  href={`/categories/sub/${project?.category_path}`}>
                          {project?.product_category_title}
                        </Link>
                      </li>
                    )}
                    {project?.product_subcategory_title && (
                      <li className="breadcrumb-item">
                        <Link  href={`/categories/sub/${project?.subcategory_path}`}>
                          {project?.product_subcategory_title}
                        </Link>
                      </li>
                    )}
                    <li className="breadcrumb-item active" aria-current="page">
                      {project?.work_title}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* mobile/tablet only */}
        {/* <div className="d-block d-lg-none">
          <AdSense slot="4597678336" format="fluid" layout="in-article" lazy={false} />
        </div> */}

      </section>

      {/* Categories  */}
      <section className="py-lg-5 py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <div className=" d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-1 justify-content-center justify-content-md-start">
                  {social.map((res, index) => (
                    <a
                      key={index}
                      href={res.url}
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                          `${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`
                        );
                        toast.success("Link Copied Successfully");
                      }}
                      className="link-button copy-link-size"
                    >
                      {/* <img
                        src={res.image.src}
                        className="img-fluid"
                        alt="icons"
                        
                      /> */}
                      <FaLink size={22} />
                    </a>
                  ))}
                  {/* facebook share  */}
                  <FacebookShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <FacebookIcon size={32} borderRadius={"10"} />
                  </FacebookShareButton>
                  {/* twitter share  */}
                  <TwitterShareButton
                    hashtags={["cadbull", "3ddesign", "2ddesing"]}
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <TwitterIcon size={32} borderRadius={"10"} />
                  </TwitterShareButton>
                  {/* // pinterest share  */}
                  <PinterestShareButton
                    title={project?.work_title}
                    media={project?.photo_url}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <PinterestIcon size={32} borderRadius={"10"} />
                  </PinterestShareButton>
                  {/* email share  */}
                  <EmailShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <EmailIcon size={32} borderRadius={"10"} />
                  </EmailShareButton>
                  {/* what's app share */}
                  <WhatsappShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <WhatsappIcon size={32} borderRadius={"10"} />
                  </WhatsappShareButton>
                  {/* facebook messanger share  */}
                  <FacebookMessengerShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <FacebookMessengerIcon size={32} borderRadius={"10"} />
                  </FacebookMessengerShareButton>
                  <LinkedinShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <LinkedinIcon size={32} borderRadius={"10"} />
                  </LinkedinShareButton>
                </div>
                <div className="d-none d-md-inline-flex gap-3 align-items-center">
                  <button
                    onClick={() => handleLike()}
                    type="button"
                    className="link-btn"
                  >
                    {/* <Icons.Like /> */}
                    {/* {isFavorited ? <Icons.Dislike /> : <Icons.Like />} */}
                    {isFavorited ? <Icons.Save /> : <Icons.Save />}
                  </button>
                  {/* save, downlaod button */}
                  {/* <button
                    onClick={() => handledownload(project.id, isAuthenticated, router)}
                    type="button"
                    className="link-btn"
                  >
                    <Icons.Save />
                  </button> */}
                </div>
              </div>

              <div className="mt-4" style={{ maxWidth: "100%", margin: "0 auto" }}>
                {/* <div className="bg-light p-3 rounded-2 shadow-sm heroFrame" >
                  {!imgLoaded && <div className="shimmer" />}
                  <Image
                    key={project?.id || project?.photo_url}
                    // src={getSafeImageUrl(project?.photo_url)}
                    src={imgError ? '/default-img.png' : getSafeImageUrl(project?.photo_url)}
                    width={project?.image_width || 800}
                    height={project?.image_height || 600}
                    alt={project?.work_title || "CAD Drawing"}
                    className="img-fluid"
                    priority
                    fetchPriority="high"
                    quality={85}
                    // unoptimized    // ⬅️ avoids backend image processing = lower latency & lower compute cost
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      // display: imgLoaded ? "block" : "none"
                    }}
                    // style={{ objectFit: "contain", width: "100%", height: "auto" }}
                    placeholder="empty"
                    blurDataURL={getSmallVersion(project?.photo_url)}
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 72vw"
                    onLoad={() => setImgLoaded(true)}            // NEW: works across browsers
                    onError={() => { setImgError(true); setImgLoaded(true); }} // NEW fallback
                    onLoadingComplete={() => setImgLoaded(true)}
                  />

                </div> */}
                <div className="bg-light p-3 rounded-2 shadow-sm heroFrame">
                  {project?.photo_url && !imgError ? (
                    <Image
                      key={project?.id || project?.photo_url}
                      src={getSafeImageUrl(project?.photo_url)}
                      width={project?.image_width || 800}
                      height={project?.image_height || 600}
                      alt={project?.work_title || "CAD Drawing"}
                      className="img-fluid"
                      priority
                      fetchPriority="high"
                      quality={85}
                      placeholder="empty"
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 72vw"
                      style={{ objectFit: "contain", width: "100%", height: "auto" }}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div
                      className="hero-fallback"
                      role="img"
                      aria-label={`${project?.work_title || "Preview"} (image not available)`}
                      style={{
                        aspectRatio: `${(project?.image_width || 4)} / ${(project?.image_height || 3)}`,
                        width: "100%",
                      }}
                      title={project?.work_title || "Preview not available"}
                    >
                      <div className="hero-fallback__inner">
                        <h2 className="hero-fallback__title">
                          {project?.work_title || "Preview not available"}
                        </h2>
                        {project?.file_type && <p className="hero-fallback__meta">{project.file_type} file</p>}
                      </div>
                    </div>
                  )}
                </div>

              </div>


              {/* <div className="border-top border-bottom py-2 mt-4"> */}
                <AdSense slot="4412795758" format="fluid" layout="in-article" className="ad-slot" lazy={false} />
              {/* </div> */}
          
              {/* Project Description */}
              <div className="py-3 py-md-4">
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-md-5 mb-4 shadow-sm px-5 py-3 rounded-1 border-start border-5 border-start-primary">
                        <div className="px-3">
                          <SectionHeading
                            mainHeading={""}
                            subHeading={" "}
                            mainHeadingBold={"Description"}
                          />
                          <div>{parse(`${project.description}`)}</div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row gy-3 mb-md-5 mb-4">
                    <FileDescription
                      bgColor={"#20325A"}
                      image={autoCad}
                      type={"File Type:"}
                      title={project?.file_type}
                    />
                    <FileDescription
                      bgColor={"#3D6098"}
                      image={cad}
                      type={"Category::"}
                      title={project?.product_category_title}
                    />
                    <FileDescription
                      bgColor={"#5B5B5B"}
                      image={cad}
                      type={"Sub Category::"}
                      title={project?.product_subcategory_title}
                    />
                    <FileDescription
                      bgColor={"#E9E9EB"}
                      image={goldblocks}
                      type={"type:"}
                      title={project?.type}
                      className={"text-primary"}
                    />

                    
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="bg-white shadow-sm p-2 p-md-5">
                        <div className="row justify-content-between align-items-center">
                          <div className="col-md-7">
                            <div className="d-flex align-items-center gap-md-3 gap-2">
                              <div className="flex-shrink-0">
                                {(project?.profile_pic && !profileImageError) ? (
                                  <Image
                                    src={getSafeImageUrl(project.profile_pic)}
                                    alt="Profile"
                                    width={80}
                                    height={80}
                                    className="rounded-circle"
                                    style={{ objectFit: "cover" }}
                                    loading="lazy"
                                    // priority={false}
                                    decoding="async"
                                    // quality={75}
                                    sizes="80px"
                                    onError={() => setProfileImageError(true)}
                                  />
                                ) : (
                                  <Image
                                    src={profile_dummy}
                                    alt="Profile"
                                    width={80}
                                    height={80}
                                    className="rounded-circle"
                                    style={{ objectFit: "cover" }}
                                    // priority={false}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                )}
                              </div>
                              <div>
                                <h6 className="text-primary fw-semibold d-flex gap-1 align-items-center">
                                  <span>{project?.firstname} </span>
                                  
                                </h6>
                                <p>
                                  {project?.lastname}
                                </p>
                                
                                <div className=" mt-1 d-md-none text-start text-md-end">
                                  <Link
                                    href={`/profile/author/${project?.user_id}`} 
                                    className="btn btn-primary"
                                  >
                                    View Profile
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-none d-md-block col-md-3 text-start text-md-end">
                            <Link href={`/profile/author/${project?.user_id}`} className="btn btn-primary">
                              View Profile
                            </Link>
                          </div>
                          {/* <p className="d-md-none mt-3">
                            This architectural drawing is a 2D block of garden
                            benches in AutoCAD drawing, CAD file, and dwg file.
                            For more details and information download the
                            drawing file.
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="border-top border-bottom py-2 mt-4"> */}
                    <AdSense slot="9473550740" format="fluid" layout="in-article" className="ad-slot" />
                  {/* </div> */}

                  <div className="row justify-content-center">
                    <div className="col-md-12 col-12 text-center">
                      <div className="download-btn-sm text-center mt-4 mt-md-5 d-inline-flex flex-column  flex-sm-row gap-2 gap-md-3">
                        <button
                          onClick={() =>
                            handledownload(project.id, isAuthenticated, router)
                          }
                          type="button"
                          className="btn-success-split "
                        >
                          <span>
                            <Icons.Download />
                          </span>
                          <span>Download</span>
                        </button>

                        {/* add to fevorite btn */}
                        <button
                          onClick={() => handleAddToLibrary()}
                          type="button"
                          className="btn-primary-split"
                        >
                          <span>
                            <Icons.Add />
                          </span>
                          <span>Add to libary</span>
                        </button>
                        
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

        
            <div className="col-lg-3">
              <div className="d-flex flex-column gap-3">
                <div className="d-none d-lg-block">
                  <AdSense slot="2091281415" sidebar className="ad-slot ad-slot--sidebar" lazy={false} />
                </div>
                <div>
                  <aside>
                    <h5 className="bg-secondary text-white px-3 py-2">
                      Search
                    </h5>
                    <div className="p-3">
                      <form className="d-flex gap-3 flex-column">
                        Category
                        <div>
                          
                          <select
                            defaultValue=""
                            className="form-select"
                            aria-label="Category"
                            onChange={(e) => {
                              const selectedCategoryId = e.target.value;
                              // Find the category in categoriesList that matches the selected id
                              const matchingCategory = categoriesList.find(
                                (cat) => cat.id == selectedCategoryId
                              );
                              // If found, update selectedCategory state with the slug
                              if (matchingCategory) {
                                setSelectedCategory(matchingCategory.slug);
                              }
                              // Also, find the selected category in categoryAndSubCategory to get its subcategories
                              const selectedCategoryObj = categoryAndSubCategory.find(
                                (item) => item.id == selectedCategoryId
                              );
                              if (selectedCategoryObj) {
                                setSubCategories(selectedCategoryObj.project_sub_categories);
                              }
                            }}
                          >
                            <option value="all">All Category</option>
                            {categoryAndSubCategory.map(({ id, title }) => (
                              <option value={id} key={id}>
                                • {title}
                              </option>
                            ))}
                          </select>

                        </div>
                        Select Sub Category
                        <div>
                          <select
                            defaultValue=""
                            className="form-select"
                            aria-label="Sub Category"
                            onChange={(e) => {
                              setSelectedSubCategory(e.target.value);
                            }}
                          >
                            <option value="">Select Sub Category</option>
                            {subCategories.map(({ id, title }) => {
                              return (
                                <option value={title} key={id}>
                                  • {title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        
                        <div className="mt-2obbs">
                          <button
                            onClick={onSearchSubmitHandler}
                            className="btn btn-secondary w-100"
                          >
                            Search
                          </button>
                        </div>
                      </form>
                      <div></div>
                    </div>
                  </aside>
                </div>
                {/* ads image */}
                
                <div className="d-block d-lg-none">
                  <AdSense slot="4406439781" format="fluid" layout="in-article" />
                </div>

              </div>
            </div>
          </div>

          <div className="py-4 py-md-5">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-4 mb-md-5 ps-5">
                  <SectionHeading
                    subHeading={"find Latest"}
                    mainHeading={"Related"}
                    mainHeadingBold={"Files"}
                  />
                </div>
              </div>
            </div>
            {showRelated && (
              <div className="row gy-4 mb-4 mb-md-5">
                {/* {similarProjects.map((project) => {
                  return (
                    <div
                      className="col-md-6 col-lg-6 col-xxl-4"
                      key={project.id}
                    >
                      <ProjectCard {...project} favorites={favouriteList} />
                    </div>
                  );
                })} */}
                {similarProjects.length > 0 ? (
                  similarProjects.map((project) => (
                    <div className="col-md-6 col-lg-6 col-xxl-4" key={project.id}>
                      <ProjectCard {...project} favorites={favouriteList} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p>No more related files found.</p>
                  </div>
                )}

                {/* ✅ ADD THIS NEW "LOAD MORE" BUTTON LOGIC */}
                {hasMore && similarProjects.length > 0 && (
                  <div className="text-center mt-4">
                    <button
                      className="btn btn-primary px-5 py-3 rounded"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* <div className="border-top border-bottom py-2"> */}
          <AdSense slot="8612944968" format="fluid" layout="in-article" className="ad-slot" />
        {/* </div> */}
      </section>
    </Fragment>
  );
};


// ✅ REVENUE OPTIMIZATION: Convert back to SSR for maximum ad revenue
export async function getServerSideProps(ctx) {
  // const startTime = Date.now();
  const { params, res } = ctx;
  const id = params.id;
  
  try {
    // Validate ID parameter - must be a valid number
    if (!id || isNaN(parseInt(id))) {
      res.setHeader('Cache-Control', 'no-store');
      return { notFound: true };
    }

    // // 🧠 Memory tracking
    // const initialMemory = process.memoryUsage();
    // logMemoryUsage('ProjectDetailPage-Start', initialMemory);

    // 🌐 Track project API call
    // const projectAPIStart = Date.now();
    const projectRes = await getsingleallprojects("", id);
    // const projectAPITime = Date.now() - projectAPIStart;
    
    // logAPICall('getsingleallprojects', projectAPITime, 200, JSON.stringify(projectRes?.data || {}).length);
    
    if (!projectRes || !projectRes.data) {
      res.setHeader('Cache-Control', 'no-store');
      return { notFound: true };
    }
    
    const project = projectRes.data;

      // Use backend slug if available and not empty/null, else fallback to slugify
      const backendSlug = project.slug || null;

      const canonicalSlug = backendSlug ? String(backendSlug).trim() : slugify(project.work_title);

      // Redirect if param slug is wrong (case-insensitive)
      const incomingSlug = decodeURIComponent(params.slug || "");
      if (incomingSlug.toLowerCase() !== canonicalSlug.toLowerCase()) {
        return {
          redirect: {
            destination: `/detail/${id}/${canonicalSlug}`,
            permanent: true,
          },
        };
      }

    // 🌐 Track similar projects API call
    // const similarAPIStart = Date.now();
    const similarRes = await getsimilerllprojects(1, 12, projectRes.data.product_sub_category_id);
    

    // ✅ Cache the HTML at the CDN for a short time
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    // optional: tidy up proxies
    res.setHeader('Vary', 'Accept-Encoding');

    return {
      props: {
        initialProject: project,
        initialSimilar: similarRes?.data?.projects || [],
        canonicalUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}/detail/${id}/${canonicalSlug}`,
      },
    };
  } catch (err) {
    // console.error('🧪 [AMPLIFY-ERROR] Error in detail page getServerSideProps:', err);
    console.error('Error in detail page getServerSideProps:', err);

    res.setHeader('Cache-Control', 'no-store');
    return {
      notFound: true,
    };
  }
}

ViewDrawing.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default ViewDrawing;
