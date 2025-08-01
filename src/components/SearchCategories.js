import React, { Fragment, useEffect, useState } from "react";
import Icons from "./Icons";
import CategoriesList from "./CategoriesList";
import { useRouter } from "next/router";
import SortByDrawer from "./drawer/SortByDrawer";
import CategoriesDrawer from "./drawer/CategoriesDrawer";
import { getallCategories, getallsubCategories } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllCategoriesData,
  addAllSubCategoriesData,
} from "../../redux/app/features/projectsSlice";
import SubCategoriesDrawer from "./drawer/SubCategoriesDrawer";
import { openDrawerHandler } from "../../redux/app/features/drawerSlice";

const SearchCategories = ({ categories, type }) => {
  const router = useRouter();
  const { subCategoriesList, categoriesList } = useSelector(
    (store) => store.projectinfo
  );
  const dispatch = useDispatch();
  const { slug } = router.query;
  // console.log("slug: ", slug);
  
  const [catalog, setCatalog] = useState([categories]);
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   console.log("Full URL Path:", router.asPath);
  //   console.log("Router Query:", router.query);
  //   console.log("Extracted Slug:", slug);
  // }, [router]);
  

  async function fetchCategories() {
    if (type === "Categories") {
      try {
        const response = await getallCategories(searchTerm);
        response.data.categories.forEach((item) => {
          item.url = "categories/sub/";
        });
        // console.log("searchcategoreis: ", response.data);
        
        setCatalog(response.data.categories);
        dispatch(addAllCategoriesData(response.data.categories));
      } catch (error) {
        // console.error("Error fetching categories:", error);
      }
    }
    if (type === "Sub Categories" && slug) {
      try {
        const response = await getallsubCategories(searchTerm, slug);

        setCatalog(response.data.subCategories);
        dispatch(addAllSubCategoriesData(response.data?.subCategories));
        // console.log("subcategoriedta", response.data);
      } catch (error) {
        // console.error("Error fetching categories:", error);
      }
    }
  }
  let timers;
  useEffect(() => {
    timers = setTimeout(() => {
      fetchCategories();
    }, 500);
    return () => {
      clearTimeout(timers);
    };
  }, [searchTerm, slug]);

  const handleSearch = (e) => {
    if (e.target.value.trim().length >= 2) {
      setSearchTerm(e.target.value.trim());
    } else {
      setSearchTerm("");
    }
  };

  return (
    <Fragment>
      <div className="d-xl-none">
        <ul className="list-unstyled gap-md-3 justify-content-center d-flex gap-2 gap-md-2 align-items-center justify-content-md-center">
          <li>
            <button
              type="button"
              // data-bs-toggle="offcanvas"
              // data-bs-target="#staticBackdrop"
              onClick={(e) => {
                dispatch(openDrawerHandler({ drawerType: "sortBy" }));
              }}
              aria-controls="staticBackdrop"
              className="link-btn d-inline-flex align-items-center"
            >
              <Icons.Sort />
              <span className="ms-1 fw-bold text-primary">Sort by</span>
            </button>
          </li>
          <li className="text-grey">|</li>
          <li>
            <button
              type="button"
              // data-bs-toggle="offcanvas"
              // data-bs-target="#staticBackdrop1"
              onClick={(e) => {
                dispatch(openDrawerHandler({ drawerType: "category" }));
              }}
              // aria-controls="staticBackdrop"
              className="link-btn d-inline-flex align-items-center"
            >
              <Icons.Categories />
              <span className="ms-1 fw-bold text-primary">Category</span>
            </button>
          </li>

          {subCategoriesList.length > 0 && (
            <>
              <li className="text-grey">|</li>
              <li>
                <Icons.Categories />
                <button
                  type="button"
                  // data-bs-toggle="offcanvas"
                  // data-bs-target="#staticBackdrop2"
                  onClick={(e) => {
                    dispatch(openDrawerHandler({ drawerType: "subcategory" }));
                  }}
                  aria-controls="staticBackdrop"
                  className="link-btn d-inline-flex align-items-center"
                >
                  <span className="ms-1 fw-bold text-primary">Subcategory</span>
                </button>
              </li>
            </>
          )}
        </ul>
        <hr />
        <SortByDrawer />
        <CategoriesDrawer />
        <SubCategoriesDrawer />
      </div>
      <aside className="d-none d-xl-block">
        <h5 className="bg-secondary text-white px-3 py-2">{type}</h5>
        <div className="p-3">
          <form className="mx-auto mb-3 mb-md-4">
            <div className="input-group mb-3">
              <span className="input-group-text bg-white">
                <Icons.Search />
              </span>
              <input
                onChange={handleSearch}
                type="text"
                className="form-control  border-start-0 ps-0"
                placeholder="Search categories"
                aria-label="Search categories"
              />
            </div>
          </form>
          <ul className="list-unstyled category-list-wrapper mb-0 d-flex flex-column gap-2">
            {/* {catalog.map((category, index) => {
              return <CategoriesList key={index} {...category} />;
            })} */}
            {catalog.length > 0 ? (
              catalog.map((category, index) => <CategoriesList key={index} {...category} />)
              ) : (
                <li className="text-center text-muted">No categories found</li>
            )}
          </ul>
          
          <div></div>
        </div>
      </aside>
    </Fragment>
  );
};

export default SearchCategories;
