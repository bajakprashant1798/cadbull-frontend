import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useEffect, useState, useCallback } from "react";
import CategoriesLayout from "@/layouts/CategoriesLayouts";
import Icons from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import Pagination from "@/components/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { getSearchResults, getFavouriteItems } from "@/service/api";
import { debounce } from "lodash";
import { setFavouriteList } from "../../../redux/app/features/projectsSlice";

const SearchCategories = () => {
  // Get the search term from Redux (if needed)
  const reduxSearchTerm = useSelector(
    (store) => store.projectinfo.homepagestore.searchTrem
  );
  const favouriteList = useSelector((state) => state.projectinfo.favouriteList);
  const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const dispatch = useDispatch();

  // Two separate states: one for the raw input and one for the debounced query.
  const [searchInput, setSearchInput] = useState(reduxSearchTerm || "");
  const [searchQuery, setSearchQuery] = useState(reduxSearchTerm || "");

  const [projects, setProjects] = useState([]); 
  const [totalResults, setTotalResults] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fileType, setFileType] = useState("");
  const [projectType, setProjectType] = useState("");

  // Fetch favorites if not already fetched
  const [favouritesFetched, setFavouritesFetched] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !favouritesFetched) {
      getFavouriteItems()
        .then((favRes) => {
          dispatch(setFavouriteList(favRes.data.favorites || []));
          setFavouritesFetched(true); // Mark as fetched so we don't re-fetch
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          // Optionally mark as fetched to avoid repeated attempts
          setFavouritesFetched(true);
        });
    }
  }, [isAuthenticated, favouritesFetched, dispatch]);


  // Update local input state on every keystroke.
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedUpdateQuery(value);
  };

  // Debounce the update of the search query.
  const debouncedUpdateQuery = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Fetch search results whenever the debounced search query or filters change.
  useEffect(() => {
    const fetchSearchResults = async (query, page) => {
      try {
        const response = await getSearchResults(query, page, 12, fileType, projectType);
        setProjects(response.data.projects);
        setTotalResults(response.data.totalResults);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults(searchQuery, currentPage);
  }, [searchQuery, currentPage, fileType, projectType]);

  // Form submission (if needed for an immediate search)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here, searchQuery is already updated via debounce.
    // If needed, you could also call fetchSearchResults immediately.
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Fragment>
      <Head>
        <title>Search Results | Cadbull</title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <CategoriesLayout 
        title="Search Results" 
        description="Cadbull presents a variety of online drawings including DWG, Cad, AutoCAD, and 3D drawings. Find exactly what you need." 
        type="Categories" 
        pageName="Search Results"
      >
        <section>
          <div className="container">
            <div className="row mb-4 mb-md-5">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-3">
                  <div>
                    <h5>
                      Showing results for:{" "}
                      <span className="text-primary">
                        {searchQuery || "All Projects"}
                      </span>{" "}
                      <small className="text-grey fs-12">
                        ({totalResults} RESULTS)
                      </small>
                    </h5>
                  </div>
                  <div className="w-100">
                    <div className="d-flex gap-3 justify-content-end flex-column flex-md-row">
                      <form onSubmit={handleFormSubmit}>
                        <div className="input-group">
                          <span className="input-group-text bg-white">
                            <Icons.Search /> ({totalResults})
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 border-end-0 rounded-end-0 ps-0"
                            placeholder="For e.g. House Design"
                            aria-label="For e.g. House Design"
                            value={searchInput}
                            onChange={handleInputChange}
                          />
                          <button type="submit" className="btn btn-secondary rounded-start-0">
                            SEARCH
                          </button>
                        </div>
                      </form>
                      {/* File Type and Project Type Filters */}
                      <div className="d-none d-xl-flex gap-2">
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            Type:
                          </span>
                          <select 
                            value={projectType} 
                            onChange={(e) => setProjectType(e.target.value)}
                            className="form-select border-start-0 rounded-start-0"
                          >
                            <option value="">All</option>
                            <option value="Gold">Gold</option>
                            <option value="Free">Free</option>
                          </select>
                        </div>
                        <div className="d-flex">
                          <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                            File Type:
                          </span>
                          <select 
                            value={fileType} 
                            onChange={(e) => setFileType(e.target.value)}
                            className="form-select border-start-0 rounded-start-0"
                          >
                            <option value="">All</option>
                            <option value="DWG">DWG</option>
                            <option value="3d sketchup">3d sketchup</option>
                            <option value="3d max">3d max</option>
                            <option value="Revit">Revit</option>
                            <option value="PDF">PDF</option>
                            <option value="BIM">BIM</option>
                            <option value="DXF">DXF</option>
                            <option value="JPEG">JPEG</option>
                            <option value="Photoshop">Photoshop</option>
                            <option value="App">App</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="row g-4 justify-content-center">
              {projects.map((project) => (
                <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                  <ProjectCard {...project} favorites={favouriteList} />
                </div>
              ))}
            </div>

            {/* Pagination Component */}
            <div className="row mt-4 justify-content-center mt-md-5">
              <div className="col-md-6 col-lg-5 col-xl-4">
                <div className="text-center">
                  {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPreviousPage={() => handlePageChange(currentPage - 1)}
                    goToNextPage={() => handlePageChange(currentPage + 1)}
                    dispatchCurrentPage={handlePageChange}
                  /> */}

                  <Pagination
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

SearchCategories.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default SearchCategories;
