import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getOccupationByIdApi, editOccupationApi } from "@/service/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";

const EditOccupation = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useSelector((store) => store.logininfo);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (id && token) {
      getOccupationByIdApi(id, token)
        .then((res) => reset(res.data.occupation))
        .catch(() => toast.error("Error fetching occupation"));
    }
  }, [id, token, reset]);

  const onSubmit = async (data) => {
    try {
      await editOccupationApi(id, data, token);
      toast.success("Occupation updated successfully!");
      router.push("/admin/occupations/list-of-occupations");
    } catch (error) {
      toast.error("Error updating occupation");
    }
  };

  return (
    <AdminLayout>
      <h2>Edit Occupation</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input className="form-control" {...register("occupation")} required />
        <button className="btn btn-primary mt-3">Update</button>
      </form>
    </AdminLayout>
  );
};

export default EditOccupation;
