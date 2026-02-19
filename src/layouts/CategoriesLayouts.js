import { Fragment } from "react";
import SearchCategories from "@/components/SearchCategories";
// import FAQSection from "@/components/FAQSection";
import { useRouter } from "next/router";
import Link from "next/link";
import AdSense from "@/components/AdSense";
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
  parent_slug,    // Parent slug (if any)
  currentPath,    // Current full path (e.g. "residential/bungalows")
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
                <h1 className="text-primary fw-bold mb-1">
                  {makeTitle(title)}
                  {/* {title ? makeTitle(title) : pageName  } */}
                </h1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: description || ""
                  }}
                />
              </div>
              {/* Breadcrum  */}
              <div className="mt-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-center justify-content-md-start">
                    {router.asPath === '/Architecture-House-Plan-CAD-Drawings' || router.asPath.startsWith('/Architecture-House-Plan-CAD-Drawings/') ? <>
                      <li className="breadcrumb-item">
                        <Link href="/">Home</Link>
                      </li>
                      <li className="breadcrumb-item"><Link href="/Architecture-House-Plan-CAD-Drawings">House Plan</Link></li>
                    </> : <>
                      <li className="breadcrumb-item">
                        <Link href="/">Home</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/categories">Categories</Link>
                      </li></>}
                    {router.asPath !== "/categories" && router.asPath !== "/Architecture-House-Plan-CAD-Drawings" && !router.asPath.startsWith('/Architecture-House-Plan-CAD-Drawings/') && (
                      <li className="breadcrumb-item">{makeTitle(title)}</li>
                    )}
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdSense slot="7946730558" format="fluid" layout="in-article" className="ad-slot" lazy={false} />

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
                    {/* 
                        Fix for recursive URLs: 
                        If parent_slug is provided (from [...slug].js), use it as the base.
                        Otherwise, fallback to stripping the last segment.
                    */}
                    {(() => {
                      let basePath = currentPath;
                      if (parent_slug) {
                        basePath = parent_slug;
                      } else if (currentPath.includes('/')) {
                        basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                      }

                      console.log(`[CategoriesLayout] slug=${slug}, parent_slug=${parent_slug}, currentPath=${currentPath}, calculatedBasePath=${basePath}`);
                      return (
                        <SearchCategories
                          categories={subCategories}
                          type="Sub Categories"
                          slug={slug}
                          currentPath={basePath}
                        // url="categories/sub/"
                        />
                      );
                    })()}
                  </div>
                  <div className="mb-4 d-none d-xl-block">
                    <SearchCategories
                      categories={mainCategories}
                      type="Categories"
                      slug={null} // Main categories don't rely on current slug
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
              <div className="d-none d-md-none d-lg-block">
                <AdSense slot="9615035443" format="fluid" layout="in-article" />
              </div>
            </div>
            {/* Right Column */}
            <div className="col-xl-9">{children}</div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      {/* <FAQSection title="Frequently Asked Questions" showLimit={8} /> */}

      {/* Get Off  */}
      {/* <GetOff /> */}
    </Fragment>
  );
};

export default CategoriesLayout;
