import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import { Fragment, useEffect, useState, useCallback } from "react";
import CategoriesLayout from "@/layouts/CategoriesLayouts";
import Icons from "@/components/Icons";
import ProjectCard from "@/components/ProjectCard";
import Pagination from "@/components/Pagination";
import { useSelector, useDispatch } from "react-redux";
import { getSearchResults } from "@/service/api";
import { debounce } from "lodash";
// If you need to update Redux when a user types on the search page, you can import the action:
// import { getserachTerm } from "../../redux/app/features/projectsSlice";

const SearchCategories = () => {
  // Get the search term from Redux (stored in homepagestore.searchTrem)
  const reduxSearchTerm = useSelector(
    (store) => store.projectinfo.homepagestore.searchTrem
  );
  const dispatch = useDispatch();

  // Local state for the search term and other filters
  const [searchTerm, setSearchTerm] = useState(reduxSearchTerm || "");
  const [projects, setProjects] = useState([]); 
  const [totalResults, setTotalResults] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fileType, setFileType] = useState("");
  const [projectType, setProjectType] = useState("");

  // Sync the local search term state with Redux value (if it changes)
  useEffect(() => {
    setSearchTerm(reduxSearchTerm);
  }, [reduxSearchTerm]);

  // Fetch results every time dependencies change. Passing an empty search term should return all products.
  useEffect(() => {
    fetchSearchResults(searchTerm, currentPage);
  }, [searchTerm, currentPage, fileType, projectType]);

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

  // If you want to debounce input changes on the search page itself, you can use this debounced function.
  // Optionally, you could dispatch an update to Redux here.
  const debouncedSearch = useCallback(
    debounce((value) => {
      // For example, you could update Redux with:
      // dispatch(getserachTerm(value));
      // and then fetch new results:
      // fetchSearchResults(value, 1);
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Form submission triggers an immediate search.
  // Optionally, you might also update Redux here if you want to persist the latest search term.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults(searchTerm, currentPage);
    // Optionally update Redux if needed:
    // dispatch(getserachTerm(searchTerm));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Fragment>
      <Head>
        <title>Categories555 | Cadbull</title>
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
                        {searchTerm || "All Products"}
                      </span>{" "}
                      <small className="text-grey fs-12">
                        ({totalResults} RESULTS)
                      </small>
                    </h5>
                  </div>
                  <div className="w-100">
                    <div className="d-flex gap-3 justify-content-end flex-column flex-md-row">
                      {/* Search form */}
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
                            value={searchTerm}
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

            {/* Projects grid */}
            <div className="row g-4 justify-content-center">
              {projects.map((project) => (
                <div className="col-md-6 col-lg-4 col-xl-4" key={project.id}>
                  <ProjectCard {...project} />
                </div>
              ))}
            </div>

            {/* Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPreviousPage={() => handlePageChange(currentPage - 1)}
              goToNextPage={() => handlePageChange(currentPage + 1)}
              dispatchCurrentPage={handlePageChange}
            />
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


// const projects = [
//   {
//     id: 1,
//     image: drawing1,
//     title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
//     type: "DWG",
//     views: 369,
//     url: '/categories/view/1'
//   },
//   {
//     id: 2,
//     image: drawing1,
//     title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
//     type: "DWG",
//     views: 369,
//     url: '/categories/view/1'
//   },
//   {
//     id: 3,
//     image: drawing1,
//     title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
//     type: "DWG",
//     views: 369,
//     url: '/categories/view/1'
//   },
//   {
//     id: 4,
//     image: drawing1,
//     title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
//     type: "DWG",
//     views: 369,
//     url: '/categories/view/1'
//   },
//   {
//     id: 5,
//     image: drawing1,
//     title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
//     type: "DWG",
//     views: 369,
//     url: '/categories/view/1'
//   },
//   {
//     id: 6,
//     image: drawing1,
//     title: "Ground Floor Bathroom Details And Dimension Autocad Fil",
//     type: "DWG",
//     views: 369,
//     url: '/categories/view/1'
//   }
// ]


// const categories = [
//   {
//     title: '3d Drawing',
//     icon: icon,
//     counts: '20,000+',
//     url: '/categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'CAD Architecture',
//     icon: icon,
//     counts: '73,145+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'CAD Landscape',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: true
//   },
//   {
//     title: 'CAD Mechinery',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Detail',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'DWG Blocks',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Electrical CAD',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Furnitures',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Interior Design',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Projects',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Structure Detail',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Urban Design',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Construction CAD',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   },
//   {
//     title: 'Advance Tech',
//     icon: icon,
//     counts: '20,000+',
//     url: 'categories/sub/cad-landscaping',
//     active: false
//   }

// ]
