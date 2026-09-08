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

const ProjectCard = ({
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

  // components/ProjectCard.js
  function slugify(text) {
    if (!text) return "";
    return text
      .replace(/\s+/g, "-")
      .replace(/\-+/g, "-")
      .replace(/^\-+|\-+$/g, "");
  }

  return (
    <div ref={ref} className='project-day-card h-100' onMouseEnter={() => preloadImage(heroUrl)} style={{ padding: '14px' }}>
      <Link
        className="h-100 d-flex flex-column text-decoration-none"
        href={`/detail/${id}/${slugify(work_title)}`}
        onMouseEnter={() => router.prefetch(`/detail/${id}/${slugify(work_title)}`)}
      >
        <div className='project-day-card-image mb-3 position-relative' style={{ height: "250px" }}>
          <Image
            src={getSafeImageUrl(photo_url)}
            width={800}
            height={600}
            alt={work_title || "project"}
            className="w-100 img-fluid"
            priority={priority}
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block"
            }}
            onError={(e) => handleImageError(e)}
          />

          <div className='action-buttons-wrapper position-absolute bottom-0 end-0 d-inline-flex flex-column gap-1 pe-2 pb-2'>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLike();
              }}
              className='border-0 bg-transparent p-0 shadow-none d-in'
            >
              {isFavorited ? <Icons.Dislike /> : <Icons.Like />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handledownload(id, isAuthenticated, router);
              }}
              className='border-0 bg-transparent p-0 shadow-none'
            >
              <img src={save.src} className='border-0' alt='icon' loading="lazy" />
            </button>
          </div>
        </div>

        <div className='project-day-card-description d-flex justify-content-between'>
          <p className='ps-3 work-title'>{work_title}</p>
          <div>
            <span className='badge bg-secondary text-white'>{file_type}</span>
          </div>
        </div>

        <div className='project-day-card-link mt-auto'>
          <p className='pe-2'>MORE DETAILS</p>

          <div className='text-end mt-3'>
            {type === "Gold" ? (
              <span style={{
                fontWeight: '500',
                fontSize: '14px',
                color: '#ffffff',
                backgroundColor: '#AB8000',
                padding: '6px 12px',
                textTransform: 'uppercase',
                border: '0',
                display: 'inline-block',
                borderRadius: '5px 5px 0px 0px',
              }}>
                Gold
              </span>
            ) : (
              <span style={{
                border: '0',
                padding: '6px 13px',
                textTransform: 'uppercase',
                fontWeight: '500',
                fontSize: '14px',
                color: '#ffffff',
                backgroundColor: '#008000',
                borderRadius: '5px 5px 0px 0px',
                display: 'inline-block',
              }}>
                Free
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
export default React.memo(ProjectCard);