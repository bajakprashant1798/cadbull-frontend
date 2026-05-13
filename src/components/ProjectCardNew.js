import save from "@/assets/icons/save.png";
import product from "@/assets/images/product.jpg"
import Icons from "./Icons";
import Link from "next/link";
import { addFavouriteItem, removeFavouriteItem } from "@/service/api";
import { useSelector, useDispatch } from "react-redux";
import { addedFavouriteItem, deleteFavouriteItem } from "../../redux/app/features/projectsSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { handledownload } from "@/service/globalfunction";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { getSafeImageUrl, handleImageError } from "@/utils/imageUtils";
import { redirectToLogin } from "@/utils/redirectHelpers";
import { preloadImage } from "@/utils/preloadImage";
import { FaBookmark, FaChevronRight } from "react-icons/fa";

const ProjectCardNew = ({
    view_count,
    work_title,
    file_type,
    id,
    photo_url,
    type,
    favorites, // Optionally pass favorites list from parent
    priority = false, // Add priority prop for LCP images
}) => {
    const router = useRouter();
    // const { token } = useSelector((store) => store.logininfo);
    const isAuthenticated = useSelector((state) => state.logininfo.isAuthenticated);
    const [isFavorited, setIsFavorited] = useState(false);

    const ref = useRef(null);
    const heroUrl = getSafeImageUrl(photo_url); // same URL used on detail page

    useEffect(() => {
        if (!ref.current || !heroUrl) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                preloadImage(heroUrl);       // warm cache as soon as card is near viewport
                io.disconnect();
            }
        }, { rootMargin: "200px" });
        io.observe(ref.current);
        return () => io.disconnect();
    }, [heroUrl]);

    const dispatch = useDispatch();

    // Use the passed favorites to set initial status
    useEffect(() => {
        const projectId = Number(id); // if needed
        if (favorites && Array.isArray(favorites)) {
            setIsFavorited(favorites.some((fav) => fav.id === projectId));
        }
    }, [favorites, id]);

    const handleviewcount = useCallback((event) => {
        if (event.target.tagName === "IMG") {
            event.preventDefault();
            return;
        }

    }, [id]);


    const handleLike = useCallback(async () => {
        if (!isAuthenticated) {
            redirectToLogin(router);
            return;
        }
        try {
            if (isFavorited) {
                await removeFavouriteItem(id);
                setIsFavorited(false);
                toast.success("Removed from Favorite list", { position: "top-right" });
                // Dispatch action to update Redux store:
                dispatch(deleteFavouriteItem(id));
            } else {
                await addFavouriteItem({ product_id: id });
                setIsFavorited(true);
                toast.success("Added to Favorite list", { position: "top-right" });
                // Dispatch action with minimal product info.
                dispatch(
                    addedFavouriteItem({
                        id,
                        work_title,
                        file_type,
                        photo_url,
                        type,
                    })
                );
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toast.error("Failed to update favorite status");
        }
    }, [isAuthenticated, id, isFavorited, router, dispatch, work_title, file_type, photo_url, type]);


    // function slugify(text) {
    //   if (!text) return "";
    // return text
    //   .toString()
    //   // .toLowerCase()
    //   .replace(/\s+/g, '-')           // Replace spaces with -
    //   .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    //   .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    //   .replace(/^-+/, '')             // Trim - from start of text
    //   .replace(/-+$/, '');            // Trim - from end of text
    // }

    // components/ProjectCard.js
    function slugify(text) {
        if (!text) return "";
        return text
            .replace(/\s+/g, "-")
            .replace(/\-+/g, "-")
            .replace(/^\-+|\-+$/g, "");
    }



    return (
        <>
            <style jsx>{`
        .custom-card-hover {
          border: 1.5px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        .custom-card-hover:hover {
          border-color: #ef4444 !important;
        }
        .custom-card-hover:hover .work-title-hover {
          color: #ef4444 !important;
        }
        .custom-card-hover:hover .more-details-hover {
          color: #ef4444 !important;
        }
        .save-badge-hover {
          opacity: 0;
          transition: all 0.2s ease;
          transform: translateY(-5px);
        }
        .custom-card-hover:hover .save-badge-hover {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
            <div ref={ref} className='custom-card-hover project-day-card card h-100 shadow-sm rounded-4 position-relative overflow-hidden' onMouseEnter={() => preloadImage(heroUrl)}>
                <Link
                    onClick={handleviewcount}
                    className="h-100 text-decoration-none d-flex flex-column"
                    href={`/detail/${id}/${slugify(work_title)}`}
                    onMouseEnter={() => router.prefetch(`/detail/${id}/${slugify(work_title)}`)}
                >
                    <div className="project-day-card-image position-relative w-100 bg-white" style={{ aspectRatio: '4/3', borderBottom: '1px solid #f1f5f9' }}>
                        <div className="w-100 h-100 position-absolute z-0" style={{ inset: 0, opacity: 0.18, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,112,243,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,112,243,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px, 32px 32px' }}></div>

                        {/* Top Left Badge (GOLD / FREE) */}
                        <span className="badge position-absolute top-0 start-0 m-3 rounded-pill shadow-sm fw-bold" style={{ backgroundColor: type === 'Gold' ? '#ef4444' : '#10b981', color: '#fff', zIndex: 10, fontSize: '0.65rem', letterSpacing: '0.5px', padding: '6px 12px' }}>
                            {type === 'Gold' ? 'GOLD' : 'FREE'}
                        </span>

                        {/* Hover Save Badge */}
                        <span className="save-badge-hover badge position-absolute top-0 start-0 m-3 rounded-pill text-white shadow-sm d-flex align-items-center gap-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', zIndex: 11, fontSize: '0.65rem', padding: '6px 12px' }}>
                            <FaBookmark size={10} /> Save
                        </span>

                        {/* Top Right Save Icon */}
                        <button
                            onClick={(e) => { e.preventDefault(); handleLike(); }}
                            className="btn position-absolute top-0 end-0 m-3 rounded-circle p-0 shadow-sm d-flex align-items-center justify-content-center transition-all hover-scale"
                            style={{ width: '36px', height: '36px', zIndex: 10, border: '1px solid #e2e8f0', backgroundColor: '#fff' }}
                        >
                            <FaBookmark size={12} color={isFavorited ? '#ef4444' : '#64748b'} />
                        </button>

                        {/* Bottom Left DWG Badge */}
                        <span className="badge position-absolute bottom-0 start-0 m-3 rounded-2 text-white shadow-sm" style={{ backgroundColor: '#1e293b', zIndex: 10, fontSize: '0.7rem', padding: '4px 8px' }}>
                            {file_type || 'DWG'}
                        </span>

                        <Image
                            src={getSafeImageUrl(photo_url)}
                            fill
                            alt={work_title || "project"}
                            className="img-fluid"
                            priority={priority}
                            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                            style={{
                                objectFit: "contain",
                                display: "block",
                                padding: '1.5rem',
                                zIndex: 1
                            }}
                            onError={(e) => handleImageError(e)}
                        />
                    </div>

                    <div className='p-3 d-flex flex-column flex-grow-1 bg-white'>
                        <h5 className="work-title-hover mb-2 text-dark" style={{ fontSize: '0.9rem', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', transition: 'color 0.2s ease', minHeight: '2.8rem' }}>
                            {work_title}
                        </h5>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-1">
                            <span className="more-details-hover text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px', transition: 'color 0.2s ease' }}>MORE DETAILS</span>
                            <FaChevronRight className="more-details-hover" color="#94a3b8" size={12} style={{ transition: 'color 0.2s ease' }} />
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
}
export default React.memo(ProjectCardNew);