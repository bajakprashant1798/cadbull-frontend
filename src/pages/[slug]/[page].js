import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import CategoriesLayout, { makeTitle } from "@/layouts/CategoriesLayouts";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/router";
import { getFavouriteItems, getSubCategories, getallCategories } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubCategory,
  resetsubcatfilter,
  setFavouriteList,
  updatesubcatpage,
  updatesubcatpagetype,
  updatesubcatserachTerm,
  updatesubcatslug,
  updatesubcatsortTerm,
} from "../../../redux/app/features/projectsSlice";
import { drawings } from "@/pages";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import { debounce } from "lodash";

const CadLandscaping = ({ initialProjects, initialTotalPages, initialSlug, page: initialPage }) => {
  const router = useRouter();
  const { slug: querySlug, page: queryPage } = router.query;

  // Prefer SSR/SSG props, fallback to router for client-side transitions
  const slug = initialSlug || querySlug;
  const currentPage = parseInt(initialPage || queryPage || 1, 10);

  const dispatch = useDispatch();
  const [isLoading, startLoading, stopLoading] = useLoading();

  // Use Redux to store subcategory projects and filters.
  const subcat = useSelector((store) => store.projectinfo.subcat);
  const subcatfilter = useSelector((store) => store.projectinfo.subcatfilter);
  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);

  // Local state for search input
  const [searchText, setSearchText] = useState("");
  const [searchedText, setSearchedText] = useState("");

  // Pagination (total pages)
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const [favouritesFetched, setFavouritesFetched] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [pageChanged, setPageChanged] = useState(false);

  // Fetch main categories on mount
  useEffect(() => {
    getallCategories("")
      .then((res) => {
        if (res.data.categories) {
          setMainCategories(res.data.categories);
        }
      })
      .catch((err) => {
        console.error("Error fetching main categories:", err);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated && !favouritesFetched) {
      getFavouriteItems()
        .then((favRes) => {
          dispatch(setFavouriteList(favRes.data.favorites || []));
          setFavouritesFetched(true);
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          setFavouritesFetched(true);
        });
    }
  }, [isAuthenticated, favouritesFetched, dispatch]);

  // Update Redux with the new slug and reset pagination
  useEffect(() => {
    if (slug) {
      dispatch(updatesubcatslug(slug));
      dispatch(updatesubcatpage(currentPage));
    }
  }, [slug, currentPage, dispatch]);

  // Debounce search input so API calls are not made on every keystroke
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchedText(value);
      dispatch(updatesubcatpage(1));
      dispatch(updatesubcatserachTerm(value));
    }, 500),
    [dispatch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.length >= 3) {
      setSearchedText(searchText);
      dispatch(updatesubcatpage(1));
      dispatch(updatesubcatserachTerm(searchText));
    }
  };

  // Load projects dynamically based on current filters and search query
  const loadProjects = () => {
    startLoading();
    if (!subcatfilter.slug) {
      stopLoading();
      return;
    }
    const filterWithPageSize = { ...subcatfilter, pageSize: 9 };
    getSubCategories(filterWithPageSize)
      .then((response) => {
        dispatch(getSubCategory(response.projects));
        setTotalPages(response.totalPages);
        stopLoading();
      })
      .catch((error) => {
        stopLoading();
        console.error("Error fetching subcategories:", error);
      });
  };

  useEffect(() => {
    if (!slug) return;
    loadProjects();
  }, [subcatfilter, slug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetsubcatfilter());
    };
  }, [dispatch]);

  const CategoriesProps = searchedText.length
    ? {
        title: "Search Results",
        description: "Cadbull presents a variety of online drawings including DWG, Cad, AutoCAD, and 3D drawings.",
        mainCategories,
        subCategories: subcat,
        slug,
        type: "Sub Categories",
        pageName: "Search Results",
      }
    : {
        title: slug ? makeTitle(slug) : "Sub Categories",
        description: "Improving the aesthetic appearance of an area by changing its contours, adding ornamental features, or planting trees and shrubs.",
        mainCategories,
        subCategories: subcat,
        slug,
        type: "Sub Categories",
      };

  // No setCurrentPage; just navigate!
  const handlePageChange = (newPage) => {
    setPageChanged(true);
    if (newPage === 1) {
      router.push(`/${slug}`);
    } else {
      router.push(`/${slug}/${newPage}`);
    }
  };

  // Scroll to grid after page change
  const productGridRef = useRef();
  useEffect(() => {
    if (!pageChanged) return;
    let scrolled = false;
    function scrollToGrid() {
      if (productGridRef.current) {
        const cards = productGridRef.current.querySelectorAll('.col-md-6, .col-lg-4, .col-xl-4');
        if (cards.length > 0) {
          productGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          scrolled = true;
          setPageChanged(false);
        }
      }
    }
    scrollToGrid();
    if (!scrolled && productGridRef.current) {
      const observer = new MutationObserver(() => {
        scrollToGrid();
        if (scrolled && observer) observer.disconnect();
      });
      observer.observe(productGridRef.current, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [pageChanged, isLoading]);

  return (
    <Fragment>
      <Head>
        <title>{makeTitle(slug)} | Cadbull</title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <CategoriesLayout {...CategoriesProps}>
        {isLoading && <Loader />}
        <section>
          <div className="container" id="categories-top">
            {/* ...your header/search/filter/grid as before... */}
            {/* Projects Grid */}
            <div id="product-grid" ref={productGridRef} className="row g-4 justify-content-center">
              {isLoading ? null : subcat && subcat.length > 0 ? (
                subcat.map((project) => (
                  <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                    <ProjectCard {...project} favorites={favouriteList} />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>Record not found</p>
                </div>
              )}
            </div>
            {/* Pagination */}
            <div className="row mt-4 justify-content-center mt-md-5">
              <div className="col-md-6 col-lg-5 col-xl-4">
                <div className="text-center">
                  <Pagination
                    slug={slug}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </CategoriesLayout>
    </Fragment>
  );
};

export async function getStaticPaths() {
  const catRes = await getallCategories("");
  const categories = catRes?.data?.categories || [];
  const paths = [];
  categories.forEach(cat => {
    paths.push({ params: { slug: cat.slug, page: "1" }});
    paths.push({ params: { slug: cat.slug, page: "2" }});
  });
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const page = parseInt(params.page, 10) || 1;
  const data = await getSubCategories({ slug, currentPage: page, pageSize: 9 });
  if (!data || !data.projects) {
    return { notFound: true };
  }
  return {
    props: {
      initialProjects: data.projects,
      initialTotalPages: data.totalPages || 1,
      initialSlug: slug,
      page,
    },
    revalidate: 300,
  };
}

CadLandscaping.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default CadLandscaping;
