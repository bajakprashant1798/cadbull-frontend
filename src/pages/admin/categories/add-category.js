import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { addCategoryApi, getCategoriesApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import { toast } from "react-toastify";

const AddCategory = () => {
  const router = useRouter();
  const { token } = useSelector((store) => store.logininfo);
  const { register, handleSubmit, reset } = useForm();
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    if (token) {
      getCategoriesApi("")
        .then((res) => setParentCategories(res.data.categories))
        .catch(() => toast.error("Error fetching parent categories"));
    }
  }, [token]);

  const onSubmit = async (data) => {
    try {
      await addCategoryApi(data);
      toast.success("Category added successfully!");
      router.push("/admin/categories/all-categories");
    } catch (error) {
      toast.error("Error adding category");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Add Category</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Parent Category</label>
            <select className="form-control" {...register("parent_id")}>
              <option value="0">None</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Category Name</label>
            <input className="form-control" {...register("name")} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" {...register("description")} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Meta Title</label>
            <input className="form-control" {...register("meta_title")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Meta Keywords</label>
            <input className="form-control" {...register("meta_keywords")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Meta Description</label>
            <textarea className="form-control" {...register("meta_description")} />
          </div>

          <button type="submit" className="btn btn-primary">Add Category</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCategory;
