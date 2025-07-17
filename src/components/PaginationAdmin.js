import Link from 'next/link';
import Icons from './Icons';

const PaginationAdmin = ({
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  goToFirstPage,
  goToLastPage,
  dispatchCurrentPage
}) => {
  const handlePageChange = (newPage) => {
    if (newPage !== '...' && Number(newPage) !== currentPage) {
      dispatchCurrentPage(Number(newPage));
    }
  };

  const getPageNumbers = () => {
    const pageWindow = 5;
    let pages = [];

    // If totalPages <= 5, just show them all
    if (totalPages <= pageWindow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Compute window
    let start = Math.max(1, currentPage - Math.floor(pageWindow / 2));
    let end = start + pageWindow - 1;

    // Clamp end if it exceeds totalPages
    if (end > totalPages) {
      end = totalPages;
      start = end - pageWindow + 1;
    }

    // Clamp start if it goes below 1
    if (start < 1) start = 1;

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
            {/* Mobile pagination */}
            <ul className="pagination gap-3 shadow-none d-md-none">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  First
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              <li className="page-item">
                <span className="page-link">
                  {currentPage} / {totalPages}
                </span>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </li>
            </ul>

            {/* Desktop pagination */}
            <ul className="pagination d-none d-md-inline-flex">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  onClick={goToFirstPage}
                  className="page-link text-white"
                  disabled={currentPage === 1}
                >
                  First
                </button>
              </li>
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  onClick={goToPreviousPage}
                  className="page-link"
                  disabled={currentPage === 1}
                >
                  <span aria-hidden="true">
                    <Icons.WhiteArrowLeft />
                  </span>
                </button>
              </li>

              {/* --- Only render number buttons if dispatchCurrentPage is provided and totalPages is truthy --- */}
              {(typeof dispatchCurrentPage === "function" && totalPages) && getPageNumbers().map((pageNumber, index) => (
                <li 
                  key={index}
                  className={`page-item ${currentPage === pageNumber ? 'active' : ''} ${pageNumber === '...' ? 'disabled' : ''}`}
                >
                  {pageNumber === '...' ? (
                    <span className="page-link">...</span>
                  ) : (
                    <button 
                      onClick={() => dispatchCurrentPage(pageNumber)}
                      className="page-link"
                    >
                      {pageNumber}
                    </button>
                  )}
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  onClick={goToNextPage}
                  className="page-link"
                  disabled={currentPage === totalPages}
                >
                  <span aria-hidden="true">
                    <Icons.WhiteArrowRight />
                  </span>
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button 
                  onClick={goToLastPage}
                  className="page-link"
                  disabled={currentPage === totalPages}
                >
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

export default PaginationAdmin;

