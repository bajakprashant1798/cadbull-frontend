import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { closeModalHandler } from "../../redux/app/features/modalSlice";
import { cancelSubscriptionRequest } from "@/service/api";
export default function CancelSubsConfirm({subscriptionId}) {
    const dispatch=useDispatch()
    const handleCancellationReq=()=>{
      cancelSubscriptionRequest(subscriptionId).then((res)=>{
        console.log('cancel subscription result ',res.data);
        dispatch(closeModalHandler())
        toast.success("Your subscription has been canceled")
      }).catch((err)=>{
         console.log('error',err)
         toast.error("Subscription cancellation failed!")
         dispatch(closeModalHandler())
      })
      
     
    }
  return (
    <>
      <div className="row p-1 ">
        <h4 className="text-secondary text-start fs-18 m-2">
          Subscription Cancellation Request{" "}
        </h4>
        <h5 className="text-danger text-center fs-15 ">
          {" "}
          Are you sure want to cancel subscription?This operation can not be
          revert
        </h5>
        <div className="d-flex gap-2 justify-content-center  mt-4 ">
          <button onClick={handleCancellationReq} type="button" className="btn btn-primary  rounded">
            Yes,I want
          </button>
          <button
            className="btn btn-danger-variant "
            onClick={(e) => {
              e.preventDefault();
              dispatch(closeModalHandler())
            }}
          >
            No,Close It
          </button>
        </div>
      </div>
    </>
  );
}
