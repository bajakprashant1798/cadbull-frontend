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
            <ul className="pagination gap-3 shadow-none d-md-none">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Link
                  className="page-link text-white d-inline-flex gap-2"
                  href={`/page/1`}
                  aria-label="First"
                >
                  <span aria-hidden="true">First</span>
                </Link>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Link
                  className="page-link text-white d-inline-flex gap-2"
                  href={`/page/${currentPage - 1}`}
                  aria-label="Previous"
                >
                  <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
                  <span >Previous</span>
                </Link>
              </li>
              <li className="page-item">
                <span className="page-link text-white">{currentPage} / {totalPages}</span>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Link
                  className="page-link text-white d-inline-flex gap-2"
                  href={`/page/${currentPage + 1}`}
                  aria-label="Next"
                >
                  <span >Next</span>
                  <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
                </Link>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Link
                  className="page-link text-white d-inline-flex gap-2"
                  href={`/page/${totalPages}`}
                  aria-label="Last"
                >
                  <span aria-hidden="true">Last</span>
                </Link>
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

