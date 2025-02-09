import { useForm } from "react-hook-form";
import { addOccupationApi } from "@/service/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";

const AddOccupation = () => {
  const { token } = useSelector((store) => store.logininfo);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await addOccupationApi(data, token);
      toast.success("Occupation added successfully!");
      reset();
    } catch (error) {
      toast.error("Error adding occupation");
    }
  };

  return (
    <AdminLayout>
      <h2>Add Occupation</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input className="form-control" {...register("occupation")} required placeholder="Enter occupation" />
        <button className="btn btn-primary mt-3">Add</button>
      </form>
    </AdminLayout>
  );
};

export default AddOccupation;
