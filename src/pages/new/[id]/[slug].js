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
import ProjectCardNew from "@/components/ProjectCardNew";
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
    getallprojects,
    getProductReviews,
    submitProductReview,
    getMyProductReview,
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

import { FaLink, FaCheckCircle, FaArrowUp, FaShieldAlt, FaDownload, FaBookmark, FaShareAlt, FaStar, FaSearch, FaHeart, FaCrown, FaUserCircle, FaTimes, FaCube, FaCouch, FaPenNib, FaLayerGroup, FaImage, FaPencilRuler, FaDrawPolygon, FaCompass, FaGraduationCap, FaCalculator, FaPalette, FaRegClock, FaUsers, FaCheck, FaChevronRight, FaChevronLeft, FaChevronUp, FaChevronDown, FaExpand, FaRegStar } from 'react-icons/fa';
import { toast } from "react-toastify";
import { handledownload } from "@/service/globalfunction";
import Head from "next/head";
import product from "@/assets/images/product.jpg"
import { getSafeImageUrl, handleImageError, getSmallVersion } from "@/utils/imageUtils";

import parse from "html-react-parser";
import AdSense from "@/components/AdSense";
import RatingsSection from "@/components/RatingsSection";
import ImageLightbox from "@/components/ImageLightbox";
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
    const [categorySearchStr, setCategorySearchStr] = useState("");
    const [subCategorySearchStr, setSubCategorySearchStr] = useState("");
    // ✅ ADD STATE FOR PROFILE IMAGE ERROR HANDLING
    const [profileImageError, setProfileImageError] = useState(false);

    const [showRelated, setShowRelated] = useState(false);

    //---- GALLERY STATE ----
    const [galleryUrls, setGalleryUrls] = useState([]);       // original-size slides
    const [galleryThumbUrls, setGalleryThumbUrls] = useState([]); // small thumbnails
    const [showGallery, setShowGallery] = useState(false);
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [zoomImageUrl, setZoomImageUrl] = useState("");
    const [zoomStartIndex, setZoomStartIndex] = useState(0);

    const openLightbox = (index) => {
        setZoomStartIndex(index ?? selectedIndex);
        setIsZoomModalOpen(true);
    };

    // Build gallery once project is loaded
    useEffect(() => {
        // Main slides: use original quality
        const urls = Array.isArray(project?.gallery_urls) && project.gallery_urls.length
            ? project.gallery_urls
            : (project?.photo_url ? [project.photo_url] : []);
        setGalleryUrls(urls);

        // Thumbnails: use small quality
        const thumbs = Array.isArray(project?.gallery_thumbs_urls) && project.gallery_thumbs_urls.length
            ? project.gallery_thumbs_urls
            : urls; // fallback to same urls if thumbs not available
        setGalleryThumbUrls(thumbs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project?.id, project?.photo_url]);

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
    const [openFaq, setOpenFaq] = useState(0);

    // ── Reviews state ────────────────────────────────────────────────────────
    const [reviewsData, setReviewsData] = useState({ reviews: [], avgRating: 0, total: 0, distribution: [] });
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [myReview, setMyReview] = useState(null);      // existing user review
    const [reviewForm, setReviewForm] = useState({ rating: 0, hoverRating: 0, title: '', review: '' });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

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

    // Fetch favorites on auth change or page change
    useEffect(() => {
        if (isAuthenticated) {
            getFavouriteItems()
                .then((favRes) => {
                    dispatch(setFavouriteList(favRes.data.favorites || []));
                })
                .catch((error) => {
                    console.error("Error fetching favorites:", error);
                });
        }
        // dispatch is stable (Redux), id changes when navigating to new product
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, id]);


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

    }, [categoryAndSubCategory.length, categoriesList.length]);
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


    const renderAITools = () => (
        <div id="ai-tools" className="mt-4 rounded-4 p-4 border border-dark border-2" style={{ border: '1.5px solid #e2e8f0', background: 'radial-gradient(circle at top right, #fff0f5 0%, #ffffff 50%)' }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <span className="badge rounded-pill text-white mb-3" style={{ backgroundColor: '#f43f5e', fontSize: '0.75rem', letterSpacing: '0.5px', padding: '6px 12px' }}><FaStar size={10} className="me-1 mb-1" /> JUST LAUNCHED</span>
                    <h3 className="fw-bold mb-2" style={{ color: '#0f172a', fontSize: '1.75rem' }}>New AI Tools you haven't tried yet</h3>
                    <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>Convert, generate and analyse drawings in seconds — built for architects & designers.</p>
                </div>
                <a href="#" className="fw-bold text-decoration-none d-none d-md-block mt-2" style={{ color: '#ef4444' }}>Explore all tools &rarr;</a>
            </div>
            <div className="row g-3">
                {[
                    { title: "Architecture → 3D", icon: <FaCube size={20} />, new: true },
                    { title: "Interior → 3D", icon: <FaCouch size={20} />, new: true },
                    { title: "Sketch → 3D", icon: <FaPenNib size={20} />, new: true },
                    { title: "2D → 3D", icon: <FaLayerGroup size={20} />, new: true },
                    { title: "3D → 2D", icon: <FaLayerGroup size={20} />, new: true },
                    { title: "Image → DWG", icon: <FaImage size={20} />, new: true },
                    { title: "AI Floor Plan", icon: <FaPencilRuler size={20} />, new: false },
                    { title: "PlanForge 2D", icon: <FaDrawPolygon size={20} />, new: true },
                    { title: "Vastu Analysis", icon: <FaCompass size={20} />, new: false },
                    { title: "Projects Thesis", icon: <FaGraduationCap size={20} />, new: true },
                    { title: "Unit Converter", icon: <FaCalculator size={20} />, new: false },
                    { title: "Mood Boards", icon: <FaPalette size={20} />, new: true },
                ].map((tool, idx) => (
                    <div className="col-6 col-md-4 col-lg-3" key={idx}>
                        <div className="rounded-4 p-3 p-md-4 bg-white h-100 d-flex flex-column align-items-start position-relative transition-all tool-card-hover" style={{ border: '1.5px solid #e2e8f0', cursor: 'pointer' }}>
                            {tool.new && <span className="position-absolute top-0 end-0 m-3 badge bg-danger rounded-pill" style={{ fontSize: '0.65rem' }}>NEW</span>}
                            <div className="rounded-3 text-white d-flex align-items-center justify-content-center mb-4" style={{ width: '48px', height: '48px', backgroundColor: '#1e293b' }}>
                                {tool.icon}
                            </div>
                            <span className="fw-bold mt-auto" style={{ color: '#0f172a', fontSize: '0.9rem' }}>{tool.title}</span>
                        </div>
                    </div>
                ))}
            </div>
            <a href="#" className="fw-bold text-decoration-none d-block d-md-none mt-4 text-center" style={{ color: '#ef4444' }}>Explore all tools &rarr;</a>
        </div>
    );

    const renderSidebar = () => (
        <>
            <div id="cta" className="sidebar-cta-card bg-white rounded-4 p-4 shadow-sm mb-4 position-relative" style={{ border: `1.5px solid ${project?.type?.toLowerCase() === 'free' ? '#10b981' : '#ef4444'}` }}>
                <div className="d-flex align-items-center gap-2 mb-3 fw-bold" style={{ color: project?.type?.toLowerCase() === 'free' ? '#10b981' : '#ef4444', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                    <FaCrown size={16} /> {project?.type === 'Free' ? 'FREE FILE' : 'GOLD FILE'}
                </div>
                <button
                    onClick={() => handledownload(project.id, isAuthenticated, router)}
                    type="button"
                    className="btn w-100 py-3 fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3 mb-4 transition-all"
                    style={{ background: project?.type?.toLowerCase() === 'free' ? '#10b981' : 'linear-gradient(to right, #ef4444, #f97316)', border: 'none' }}
                >
                    <FaDownload size={18} /> Download
                </button>
                <ul className="list-unstyled mt-3 mb-0 small text-muted d-flex flex-column gap-3">
                    <li className="d-flex align-items-start gap-2"><FaCheckCircle color="#10b981" size={16} className="mt-1 flex-shrink-0" /> {project?.type === 'Free' ? 'Free high-quality DWG' : 'Unlimited DWG downloads'}</li>
                    <li className="d-flex align-items-start gap-2"><FaCheckCircle color="#10b981" size={16} className="mt-1 flex-shrink-0" /> Commercial-use license</li>
                    <li className="d-flex align-items-start gap-2"><FaCheckCircle color="#10b981" size={16} className="mt-1 flex-shrink-0" /> {project?.type === 'Free' ? 'Production ready' : 'All categories included'}</li>
                    <li className="d-flex align-items-start gap-2 border-bottom pb-3"><FaCheckCircle color="#10b981" size={16} className="mt-1 flex-shrink-0" /> Cancel anytime</li>
                </ul>
                <div className="mt-3 text-center d-flex align-items-center justify-content-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
                    <FaShieldAlt size={12} color="#10b981" /> Verified files • 2.5 Million+ trusted users
                </div>
            </div>

            {/* Author Card */}
            <div className="sidebar-card bg-white rounded-4 border p-4 shadow-sm mb-4">
                <h4 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Uploaded by</h4>
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="flex-shrink-0">
                        {(project?.profile_pic && !profileImageError) ? (
                            <Image
                                src={getSafeImageUrl(project.profile_pic)}
                                alt="Profile"
                                width={48}
                                height={48}
                                className="rounded-circle"
                                style={{ objectFit: "cover" }}
                                loading="lazy"
                                decoding="async"
                                onError={() => setProfileImageError(true)}
                            />
                        ) : (
                            <Image
                                src={profile_dummy}
                                alt="Profile"
                                width={48}
                                height={48}
                                className="rounded-circle"
                                style={{ objectFit: "cover" }}
                                loading="lazy"
                                decoding="async"
                            />
                        )}
                    </div>
                    <div>
                        <h6 className="text-dark fw-bold mb-1">
                            {project?.firstname} {project?.lastname}
                        </h6>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                            142 uploads • 28K downloads
                        </div>
                    </div>
                </div>
                <Link href={`/profile/author/${project?.user_id}`} className="btn w-100 py-2 text-white fw-medium rounded-3" style={{ backgroundColor: '#1e293b' }}>
                    <FaUserCircle size={16} className="me-2" /> View Profile
                </Link>
            </div>

            {/* Tags Card */}
            <div className="sidebar-card bg-white rounded-4 border p-4 shadow-sm mb-4">
                <h4 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Tags</h4>
                <div className="d-flex flex-wrap gap-2">
                    {["#bungalow", "#plumbing layout", "#electrical plan", "#DWG", "#ground floor", "#first floor", "#residential", "#MEP"].map((tag, idx) => (
                        <span key={idx} className="badge bg-light text-secondary border px-2 py-2 rounded-pill fw-normal" style={{ fontSize: '0.75rem' }}>{tag}</span>
                    ))}
                </div>
            </div>

            <div className="d-none d-lg-block">
                <AdSense slot="9473550740" format="fluid" layout="in-article" className="ad-slot" lazy={false} />
            </div>

            <div className="sidebar-card bg-white rounded-4 border p-4 shadow-sm mb-4">
                <div className="d-flex align-items-center gap-2 text-muted fw-bold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                    <FaLayerGroup size={14} color="#ef4444" /> BROWSE BY CATEGORY
                </div>

                <div className="mb-3">
                    <label className="form-label fw-medium" style={{ fontSize: '0.75rem', color: '#64748b' }}>Category</label>
                    <div className="input-group mb-2">
                        <span className="input-group-text bg-white border-end-0 text-muted"><FaSearch size={12} /></span>
                        <input type="text" className="form-control border-start-0 ps-0 shadow-none" placeholder="Search category..." style={{ fontSize: '0.85rem' }} value={categorySearchStr} onChange={(e) => setCategorySearchStr(e.target.value)} />
                    </div>

                    <div className="list-group mb-4" style={{ border: '1px solid #f1f5f9', borderRadius: '0.5rem', overflow: 'hidden', maxHeight: '200px', overflowY: 'auto' }}>
                        {(categoryAndSubCategory?.filter(c => c.title?.toLowerCase().includes(categorySearchStr.toLowerCase())) || []).map(({ id, title }) => (
                            <button
                                key={id}
                                className="list-group-item list-group-item-action border-0 py-2 text-dark text-start"
                                style={{ fontSize: '0.85rem', backgroundColor: selectedCategory === title ? '#fff0f5' : 'transparent', fontWeight: selectedCategory === title ? '600' : '400' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const matchingCategory = categoriesList?.find((cat) => cat.id == id);
                                    if (matchingCategory) setSelectedCategory(matchingCategory.slug);
                                    const selectedCategoryObj = categoryAndSubCategory?.find((item) => item.id == id);
                                    if (selectedCategoryObj) setSubCategories(selectedCategoryObj.project_sub_categories || []);
                                    setSelectedSubCategory("");
                                }}
                            >
                                {title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-medium" style={{ fontSize: '0.75rem', color: '#64748b' }}>Subcategory</label>
                    <div className="input-group mb-2">
                        <span className="input-group-text bg-white border-end-0 text-muted"><FaSearch size={12} /></span>
                        <input type="text" className="form-control border-start-0 ps-0 shadow-none" placeholder="Search subcategory..." style={{ fontSize: '0.85rem' }} value={subCategorySearchStr} onChange={(e) => setSubCategorySearchStr(e.target.value)} />
                    </div>

                    <div className="list-group mb-4 position-relative" style={{ border: '1px solid #f1f5f9', borderRadius: '0.5rem', height: '200px', overflowY: 'auto' }}>
                        {subCategories?.filter(sc => sc.title?.toLowerCase().includes(subCategorySearchStr.toLowerCase())).length > 0 ? subCategories.filter(sc => sc.title?.toLowerCase().includes(subCategorySearchStr.toLowerCase())).map(({ id, title, slug }) => (
                            <button
                                key={id}
                                className="list-group-item list-group-item-action border-0 py-2 text-dark text-start"
                                style={{ fontSize: '0.85rem', backgroundColor: selectedSubCategory === slug ? '#fff0f5' : 'transparent', fontWeight: selectedSubCategory === slug ? '600' : '400' }}
                                onClick={(e) => { e.preventDefault(); setSelectedSubCategory(slug); }}
                            >
                                {title}
                            </button>
                        )) : (
                            <div className="p-3 text-muted text-center" style={{ fontSize: '0.8rem' }}>Select a category first</div>
                        )}
                    </div>
                </div>

                <button
                    onClick={onSearchSubmitHandler}
                    className="btn w-100 py-3 fw-bold text-white shadow-sm rounded-3 d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                    style={{ backgroundColor: '#0f172a' }}
                >
                    Browse Files <FaChevronRight size={12} />
                </button>
            </div>

            {/* Claim Offer Widget (Moved to bottom) */}
            <div id="cta-promo" className="rounded-4 p-4 p-md-4 mb-4 position-relative text-white" style={{ backgroundColor: '#1e293b' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2 fw-bold" style={{ color: '#94a3b8', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                        <FaCrown size={14} color="#ef4444" /> STARTING FROM
                    </div>
                    <span className="badge rounded-pill" style={{ backgroundColor: '#ef4444', fontSize: '0.65rem', padding: '4px 8px' }}>BEST VALUE</span>
                </div>

                <div className="d-flex align-items-end gap-2 mb-1">
                    <span className="fw-bold" style={{ fontSize: '2.5rem', lineHeight: '1' }}>$5.99</span>
                    <span className="fw-bold mb-1" style={{ fontSize: '0.9rem', color: '#94a3b8' }}>USD</span>
                    <span className="text-decoration-line-through mb-1" style={{ fontSize: '0.9rem', color: '#64748b' }}>$19.99</span>
                    <span className="badge mb-1 ms-1" style={{ backgroundColor: '#ef4444', fontSize: '0.65rem' }}>-50%</span>
                </div>
                <div className="text-muted small mb-4" style={{ fontSize: '0.8rem' }}>/ Weekly · Cancel anytime</div>

                {/* Timer Box */}
                <div className="rounded-3 p-3 mb-4" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                        <FaRegClock size={14} /> LIMITED-TIME OFFER ENDS IN
                    </div>
                    <div className="d-flex gap-2 mb-3">
                        <div className="bg-danger rounded-2 text-center text-white p-2 d-flex flex-column justify-content-center flex-fill">
                            <span className="fw-bold" style={{ fontSize: '1.25rem', lineHeight: '1' }}>23</span>
                            <span style={{ fontSize: '0.6rem' }}>HRS</span>
                        </div>
                        <span className="text-danger fw-bold d-flex align-items-center">:</span>
                        <div className="bg-danger rounded-2 text-center text-white p-2 d-flex flex-column justify-content-center flex-fill">
                            <span className="fw-bold" style={{ fontSize: '1.25rem', lineHeight: '1' }}>54</span>
                            <span style={{ fontSize: '0.6rem' }}>MIN</span>
                        </div>
                        <span className="text-danger fw-bold d-flex align-items-center">:</span>
                        <div className="bg-danger rounded-2 text-center text-white p-2 d-flex flex-column justify-content-center flex-fill">
                            <span className="fw-bold" style={{ fontSize: '1.25rem', lineHeight: '1' }}>43</span>
                            <span style={{ fontSize: '0.6rem' }}>SEC</span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2 mt-1">
                        <FaUsers size={12} color="#ef4444" />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>162 of 200 claimed</span>
                    </div>
                    <div className="progress" style={{ height: '4px', backgroundColor: '#334155' }}>
                        <div className="progress-bar bg-danger" role="progressbar" style={{ width: '81%' }} aria-valuenow="81" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/pricing')}
                    type="button"
                    className="btn w-100 py-3 fw-bold text-white shadow-sm rounded-3 mb-4 transition-all hover-scale"
                    style={{ background: '#ef4444', border: 'none' }}
                >
                    <FaRegClock size={16} className="me-2 mb-1" /> Claim Offer Now
                </button>

                <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1px' }}>INCLUDES</h6>
                <ul className="list-unstyled mb-4 small d-flex flex-column gap-2" style={{ fontSize: '0.85rem' }}>
                    <li className="d-flex align-items-center gap-2"><FaCheck color="#ef4444" size={12} /> 25 AI Credits</li>
                    <li className="d-flex align-items-center gap-2"><FaCheck color="#ef4444" size={12} /> 65K+ Free Files</li>
                    <li className="d-flex align-items-center gap-2"><FaCheck color="#ef4444" size={12} /> 225K+ Premium Files</li>
                    <li className="d-flex align-items-center gap-2"><FaCheck color="#ef4444" size={12} /> Create Library</li>
                    <li className="d-flex align-items-center gap-2"><FaCheck color="#ef4444" size={12} /> Upload Files</li>
                    <li className="d-flex align-items-center gap-2"><FaCheck color="#ef4444" size={12} /> Projects Library</li>
                </ul>

                <h6 className="text-uppercase fw-bold mb-3 mt-4" style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1px' }}>DAILY DOWNLOADS</h6>
                <div className="d-flex gap-3 mb-4">
                    <div className="flex-fill rounded-3 p-3 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div className="text-danger fw-bold fs-5 mb-1">10</div>
                        <div className="text-uppercase" style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.5px' }}>GOLD / DAY</div>
                    </div>
                    <div className="flex-fill rounded-3 p-3 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div className="text-white fw-bold fs-5 mb-1">10</div>
                        <div className="text-uppercase" style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.5px' }}>FREE / DAY</div>
                    </div>
                </div>

                <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1px' }}>AI TOOLS INCLUDED</h6>
                <div className="row g-2 mb-4">
                    {[
                        "Architecture → 3D", "Interior → 3D",
                        "Sketch → 3D", "2D → 3D",
                        "3D → 2D", "Image → DWG",
                        "AI Floor Plan", "PlanForge 2D",
                        "Vastu Analysis", "Projects Thesis",
                        "Unit Converter", "Mood Boards"
                    ].map((tool, idx) => (
                        <div className="col-6" key={idx}>
                            <div className="rounded border px-2 py-2 d-flex align-items-center justify-content-between" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                <span style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>{tool}</span>
                                <span className="text-danger" style={{ fontSize: '0.55rem' }}>NEW</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center d-flex align-items-center justify-content-center gap-2 mt-4" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    <FaShieldAlt size={12} color="#ef4444" /> Secure checkout · Cancel anytime
                </div>
            </div>
        </>
    );

    const renderRelatedFiles = () => (
        <div id="related" className="bg-white rounded-4 border py-4 px-4 px-md-4 py-md-5 mt-5 shadow-sm">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-2 text-uppercase fw-bold" style={{ color: '#ef4444', fontSize: '0.7rem', letterSpacing: '1px' }}>
                        <FaRegStar size={14} /> FIND LATEST
                    </div>
                    <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '2rem' }}>Related Files</h2>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Hand-picked DWG drawings similar to this layout.</p>
                </div>
                <Link href="/categories" className="text-decoration-none fw-bold hover-scale transition-all d-none d-md-block" style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                    View all <FaChevronRight size={10} className="ms-1" />
                </Link>
            </div>

            {showRelated && (
                <div className="row gy-4 mb-4 mb-md-5">
                    {similarProjects.length > 0 ? (
                        similarProjects.map((project) => (
                            <div className="col-12 col-md-6 col-xl-4" key={project.id}>
                                <ProjectCardNew {...project} favorites={favouriteList} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p>No more related files found.</p>
                        </div>
                    )}

                    {/* ✅ ADD THIS NEW "LOAD MORE" BUTTON LOGIC */}
                    {hasMore && similarProjects.length > 0 && (
                        <div className="text-center mt-4 w-100">
                            <button
                                className="btn py-3 rounded-3 fw-bold transition-all hover-scale"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                style={{ backgroundColor: '#0f172a', color: 'white', width: '200px' }}
                            >
                                {isLoading ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

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

                {galleryUrls?.length > 0 && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "CreativeWork",
                                "name": project?.work_title,
                                "description": project?.meta_description || project?.description,
                                "image": galleryUrls.map((url) => getSafeImageUrl(url)),
                                "url": `${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`,
                                "mainEntityOfPage": `${process.env.NEXT_PUBLIC_FRONT_URL}${router.asPath}`
                            }),
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
            <div className="product-page-container pb-2">
                <div className="container">
                    <nav aria-label="breadcrumb" className="breadcrumb-nav">
                        <ol>
                            <li><Link href="/">Home</Link></li>
                            <li className="separator">/</li>
                            <li><Link href="/categories">Categories</Link></li>
                            {project?.product_category_title && (
                                <>
                                    <li className="separator">/</li>
                                    <li><Link href={`/${project?.category_path}/1`}>{project?.product_category_title}</Link></li>
                                </>
                            )}
                            {project?.product_subcategory_title && (
                                <>
                                    <li className="separator">/</li>
                                    <li><Link href={`/${project?.category_path}/${project?.subcategory_path}/1`}>{project?.product_subcategory_title}</Link></li>
                                </>
                            )}
                            <li className="separator">/</li>
                            <li className="text-dark fw-medium text-truncate" style={{ maxWidth: '40ch' }}>{project?.work_title}</li>
                        </ol>
                    </nav>

                    <section className="product-title-block">
                        <div className="d-flex flex-wrap align-items-center gap-2 col-12 col-sm-12 col-md-9">
                            <h1 className="flex-grow-1 text-truncate" style={{ whiteSpace: 'normal', margin: 0, fontWeight: 900 }}>{project?.work_title}</h1>
                        </div>

                        <div className="product-stats-strip align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <Icons.Eye size={14} />
                                {project?.views || 0}
                            </div>
                            <span className="d-none d-sm-inline" style={{ color: '#e5e7eb' }}>•</span>
                            <div className="d-flex align-items-center gap-2">
                                <FaDownload size={14} />
                                {project?.downloads_count || project?.download || 0}
                            </div>

                            {project?.type && (
                                <>
                                    <span className="d-none d-sm-inline" style={{ color: '#e5e7eb' }}>•</span>
                                    <span className="gold-badge" style={project.type.toLowerCase() === 'free' ? { backgroundColor: '#d1fae5', color: '#10b981' } : {}}>
                                        {project.type}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="trust-strip">
                            <div className="trust-item">
                                <div className="trust-icon"><FaCheckCircle size={16} /></div>
                                <div className="min-w-0" style={{ overflow: 'hidden' }}>
                                    <div className="trust-text-label">Verified file</div>
                                    <div className="trust-text-val">Quality checked</div>
                                </div>
                            </div>
                            <div className="trust-item">
                                <div className="trust-icon"><FaDownload size={16} /></div>
                                <div className="min-w-0" style={{ overflow: 'hidden' }}>
                                    <div className="trust-text-label">{project?.downloads_count || project?.download || 0} downloads</div>
                                    <div className="trust-text-val">Overall</div>
                                </div>
                            </div>
                            <div className="trust-item">
                                <div className="trust-icon"><FaArrowUp size={16} /></div>
                                <div className="min-w-0" style={{ overflow: 'hidden' }}>
                                    <div className="trust-text-label">Trending #{project?.trending_rank || 1}</div>
                                    <div className="trust-text-val">{project?.product_category_title || "Category"}</div>
                                </div>
                            </div>
                            <div className="trust-item">
                                <div className="trust-icon"><FaShieldAlt size={16} /></div>
                                <div className="min-w-0" style={{ overflow: 'hidden' }}>
                                    <div className="trust-text-label">Commercial use</div>
                                    <div className="trust-text-val">License included</div>
                                </div>
                            </div>
                        </div>
                    </section>


                </div>
            </div>

            {/* Categories  */}

            {/* In-page section nav (Sticky full width) */}
            <div className="position-sticky bg-white border-bottom" style={{ top: "80px", zIndex: 1020 }}>
                <div className="container">
                    <div className="in-page-nav-inner py-1" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', margin: 0 }}>
                        <a href="#about" className="text-decoration-none fw-semibold" style={{ color: '#111827', padding: '1rem 0.5rem', borderBottom: '2px solid transparent' }}>About</a>
                        <a href="#specs" className="text-decoration-none fw-medium" style={{ color: '#64748b', padding: '1rem 0.5rem', borderBottom: '2px solid transparent' }}>Specs</a>
                        <a href="#faq" className="text-decoration-none fw-medium" style={{ color: '#64748b', padding: '1rem 0.5rem', borderBottom: '2px solid transparent' }}>FAQ</a>
                        <a href="#reviews" className="text-decoration-none fw-medium" style={{ color: '#64748b', padding: '1rem 0.5rem', borderBottom: '2px solid transparent' }}>Reviews</a>
                        <a href="#related" className="text-decoration-none fw-medium" style={{ color: '#64748b', padding: '1rem 0.5rem', borderBottom: '2px solid transparent' }}>Related</a>
                    </div>
                </div>
            </div>

            <section className="product-main-content pb-5" style={{ backgroundColor: '#f8fafc', paddingTop: '2rem' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">


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

                            <div className="gallery-container position-relative border rounded-4 overflow-hidden mb-4" style={{ background: 'radial-gradient(circle at center, #f8fafc 0%, #ffffff 100%)', boxShadow: 'var(--shadow-card)' }}>
                                {/* Blueprint grid overlay for the entire container */}
                                <div className="w-100 h-100 position-absolute z-0" style={{ inset: 0, opacity: 0.18, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,112,243,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,112,243,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px, 32px 32px' }}></div>
                                <div aria-hidden className="w-100 h-100 position-absolute z-0" style={{ inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,112,243,0.08) 100%)' }}></div>

                                {/* Decorative corner accents */}
                                <div aria-hidden className="pointer-events-none position-absolute" style={{ top: '-1px', left: '-1px', width: '3rem', height: '3rem', borderTop: '2px solid #ef4444', borderLeft: '2px solid #ef4444', borderTopLeftRadius: '1rem', zIndex: 20 }}></div>
                                <div aria-hidden className="pointer-events-none position-absolute" style={{ top: '-1px', right: '-1px', width: '3rem', height: '3rem', borderTop: '2px solid #ef4444', borderRight: '2px solid #ef4444', borderTopRightRadius: '1rem', zIndex: 20 }}></div>

                                {/* badges */}
                                <div className="position-absolute top-0 start-0 m-3  d-flex flex-column gap-2" style={{ marginTop: '1.5rem !important', marginLeft: '1.5rem !important', zIndex: 5 }}>
                                    <span className="badge bg-dark text-white p-2 px-3 d-inline-flex align-items-center gap-1 rounded-pill"><FaStar size={12} /> Free Preview</span>
                                    <span className="badge bg-white text-dark border p-2 px-3 rounded-pill text-start w-auto shadow-sm" style={{ alignSelf: 'flex-start' }}>HD · DWG</span>
                                </div>

                                {galleryUrls.length > 1 ? (
                                    /* MULTI-IMAGE MODE (with ratio, but only 1–2 images loaded at a time) */
                                    <div className="position-relative group-gallery">
                                        {/* Top-right toolbar */}
                                        <div className="position-absolute top-0 end-0 m-3 d-flex align-items-center gap-2 gallery-toolbar" style={{ zIndex: 5 }}>
                                            <button onClick={() => openLightbox(selectedIndex)} className="btn btn-light bg-white border d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', borderRadius: '8px', padding: 0 }}>
                                                <FaExpand size={15} className="text-dark" />
                                            </button>
                                        </div>

                                        <div className="embla" ref={emblaRef}>
                                            <div className="embla__container">
                                                {galleryUrls.map((url, idx) => {
                                                    const isFirst = idx === 0;
                                                    // Only load current, previous and next slide
                                                    const isNearCurrent = Math.abs(idx - selectedIndex) <= 1;

                                                    return (
                                                        <div className="embla__slide position-relative" key={`embla-${idx}`}>
                                                            <div className="embla__stage" style={{ ['--frame-ratio']: ratioStr, background: 'transparent', boxShadow: 'none' }}>
                                                                {isNearCurrent ? (
                                                                    <>
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
                                                                            style={{ cursor: 'zoom-in', objectFit: 'contain', padding: '2rem', paddingBottom: '6rem', backgroundColor: 'transparent' }}
                                                                            onClick={() => openLightbox(idx)}
                                                                            className="z-10 gallery-main-image"
                                                                        />
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* NEW Bottom Overlay OUTSIDE the slides */}
                                        <div className="position-absolute bottom-0 start-0 w-100 p-3 p-md-4 d-flex justify-content-between align-items-end z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(241, 245, 249, 1) 0%, rgba(241, 245, 249, 0.7) 40%, transparent 100%)', paddingTop: '8rem' }}>
                                            <div style={{ pointerEvents: 'auto' }}>
                                                <div className="fw-bold fs-5 text-dark" style={{ textShadow: '0 0 10px white, 0 0 20px white' }}>Part-{selectedIndex + 1}</div>
                                                <div className="d-flex align-items-center mt-2" style={{ gap: '6px' }}>
                                                    {galleryUrls.map((_, i) => (
                                                        <span
                                                            key={i}
                                                            style={{
                                                                height: '4px',
                                                                borderRadius: '2px',
                                                                transition: 'all 0.3s ease',
                                                                width: i === selectedIndex ? '24px' : '6px',
                                                                backgroundColor: i === selectedIndex ? '#ef4444' : 'rgba(0,0,0,0.3)',
                                                                boxShadow: '0 0 4px white'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2" style={{ pointerEvents: 'auto' }}>
                                                <span className="badge bg-white text-dark border p-2 px-3 rounded-pill shadow-sm">{selectedIndex + 1} / {galleryUrls.length || 1}</span>
                                                <button onClick={() => openLightbox(selectedIndex)} className="btn btn-light bg-white text-dark border p-2 px-3 rounded-pill shadow-sm d-flex align-items-center" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}><FaExpand size={12} className="me-1" /> Click to zoom</button>
                                            </div>
                                        </div>

                                        {/* controls remain same */}
                                        <button className="position-absolute start-0 top-50 translate-middle-y ms-2 ms-md-3 btn btn-light bg-white border rounded-circle shadow-sm d-flex align-items-center justify-content-center" onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollPrev(); }} style={{ width: '44px', height: '44px', padding: 0, zIndex: 50 }}>
                                            <FaChevronLeft size={16} className="text-dark" />
                                        </button>
                                        <button className="position-absolute end-0 top-50 translate-middle-y me-2 me-md-3 btn btn-light bg-white border rounded-circle shadow-sm d-flex align-items-center justify-content-center" onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollNext(); }} style={{ width: '44px', height: '44px', padding: 0, zIndex: 50 }}>
                                            <FaChevronRight size={16} className="text-dark" />
                                        </button>
                                    </div>
                                ) : (
                                    /* SINGLE IMAGE MODE (no ratio, use natural height) */
                                    <div className="embla__single position-relative group-gallery" style={{ background: 'transparent' }}>
                                        {/* Top-right toolbar */}
                                        <div className="position-absolute top-0 end-0 m-3 z-10 d-flex align-items-center gap-2 gallery-toolbar">
                                            <button onClick={() => openLightbox(0)} className="btn btn-light bg-white border d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', borderRadius: '8px', padding: 0 }}>
                                                <FaExpand size={15} className="text-dark" />
                                            </button>
                                        </div>

                                        <Image
                                            key={project?.id || project?.photo_url}
                                            src={getSafeImageUrl(project?.photo_url)}
                                            width={project?.image_width || 800}
                                            height={project?.image_height || 600}
                                            alt={project?.work_title || "CAD Drawing"}
                                            className="img-fluid position-relative z-10 gallery-main-image"
                                            priority
                                            fetchPriority="high"
                                            quality={85}
                                            placeholder="empty"
                                            sizes="(max-width: 480px) 100vw, (max-width: 768px) 90vw, 72vw"
                                            style={{ objectFit: "contain", width: "100%", height: "auto", padding: '2rem', paddingBottom: '6rem', cursor: 'zoom-in', backgroundColor: 'transparent' }}
                                            onClick={() => openLightbox(0)}
                                            onError={() => setImgError(true)}
                                        />

                                        {/* Bottom Overlay for Single Image */}
                                        <div className="position-absolute bottom-0 start-0 w-100 p-3 p-md-4 d-flex justify-content-between align-items-end z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(241, 245, 249, 1) 0%, rgba(241, 245, 249, 0.7) 40%, transparent 100%)', paddingTop: '8rem' }}>
                                            <div style={{ pointerEvents: 'auto' }}>
                                                <div className="fw-bold fs-5 text-dark" style={{ textShadow: '0 0 10px white, 0 0 20px white' }}>Part-1</div>
                                                <div className="d-flex align-items-center mt-2" style={{ gap: '6px' }}>
                                                    <span style={{ height: '4px', borderRadius: '2px', width: '24px', backgroundColor: '#ef4444', boxShadow: '0 0 4px white' }} />
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2" style={{ pointerEvents: 'auto' }}>
                                                <span className="badge bg-white text-dark border p-2 px-3 rounded-pill shadow-sm">1 / 1</span>
                                                <button onClick={() => openLightbox(0)} className="btn btn-light bg-white text-dark border p-2 px-3 rounded-pill shadow-sm d-flex align-items-center" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}><FaExpand size={12} className="me-1" /> Click to zoom</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* THUMBNAILS AT BOTTOM OF CONTAINER — uses small URLs for performance */}
                                {galleryUrls.length > 1 && (
                                    <div className="embla__thumbs px-3 pb-3 pt-3 d-flex gap-2 overflow-auto border-top z-10 position-relative" style={{ scrollSnapType: 'x mandatory', background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(241, 245, 249, 0.3) 100%)' }}>
                                        {galleryThumbUrls.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => scrollTo(i)}
                                                className="flex-shrink-0 position-relative overflow-hidden transition-all text-start"
                                                style={{
                                                    width: "72px",
                                                    scrollSnapAlign: 'start',
                                                    border: i === selectedIndex ? "2px solid #ef4444" : "2px solid transparent",
                                                    opacity: i === selectedIndex ? 1 : 0.7,
                                                    borderRadius: '8px',
                                                    transform: i === selectedIndex ? 'scale(1.02)' : 'none',
                                                    boxShadow: i === selectedIndex ? '0 4px 12px rgba(239, 68, 68, 0.2)' : 'none',
                                                    padding: 0,
                                                    backgroundColor: 'transparent'
                                                }}
                                            >
                                                {/* <span
                          className="position-absolute z-10 fw-bold font-monospace border shadow-sm"
                          style={{
                            top: '4px', left: '4px', fontSize: '9px', padding: '1px 4px', borderRadius: '4px',
                            backgroundColor: i === selectedIndex ? '#ef4444' : 'rgba(255,255,255,0.9)',
                            color: i === selectedIndex ? '#fff' : '#64748b'
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span> */}
                                                <div className="w-100 bg-white" style={{ aspectRatio: '4/3', padding: '2px' }}>
                                                    <div className="position-relative w-100 h-100">
                                                        <Image src={getSafeImageUrl(url)} alt={`Thumb ${i + 1}`} fill style={{ objectFit: 'contain' }} />
                                                    </div>
                                                </div>
                                                <div className="w-100 text-center fw-semibold text-truncate transition-all" style={{
                                                    fontSize: '10px', padding: '4px',
                                                    backgroundColor: i === selectedIndex ? '#ef4444' : '#fff',
                                                    color: i === selectedIndex ? '#fff' : '#64748b'
                                                }}>
                                                    Part-{i + 1}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Action Bar */}
                            <div className="action-bar-new mt-4 mb-4 d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-2 flex-wrap">
                                    <button onClick={() => handleLike()} type="button" className={`btn btn-light bg-white border rounded-pill d-flex align-items-center gap-2 px-3 py-2 fw-medium shadow-sm ${isFavorited ? 'text-danger border-danger' : 'text-dark'}`}>
                                        <FaHeart size={16} /> {isFavorited ? "Saved" : "Save"}
                                    </button>

                                    <button type="button" className="btn btn-light bg-white border rounded-pill d-flex align-items-center gap-2 px-3 py-2 fw-medium shadow-sm text-dark">
                                        <FaShareAlt size={16} /> Share
                                    </button>

                                    <button onClick={() => handleAddToLibrary()} type="button" className="btn btn-light bg-white border rounded-pill d-flex align-items-center gap-2 px-3 py-2 fw-medium shadow-sm text-dark">
                                        <FaBookmark size={16} /> Library
                                    </button>
                                </div>

                                <div className="text-muted small fw-medium d-none d-sm-block">
                                    File ID: CB-{project?.id}
                                </div>
                            </div>

                            {/* Project Description */}
                            <div id="about" className="section-card bg-white border rounded-4 mt-4 p-4 shadow-sm">
                                <h2 className="section-title fs-4 mb-4 fw-bold text-dark">About this drawing</h2>
                                <div className="prose-text text-dark" style={{ lineHeight: '1.8' }}>
                                    {project?.description ? (
                                        parse(`${(project.description || "").replace(/\s*style="[^"]*"/g, '')}`)
                                    ) : (
                                        <p>No description available for this drawing.</p>
                                    )}
                                </div>
                            </div>

                            {/* File Info Specs */}
                            <div id="specs" className="section-card mt-4">
                                <h3 className="section-title">File information</h3>
                                <div className="specs-grid">
                                    <div className="spec-item">
                                        <span className="spec-label"><Icons.File color="#ef4444" /> File Type</span>
                                        <span className="spec-val text-end w-50">{project?.file_type}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label"><Icons.File color="#ef4444" /> File Size</span>
                                        <span className="spec-val text-end w-50">{formatBytes(project?.size) || "—"}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label"><Icons.Categories color="#ef4444" /> Category</span>
                                        <span className="spec-val text-end w-50">{project?.product_category_title}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label"><Icons.Categories color="#ef4444" /> Sub Category</span>
                                        <span className="spec-val text-end w-50">{project?.product_subcategory_title}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label"><Icons.Tag color="#ef4444" /> License Type</span>
                                        <span className="spec-val text-primary text-end w-50">{project?.type}</span>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ, Ratings & AI Tools */}
                            {project?.faqs && project.faqs.length > 0 && (
                                <div id="faq" className="section-card mt-4">
                                    <h3 className="section-title">Frequently Asked Questions</h3>
                                    <div className="faq-accordion mt-4">
                                        {project?.faqs.map((faq, index) => (
                                            <div key={faq.id || index} className={`py-3 ${index === project.faqs.length - 1 ? '' : 'border-bottom'}`}>
                                                <button
                                                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                                    className="d-flex justify-content-between align-items-center w-100 bg-transparent border-0 p-0 text-start"
                                                    style={{ cursor: 'pointer', outline: 'none' }}
                                                >
                                                    <span className="fw-semibold" style={{ color: '#111827', fontSize: '1rem' }}>
                                                        Q. {faq.question}
                                                    </span>
                                                    <span className="text-muted ms-3 flex-shrink-0 d-flex align-items-center">
                                                        {openFaq === index ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                                    </span>
                                                </button>
                                                {openFaq === index && (
                                                    <div className="pt-3 pe-4">
                                                        <p className="mb-0 text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Ratings & Reviews ───────────────────────────────────── */}
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

                            <div className="d-none d-lg-block">
                                {renderAITools()}
                            </div>

                            <div className="mt-4">
                                <AdSense slot="4412795758" format="fluid" layout="in-article" className="ad-slot" lazy={false} />
                            </div>

                            <div className="d-none d-lg-block">
                                {renderRelatedFiles()}
                            </div>

                        </div> {/* END OF col-lg-8 */}

                        <div className="col-lg-4 position-sticky d-none d-lg-block" style={{ top: "100px", height: "max-content", zIndex: 10 }}>
                            {/* Sidebar CTA */}
                            {renderSidebar()}
                            {/* ads image */}

                            {/* <div className="d-block d-lg-none">
                  <AdSense slot="4406439781" format="fluid" layout="in-article" />
                </div> */}

                        </div>
                    </div>

                    <div className="d-block d-lg-none mt-4 mb-4">
                        {renderSidebar()}
                    </div>
                    <div className="d-block d-lg-none mt-4 mb-4">
                        {renderAITools()}
                    </div>
                    <div className="d-block d-lg-none mt-4 mb-5">
                        {renderRelatedFiles()}
                    </div>
                </div>

                {/* Removed old Related Files location */}

                {/* <div className="border-top border-bottom py-2"> */}
                {/* <AdSense slot="8612944968" format="fluid" layout="in-article" className="ad-slot" /> */}
                {/* </div> */}
                {/* ZOOM LIGHTBOX */}
                {isZoomModalOpen && (
                    <ImageLightbox
                        images={galleryUrls.length ? galleryUrls : (project?.photo_url ? [project.photo_url] : [])}
                        startIndex={zoomStartIndex}
                        onClose={() => setIsZoomModalOpen(false)}
                        onDownload={() => handledownload(project.id, isAuthenticated, router)}
                    />
                )}

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