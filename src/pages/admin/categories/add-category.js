import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { addCategoryApi, getCategoriesApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import { checkCategoryNameApi } from "@/service/api";
import { toast } from "react-toastify";

const AddCategory = () => {
  const router = useRouter();
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  
  const { register, handleSubmit, reset, setValue } = useForm();
  const [parentCategories, setParentCategories] = useState([]);

  const [categoryName, setCategoryName] = useState(""); // Controlled input
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [checking, setChecking] = useState(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      getCategoriesApi("")
        .then((res) => setParentCategories(res.data.categories))
        .catch(() => toast.error("Error fetching parent categories"));
    }
  }, [isAuthenticated]);

  // Live duplicate check on name
  const handleCategoryNameChange = (e) => {
    const value = e.target.value;
    setCategoryName(value);
    setValue("name", value); // Sync with react-hook-form

    setIsDuplicate(false);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(async () => {
      if (!value.trim()) {
        setIsDuplicate(false);
        setChecking(false);
        return;
      }
      setChecking(true);
      try {
        const res = await checkCategoryNameApi(value.trim());
        setIsDuplicate(res.data.exists);
      } catch (err) {
        setIsDuplicate(false);
      }
      setChecking(false);
    }, 350);
  };

  const onSubmit = async (data) => {
    if (isDuplicate) {
      toast.error("Cannot save: Duplicate category name.");
      return;
    }
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
            Add Category
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCategory;
