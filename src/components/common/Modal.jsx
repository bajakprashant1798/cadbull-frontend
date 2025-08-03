
import { useDispatch, useSelector } from "react-redux";
import Icons from "../Icons";
import { closeModalHandler } from "../../../redux/app/features/modalSlice";

export default function Modal({children}) {
  const { showModal } = useSelector((store) => store.modalState);
  const dispatch=useDispatch()
  // console.log('modal state',showModal)
  return (
    <>
      <div
        className={`modal fade  ${showModal ? "show" : ""}`}
        style={{
          display: showModal ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content p-md-4 border-0 rounded-4">
            <div className="modal-body position-relative">
              <div className="d-flex justify-content-end border-0 ">
              <button
                  type="button"
                  className="btn p-0 border-0 shadow-none"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={()=>{
                    dispatch(closeModalHandler())
                  }}
                >
                  <Icons.Close />
                </button>
              
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
