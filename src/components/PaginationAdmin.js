import Link from 'next/link';
import Icons from './Icons';
import { useDispatch } from 'react-redux';

const Pagination = ({
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  goToFirstPage,    // <--- Add these props in your parent
  goToLastPage,
  dispatchCurrentPage
}) => {
  const dispatch = useDispatch();

  // Handles page change when clicking a number
  const handlePageChange = (newPage) => {
    if (newPage !== '...') {
      dispatchCurrentPage(newPage);  // ✅ Directly update the page number
    }
  };

  // Generate pagination numbers with "..." for large sets
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxPagesToShow - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };


  return (
    <div className="row mt-4 mt-md-5">
      <div className="col-md-12">
        <div className="text-center">
          <nav aria-label="Page navigation justify-content-center">
            {/* Small screens pagination */}
            {/* Small screens pagination */}
            <ul className="pagination gap-3 shadow-none d-md-none">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={goToFirstPage} disabled={currentPage === 1}>First</button>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
              </li>
              <li className="page-item">
                <span className="page-link">{currentPage} / {totalPages}</span>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={goToLastPage} disabled={currentPage === totalPages}>Last</button>
              </li>
            </ul>


            {/* Large screens pagination */}
            <ul className="pagination d-none d-md-inline-flex">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button onClick={goToFirstPage} className="page-link text-white" aria-label="First" disabled={currentPage === 1}>
                  First
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button onClick={goToPreviousPage} className="page-link" aria-label="Previous" disabled={currentPage === 1}>
                  <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
                </button>
              </li>
              {getPageNumbers().map((pageNumber, index) => (
                <li key={index} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  {pageNumber === "..." ? (
                    <span className="page-link">...</span>
                  ) : (
                    <button onClick={() => handlePageChange(pageNumber)} className="page-link">
                      {pageNumber}
                    </button>
                  )}
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button onClick={goToNextPage} className="page-link" aria-label="Next" disabled={currentPage === totalPages}>
                  <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button onClick={goToLastPage} className="page-link" aria-label="Last" disabled={currentPage === totalPages}>
                  Last
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

