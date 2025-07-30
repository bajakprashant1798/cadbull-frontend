import GetOff from "@/components/GetOff";
import { Fragment, createElement, useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Icons from "@/components/Icons";
import profile_dummy from "@/assets/icons/profile.png";
import SectionHeading from "@/components/SectionHeading";
import FileDescription from "@/components/FileDescription";
import autoCad from "@/assets/images/filetype/file_white.png";
import cad from "@/assets/images/filetype/cad.png";
import goldblocks from "@/assets/images/filetype/file.png";
import drawing1 from "@/assets/images/drawing-image.png";
import ProjectCard from "@/components/ProjectCard";
import ad_1 from "@/assets/images/ad-1.png";
import ad_2 from "@/assets/images/ad-2.png";
import banner_1 from "@/assets/images/banner-1.png";
import banner_2 from "@/assets/images/banner-2.png";
import MainLayout from "@/layouts/MainLayout";
import link from "@/assets/icons/social/link.png";
import india from "@/assets/icons/social/india.png";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/router";
import {
  addFavouriteItem,
  removeFavouriteItem,
  checkIfFavorited,
  getCategoriesWithSubcategories,
  getallCategories,
  getsimilerllprojects,
  getsingleallprojects,
  getFavouriteItems,
  getallprojects, // ✅ Add this here
} from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllCategoriesData,
  addCategoryAndSubCategoryData,
  addedFavouriteItem,
  deleteFavouriteItem,
  getSimilarProjects,
  getSimilarProjectsPage,
  setFavouriteList,
  updatesubcatpage,
  updatesubcatslug,
} from "../../../../redux/app/features/projectsSlice";
import { set } from "react-hook-form";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { FaLink } from 'react-icons/fa';
import { toast } from "react-toastify";
import { handledownload } from "@/service/globalfunction";
import Head from "next/head";
import product from "@/assets/images/product.jpg"

import parse from "html-react-parser";
import LoadMore from "@/components/LoadMore";
import Image from "next/image";
import AdSense from "@/components/AdSense";
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

// function slugify(text) {
//   if (!text) return "";
//   return text
//     .toString()
//     .toLowerCase()
//     .replace(/\s+/g, '-')           // Replace spaces with -
//     .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
//     .replace(/\-\-+/g, '-')         // Replace multiple - with single -
//     .replace(/^-+/, '')             // Trim - from start of text
//     .replace(/-+$/, '');            // Trim - from end of text
// }
function slugify(title) {
  if (!title) return '';
  return title
    .replace(/\s+/g, '-')                  // Replace spaces with dashes
    .replace(/-+/g, '-')                   // Remove duplicate dashes
    .replace(/^-+|-+$/g, '');              // Trim dashes from start/end
    // Do NOT lowercase, do NOT remove special chars like &
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


  //current project fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = id;
        // Fetch the single project data
        const singleProjectResponse = await getsingleallprojects("", projectId);
        const singleProjectData = singleProjectResponse.data;
        setProject(singleProjectData);
        console.log("singleProjectData: ", singleProjectData);
        
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

  // Fetch similar projects when the subcategory ID changes
  useEffect(() => {
    fetchSimilarProjects();
  }, [similarProjectId, router.query.id]);

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
    if (!isAuthenticated) {
      router.push("/auth/login");
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
    if (!isAuthenticated) {
      router.push("/auth/login");
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
        <meta property="og:image" content={project?.photo_url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project?.meta_title || project?.work_title} />
        <meta name="twitter:description" content={project?.meta_description || project?.description?.slice(0, 150)} />
        <meta name="twitter:image" content={project?.photo_url} />
        <meta name="keywords" content={project?.tags || ""} />

        <link rel="canonical" href={canonicalUrl} />
        <link rel="preconnect" href="https://beta-assets.cadbull.com" crossOrigin="anonymous" />

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

        
        {/* <AdSense slot="4597678336" format="fluid" layout="in-article" /> */}
       
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

              {/* Project Image */}
              {/* <div className="mt-4" style={{ maxWidth: "100%" }}>
                <div className="bg-light p-3 rounded-2 shadow-sm">
                  <Image
                    src={project.photo_url || product.src}
                    className="img-fluid"
                    alt="drawing"
                    onError={(e) => (e.target.src = product.src)} 
                    loading="lazy" 
                  />
                </div>
              </div> */}
              <div
                className="mt-4"
                style={{ maxWidth: "100%", margin: "0 auto" }}
              >
                <div
                  className="bg-light p-3 rounded-2 shadow-sm"
                  style={{ maxWidth: "100%" }} // Optional, if you want to constrain inner div too
                >
                  <Image
                    src={project.photo_url || product}
                    width={project.image_width || 800}
                    height={project.image_height || 600}
                    alt="drawing"
                    className="img-fluid"
                    // DO NOT SET loading="lazy" for LCP image!
                    priority={true} // <-- This is required for LCP
                    onError={(e) => (e.target.src = product.src)}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                </div>
              </div>

              {/* <div className="border-top border-bottom py-2 mt-4"> */}
                <AdSense slot="4412795758" format="fluid" layout="in-article" />
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
                          <p>{parse(`${project.description}`)}</p>
                          
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
                                {project?.profile_pic ? (
                                  <img
                                    src={project.profile_pic || profile_dummy.src}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    onError={e => { e.target.onerror = null; e.target.src = profile_dummy.src }}
                                    loading="lazy"
                                  />
                                  // <Image
                                  //   src={project.profile_pic || profile_dummy.src}
                                  //   alt="Profile"
                                  //   width={80}     // <= REQUIRED
                                  //   height={80}    // <= REQUIRED
                                  //   loading="lazy"
                                  //   className="rounded-circle"
                                  //   style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                  //   onError={e => { e.target.onerror = null; e.target.src = profile_dummy.src }}
                                  // />


                                ) : (
                                  <Icons.Avatar />
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
                    <AdSense slot="9473550740" format="fluid" layout="in-article" />
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
                          <span className="w-100">Download</span>
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

                  {/* <div className="py-4 py-md-5">
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
                    <div className="row gy-4 mb-4 mb-md-5">
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
                    </div>
                  </div> */}

                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="d-flex flex-column gap-3">
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

                {/* add component started */}
                {/* <div className="bg-white shadow-sm p-3 rounded-2"> */}
                  {/* <AdSense slot="2091281415" format="fluid" layout="in-article" /> */}
                {/* </div> */}
                {/* add component ended */}
                
                {/* <div className="border-top border-bottom py-2"> */}
                  <AdSense slot="4406439781" format="fluid" layout="in-article" />
                {/* </div> */}

                {/* <div>
                  <img
                    src={banner_1.src}
                    className="img-fluid w-100 rounded-2 shadow-sm"
                    alt="ad"
                  />
                </div>
                <div>
                  <img
                    src={banner_2.src}
                    className="img- w-100  rounded-2 shadow-sm"
                    alt="ad"
                  />
                </div>
                <div>
                  <img
                    src={ad_1.src}
                    className="img-fluid w-100  rounded-2 shadow-sm"
                    alt="ad"
                  />
                </div>
                <div>
                  <img
                    src={ad_2.src}
                    className="img-fluid w-100  rounded-2 shadow-sm"
                    alt="ad"
                  />
                </div> */}
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
                    className="btn btn-primary px-5 py-2"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
        

        {/* <div className="border-top border-bottom py-2"> */}
          <AdSense slot="8612944968" format="fluid" layout="in-article" />
        {/* </div> */}
      </section>
    </Fragment>
  );
};


export async function getStaticPaths() {
  const res = await getallprojects(1, 100); // Or popular projects only
  const paths = res.data.products.map((proj) => ({
    params: { 
        id: proj.id.toString(),
        slug: slugify(proj.work_title)
    }
  }));

  return {
    paths,
    fallback: "blocking", // or "true" if you want loading spinner
  };
}

export async function getStaticProps({ params }) {
  const id = params.id;
  

  try {
    const projectRes = await getsingleallprojects("", id);
    const project = projectRes.data;
    // const expectedSlug = slugify(project.work_title);

    // if (params.slug !== expectedSlug) {
    //   return {
    //     redirect: {
    //       destination: `/detail/${id}/${expectedSlug}`,
    //       permanent: true,
    //     },
    //   };
    // }

    // Use DB slug!
    const canonicalSlug = project.slug || slugify(project.work_title); // fallback for missing
    // Redirect if param slug is wrong
    if (params.slug !== canonicalSlug) {
      return {
        redirect: {
          destination: `/detail/${id}/${canonicalSlug}`,
          permanent: true,
        },
      };
    }

    const similarRes = await getsimilerllprojects(1, 12, projectRes.data.product_sub_category_id);
    
    return {
      props: {
        initialProject: project,
        initialSimilar: similarRes.data.projects || [],
        canonicalUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}/detail/${id}/${canonicalSlug}`,
      },
      revalidate: 300,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

ViewDrawing.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default ViewDrawing;
