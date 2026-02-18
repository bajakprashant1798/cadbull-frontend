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
import { useEffectTimer } from "@/utils/apiTiming";

const SearchCategories = ({ categories, type, slug: propSlug, currentPath }) => {
  const router = useRouter();
  const { subCategoriesList, categoriesList } = useSelector(
    (store) => store.projectinfo
  );
  const dispatch = useDispatch();

  // Use propSlug if available, otherwise try to extract from router (handling array case)
  const querySlug = router.query.slug;
  const effectiveSlug = propSlug || (Array.isArray(querySlug) ? querySlug[querySlug.length - 1] : querySlug);

  // Debug log for sidebar issue
  useEffect(() => {
    if (type === "Sub Categories") {
      console.log(`[SearchCategories] Debug: type=${type}, propSlug=${propSlug}, querySlug=${JSON.stringify(querySlug)}, effectiveSlug=${effectiveSlug}`);
    }
  }, [type, propSlug, querySlug, effectiveSlug]);

  // Initialize catalog safely
  const [catalog, setCatalog] = useState(Array.isArray(categories) ? categories : []);
  const [searchTerm, setSearchTerm] = useState("");
  const [previousCategories, setPreviousCategories] = useState([]);

  // Sync catalog when props change - only if valid array provided
  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      setCatalog(categories);
    }
  }, [categories]);

  async function fetchCategories() {
    const timer = useEffectTimer("SearchCategories-fetchCategories", [type, effectiveSlug, searchTerm]);

    if (type === "Categories") {
      try {
        timer.mark('categories-fetch-start');
        const response = await getallCategories(searchTerm);
        timer.mark('categories-response-received');

        response.data.categories.forEach((item) => {
          item.link = item.slug;
          item.url = "categories/sub/";
        });

        setCatalog(response.data.categories);
        dispatch(addAllCategoriesData(response.data.categories));

        timer.complete(true, { categoriesCount: response.data.categories.length });
      } catch (error) {
        timer.error(error);
      }
    }
    if (type === "Sub Categories" && effectiveSlug) {
      try {
        timer.mark('subcategories-fetch-start');
        // Use effectiveSlug (string) explicitly
        const response = await getallsubCategories(searchTerm, effectiveSlug);
        timer.mark('subcategories-response-received');

        const fetchedSubCategories = response.data.subCategories || [];

        if (fetchedSubCategories.length > 0) {
          setPreviousCategories(fetchedSubCategories);
          setCatalog(fetchedSubCategories);
        } else if (previousCategories.length > 0) {
          setCatalog(previousCategories);
        } else {
          setCatalog([]);
        }

        dispatch(addAllSubCategoriesData(fetchedSubCategories));
        timer.complete(true, { subCategoriesCount: fetchedSubCategories.length, slug: effectiveSlug });
      } catch (error) {
        timer.error(error);
      }
    }
  }

  let timers;
  useEffect(() => {
    const effectTimer = useEffectTimer("SearchCategories-useEffect", [searchTerm]);

    timers = setTimeout(() => {
      effectTimer.mark('timeout-triggered');
      fetchCategories().then(() => {
        effectTimer.complete(true);
      }).catch((error) => {
        effectTimer.error(error);
      });
    }, 500);
    return () => {
      clearTimeout(timers);
    };
  }, [searchTerm, effectiveSlug]); // Depend on effectiveSlug

  const handleSearch = (e) => {
    if (e.target.value.trim().length >= 2) {
      setSearchTerm(e.target.value.trim());
    } else {
      setSearchTerm("");
    }
  };

  return (
    <Fragment>
      <div className="d-xl-none d-block">
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
            {catalog.length > 0 ? (
              catalog.map((category, index) => (
                <CategoriesList
                  key={index}
                  {...category}
                  link={
                    type === "Sub Categories"
                      ? (currentPath ? `${currentPath}/${category.slug}` : `${effectiveSlug}/${category.slug}`)
                      : category.slug
                  }
                />
              ))
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
