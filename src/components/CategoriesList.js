import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updatesubcatpage,
  updatesubcatslug,
} from "../../redux/app/features/projectsSlice";
import { useRouter } from "next/router";
import { closeDrawerHandler } from "../../redux/app/features/drawerSlice";

function CategoriesList({
  // active,
  // url,
  // icon,
  // title,
  // counts,
  // projectsCount,
  // id,
  path,
  active, name, slug, pcount
}) {
  const dispatch = useDispatch();
  const router= useRouter();
// console.log("path: ", slug);

  return (
    <li
      className={`d-flex justify-content-between align-items-center gap-2 ${
        active ? "active" : ""
      }`}
    >
      {slug ? (
        <Link
        onClick={(e)=>{
          dispatch(closeDrawerHandler({drawerType:"category"}))
          router.push(`/categories/sub/${slug}`)
        }}
          href={`/categories/sub/${slug}`}
          className="d-inline-flex gap-1 align-items-center"
        >
          {/* <img src={icon.src} alt="icon" width={30} /> */}
          <span className="fw-normal">{name}</span>
        </Link>
      ) : (
        <div
          id="id"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            dispatch(updatesubcatslug(name));
            dispatch(updatesubcatpage(1));
            dispatch(closeDrawerHandler({drawerType:"subcategory"}))
          }}
          className="d-inline-flex gap-1 align-items-center  "
        >
          {/* <img src={icon.src} alt="icon" width={30} /> */}
          <span className="fw-normal">{name}</span>
        </div>
      )}
      <p>{pcount || 0}</p>
          
      
    </li>
  );
}

export default CategoriesList;



// {slug ? (
//   <Link
//   onClick={(e)=>{
//     dispatch(closeDrawerHandler({drawerType:"category"}))
//     router.push(`/categories/sub/${path}`)
//   }}
//     href={`/categories/sub/${path}`}
//     className="d-inline-flex gap-1 align-items-center"
//   >
//     {/* <img src={icon.src} alt="icon" width={30} /> */}
//     <span className="fw-normal">{name}</span>
//   </Link>
// ) : (
//   <div
//     id="id"
//     style={{ cursor: "pointer" }}
//     onClick={(e) => {
//       dispatch(updatesubcatslug(name));
//       dispatch(updatesubcatpage(1));
//       dispatch(closeDrawerHandler({drawerType:"subcategory"}))
//     }}
//     className="d-inline-flex gap-1 align-items-center  "
//   >
//     {/* <img src={icon.src} alt="icon" width={30} /> */}
//     <span className="fw-normal">{name}</span>
//   </div>
// )}
// <p>{pcount || 0}</p>

{/* <Link
        href={`/categories/sub/${path}`} // Category URL
        className="d-inline-flex gap-1 align-items-center"
        onClick={(e) => dispatch(closeDrawerHandler({ drawerType: "category" }))}
      >
        <span className="fw-normal">{name}</span>
      </Link>
      <p>{pcount || 0}</p>  */}
