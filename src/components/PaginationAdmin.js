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
    const delta = 2; // Pages to show before and after current page
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Calculate window around current page
      let start = Math.max(2, currentPage - delta);
      let end = Math.min(totalPages - 1, currentPage + delta);
      
      // Adjust window if at edges
      if (currentPage <= 3) {
        end = 5;
      }
      if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }
      
      // Add pages in window
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
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

