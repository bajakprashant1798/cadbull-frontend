import Icons from './Icons';

const Pagination = ({
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
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="page-link text-white"
                    aria-label="Previous"
                  >
                    Previous
                  </button>
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
                  <button onClick={() => onPageChange(pageNumber)} className="page-link">
                    {pageNumber}
                  </button>
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




// import Link from 'next/link';
// import Icons from './Icons';

// const Pagination = ({ currentPage, totalPages, onPageChange, goToPreviousPage, goToNextPage }) => {
//   const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

//   return (
//     <div className="row mt-4 mt-md-5">
//       <div className="col-md-12">
//         <div className="text-center">
//           <nav aria-label="Page navigation justify-content-center">
//             {/* Small screens */}
//             <ul className="pagination gap-3 shadow-none d-md-none">
//               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                 <Link
//                   className="page-link text-white d-inline-flex gap-2"
//                   href={`/page/${currentPage - 1}`}
//                   aria-label="Previous"
//                 >
//                   <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
//                   <span>Previous</span>
//                 </Link>
//               </li>
//             </ul>
//             {/* Large screens */}
//             <ul className="pagination d-none d-md-inline-flex">
//               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                 <button onClick={() => onPageChange(currentPage - 1)} className="page-link" aria-label="Previous">
//                   <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
//                 </button>
//               </li>
//               {pageNumbers.map((pageNumber) => (
//                 <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
//                   <button onClick={() => onPageChange(pageNumber)} className="page-link">
//                     {pageNumber}
//                   </button>
//                 </li>
//               ))}
//               <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                 <button onClick={() => onPageChange(currentPage + 1)} className="page-link" aria-label="Next">
//                   <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pagination;



// import Link from 'next/link';
// import Icons from './Icons';
// import { useDispatch } from 'react-redux';

// const Pagination = ({ currentPage, totalPages, goToPreviousPage, goToNextPage, dispatchCurrentPage }) => {
//   const dispatch = useDispatch();

//   // Handles page change when clicking a number
//   const handlePageChange = (newPage) => {
//     if (newPage !== '...') {
//       dispatchCurrentPage(newPage);  // ✅ Directly update the page number
//     }
//   };

//   // Generate pagination numbers with "..." for large sets
//   const getPageNumbers = () => {
//     let pages = [];
//     if (totalPages <= 5) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       pages = [1];
//       if (currentPage > 3) {
//         pages.push("...");
//       }
//       for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
//         pages.push(i);
//       }
//       if (currentPage < totalPages - 2) {
//         pages.push("...");
//       }
//       pages.push(totalPages);
//     }
//     return pages;
//   };

//   return (
//     <div className="row mt-4 mt-md-5">
//       <div className="col-md-12">
//         <div className="text-center">
//           <nav aria-label="Page navigation justify-content-center">
//             {/* Small screens pagination */}
//             <ul className="pagination gap-3 shadow-none d-md-none">
//               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                 <Link
//                   className="page-link text-white d-inline-flex gap-2"
//                   href={`/page/${currentPage - 1}`}
//                   aria-label="Previous"
//                 >
//                   <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
//                   <span>Previous</span>
//                 </Link>
//               </li>
//               <li className="page-item">
//                 <span className="page-link text-white">{currentPage} / {totalPages}</span>
//               </li>
//               <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                 <Link
//                   className="page-link text-white d-inline-flex gap-2"
//                   href={`/page/${currentPage + 1}`}
//                   aria-label="Next"
//                 >
//                   <span>Next</span>
//                   <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
//                 </Link>
//               </li>
//             </ul>

//             {/* Large screens pagination */}
//             <ul className="pagination d-none d-md-inline-flex">
//               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                 <button onClick={goToPreviousPage} className="page-link" aria-label="Previous">
//                   <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
//                 </button>
//               </li>
//               {getPageNumbers().map((pageNumber, index) => (
//                 <li key={index} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
//                   {pageNumber === "..." ? (
//                     <span className="page-link">...</span>
//                   ) : (
//                     <button onClick={() => handlePageChange(pageNumber)} className="page-link">
//                       {pageNumber}
//                     </button>
//                   )}
//                 </li>
//               ))}
//               <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                 <button onClick={goToNextPage} className="page-link" aria-label="Next">
//                   <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pagination;
