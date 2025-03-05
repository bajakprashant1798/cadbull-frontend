import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { addInterestApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";

const AddInterest = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await addInterestApi(data);
      toast.success("Interest added successfully!");
      reset();
      router.push("/admin/interests/list-of-interests");
    } catch (error) {
      toast.error("Error adding interest");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Add Interest</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Interest Name</label>
            <input className="form-control" {...register("interest")} required />
          </div>
          <button type="submit" className="btn btn-primary">Add Interest</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddInterest;
