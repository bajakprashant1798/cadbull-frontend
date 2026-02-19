import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
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
  active, name, slug, pcount,
  ...props
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  // console.log("path: ", slug);

  return (
    <li
      className={`category-item d-flex justify-content-between align-items-start gap-2 ${active ? "active" : ""
        }`}
    >
      {slug ? (
        <Link
          onClick={(e) => {
            const destination = props.link ? `/${props.link}` : `/${slug}`;

            // ✅ Fix: Robust check to prevent same-URL navigation
            // 1. Remove query params and hash from current path
            const currentPathClean = router.asPath.split('?')[0].split('#')[0];

            // 2. Normalize both paths (lowercase, remove trailing slash) for comparison
            const normalize = (p) => p.toLowerCase().replace(/\/$/, "");

            if (normalize(decodeURIComponent(currentPathClean)) === normalize(destination)) {
              e.preventDefault();
              return;
            }

            dispatch(closeDrawerHandler({ drawerType: "category" }))
          }}
          href={props.link ? `/${props.link}` : `/${slug}`}
          className="d-inline-flex gap-1 align-items-center"
        >
          {/* <img src={icon.src} alt="icon" width={30} /> */}
          <span className="fw-normal categories-name-font-size">{name}</span>
        </Link>
      ) : (
        <div
          id="id"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            dispatch(updatesubcatslug(name));
            dispatch(updatesubcatpage(1));
            dispatch(closeDrawerHandler({ drawerType: "subcategory" }))
          }}
          className="d-inline-flex gap-1 align-items-center  "
        >
          {/* <img src={icon.src} alt="icon" width={30} /> */}
          <span className="fw-normal ">{name}</span>
        </div>
      )}
      <p className="categories-pcount-font-size">{pcount || 0}</p>


    </li>
  );
}

export default CategoriesList;
