import { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { editInterestApi, getInterestByIdApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import { toast } from "react-toastify";

const EditInterest = () => {
  const router = useRouter();
  const { id } = router.query;
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (id && isAuthenticated) {
      getInterestByIdApi(id)
        .then((res) => reset(res.data.interest))
        .catch(() => toast.error("Error fetching interest details"));
    }
  }, [id, isAuthenticated, reset]);

  const onSubmit = async (data) => {
    try {
      await editInterestApi(id, data);
      toast.success("Interest updated successfully!");
      router.push("/admin/interests/list-of-interests");
    } catch (error) {
      toast.error("Error updating interest");
    }
  };

  return (
    <AdminLayout>
      <div className="container ">
        <h2>Edit Interest</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Interest Name</label>
            <input className="form-control" {...register("interest")} required />
          </div>
          <button type="submit" className="btn btn-primary">Update Interest</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditInterest;
