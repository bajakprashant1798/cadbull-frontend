const SortByDate = () => {
  return (

    <div className="offcanvas offcanvas-bottom" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop4" aria-labelledby="staticBackdropLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasBottomLabel">Sort by Date</h5>
        <button type="button" className="btn-close shadow-none border-0" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <hr className="m-0" />
      <div className="offcanvas-body sort-by-wrapper d-flex flex-column gap-3">
        <div>
          <label className="mb-1 fw-semibold" htmlFor="">TO</label>
          <input type="date" className="form-control shadow-none" />
        </div>
        <div>
          <label className="mb-1 fw-semibold" htmlFor="">From</label>
          <input type="date" className="form-control shadow-none" />
        </div>
      </div>
    </div>
  );
}

export default SortByDate;