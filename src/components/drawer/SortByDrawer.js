import { drawings } from "@/pages";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawerHandler } from "../../../redux/app/features/drawerSlice";
import { updateSortList, updatesubcatpage, updatesubcatserachTerm } from "../../../redux/app/features/projectsSlice";

const SortByDrawer = () => {
  const drawerState=useSelector((store)=>store.drawerState);
   const { sortList } = useSelector((store) => store.projectinfo);
  const dispatch=useDispatch();
  return (
    <div
      className={`offcanvas offcanvas-bottom ${drawerState.drawers.sortBy?"show":''}`}
      // data-bs-backdrop="static"
      tabIndex="-1"
      // id="staticBackdrop"
      aria-labelledby="staticBackdropLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasBottomLabel">
          Sort by
        </h5>
        <button
          type="button"
          className="btn-close shadow-none border-0"
          // data-bs-dismiss="offcanvas"
          onClick={(e)=>{
            dispatch(closeDrawerHandler({drawerType:"sortBy"}))
         }}
          aria-label="Close"
        ></button>
      </div>
      <hr className="m-0" />
      <div className="offcanvas-body sort-by-wrapper">
        <ul className="list-unstyled d-flex flex-column gap-3">
          <li className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="m-0 text-primary fw-bold lh-sm">All </h6>
              <p className="m-0">All Types</p>
            </div>
            <div>
              <input
                onChange={(e)=>{
                  dispatch(updateSortList(''))
                  dispatch(updatesubcatserachTerm(''));
                  dispatch(closeDrawerHandler({drawerType:"sortBy"}))
                }}
                className="form-check-input shadow-none"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                defaultChecked
                value={""}
              />
            </div>
          </li>
          {drawings.map(({ type, description,value }) => {
            return (
              <li className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="m-0 text-primary fw-bold lh-sm">{type} </h6>
                  <p className="m-0">{description}</p>
                </div>
                <div>
                  <input
                  onChange={(e)=>{
                    dispatch(updateSortList(value))
                    dispatch(updatesubcatpage(1));
                    dispatch(updatesubcatserachTerm(value));
                     setTimeout(() => {
                      dispatch(closeDrawerHandler({drawerType:"sortBy"}))
                     }, 100);
                  }}
                    className="form-check-input shadow-none"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value={sortList}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SortByDrawer;
