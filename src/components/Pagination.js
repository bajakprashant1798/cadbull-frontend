import Link from "next/link";
import React from 'react';

const Pagination = ({
  basePath = "",
  currentPage,
  totalPages,
  onPageChange,
  jumpSize = 5,   // number of pages to jump with jump buttons (desktop)
  windowSize = 10 // maximum number of numbered buttons to display (desktop)
}) => {
  if (typeof onPageChange !== 'function') {
    throw new Error("Pagination component requires an onPageChange function prop");
  }

  // Helper for desktop: calculates the numbered pages to display
  const getWindowPages = (currentPage, totalPages) => {
    if (totalPages <= windowSize) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = currentPage - Math.floor(windowSize / 2);
    let end = currentPage + Math.floor(windowSize / 2);
    if (start < 1) {
      start = 1;
      end = windowSize;
    }
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - windowSize + 1;
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getWindowPages(currentPage, totalPages);

  // For links: default to "/" if no basePath
  const getPageHref = (pageNumber) => {
    if (!basePath || basePath === "/") {
      return pageNumber === 1 ? "/" : `/${pageNumber}`;
    }
    return pageNumber === 1 ? basePath : `${basePath}/${pageNumber}`;
  };

  // Jump buttons for desktop view
  const jumpBack = () => {
    const newPage = currentPage - jumpSize;
    onPageChange(newPage < 1 ? 1 : newPage);
  };

  const jumpForward = () => {
    const newPage = currentPage + jumpSize;
    onPageChange(newPage > totalPages ? totalPages : newPage);
  };

  return (
    <div className="row mt-4 mt-md-5">
      <div className="col-md-12">
        <div className="d-flex justify-content-center" style={{ overflowX: 'auto' }}>
          <nav aria-label="Page navigation">
            {/* Mobile view: only show Previous/Next buttons as specified */}
            <ul className="pagination gap-3 shadow-none d-md-none">
              {currentPage > 1 && (
                <li className="page-item">
                  <Link
                    href={getPageHref(currentPage - 1)}
                    className="page-link text-white"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage > 1) onPageChange(currentPage - 1);
                    }}
                  >
                    Previous
                  </Link>
                </li>
              )}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''} `}>
                <Link
                  href={getPageHref(currentPage + 1)}
                  className="page-link text-white"
                  onClick={e => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  aria-label="Next"
                >
                  Next
                </Link>
              </li>
            </ul>

            {/* Desktop view: numbered pages with jump buttons */}
            <ul className="pagination d-none d-md-inline-flex">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Link
                  href={getPageHref(1)}
                  scroll={false}
                  className="page-link text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(1);
                  }}
                  aria-label="First page"
                >
                  First
                </Link>
              </li>
              {/* Always render jump-back button */}
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  onClick={jumpBack}
                  className="page-link"
                  aria-label="Jump back"
                  disabled={currentPage === 1}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>

              {pages.map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <Link
                    href={getPageHref(pageNumber)}
                    scroll={false}
                    className="page-link"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage !== pageNumber) onPageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </Link>
                </li>
              ))}

              {/* Always render jump-forward button */}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  onClick={jumpForward}
                  className="page-link"
                  aria-label="Jump forward"
                  disabled={currentPage === totalPages}
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Link
                  href={getPageHref(totalPages)}
                  scroll={false}
                  className="page-link text-white"
                  onClick={e => {
                    e.preventDefault();
                    onPageChange(totalPages);
                  }}
                  aria-label="Last page"
                >
                  Last
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;