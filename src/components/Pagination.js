// import Link from 'next/link';
// import Icons from './Icons';
// import { useDispatch } from 'react-redux';
// import { getCurrentPage } from '../../redux/app/features/projectsSlice';

// const Pagination = ({ currentPage, totalPages, goToPreviousPage, goToNextPage,dispatchCurrentPage }) => {
//   const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
//   const dispatch = useDispatch();
//   const handlePageChange = (newPage) => {
//     dispatch(
//       dispatchCurrentPage(newPage)
//     )
//   };
//   return (
//     <div className="row mt-4 mt-md-5">
//       <div className="col-md-12">
//         <div className='text-center'>
//           <nav aria-label="Page navigation justify-content-center">
//             {/* small screens */}
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
//               {/* Other small screen links */}
//             </ul>
//             {/* large screens */}
//             <ul className="pagination d-none d-md-inline-flex">
//               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                 <button onClick={()=>goToPreviousPage()} className="page-link" aria-label="Previous">
//                   <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
//                 </button>
//               </li>
//               {pageNumbers.map((pageNumber) => (
//                 <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
//                   <button onClick={()=>handlePageChange(pageNumber)} className="page-link" >
//                     {pageNumber}
//                   </button>
//                 </li>
//               ))}
//               <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                 <button
//                   className="page-link"
//                  onClick={()=>goToNextPage()}
//                   aria-label="Next"
//                 >
//                   {/* <span>Next</span> */}
//                   <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Pagination;

import Link from 'next/link';
import Icons from './Icons';
import { useDispatch } from 'react-redux';

const Pagination = ({ currentPage, totalPages, goToPreviousPage, goToNextPage, dispatchCurrentPage }) => {
  const dispatch = useDispatch();

  // Handles page change when clicking a number
  const handlePageChange = (newPage) => {
    if (newPage !== '...') {
      dispatchCurrentPage(newPage);  // ✅ Directly update the page number
    }
  };

  // Generate pagination numbers with "..." for large sets
  const getPageNumbers = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages = [1];
      if (currentPage > 3) {
        pages.push("...");
      }
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
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
                  href={`/page/${currentPage - 1}`}
                  aria-label="Previous"
                >
                  <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
                  <span>Previous</span>
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
                  <span>Next</span>
                  <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
                </Link>
              </li>
            </ul>

            {/* Large screens pagination */}
            <ul className="pagination d-none d-md-inline-flex">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button onClick={goToPreviousPage} className="page-link" aria-label="Previous">
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
                <button onClick={goToNextPage} className="page-link" aria-label="Next">
                  <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
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
