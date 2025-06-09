import Icons from './Icons';
import Link from "next/link";
import React from 'react';

const Pagination = ({
  slug,
  currentPage,
  totalPages,
  onPageChange,
  jumpSize = 5,   // number of pages to jump with jump buttons (desktop)
  windowSize = 11 // maximum number of numbered buttons to display (desktop)
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
        <div className="text-center">
          <nav aria-label="Page navigation">
            {/* Mobile view: only show Previous/Next buttons as specified */}
            <ul className="pagination gap-3 shadow-none d-md-none">
              {currentPage > 1 && (
                <li className="page-item">
                  {/* <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="page-link text-white"
                    aria-label="Previous"
                  >
                    Previous
                  </button> */}
                  <Link
                    href={currentPage - 1 === 1 ? `/${slug}` : `/${slug}/${currentPage - 1}`}
                    className="page-link"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage > 1) onPageChange(currentPage - 1);
                    }}
                  >Previous</Link>

                </li>
              )}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  className="page-link text-white"
                  aria-label="Next"
                >
                  Next
                </button>
              </li>
            </ul>

            {/* Desktop view: numbered pages with jump buttons */}
            <ul className="pagination d-none d-md-inline-flex">
              {/* <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button onClick={() => onPageChange(currentPage - 1)} className="page-link" aria-label="Previous">
                  <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
                </button>
              </li> */}

              {/* Always render jump-back button */}
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  onClick={jumpBack}
                  className="page-link"
                  aria-label="Jump back"
                  disabled={currentPage === 1}
                >
                  <span aria-hidden="true" className='text-white'>&laquo;</span>
                </button>
              </li>

              {pages.map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <Link
                    href={pageNumber === 1 ? `/${slug}` : `/${slug}/${pageNumber}`}
                    scroll={false}
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage !== pageNumber) {
                        onPageChange(pageNumber);
                      }
                    }}
                  >
                    {pageNumber}
                  </Link>
                </li>
              ))}


              {/* {pages.map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <button onClick={() => onPageChange(pageNumber)} className="page-link">
                    {pageNumber}
                  </button>
                </li>
              ))} */}

              {/* Always render jump-forward button */}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  onClick={jumpForward}
                  className="page-link"
                  aria-label="Jump forward"
                  disabled={currentPage === totalPages}
                >
                  <span aria-hidden="true" className='text-white'>&raquo;</span>
                </button>
              </li>

              {/* <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  className="page-link"
                  aria-label="Next"
                >
                  <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
                </button>
              </li> */}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;