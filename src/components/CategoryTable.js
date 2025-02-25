import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCategoriesApi } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import { CheckCircle, XCircle, Edit, ChevronUp, ChevronDown } from "lucide-react";
import { toggleCategoryStatusApi } from "@/service/api";
import { toast } from "react-toastify";

const CategoryTable = ({ status, title }) => {
  const { token } = useSelector((store) => store.logininfo);
  const [categories, setCategories] = useState([]);
  const [parentCategoryMap, setParentCategoryMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState("id"); // Default: Sort by ID
  const [sortOrder, setSortOrder] = useState("desc"); // Default: Newest First
  const router = useRouter();

  const handleToggleStatus = (id) => {
    toggleCategoryStatusApi(id, token)
      .then((res) => {
        toast.success("Category status updated!");
        fetchCategories(); // ✅ Refresh categories after update
      })
      .catch(() => {
        toast.error("Failed to update category status.");
      });
  };

  useEffect(() => {
    if (token) fetchCategories();
  }, [status, token, searchTerm, currentPage, entriesPerPage, sortColumn, sortOrder]);

  const fetchCategories = () => {
    getCategoriesApi(status, currentPage, entriesPerPage, searchTerm, sortColumn, sortOrder)
      .then((res) => {
        const categoryList = res.data.categories;

        // ✅ Create Parent Category Mapping (ID → Name)
        const parentMap = {};
        categoryList.forEach(cat => {
          parentMap[cat.id] = cat.name;
        });

        setCategories(categoryList);
        setParentCategoryMap(parentMap);
        setTotalPages(res.data.totalPages); // ✅ FIXED: Now updates based on filtered data
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
                  <td>{category.parent_id === 0 ? "None" : parentCategoryMap[category.parent_id] || "Unknown"}</td>
                  <td className="wrap-text">{category.description}</td>
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
        <PaginationAdmin
          currentPage={currentPage}
          totalPages={totalPages}
          goToPreviousPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
          goToNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          dispatchCurrentPage={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default CategoryTable;
