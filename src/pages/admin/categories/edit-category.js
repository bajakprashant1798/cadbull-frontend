import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { editCategoryApi, getCategoryByIdApi, getCategoriesApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import { checkCategoryNameApi } from "@/service/api";
import { toast } from "react-toastify";

const EditCategory = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isDuplicate, setIsDuplicate] = useState(false);
  const [categoryName, setCategoryName] = useState(""); // Controlled input
  const [checking, setChecking] = useState(false);
  const typingTimeout = useRef(null);

  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const { register, handleSubmit, reset, setValue } = useForm();
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    if (id && isAuthenticated) {
      getCategoryByIdApi(id)
        .then((res) => {
          reset(res.data.category);
          setCategoryName(res.data.category.name || "");
        })
        .catch(() => toast.error("Error fetching category details"));

      getCategoriesApi("")
        .then((res) => setParentCategories(res.data.categories))
        .catch(() => toast.error("Error fetching parent categories"));
    }
  }, [id, isAuthenticated, reset]);


  const onSubmit = async (data) => {
    if (isDuplicate) {
      toast.error("Cannot save: Duplicate category name.");
      return;
    }
    try {
      await editCategoryApi(id, data);
      toast.success("Category updated successfully!");
      router.push("/admin/categories/all-categories");
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  const handleCategoryNameChange = (e) => {
    const value = e.target.value;
    setCategoryName(value);
    setValue("name", value);  // <-- Sync with react-hook-form
    setIsDuplicate(false); // Reset while checking

    // Debounce check (avoids too many API calls)
    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(async () => {
      if (!value.trim()) {
        setIsDuplicate(false);
        setChecking(false);
        return;
      }
      setChecking(true);
      try {
        // For edit, pass id; for add, just name
        const res = await checkCategoryNameApi(value.trim(), id || "");
        setIsDuplicate(res.data.exists);
      } catch (err) {
        setIsDuplicate(false);
      }
      setChecking(false);
    }, 350);
  };


  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Edit Category</h2>
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
            {/* <input className="form-control" {...register("name")} required /> */}
            <input
              className="form-control"
              {...register("name", { required: true })}
              value={categoryName}
              onChange={handleCategoryNameChange}
              autoComplete="off"
            />
            {checking && (
              <span style={{ color: "#888", fontSize: "13px" }}>Checking availability...</span>
            )}
            {isDuplicate && (
              <span style={{ color: "red", fontSize: "14px" }}>
                This category name already exists. Please choose another.
              </span>
            )}
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

          <button type="submit" className="btn btn-primary" disabled={isDuplicate || checking}>
            Update Category
          </button>

        </form>
      </div>
    </AdminLayout>
  );
};

export default EditCategory;
