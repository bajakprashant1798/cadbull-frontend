import GetOff from "@/components/GetOff";
import { Fragment } from "react";
import SearchCategories from "@/components/SearchCategories";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
export const makeTitle = (slug) => {
  return slug
    ? slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";
};

const CategoriesLayout = ({
  children,
  title,
  description,
  mainCategories, // Array of main categories
  subCategories,  // Array of subcategories
  slug,           // Current slug (if any)
  type,
  pageName = "Categories",
}) => {
  const router = useRouter();

  return (
    <Fragment>
      <section className="bg-light py-md-5 py-4 category-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-md-12">
              <div className="text-center text-md-start">
                <h2 className="text-primary fw-bold mb-1">
                  {/* {makeTitle(title)} */}
                  {title ? makeTitle(title) : pageName  }
                </h2>
                <p>{description}</p>
              </div>
              {/* Breadcrum  */}
              <div className="mt-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center justify-content-md-start">
                     {router.asPath ==='/house-plan'?  <>
                    <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                     <li className="breadcrumb-item"><Link href="/house-plan">House Plan</Link></li>
                     </>:<>
                     <li className="breadcrumb-item">
                      <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link href="/categories">Categories</Link>
                    </li></>}
                    {router.asPath !== "/categories"  && (
                      <li className="breadcrumb-item">{makeTitle(title)}</li>
                    )}
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories  */}
      {/* <section className="py-lg-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-xl-3">
              <SearchCategories
                categories={categories}
                type={type}
                url="categories/sub/"
              />
            </div>
            <div className="col-xl-9">{children}</div>
          </div>
        </div>
      </section> */}

      {/* Main Section with Left Sidebar */}
      <section className="py-lg-5 py-4">
        <div className="container">
          <div className="row">
            {/* Left Sidebar */}
            <div className="col-xl-3">
              {slug ? (
                // If slug exists, show Subcategories first then Main Categories
                <>
                  <div className="mb-4">
                    <SearchCategories
                      categories={subCategories}
                      type="Sub Categories"
                      // url="categories/sub/"
                    />
                  </div>
                  <div className="mb-4">
                    <SearchCategories
                      categories={mainCategories}
                      type="Categories"
                      // url="categories/"
                    />
                  </div>
                </>
              ) : (
                // Otherwise, show only main categories
                <div className="mb-4">
                  <SearchCategories
                    categories={mainCategories}
                    type="Categories"
                    url="categories/"
                  />
                </div>
              )}
            </div>
            {/* Right Column */}
            <div className="col-xl-9">{children}</div>
          </div>
        </div>
      </section>

      {/* Get Off  */}
      {/* <GetOff /> */}
    </Fragment>
  );
};
 
export default CategoriesLayout;
