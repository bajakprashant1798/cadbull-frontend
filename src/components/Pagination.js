import Link from 'next/link';
import Icons from './Icons';
import { useDispatch } from 'react-redux';
import { getCurrentPage } from '../../redux/app/features/projectsSlice';

const Pagination = ({ currentPage, totalPages, goToPreviousPage, goToNextPage,dispatchCurrentPage }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const dispatch = useDispatch();
  const handlePageChange = (newPage) => {
    dispatch(
      dispatchCurrentPage(newPage)
    )
  };
  return (
    <div className="row mt-4 mt-md-5">
      <div className="col-md-12">
        <div className='text-center'>
          <nav aria-label="Page navigation justify-content-center">
            {/* small screens */}
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
              {/* Other small screen links */}
            </ul>
            {/* large screens */}
            <ul className="pagination d-none d-md-inline-flex">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button onClick={()=>goToPreviousPage()} className="page-link" aria-label="Previous">
                  <span aria-hidden="true"><Icons.WhiteArrowLeft /></span>
                </button>
              </li>
              {pageNumbers.map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <button onClick={()=>handlePageChange(pageNumber)} className="page-link" >
                    {pageNumber}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                 onClick={()=>goToNextPage()}
                  aria-label="Next"
                >
                  {/* <span>Next</span> */}
                  <span aria-hidden="true"><Icons.WhiteArrowRight /></span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Pagination;
