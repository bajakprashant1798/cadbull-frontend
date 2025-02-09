import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import * as api from "@/service/api";
import { toast } from "react-toastify";
import { getProjectByIdApi, updateProjectApi, getAdminCategoriesWithSubcategories } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // ✅ Import default styles

const EditProject = () => {
  const { token } = useSelector((store) => store.logininfo);
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, watch } = useForm();
  const router = useRouter();
  const { id } = router.query;

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storedToken, setStoredToken] = useState(null);

  // ✅ Load token from sessionStorage safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionToken = sessionStorage.getItem("accessToken");
      setStoredToken(sessionToken);
    }
  }, []);

  // ✅ Restore Redux token if missing
  useEffect(() => {
    if (!token && storedToken) {
      const savedUser = sessionStorage.getItem("userData");
      if (savedUser) {
        dispatch(loginSuccess({ user: JSON.parse(savedUser), token: storedToken }));
      }
    }
  }, [dispatch, token, storedToken]);

  // ✅ Fetch Categories & Project Data
  useEffect(() => {
    if (!id) return;

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const authToken = token || storedToken;
        if (!authToken) {
          toast.error("Token is missing, please login again.");
          return router.push("/auth/login");
        }

        console.log("Fetching project with token:", authToken);

        // ✅ Fetch categories and project details simultaneously
        const [categoriesRes, projectRes] = await Promise.all([
          api.getAdminCategoriesWithSubcategories(authToken),
          api.getProjectByIdApi(id, authToken),
        ]);

        console.log("✅ Categories Response:", categoriesRes.data);
        console.log("✅ Project Response:", projectRes.data);

        if (!categoriesRes.data || !Array.isArray(categoriesRes.data)) {
          throw new Error("Invalid categories response");
        }
        if (!projectRes.data) {
          throw new Error("Invalid project details response");
        }

        setCategories(categoriesRes.data);

        // ✅ Set Form Data
        Object.keys(projectRes.data).forEach((key) => setValue(key, projectRes.data[key] || ""));
        setTags(projectRes.data.tags ? projectRes.data.tags.split(",") : []);

        // ✅ Set Category & Subcategory
        if (projectRes.data.category_id) {
          const selectedCategory = categoriesRes.data.find((cat) => cat.id === Number(projectRes.data.category_id));
          setSubcategories(selectedCategory?.project_sub_categories || []);
          setValue("subcategory_id", projectRes.data.subcategory_id || ""); // ✅ Handle null subcategory
        }

        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching project details:", error.message);
        toast.error("Error fetching project details or categories.");
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id, token, storedToken]);

  // ✅ Handle Category Selection
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setValue("category_id", categoryId);
    setValue("subcategory_id", ""); // ✅ Reset subcategory when changing category

    const selectedCategory = categories.find((cat) => cat.id === Number(categoryId));
    setSubcategories(selectedCategory?.project_sub_categories || []);
  };

  // ✅ Submit Form with Updated Data
  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        tags: tags.join(","), // Convert tags array to CSV
        subcategory_id: data.subcategory_id || null, // ✅ Handle null subcategory
      };

      // ✅ Append files if they exist
      if (data.file && data.file.length > 0) {
        updatedData.file = data.file;
      }
      if (data.image && data.image.length > 0) {
        updatedData.image = data.image;
      }

      console.log("🚀 Sending Updated Project Data:", updatedData);

      await updateProjectApi(id, updatedData, token);
      toast.success("Project updated successfully!");
      router.push("/admin/projects/view-projects");
    } catch (error) {
      console.error("❌ Error updating project:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Error updating project");
    }
  };

  // ✅ Ensure page does not stay stuck in loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="container py-5 text-center">
          <h4>Loading project details...</h4>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Edit Project</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* Work Title */}
          <div className="mb-3">
            <label className="form-label">Work Title</label>
            <input className="form-control" {...register("work_title", { required: true })} />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" {...register("description")} />
          </div>

          {/* Meta Title */}
          <div className="mb-3">
            <label className="form-label">Meta Title</label>
            <input className="form-control" {...register("meta_title")} />
          </div>

          {/* Meta Description */}
          <div className="mb-3">
            <label className="form-label">Meta Description</label>
            <textarea className="form-control" {...register("meta_description")} />
          </div>

          {/* Tags Input Field */}
          <div className="mb-3">
            <label className="form-label">Tags</label>
            <TagsInput value={tags} onChange={setTags} />
          </div>

          {/* File Type */}
          <div className="mb-3">
            <label className="form-label">File Type</label>
            <select className="form-control" {...register("file_type")}>
              <option value="DWG">DWG</option>
              <option value="DXF">DXF</option>
              <option value="PDF">PDF</option>
              <option value="JPEG">JPEG</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select className="form-control" {...register("category_id")} onChange={handleCategoryChange}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="mb-3">
            <label className="form-label">Subcategory</label>
            <select className="form-control" {...register("subcategory_id")}>
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.title}</option>
              ))}
            </select>
          </div>

          {/* Project Type */}
          <div className="mb-3">
            <label className="form-label">Project Type</label>
            <select className="form-control" {...register("type")}>
              <option value="Free">Free</option>
              <option value="Gold">Gold</option>
            </select>
          </div>

          {/* Upload New Zip File */}
          <div className="mb-3">
            <label className="form-label">Upload New Zip File</label>
            <input type="file" className="form-control" {...register("file")} />
          </div>

          {/* Upload New Image */}
          <div className="mb-3">
            <label className="form-label">Upload New Image</label>
            <input type="file" className="form-control" {...register("image")} />
          </div>

          {/* Project Status */}
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select className="form-control" {...register("status")}>
              <option value="1">Approved</option>
              <option value="2">Rejected</option>
            </select>
          </div>

          {/* Choose Project Type */}
          <div className="mb-3">
            <label className="form-label">Choose Project Type</label>
            <select className="form-control" {...register("popular")}>
              <option value="0">Regular Project</option>
              <option value="1">Popular Project</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProject;
