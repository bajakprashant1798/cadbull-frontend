import { useState, useEffect } from "react";
import { Edit, Trash, ChevronUp, ChevronDown } from "lucide-react";
import Pagination from "@/components/Pagination";

const TableComponent = ({ fetchData, deleteHandler, editPath, columnName, showEdit = true, data = [], setData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // ✅ Fetch Data on Load & Changes
  useEffect(() => {
    fetchData(currentPage, entriesPerPage, searchTerm).then((res) => {
      if (res && res.data) {
        setData(res.data); // ✅ Update State from API
        setTotalPages(res.totalPages);
        setTotalEntries(res.totalEntries);
      }
    }).catch(error => {
      console.error("❌ Error fetching data:", error);
    });
  }, [currentPage, entriesPerPage, searchTerm]);

  // ✅ Handle Sorting
  const handleSort = (column) => {
    const newSortOrder = sortColumn === column ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sorted = [...data].sort((a, b) => {
      let valueA = a[column] || "";
      let valueB = b[column] || "";
      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();
      return valueA < valueB ? (newSortOrder === "asc" ? -1 : 1) : valueA > valueB ? (newSortOrder === "asc" ? 1 : -1) : 0;
    });

    setData(sorted); // ✅ Update State
  };

  // ✅ Handle Entries Per Page Change
  const handleEntriesPerPageChange = (e) => {
    const newEntriesPerPage = parseInt(e.target.value);
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
  };

  return (
    <section className="table-wrapper">
      {/* Search & Show Entries */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder={`Search ${columnName}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="form-control w-25" value={entriesPerPage} onChange={handleEntriesPerPageChange}>
          <option value="10">10 entries</option>
          <option value="20">20 entries</option>
          <option value="50">50 entries</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th onClick={() => handleSort(columnName)} style={{ cursor: "pointer" }}>
                {columnName} {sortColumn === columnName ? (sortOrder === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : ""}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item[columnName]}</td>
                  <td>
                    {showEdit && (
                      <button className="btn btn-primary btn-sm me-2" onClick={() => window.location.href = `${editPath}?id=${item.id}`}>
                        <Edit size={18} />
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        deleteHandler(item.id);
                        setData((prevData) => prevData.filter((word) => word.id !== item.id)); // ✅ Remove from table instantly
                      }}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={totalEntries}
        goToPreviousPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
        goToNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        dispatchCurrentPage={setCurrentPage}
      />
    </section>
  );
};

export default TableComponent;
