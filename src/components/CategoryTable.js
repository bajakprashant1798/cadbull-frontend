import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { getCategoriesApi } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import { CheckCircle, XCircle, Edit, ChevronUp, ChevronDown } from "lucide-react";
import { toggleCategoryStatusApi } from "@/service/api";
import { toast } from "react-toastify";

const CategoryTable = ({ status, title }) => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const [modalCategory, setModalCategory] = useState(null); // State for modal
  
  const [categories, setCategories] = useState([]);
  // const [parentCategoryMap, setParentCategoryMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState("id"); // Default: Sort by ID
  const [sortOrder, setSortOrder] = useState("desc"); // Default: Newest First
  const router = useRouter();

  const handleToggleStatus = (id) => {
    toggleCategoryStatusApi(id)
      .then((res) => {
        toast.success("Category status updated!");
        fetchCategories(); // ✅ Refresh categories after update
      })
      .catch(() => {
        toast.error("Failed to update category status.");
      });
  };

  useEffect(() => {
    if (isAuthenticated) fetchCategories();
  }, [status, isAuthenticated, searchTerm, currentPage, entriesPerPage, sortColumn, sortOrder]);

  const fetchCategories = () => {
    getCategoriesApi(status, currentPage, entriesPerPage, searchTerm, sortColumn, sortOrder)
      .then((res) => {

        // ✅ SIMPLIFIED: No more manual mapping needed.
        setCategories(res.data.categories);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => console.error("Error fetching categories"));
  };

  // ✅ Sorting Logic (Triggers API Call)
  const handleSort = (column) => {
    const newSortOrder = sortColumn === column ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  // ✅ Handle Entries Per Page Change (Triggers API Call)
  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  return (
    <section className="py-lg-5 py-4 profile-page">
      <div className="container">
        <h2 className="mb-4">{title}</h2>

        {/* Search & Show Entries */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="form-control w-25" value={entriesPerPage} onChange={handleEntriesPerPageChange}>
            <option value="10">10 entries</option>
            <option value="20">20 entries</option>
            <option value="50">50 entries</option>
          </select>
        </div>

        {/* Category Table */}
        <div className="table-responsive">
          <table className="table table-striped table-hover category-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                  Name {sortColumn === "name" ? (sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : ""}
                </th>
                <th onClick={() => handleSort("parent_id")} style={{ cursor: "pointer" }}>
                  Parent Category {sortColumn === "parent_id" ? (sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : ""}
                </th>
                <th onClick={() => handleSort("description")} style={{ cursor: "pointer" }}>
                  Description {sortColumn === "description" ? (sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : ""}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="wrap-text">{category.name}</td>
                  {/* ✅ SIMPLIFIED: Directly display the parent name from the API */}
                  <td className="wrap-text">{category.parent_category_name}</td>
                  <td
                    className="description-cell"
                    title="Click to read more"
                    onClick={() => setModalCategory(category)}
                  >
                    <div className="description-cell-content">{category.description}</div>
                  </td>
                  <td>
                    <button onClick={() => handleToggleStatus(category.id)} className="border-0 bg-transparent">
                      {category.status === 1 ? (
                        <CheckCircle className="text-success me-2" size={18} />
                      ) : (
                        <XCircle className="text-danger me-2" size={18} />
                      )}
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => router.push(`/admin/categories/edit-category?id=${category.id}`)}
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* <PaginationAdmin
          currentPage={currentPage}
          totalPages={totalPages}
          goToPreviousPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
          goToNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          dispatchCurrentPage={setCurrentPage}
        /> */}

        <PaginationAdmin
          currentPage={currentPage}
          totalPages={totalPages}
          goToFirstPage={() => setCurrentPage(1)}
          goToLastPage={() => setCurrentPage(totalPages)}
          goToPreviousPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
          goToNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          dispatchCurrentPage={setCurrentPage}
        />

        {/* Modal for full description */}
        {modalCategory && (
          <div className="description-modal-overlay" onClick={() => setModalCategory(null)}>
            <div className="description-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="description-modal-header">
                <h5 className="mb-0">{modalCategory.name} - Description</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalCategory(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="description-modal-body">
                <p>{modalCategory.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryTable;
