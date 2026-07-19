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

import useEmblaCarousel from 'embla-carousel-react';

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

import { FaLink, FaChevronUp, FaChevronDown, FaStar, FaRegStar, FaShieldAlt } from 'react-icons/fa';
import { toast } from "react-toastify";
import { handledownload } from "@/service/globalfunction";
import Head from "next/head";
import product from "@/assets/images/product.jpg"
import { getSafeImageUrl, handleImageError, getSmallVersion } from "@/utils/imageUtils";

import parse from "html-react-parser";
import AdSense from "@/components/AdSense";
import RatingsSection from "@/components/RatingsSection";
// ✅ PERFORMANCE OPTIMIZATION: Use native Next.js Image for maximum speed
import Image from 'next/image';

// CDN asset URLs (no local imports)
const autoCad = assets.images.filetype("file_white.png");
const cad = assets.images.filetype("file_white_double.png");
const cad_category = assets.images.filetype("file_white.png");
const goldblocks = assets.images.filetype("file.png");
const profile_dummy = assets.images.icons("profile.png");
const link = assets.images.social("link.png"); // if you ever need the image file
const file_size = assets.images.filetype("filesize.png");

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

// new added calculate file size function
// Human-readable byte formatter (e.g., 12.3 MB)
const formatBytes = (bytes) => {
  if (bytes == null) return null;
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  const rounded = i < 2 ? Math.round(val) : Math.round(val * 10) / 10; // 0 dec for KB, 1 dec from MB+
  return `${rounded} ${units[i]}`;
};

const ViewDrawing = ({ initialProject, initialSimilar, canonicalUrl }) => {
  const dispatch = useDispatch();
  const [project, setProject] = useState(initialProject || []);
  const [similarProjects, setSimilarProjects] = useState(initialSimilar || []);
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

  // ── Reviews state ────────────────────────────────────────────────────────
  const [reviewsData, setReviewsData] = useState({ reviews: [], avgRating: 0, total: 0, distribution: [] });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [myReview, setMyReview] = useState(null);      // existing user review
  const [reviewForm, setReviewForm] = useState({ rating: 0, hoverRating: 0, title: '', review: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  //---- GALLERY STATE ----
  const [galleryUrls, setGalleryUrls] = useState([]); // array of URLs (strings)
  const [showGallery, setShowGallery] = useState(false); // mount Swiper only when needed

  // Build gallery once project is loaded
  useEffect(() => {
    // Prefer backend-provided gallery; fallback to single cover
    const urls = Array.isArray(project?.gallery_urls) && project.gallery_urls.length
      ? project.gallery_urls
      : (project?.photo_url ? [project.photo_url] : []);
    setGalleryUrls(urls);
  }, [project?.id, project?.photo_url, project?.gallery_urls]);

  useEffect(() => {
    if (galleryUrls?.length > 1) {
      const run = () => setShowGallery(true);
      if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1500 });
      else setTimeout(run, 800);
    }
  }, [galleryUrls]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: galleryUrls.length > 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  // --- debug helpers (local-only; remove later) ---
  const shortCat = (c) => ({
    id: c?.id, title: c?.title, slug: c?.slug,
    category_path: c?.category_path, path: c?.path
  });
  const shortSub = (s) => ({
    id: s?.id, title: s?.title, slug: s?.slug,
    subcategory_path: s?.subcategory_path, path: s?.path
  });

  // console.log("Initial Project:", { project });

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
  const { categoryAndSubCategory, categoriesList } = useSelector((store) => store.projectinfo);
  const { id } = router.query;

  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  const [isFavorited, setIsFavorited] = useState(false);

  // At the top, add a state to track whether favorites have been fetched
  const [favouritesFetched, setFavouritesFetched] = useState(false);

  // const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

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
    setIsFavorited(favouriteList.some((fav) => fav.id === Number(projectId)));
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
    console.log("categoryAndSubCategory", categoryAndSubCategory);
    console.log("categoriesList", categoriesList);

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
    if (categoriesList.length === 0) {
      getallCategories('').then((res) => {
        // console.log("res", res);

        dispatch(addAllCategoriesData(res.data.categories));
      }).catch((err) => {

      })
    }

  }, [categoryAndSubCategory, categoriesList]);
  const onSearchSubmitHandler = (e) => {
    e.preventDefault();
    // console.log("selectedCategory", selectedCategory);
    // console.log("selectedSubCategory", selectedSubCategory);

    // if (selectedCategory && selectedSubCategory) {
    //   dispatch(updatesubcatslug(selectedSubCategory));
    //   dispatch(updatesubcatpage(1));
    //   // router.push(`/categories/sub/${selectedCategory}`);
    //   router.push(`/${selectedCategory}`);
    // } else if (selectedCategory) {
    //   // router.push(`/categories/sub/${selectedCategory}`);
    //   router.push(`/${selectedCategory}`);
    // }
    // Go directly to subcategory if chosen
    if (selectedSubCategory) {
      // Use nested routing: /category/subcategory
      router.push(`/${selectedCategory}/${selectedSubCategory}`);
      return;
    }

    // Otherwise go to the main category (this already works for you)
    if (selectedCategory) {
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

  // Decide the aspect ratio once for the box (fallback 4/3)
  // If only one image → do NOT use ratio
  // If multiple images → use a fixed ratio box
  let ratioStr = null;

  if (galleryUrls.length > 1) {
    ratioStr = project?.image_width && project?.image_height
      ? `${project.image_width} / ${project.image_height}`
      : '4 / 3';   // fallback ratio
  }

  // Decide preview image for social sharing (ALWAYS ONE)
  const previewImage =
    galleryUrls?.length > 0
      ? galleryUrls[0]          // first gallery image
      : project?.photo_url || null;

  return (
    <Fragment>
      <Head>
        <title>{project?.meta_title || project?.work_title}</title>
        <meta name="robots" content="index, follow" />
        <meta name="description" content={project?.meta_description || project?.description?.slice(0, 150)} />
        <meta property="og:title" content={project?.meta_title || project?.work_title} />
        <meta property="og:description" content={project?.meta_description || project?.description?.slice(0, 150)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`} />
        {/* <meta property="og:image" content={project?.photo_url || `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`} /> */}

        {/* {galleryUrls.map((url, i) => (
          <meta property="og:image" content={getSafeImageUrl(url) || `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`} key={i} />
        ))} */}
        {/* <meta property="og:image" content={getSafeImageUrl(project?.photo_url) || `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`} /> */}

        {/* PRIMARY OG IMAGE (MANDATORY) */}
        {previewImage && (
          <meta
            property="og:image"
            content={getSafeImageUrl(previewImage)}
          />
        )}

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={`${project?.work_title} - CAD Drawing from Cadbull`}
        />

        {/* OPTIONAL: additional gallery images */}
        {/* {galleryUrls.slice(1, 4).map((url, i) => ( */}
        {galleryUrls.slice(1).map((url, i) => (
          <meta
            property="og:image"
            content={getSafeImageUrl(url)}
            key={`og-extra-${i}`}
          />
        ))}
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
        {/* <meta name="twitter:image" content={getSafeImageUrl(project?.photo_url) || `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`} /> */}
        <meta
          name="twitter:image"
          content={previewImage
            ? getSafeImageUrl(previewImage)
            : `${process.env.NEXT_PUBLIC_FRONT_URL}/default-img.png`
          }
        />
        <meta name="twitter:image:alt" content={`${project?.work_title} - CAD Drawing from Cadbull`} />
        <meta name="keywords" content={project?.tags || ""} />

        {/* 1. CreativeWork / Image Gallery Schema */}
        {galleryUrls?.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "name": project?.work_title,
                "description": project?.meta_description || (project?.description ? project.description.replace(/<[^>]*>/g, '').slice(0, 300) : "Download high-quality AutoCAD drawings and 2D/3D CAD blocks."),
                "image": galleryUrls.map((url) => getSafeImageUrl(url)),
                "url": `${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`,
                "mainEntityOfPage": `${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`
              }),
            }}
          />
        )}

        {/* 2. Product Schema with dynamic review aggregation and offers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": project?.work_title,
              "image": galleryUrls.map((url) => getSafeImageUrl(url)),
              "description": project?.meta_description || (project?.description ? project.description.replace(/<[^>]*>/g, '').slice(0, 300) : "Download high-quality AutoCAD drawings and 2D/3D CAD blocks."),
              "sku": project?.id ? String(project.id) : undefined,
              "mpn": project?.id ? String(project.id) : undefined,
              "brand": {
                "@type": "Brand",
                "name": "Brand"
              },
              "reviewedBy": project?.reviewed_by ? {
                "@type": "Person",
                "name": project.reviewed_by
              } : {
                "@type": "Person",
                "name": "Cadbull"
              },
              "dateReviewed": project?.last_reviewed ? project.last_reviewed.split('T')[0] : new Date().toISOString().split('T')[0],
              "abstract": project?.tldr || undefined,
              "author": project?.experience ? {
                "@type": "Person",
                "name": "Expert Contributor",
                "knowsAbout": project.experience
              } : undefined,
              "offers": {
                "@type": "Offer",
                "url": `${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`,
                "priceCurrency": "USD",
                "price": project?.type?.toLowerCase() === 'free' ? '0.00' : '5.99',
                "priceValidUntil": "2028-12-31",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
              },
              "aggregateRating": reviewsData?.total > 0 ? {
                "@type": "AggregateRating",
                "ratingValue": String(reviewsData.avgRating || 5),
                "reviewCount": String(reviewsData.total || 1),
                "bestRating": "5",
                "worstRating": "1"
              } : undefined
            })
          }}
        />

        {/* 3. SoftwareApplication (CAD Asset) Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": project?.work_title,
              "operatingSystem": "Windows, macOS",
              "applicationCategory": "DesignApplication",
              "fileFormat": project?.file_type || "DWG",
              "fileSize": formatBytes(project?.size) || "Unknown size",
              "requirements": {
                "@type": "SoftwareApplication",
                "name": project?.file_type ? (
                  project.file_type.toLowerCase().includes("sketchup") || project.file_type.toLowerCase().includes("skp") ? "Trimble SketchUp" :
                    project.file_type.toLowerCase().includes("revit") ? "Autodesk Revit" :
                      project.file_type.toLowerCase().includes("max") || project.file_type.toLowerCase().includes("3ds") ? "Autodesk 3ds Max" : "Autodesk AutoCAD"
                ) : "Autodesk AutoCAD"
              },
              "offers": {
                "@type": "Offer",
                "price": project?.type?.toLowerCase() === 'free' ? '0.00' : '5.99',
                "priceCurrency": "USD"
              }
            })
          }}
        />

        {/* 4. FAQPage Schema for Search & AI Overview (GEO/AEO) extraction */}
        {project?.faqs && project.faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": project.faqs.map((faq) => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              })
            }}
          />
        )}


        <link rel="canonical" href={canonicalUrl} />
        <link rel="preconnect" href="https://assets.cadbull.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://assets.cadbull.com"></link>
        {/* <link rel="preload" href="https://assets.cadbull.com" as="image" />
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
                        {/* <Link  href={`/categories/sub/${project?.category_path}`}> */}
                        <Link href={`/${project?.category_path}/1`}>
                          {project?.product_category_title}
                        </Link>
                      </li>
                    )}
                    {project?.product_subcategory_title && (
                      <li className="breadcrumb-item">
                        {/* <Link  href={`/categories/sub/${project?.subcategory_path}`}> */}
                        <Link href={`/${project?.category_path}/1`}>
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
            <div className="col-lg-8">
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
                    media={getSafeImageUrl(previewImage)}
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

              {/* <div className="mt-4" style={{ maxWidth: "100%", margin: "0 auto" }}>
                <div className="bg-light p-3 rounded-2 shadow-sm heroFrame mb-3">
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
                      // title={project?.work_title || "Preview not available"}
                    >
                      <div className="hero-fallback__inner">
                        <h2 className="hero-fallback__title">
                          {project?.work_title}
                        </h2>
                        {project?.file_type && <p className="hero-fallback__meta">{project.file_type} file</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div> */}

              {/* E9E9EB */}
              <div className="p-3 rounded-2 shadow-sm heroFrame mb-3 mt-2" style={{ background: "#FBFBFC" }}>
                {galleryUrls.length > 1 ? (
                  /* MULTI-IMAGE MODE (with ratio, but only 1–2 images loaded at a time) */
                  <div className="embla" ref={emblaRef}>
                    <div className="embla__container">
                      {galleryUrls.map((url, idx) => {
                        const isFirst = idx === 0;
                        // Only load current, previous and next slide
                        const isNearCurrent = Math.abs(idx - selectedIndex) <= 1;

                        return (
                          <div className="embla__slide" key={`embla-${idx}`}>
                            <div className="embla__stage" style={{ ['--frame-ratio']: ratioStr }}>
                              {isNearCurrent ? (
                                <Image
                                  src={getSafeImageUrl(url)}   // ✅ still your original high-quality image
                                  alt={project?.work_title ? (idx === 0 ? project.work_title : `${project.work_title} ${idx + 1}`) : `Slide ${idx + 1}`}
                                  fill
                                  priority={isFirst}
                                  fetchPriority={isFirst ? "high" : "auto"}
                                  loading={isFirst ? "eager" : "lazy"}
                                  decoding={isFirst ? "auto" : "async"}
                                  quality={85}
                                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 72vw"
                                />
                              ) : (
                                // Lightweight placeholder instead of loading full image
                                <div className="embla__placeholder">
                                  {/* optional text/icon here */}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* controls remain same */}
                    <button className="embla__btn embla__btn--prev" onClick={scrollPrev}>
                      <Icons.leftSwip />
                    </button>
                    <button className="embla__btn embla__btn--next" onClick={scrollNext}>
                      <Icons.rightSwip />
                    </button>
                    <div className="embla__dots">
                      {scrollSnaps.map((_, i) => (
                        <button
                          key={i}
                          className={`embla__dot ${i === selectedIndex ? "embla__dot--active" : ""}`}
                          onClick={() => scrollTo(i)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* SINGLE IMAGE MODE (no ratio, use natural height) */
                  <div className="embla__single">
                    <Image
                      // key={project?.id || project?.photo_url}
                      // src={getSafeImageUrl(project?.photo_url)}
                      // alt={project?.work_title || "CAD Drawing"}
                      // width={project?.image_width || 800}
                      // height={project?.image_height || 600}
                      // style={{ width: "100%", height: "auto", objectFit: "contain" }}
                      // priority
                      // quality={85}
                      // sizes="100vw"
                      // onError={() => setImgError(true)}

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
                  </div>
                )}
              </div>

              <AdSense slot="1862351352" format="auto" className="ad-slot" lazy={false} />

              {/* Tags Card */}
              {project?.tags && (
                <div className="d-none d-lg-block bg-white profile_shadow p-3 p-md-4 rounded-2 mt-3 mb-4">
                  <h4 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Tags</h4>
                  <div className="d-flex flex-wrap gap-2">
                    {project.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                      <span key={idx} className="badge bg-light text-secondary border px-2 py-2 rounded-pill fw-normal" style={{ fontSize: '0.75rem' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cadbull AI Generator Card - Desktop */}
              <div className="row my-3 d-lg-block d-none">
                <div className="col-md-12">
                  <a
                    href="https://ai.cadbull.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <div
                      className="p-4 profile_shadow rounded-2 border border-light-subtle position-relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #20325A 0%, #3D6098 100%)",
                        transition: "all 0.3s ease",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Decorative background glow bubble */}
                      <div
                        style={{
                          position: "absolute",
                          top: "-20%",
                          right: "-20%",
                          width: "150px",
                          height: "150px",
                          background: "rgba(255, 255, 255, 0.12)",
                          borderRadius: "50%",
                          filter: "blur(40px)",
                          pointerEvents: "none"
                        }}
                      />

                      <div className="d-flex align-items-center gap-3">
                        <div className="flex-grow-1">
                          <h4 className="fw-bold mb-2 text-white" style={{ fontSize: "1.1rem", letterSpacing: "0.2px" }}>
                            Turn floor plans into photoreal 3D in minutes.
                          </h4>
                          <p className="mb-0 text-white-50" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>
                            Upload your drawings, describe the vision, and generate four cinematic 3D views. Built for working architects and interior designers.
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 d-flex align-items-center justify-content-end">
                        <span
                          className="btn btn-sm fw-semibold rounded-pill px-3 py-1.5 shadow-sm text-primary"
                          style={{
                            fontSize: "0.8rem",
                            border: "none",
                            background: "#ffffff",
                            color: "#20325A"
                          }}
                        >
                          Try AI Now &rarr;
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Classic styled FAQ and Reviews for Desktop */}
              {project?.faqs && project.faqs.length > 0 && (
                <div className="bg-white profile_shadow rounded-4 border border-1 p-3 p-md-4 mt-3 d-none d-lg-block" id="faq">
                  <h3 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ fontSize: "1.25rem" }}>
                    Frequently Asked Questions
                  </h3>
                  <div className="faq-accordion">
                    {project.faqs.map((faq, index) => (
                      <div key={faq.id || index} className={`py-3 ${index === project.faqs.length - 1 ? '' : 'border-bottom'}`}>
                        <button
                          onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                          className="d-flex justify-content-between align-items-center w-100 bg-transparent border-0 p-0 text-start"
                          style={{ cursor: 'pointer', outline: 'none' }}
                        >
                          <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                            Q. {faq.question}
                          </span>
                          <span className="text-muted ms-3 flex-shrink-0 d-flex align-items-center">
                            {openFaq === index ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                          </span>
                        </button>
                        {openFaq === index && (
                          <div className="pt-3 pe-4">
                            <p className="mb-0 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* E-E-A-T Quality verification card */}
              {(project?.tldr || project?.experience) && (
                <div className="bg-white profile_shadow rounded-4 border border-1 p-3 p-md-4 mt-3 d-none d-lg-block" id="eeat-quality">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <FaShieldAlt className="text-primary" size={18} />
                    <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.25rem" }}>
                      E-E-A-T & Quality Verification
                    </h3>
                  </div>

                  {project?.tldr && (
                    <div className="mb-3">
                      <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: "0.95rem" }}>📝 AI Overview (TL;DR)</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                        {project.tldr}
                      </p>
                    </div>
                  )}

                  {project?.experience && (
                    <div className="mb-3">
                      <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: "0.95rem" }}>💡 First-hand Experience</h5>
                      <p className="mb-0 text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                        {project.experience}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-top border-light-subtle d-flex flex-wrap justify-content-between align-items-center gap-2" style={{ fontSize: "0.8rem" }}>
                    <span className="text-muted">
                      Reviewed by: <strong className="text-dark">{project.reviewed_by || "Cadbull"}</strong>
                    </span>
                    <span className="text-muted">
                      Last reviewed: <strong className="text-dark">
                        {(() => {
                          const dateStr = project.last_reviewed || new Date();
                          try {
                            const d = new Date(dateStr);
                            if (isNaN(d.getTime())) return String(dateStr);
                            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                          } catch (e) {
                            return String(dateStr);
                          }
                        })()}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Dynamic Ratings & Reviews section inside a matching classic card */}
              <div className="bg-white pb-3 mt-3 d-none d-lg-block" id="reviews">
                <RatingsSection
                  productId={project?.id}
                  isAuthenticated={isAuthenticated}
                  reviewsData={reviewsData}
                  setReviewsData={setReviewsData}
                  myReview={myReview}
                  setMyReview={setMyReview}
                  showReviewModal={showReviewModal}
                  setShowReviewModal={setShowReviewModal}
                  reviewForm={reviewForm}
                  setReviewForm={setReviewForm}
                  reviewSubmitting={reviewSubmitting}
                  setReviewSubmitting={setReviewSubmitting}
                />
              </div>


              {/* <div className="border-top border-bottom py-2 mt-4"> */}
              <div className="d-none d-lg-block">
                <AdSense slot="9473550740" format="fluid" layout="in-article" className="ad-slot" lazy={false} />
              </div>
              {/* </div> */}


            </div>


            <div className="col-lg-4">
              <div className="d-flex flex-column gap-3">

                {/* Project Description */}
                <div className="py-3 py-md-2 description-container">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-md-3 mb-4 shadow-sm px-3 pb-3 pt-2 rounded-1" style={{ background: "#F4F4F5" }}>
                          <div className="" style={{ paddingLeft: '25px' }}>

                            <div className={`position-relative d-inline-flex main-heading-wrapper-product `}>
                              <div>
                                <h4 className="d-inline-block mb-3 h6" style={{ minHeight: 6 }}></h4>
                                <h2 className="product-description-title mb-2">Description</h2>
                              </div>
                            </div>
                            <div>{parse(`${(project.description || "").replace(/\s*style=">/g, '>')}`)}</div>
                            {/* <DescriptionRenderer 
                              description={project?.description} 
                              className="mt-2"
                            /> */}

                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cadbull AI Generator Card moved below tags */}

                    {/* <div className="d-none d-lg-block"> */}
                    <AdSense slot="4412795758" sidebar className="ad-slot mb-3" lazy={false} />
                    {/* </div> */}

                    <div className="row gy-3 mb-md-3 mb-4">
                      <Link href={`/categories/1?file_type=${project?.file_type}`} className="text-decoration-none">
                        <FileDescription
                          bgColor={"#20325A"}
                          image={autoCad}
                          type={"File Type:"}
                          title={project?.file_type}
                        />
                      </Link>

                      {/* NEW: File Size card */}
                      {/* <div className="text-decoration-none">
                        <FileDescription
                          bgColor={"#21447f"}
                          image={file_size}
                          type={"File Size:"}
                          title={formatBytes(project?.size) || "—"}
                        // className={"text-dark"}
                        />
                      </div> */}

                      <Link href={`/${project?.category_path}/1`} className="text-decoration-none">
                        <FileDescription
                          bgColor={"#3D6098"}
                          image={cad_category}
                          type={"Category::"}
                          title={project?.product_category_title}
                        />
                      </Link>
                      <Link href={`/${project?.category_path}/${project?.subcategory_path}/1`} className="text-decoration-none">
                        <FileDescription
                          bgColor={"#5B5B5B"}
                          image={cad}
                          type={"Sub Category::"}
                          title={project?.product_subcategory_title}
                        />
                      </Link>
                      <Link href={`/categories/1?type=${slugify(project?.type)}`} className="text-decoration-none">
                        <FileDescription
                          bgColor={"#E9E9EB"}
                          image={goldblocks}
                          type={"type:"}
                          title={project?.type}
                          className={"text-primary"}
                        />
                      </Link>

                    </div>

                    {/* Uploaded By Profile Card */}
                    <div className="bg-white profile_shadow p-3 rounded-2 border border-light-subtle mb-3">
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="flex-shrink-0">
                            {(project?.profile_pic && !profileImageError) ? (
                              <Image
                                src={getSafeImageUrl(project.profile_pic)}
                                alt="Profile"
                                width={60}
                                height={60}
                                className="rounded-circle"
                                style={{ objectFit: "cover" }}
                                loading="lazy"
                                decoding="async"
                                sizes="60px"
                                onError={() => setProfileImageError(true)}
                              />
                            ) : (
                              <Image
                                src={profile_dummy}
                                alt="Profile"
                                width={60}
                                height={60}
                                className="rounded-circle"
                                style={{ objectFit: "cover" }}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                          </div>
                          <div>
                            <p className='fst-italic mb-0 text-muted' style={{ fontSize: '0.75rem' }}>Uploaded by:</p>
                            <h6 className="text-primary fw-semibold mb-0" style={{ fontSize: '0.9rem' }}>
                              {project?.firstname} {project?.lastname}
                            </h6>
                          </div>
                        </div>
                        <div>
                          <Link href={`/profile/author/${project?.user_id}`} className="btn btn-primary btn-sm py-1.5 px-3 rounded-pill fw-semibold" style={{ fontSize: '0.8rem' }}>
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Download & Library Buttons placed below Uploaded By Card */}
                    <div className="row justify-content-center mb-3 mt-3">
                      <div className="col-md-12 col-12 text-center">
                        <div className="download-btn-sm text-center d-inline-flex flex-column flex-sm-row gap-2 gap-md-3">
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

                    {/* Tags Card */}
                    {project?.tags && (
                      <div className="d-block d-lg-none bg-white profile_shadow p-3 p-md-4 rounded-2 mt-3 mb-4">
                        <h4 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Tags</h4>
                        <div className="d-flex flex-wrap gap-2">
                          {project.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                            <span key={idx} className="badge bg-light text-secondary border px-2 py-2 rounded-pill fw-normal" style={{ fontSize: '0.75rem' }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cadbull AI Generator Card - Mobile */}
                    <div className="row my-3 d-block d-lg-none">
                      <div className="col-12">
                        <a
                          href="https://ai.cadbull.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          <div
                            className="p-4 profile_shadow rounded-2 border border-light-subtle position-relative overflow-hidden"
                            style={{
                              background: "linear-gradient(135deg, #20325A 0%, #3D6098 100%)",
                              transition: "all 0.3s ease",
                              cursor: "pointer"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-4px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            {/* Decorative background glow bubble */}
                            <div
                              style={{
                                position: "absolute",
                                top: "-20%",
                                right: "-20%",
                                width: "150px",
                                height: "150px",
                                background: "rgba(255, 255, 255, 0.12)",
                                borderRadius: "50%",
                                filter: "blur(40px)",
                                pointerEvents: "none"
                              }}
                            />

                            <div className="d-flex align-items-center gap-3">
                              <div className="flex-grow-1">
                                <h4 className="fw-bold mb-2 text-white" style={{ fontSize: "1.1rem", letterSpacing: "0.2px" }}>
                                  Turn floor plans into photoreal 3D in minutes.
                                </h4>
                                <p className="mb-0 text-white-50" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>
                                  Upload your drawings, describe the vision, and generate four cinematic 3D views. Built for working architects and interior designers.
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 d-flex align-items-center justify-content-end">
                              <span
                                className="btn btn-sm fw-semibold rounded-pill px-3 py-1.5 shadow-sm text-primary"
                                style={{
                                  fontSize: "0.8rem",
                                  border: "none",
                                  background: "#ffffff",
                                  color: "#20325A"
                                }}
                              >
                                Try AI Now &rarr;
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>

                    {/* Classic FAQ and Reviews for Mobile viewports */}
                    {project?.faqs && project.faqs.length > 0 && (
                      <div className="row my-3 d-block d-lg-none">
                        <div className="col-12">
                          <div className="bg-white profile_shadow p-3 p-md-4 mt-3" id="faq-mobile">
                            <h3 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ fontSize: "1.25rem" }}>
                              Frequently Asked Questions
                            </h3>
                            <div className="faq-accordion">
                              {project.faqs.map((faq, index) => (
                                <div key={faq.id || index} className={`py-3 ${index === project.faqs.length - 1 ? '' : 'border-bottom'}`}>
                                  <button
                                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                    className="d-flex justify-content-between align-items-center w-100 bg-transparent border-0 p-0 text-start"
                                    style={{ cursor: 'pointer', outline: 'none' }}
                                  >
                                    <span className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                                      Q. {faq.question}
                                    </span>
                                    <span className="text-muted ms-3 flex-shrink-0 d-flex align-items-center">
                                      {openFaq === index ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                    </span>
                                  </button>
                                  {openFaq === index && (
                                    <div className="pt-3 pe-4">
                                      <p className="mb-0 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                        {faq.answer}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* E-E-A-T Quality verification card for Mobile viewports */}
                    {(project?.tldr || project?.experience) && (
                      <div className="row my-3 d-block d-lg-none">
                        <div className="col-12">
                          <div className="bg-white profile_shadow p-3 p-md-4 mt-3" id="eeat-quality-mobile">
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <FaShieldAlt className="text-primary" size={18} />
                              <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.25rem" }}>
                                E-E-A-T & Quality Verification
                              </h3>
                            </div>

                            {project?.tldr && (
                              <div className="mb-3">
                                <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: "0.95rem" }}>📝 AI Overview (TL;DR)</h5>
                                <p className="mb-0 text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                                  {project.tldr}
                                </p>
                              </div>
                            )}

                            {project?.experience && (
                              <div className="mb-3">
                                <h5 className="fw-semibold text-dark mb-1" style={{ fontSize: "0.95rem" }}>💡 First-hand Experience</h5>
                                <p className="mb-0 text-muted" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                                  {project.experience}
                                </p>
                              </div>
                            )}

                            <div className="pt-2 border-top border-light-subtle d-flex flex-wrap justify-content-between align-items-center gap-2" style={{ fontSize: "0.8rem" }}>
                              <span className="text-muted">
                                Reviewed by: <strong className="text-dark">{project.reviewed_by || "Cadbull"}</strong>
                              </span>
                              <span className="text-muted">
                                Last reviewed: <strong className="text-dark">
                                  {(() => {
                                    const dateStr = project.last_reviewed || new Date();
                                    try {
                                      const d = new Date(dateStr);
                                      if (isNaN(d.getTime())) return String(dateStr);
                                      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                    } catch (e) {
                                      return String(dateStr);
                                    }
                                  })()}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row my-3 d-block d-lg-none">
                      <div className="col-12">
                        <div className="bg-white profile_shadow p-3 p-md-4 mt-3" id="reviews-mobile">
                          <RatingsSection
                            productId={project?.id}
                            isAuthenticated={isAuthenticated}
                            reviewsData={reviewsData}
                            setReviewsData={setReviewsData}
                            myReview={myReview}
                            setMyReview={setMyReview}
                            showReviewModal={showReviewModal}
                            setShowReviewModal={setShowReviewModal}
                            reviewForm={reviewForm}
                            setReviewForm={setReviewForm}
                            reviewSubmitting={reviewSubmitting}
                            setReviewSubmitting={setReviewSubmitting}
                          />
                        </div>
                      </div>
                    </div>


                    {/* <div className="border-top border-bottom py-2 mt-4"> */}
                    {/* <AdSense slot="9473550740" ≠ layout="in-article" className="ad-slot" /> */}
                    {/* </div> */}

                    <AdSense slot="2091281415" format="fluid" layout="in-article" className="ad-slot" lazy={false} />

                    {/* Buttons moved above description */}

                    {/* <Link href={`https://arcll.com/3d-visualizer`} target='_blank'>
                      <button
                        type="button"
                        className="btn btn-primary d-flex mx-auto mt-3"
                      >
                        <span>3D View</span>
                      </button>
                    </Link> */}
                  </div>
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
                              setSelectedSubCategory(""); // clear previous sub selection
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
                            {subCategories.map(({ id, title, slug }) => {
                              return (
                                <option value={slug} key={id}>
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

                {/* <div className="d-block d-lg-none">
                  <AdSense slot="4406439781" format="fluid" layout="in-article" />
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
                    mainHeading={"Similar"}
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
        {/* <AdSense slot="8612944968" format="fluid" layout="in-article" className="ad-slot" /> */}
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
      // res.setHeader('Cache-Control', 'no-store');
      res.statusCode = 404;
      return { notFound: true };
      // return { redirect: { destination: '/', permanent: false } };
    }

    // // 🧠 Memory tracking
    // const initialMemory = process.memoryUsage();
    // logMemoryUsage('ProjectDetailPage-Start', initialMemory);

    // 🌐 Track project API call with retry logic
    let projectRes;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        projectRes = await getsingleallprojects("", id);
        break; // Success, exit retry loop
      } catch (error) {
        retryCount++;
        console.error(`❌ [DETAIL-PAGE-ERROR] Retry ${retryCount}/${maxRetries} for product ID: ${id}, slug: ${params.slug || 'unknown'}:`, {
          status: error.response?.status || 'unknown',
          message: error.message,
          url: error.config?.url || 'unknown',
          method: error.config?.method || 'GET'
        });

        if (error.response?.status === 429 && retryCount < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }

        // If final retry or non-429 error, throw
        throw error;
      }
    }
    // const projectAPITime = Date.now() - projectAPIStart;

    // logAPICall('getsingleallprojects', projectAPITime, 200, JSON.stringify(projectRes?.data || {}).length);

    if (!projectRes || !projectRes.data) {
      res.setHeader('Cache-Control', 'no-store');
      // return { props: { initialProject: null, initialSimilar: [], canonicalUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}/detail/${id}`, softError: true } };
      res.statusCode = 410; // 🔥 DMCA BEST PRACTICE
      return { notFound: true };
    }

    const project = projectRes.data;

    // // Use backend slug if available and not empty/null, else fallback to slugify
    // const backendSlug = project.slug || null;

    // const canonicalSlug = backendSlug ? String(backendSlug).trim() : slugify(project.work_title);

    // // Redirect if param slug is wrong (case-insensitive)
    // const incomingSlug = decodeURIComponent(params.slug || "");
    // if (incomingSlug.toLowerCase() !== canonicalSlug.toLowerCase()) {
    //   return {
    //     redirect: {
    //       destination: `/detail/${id}/${canonicalSlug}`,
    //       permanent: true,
    //     },
    //   };
    // }

    // 1) take DB slug exactly if it's a real string
    let dbSlug = typeof project?.slug === 'string' ? project.slug.trim() : '';
    // guard against literal "null"/"undefined" stored as text
    if (['null', 'undefined'].includes(dbSlug.toLowerCase?.() || '')) dbSlug = '';
    // 2) otherwise fallback to old-site slugify (no lowercase)
    const canonicalSlug = dbSlug || slugify(project?.work_title || '');

    // 3) case-SENSITIVE compare; only redirect when different
    const incomingSlug = decodeURIComponent(params.slug || "");
    if (incomingSlug !== canonicalSlug) {
      return {
        redirect: {
          destination: `/detail/${id}/${encodeURIComponent(canonicalSlug)}`,
          permanent: true,
        },
      };
    }

    // 🌐 Track similar projects API call with error handling
    let similarRes;
    try {
      similarRes = await getsimilerllprojects(1, 12, projectRes.data.product_sub_category_id);
    } catch (error) {
      console.log(`Similar projects API failed for project ${id}:`, error.status);
      // Continue without similar projects if API fails
      similarRes = { data: { projects: [] } };
    }


    // ✅ Cache the HTML at the CDN for a short time
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    // optional: tidy up proxies
    res.setHeader('Vary', 'Accept-Encoding');

    return {
      props: {
        initialProject: project,
        initialSimilar: similarRes?.data?.projects || [],
        canonicalUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}/detail/${id}/${encodeURIComponent(canonicalSlug)}`,
      },
    };
  } catch (err) {
    console.error(`❌ [DETAIL-PAGE-ERROR] Error in detail page getServerSideProps for product ID: ${id}, slug: ${params.slug || 'unknown'}:`, {
      errorMessage: err.message,
      errorStatus: err.response?.status || 'unknown',
      errorCode: err.code || 'unknown',
      requestURL: err.config?.url || 'unknown',
      projectId: id,
      requestedSlug: params.slug,
      userAgent: ctx.req.headers['user-agent'] || 'unknown',
      ip: ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress || 'unknown'
    });

    res.setHeader('Cache-Control', 'no-store');
    //   return {
    //    props: {
    //      initialProject: null,
    //      initialSimilar: [],
    //      canonicalUrl: `${process.env.NEXT_PUBLIC_FRONT_URL}/detail/${id}`,
    //      softError: true,
    //    },
    //  };

    res.statusCode = 404;
    return { notFound: true };
  }
}

ViewDrawing.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default ViewDrawing;