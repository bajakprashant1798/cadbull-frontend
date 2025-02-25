import GetOff from "@/components/GetOff";
import { Fragment, createElement, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Icons from "@/components/Icons";
import SectionHeading from "@/components/SectionHeading";
import FileDescription from "@/components/FileDescription";
import autoCad from "@/assets/images/filetype/dwg.png";
import cad from "@/assets/images/filetype/cad.png";
import goldblocks from "@/assets/images/filetype/dwg-yellow.png";
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
} from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllCategoriesData,
  addCategoryAndSubCategoryData,
  addedFavouriteItem,
  deleteFavouriteItem,
  getSimilarProjects,
  getSimilarProjectsPage,
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
import { toast } from "react-toastify";
import { handledownload } from "@/service/globalfunction";
import Head from "next/head";
import product from "@/assets/images/product.jpg"

import parse from "html-react-parser";
import LoadMore from "@/components/LoadMore";
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

const ViewDrawing = ({}) => {
  const dispatch = useDispatch();
  const [project, setProject] = useState([]);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [similarProjectId, setSimilarProjectId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { token } = useSelector((store) => store.logininfo);
  
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { categoryAndSubCategory,categoriesList } = useSelector((store) => store.projectinfo);
  const { id } = router.query;

  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const projectId = Number(id);
  useEffect(() => {
    if (favouriteList && Array.isArray(favouriteList)) {
      setIsFavorited(favouriteList.some((fav) => fav.id === projectId));
    }
  }, [favouriteList, projectId]);
    
  // useEffect(() => {
  //   const fetchFavoriteStatus = async () => {
  //     if (!token || !id) return; // Ensure the user is logged in and ID is available
  
  //     try {
  //       const response = await checkIfFavorited(token, id);
  //       setIsFavorited(response.data.isFavorited); // Expecting response to be { isFavorited: true/false }
  //     } catch (error) {
  //       console.error("Error checking favorite status:", error);
  //     }
  //   };
  
  //   fetchFavoriteStatus();
  // }, [id, token]); // Re-run when `id` or `token` changes
  


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
  // const fetechSimilarProjects = async () => {
  //   try {
  //       if(!similarProjectId){
  //         return
  //       }
  //     // Fetch similar projects based on sub_category_id
  //     const similarProjectsResponse = await getsimilerllprojects(
  //       currentPage,
  //       2,
  //       similarProjectId
  //     );
  //     const similarProjectsData = similarProjectsResponse.data.projects;
  //     if (currentPage === 1) {
  //       setSimilarProjects(similarProjectsData);
  //     } else {
  //       setSimilarProjects([...similarProjects, ...similarProjectsData]);
  //     }
  //     setCurrentPage(similarProjectsResponse.data.currentPage);
  //     setTotalPages(similarProjectsResponse.data.totalPages);
  //   } catch (error) {}
  // };
  // useEffect(() => {
  //   fetechSimilarProjects();
  // }, [similarProjectId, currentPage]);
  // useEffect(() => {
  //   return () => {
  //     dispatch(getSimilarProjectsPage(1));
  //   };
  // }, []);

  // Fetch similar projects
const fetchSimilarProjects = async () => {
  try {
      if (!similarProjectId) return;

      const response = await getsimilerllprojects(currentPage, 9, similarProjectId);
      console.log("similer project: ", response);
      
      if (currentPage === 1) {
          setSimilarProjects(response.data.projects);
      } else {
          setSimilarProjects([...similarProjects, ...response.data.projects]);
      }
      setTotalPages(response.data.totalPages);
  } catch (error) {
      console.error("Error fetching similar projects:", error);
  }
};

// Fetch similar projects when the subcategory ID changes
useEffect(() => {
  fetchSimilarProjects();
}, [similarProjectId, currentPage]);

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
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      if (isFavorited) {
        await removeFavouriteItem(token, id);
        setIsFavorited(false);
        toast.success("Removed from Favorite list", { position: "top-right" });
        // Dispatch Redux action to remove favorite using the project id
        dispatch(deleteFavouriteItem(projectId));
      } else {
        await addFavouriteItem({ product_id: id }, token);
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

  useEffect(() => {
    if (categoryAndSubCategory.length === 0) {
      getCategoriesWithSubcategories()
        .then((res) => {
          console.log("sub", res);
          
          dispatch(addCategoryAndSubCategoryData(res));
          // console.log('api response upload==========',res)
        })
        .catch((err) => {
          // console.log(err)
        });
    }
    if(categoriesList.length===0){
     getallCategories('').then((res)=>{
      console.log("res", res);
      
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
      router.push(`/categories/sub/${selectedCategory}`);
    } else if (selectedCategory) {
      router.push(`/categories/sub/${selectedCategory}`);
    }
  };
  return (
    <Fragment>
      <Head>
        <title>{project?.work_title}</title>
        {/* Open Graph Metadata */}
        <meta property="og:title" content={project?.work_title} />
        <meta property="og:description" content={project?.description} />
        <meta property="og:type" content="www.cadbull.com" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
        />
        <meta property="og:image" content={project?.photo_url} />
        {/* <meta property="og:image:alt" content="A description of what is in the image" /> */}

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content={project?.photo_url} />
        <meta name="twitter:site" content="@cadbull" />
        <meta name="twitter:title" content={project?.work_title} />
        <meta name="twitter:description" content={project?.description} />
        <meta name="twitter:image" content={project?.photo_url} />
      </Head>
      <section className="bg-light py-md-5 py-4 category-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div>
                <h3 className="text-primary fw-bold">{project?.work_title}</h3>
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
                        <Link onClick={(e) => e.preventDefault()} href="">
                          {project?.product_category_title}
                        </Link>
                      </li>
                    )}
                    {project?.product_subcategory_title && (
                      <li className="breadcrumb-item">
                        <Link onClick={(e) => e.preventDefault()} href="">
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
                      className="link-button"
                    >
                      <img
                        src={res.image.src}
                        className="img-fluid"
                        alt="icons"
                        
                      />
                    </a>
                  ))}
                  {/* facebook share  */}
                  <FacebookShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <FacebookIcon size={42} borderRadius={"10"} />
                  </FacebookShareButton>
                  {/* twitter share  */}
                  <TwitterShareButton
                    hashtags={["cadbull", "3ddesign", "2ddesing"]}
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <TwitterIcon size={42} borderRadius={"10"} />
                  </TwitterShareButton>
                  {/* // pinterest share  */}
                  <PinterestShareButton
                    title={project?.work_title}
                    media={project?.photo_url}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <PinterestIcon size={42} borderRadius={"10"} />
                  </PinterestShareButton>
                  {/* email share  */}
                  <EmailShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <EmailIcon size={42} borderRadius={"10"} />
                  </EmailShareButton>
                  {/* what's app share */}
                  <WhatsappShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <WhatsappIcon size={42} borderRadius={"10"} />
                  </WhatsappShareButton>
                  {/* facebook messanger share  */}
                  <FacebookMessengerShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <FacebookMessengerIcon size={42} borderRadius={"10"} />
                  </FacebookMessengerShareButton>
                  <LinkedinShareButton
                    title={project?.work_title}
                    url={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`}
                  >
                    <LinkedinIcon size={42} borderRadius={"10"} />
                  </LinkedinShareButton>
                </div>
                <div className="d-none d-md-inline-flex gap-3 align-items-center">
                  <button
                    onClick={() => handleLike()}
                    type="button"
                    className="link-btn"
                  >
                    {/* <Icons.Like /> */}
                    {isFavorited ? <Icons.Dislike /> : <Icons.Like />}
                  </button>
                  <button
                    onClick={() => handledownload(project.id, token, router)}
                    type="button"
                    className="link-btn"
                  >
                    <Icons.Save />
                  </button>
                </div>
              </div>

              {/* Project Image */}
              <div className="mt-4">
                <div className="bg-light p-3 rounded-2 shadow-sm">
                  <img
                    src={project.photo_url || product.src}
                    className="img-fluid"
                    alt="drawing"
                    onError={(e) => (e.target.src = product.src)} 
                    loading="lazy" 
                  />
                </div>
              </div>
          
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
                      title={"AutoCAD Drawing file"}
                    />
                    <FileDescription
                      bgColor={"#3D6098"}
                      image={cad}
                      type={"Category::"}
                      title={"Cad Landscaping"}
                    />
                    <FileDescription
                      bgColor={"#5B5B5B"}
                      image={cad}
                      type={"Sub Category::"}
                      title={"Garden CAD Blocks"}
                    />
                    <FileDescription
                      bgColor={"#E9E9EB"}
                      image={goldblocks}
                      type={"Gold FIle::"}
                      title={"Garden CAD Blocks"}
                      className={"text-primary"}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="bg-white shadow-sm p-2 p-md-5">
                        <div className="row justify-content-between align-items-center">
                          <div className="col-md-7">
                            <div className="d-flex gap-md-3 gap-2">
                              <div className="flex-shrink-0">
                                <Icons.Avatar />
                              </div>
                              <div>
                                <h6 className="text-primary fw-semibold d-flex gap-1 align-items-center">
                                  <span>Viddhi Chajjed </span>
                                  <img
                                    src={india.src}
                                    width={22}
                                    alt="flag"
                                  />{" "}
                                </h6>
                                <p>
                                  {" "}
                                  <small className="text-primary mb-2">
                                    February 17, 2023 AT 2:40 AM
                                  </small>
                                  c
                                </p>
                                <p className="d-none d-md-block">
                                  This architectural drawing is a 2D block of
                                  garden benches in AutoCAD drawing, CAD file,
                                  and dwg file. For more details and information
                                  download the drawing file.
                                </p>
                                <div className=" mt-1 d-md-none text-start text-md-end">
                                  <Link
                                    href="/profile"
                                    className="btn btn-primary"
                                  >
                                    View Profile
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-none d-md-block col-md-3 text-start text-md-end">
                            <Link href="/profile" className="btn btn-primary">
                              View Profile
                            </Link>
                          </div>
                          <p className="d-md-none mt-3">
                            This architectural drawing is a 2D block of garden
                            benches in AutoCAD drawing, CAD file, and dwg file.
                            For more details and information download the
                            drawing file.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    <div className="col-md-12 col-12 text-center">
                      <div className=" text-center mt-4 mt-md-5 d-inline-flex flex-column  flex-sm-row gap-2 gap-md-3">
                        <button
                          onClick={() =>
                            handledownload(project.id, token, router)
                          }
                          type="button"
                          className="btn-success-split "
                        >
                          <span>
                            <Icons.Download />
                          </span>
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleLike()}
                          type="button"
                          className="btn-primary-split"
                        >
                          <span>
                            <Icons.Add />
                          </span>
                          <span>Add to libary</span>
                        </button>
                        {/* <button type="button" className="btn-danger-split">
                          <span>
                            <Icons.File />
                          </span>
                          <span>Related Files</span>
                        </button> */}
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
                      {similarProjects.map((project) => {
                        return (
                          <div
                            className="col-md-6 col-lg-6 col-xxl-4"
                            key={project.id}
                          >
                            <ProjectCard {...project} />
                          </div>
                        );
                      })}
                    </div>

                    {/* <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      dispatchCurrentPage={getSimilarProjectsPage}
                      goToPreviousPage={() => handlePageChange(currentPage - 1)}
                      goToNextPage={() => handlePageChange(currentPage + 1)}
                    /> */}

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />


                    {/* <LoadMore
                      currentPage={currentPage}
                      totalPage={totalPages}
                      loadMoreHandler={() => {
                        setCurrentPage((prev) => prev + 1);
                      }}
                    /> */}

                    {/* <div className="row">
                      <div className="col-md-12">
                        <div className="text-center">
                          <Link
                            href={"/categories"}
                            className="btn btn-secondary"
                          >
                            BROWSE
                          </Link>
                        </div>
                      </div>
                    </div> */}
                  </div>
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
                          {/* <select
                            defaultValue=""
                            className="form-select"
                            aria-label="Category"
                            onChange={(e) => {
                              categoryAndSubCategory.forEach((item) => {
                                if (item.id == e.target.value) {
                                  console.log("item", categoriesList);
                                  
                                  setSelectedCategory(item.slug);
                                  setSubCategories(item.project_sub_categories);
                                  // console.log("sub",item)
                                }
                              });
                            }}
                          >
                            <option value="all">All Category</option>
                            {categoryAndSubCategory.map(
                              ({ id, title, slug }, index) => {
                                return (
                                  <option value={id} key={id}>
                                    {title}
                                  </option>
                                );
                              }
                            )}
                          </select> */}
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
                                {title}
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
                                  {title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        {/* Category */}
                        {/* <div>
                          <select
                            defaultValue=""
                            className="form-select"
                            aria-label="Category"
                          >
                            <option value="0">All Category</option>
                            <option value="1">Category 1</option>
                            <option value="2">Category 2</option>
                            <option value="3">Category 3</option>
                          </select>
                        </div> */}
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
                <div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

ViewDrawing.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default ViewDrawing;
