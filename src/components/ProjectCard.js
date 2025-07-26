import premium from "@/assets/icons/premium.png";
import free from '@/assets/icons/free2.png'
import save from "@/assets/icons/save.png";
import heart from "@/assets/icons/heart.png";
import heart_like from "@/assets/icons/heart_like.png";
import product from "@/assets/images/product.jpg"
import Icons from "./Icons";
import Link from "next/link";
import { addFavouriteItem, callViewProfileAPI, viewProfile, removeFavouriteItem, getFavouriteItems } from "@/service/api";
import { useSelector, useDispatch } from "react-redux";
import { addedFavouriteItem, deleteFavouriteItem } from "../../redux/app/features/projectsSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { handledownload } from "@/service/globalfunction";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const ProjectCard = ({  
  view_count, 
  work_title, 
  file_type,
  id,
  photo_url,
  type,
  favorites, // Optionally pass favorites list from parent
}) => {
  const router = useRouter();
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((state) => state.logininfo.isAuthenticated);
  const [isFavorited, setIsFavorited] = useState(false);

  // console.log("isAuthenticated for projectCard", isAuthenticated);
  
  // console.log(photo_url, "photo_url in projectCard");
  // console.log(type, "type in projectCard");
  
  const dispatch = useDispatch();

  // // Use a custom hook or parent prop for favorites if available.
  // // If not provided, fall back to fetching on mount.
  // useEffect(() => {
  //   if (!favorites && token) {
  //     checkFavoriteStatus();
  //   } else if (favorites) {
  //     setIsFavorited(favorites.some((fav) => fav.id === id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [favorites, id, token]);

  // const checkFavoriteStatus = useCallback(async () => {
  //   try {
  //     const response = await getFavouriteItems(token);
  //     const favoriteProjects = response.data.favorites;
  //     setIsFavorited(favoriteProjects.some((fav) => fav.id === id));
  //   } catch (error) {
  //     console.error("Error checking favorite status:", error);
  //   }
  // }, [id, token]);

  // const handleviewcount = (event) => {
  //   if (event.target.tagName == "IMG"){
  //     event.preventDefault();
  //     return ;
  //   }
  //   callViewProfileAPI(id).then((res)=>{
  //       console.log("view",res.data)
  //     }
  //     ).catch((err)=>{
  //       console.log(err)
  //     })
  // }

  // const handleLike = useCallback(async () => {
  //   if (!token) {
  //     router.push("/auth/login");
  //     return;
  //   }
  //   try {
  //     if (isFavorited) {
  //       await removeFavouriteItem(token, id);
  //       setIsFavorited(false);
  //       toast.success("Removed from Favorite list", { position: "top-right" });
  //     } else {
  //       await addFavouriteItem({ product_id: id }, token);
  //       setIsFavorited(true);
  //       toast.success("Added to Favorite list", { position: "top-right" });
  //     }
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //     toast.error("Failed to update favorite status");
  //   }
  // }, [token, id, isFavorited, router]);

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
    // callViewProfileAPI(id)
    //   .then((res) => console.log("view", res.data))
    //   .catch((err) => console.error(err));
  }, [id]);

  // const handleLike = useCallback(async () => {
  //   if (!token) {
  //     router.push("/auth/login");
  //     return;
  //   }
  //   try {
  //     if (isFavorited) {
  //       await removeFavouriteItem(token, id);
  //       setIsFavorited(false);
  //       toast.success("Removed from Favorite list", { position: "top-right" });
  //     } else {
  //       await addFavouriteItem({ product_id: id }, token);
  //       setIsFavorited(true);
  //       toast.success("Added to Favorite list", { position: "top-right" });
  //     }
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //     toast.error("Failed to update favorite status");
  //   }
  // }, [token, id, isFavorited, router]);
  
  const handleLike = useCallback(async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    try {
      if (isFavorited) {
        await removeFavouriteItem( id);
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


  function slugify(text) {
    if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
  }


  return (
    <div className='project-day-card h-100'>
      {/* <Link onClick={handleviewcount}  className="h-100" href={`/categories/view/${id}`}> */}
      <Link onClick={handleviewcount}  className="h-100" href={`/detail/${id}/${slugify(work_title)}`}>
        <div className='project-day-card-image mb-3 position-relative'>
          
              {/* <img src={photo_url || product.src} alt="project" className='w-100 img-fluid' onError={(e) => (e.target.src = product.src)} loading="lazy" /> */}
              <div style={{
                position: "relative",
                width: "100%",
                paddingTop: "64.18%", // (353/550)*100 for fallback
                aspectRatio: "550 / 353"
              }}>
                <Image
                  src={photo_url || product}
                  alt="project"
                  fill
                  className="img-fluid"
                  style={{ objectFit: "cover" }}
                  onError={(e) => (e.target.src = product)}
                  loading="lazy"
                  sizes="(max-width: 550px) 100vw, 550px"
                  priority={false}
                />
              </div>


          <div className='action-buttons-wrapper position-absolute bottom-0 end-0 d-inline-flex flex-column gap-1 pe-2 pb-2'>
            <button onClick={()=>handleLike()} className='border-0 bg-transparent p-0 shadow-none d-in'>
              {/* <img src={isFavorited ? heart_like.src : heart.src} className='border-0' alt="heart icon" /> */}
              {isFavorited ? <Icons.Dislike /> : <Icons.Like />}
            </button>
            <button onClick={()=>handledownload(id,isAuthenticated,router)} className='border-0 bg-transparent p-0 shadow-none'><img src={save.src} className='border-0' alt='icon' loading="lazy" /></button>
          </div>
        </div>
        <div className='project-day-card-description d-flex justify-content-between'>
          <p className='ps-3 work-title'>{work_title}</p>
          <div>
            <span className='badge bg-secondary text-white'>{file_type}</span>
            {/* <div className='d-flex gap-1 mt-2 align-items-center'>
              <span><Icons.Eye /></span>
              <span className="text-grey">{view_count}</span>
            </div> */}
          </div>
        </div>
        <div className='text-end mt-2'>
        {type === "Gold" ? (
        <span style={{
          fontWeight: '500',
          fontSize: '14px', // Set the font size to the desired size
          color: '#e59710',
          backgroundColor: '#fcebce',
          padding: '8px 15px', // Adjust padding for consistency
          textTransform: 'uppercase',
          border: '0',
          display: 'inline-block',
        }}>
          Gold
        </span>
      ) : (
        <button style={{
          border: '0',
          padding: '8px 15px', // Adjust padding for consistency
          textTransform: 'uppercase',
          fontWeight: '500',
          color: '#10a308',
          backgroundColor: '#cefcd0',
        }}>
          Free
        </button>
      )}

        </div>
        <div className='project-day-card-link'>
          <p className='pe-2'>MORE DETAILS</p>
        </div>
      </Link>
    </div>
  );
}
export default React.memo(ProjectCard);