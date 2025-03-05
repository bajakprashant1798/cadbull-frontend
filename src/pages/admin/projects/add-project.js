import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { addProjectApi, getAdminCategoriesWithSubcategories, getCategoriesApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import TagsField from "@/components/TagsField";


const AddProject = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // ✅ Ensure it starts as an empty array
  const [descriptionCount, setDescriptionCount] = useState(250);
  const [tags, setTags] = useState([]);

  // ✅ Fetch Categories on Component Mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  // ✅ Fetch Categories Using New Admin API
  const fetchCategories = async () => {
    if (!isAuthenticated) {
      toast.error("❌ Missing authentication token");
      return;
    }
  
    try {
      console.log("🚀 Fetching categories for admin panel...");
      const res = await getAdminCategoriesWithSubcategories();
      console.log("✅ Categories Fetched:", res);
      setCategories(res.data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      toast.error(error.message || "Error fetching categories");
    }
  };
  

  // ✅ Handle Category Selection
  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find((cat) => cat.id === Number(categoryId));
    setSubcategories(selectedCategory?.project_sub_categories || []);
  };
  

  // ✅ Handle Description Character Count
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    setDescriptionCount(250 - text.length);
  };

  // ✅ Submit Form
  const onSubmit = async (data) => {
    try {
        const formData = new FormData();

        data.tags = tags.join(",");

        console.log("🚀 Form Data BEFORE Append:", data);

        // ✅ Explicitly append all form fields
        formData.append("work_title", data.work_title || "");
        formData.append("description", data.description || "");
        formData.append("meta_title", data.meta_title || "");
        formData.append("meta_description", data.meta_description || "");
        formData.append("tags", data.tags || "");
        formData.append("file_type", data.file_type || "");
        formData.append("category_id", data.category_id || "");
        formData.append("subcategory_id", data.subcategory_id || "");
        formData.append("type", data.type || "Free");

        // ✅ Ensure file & image exist before appending
        if (data.file && data.file.length > 0) {
            formData.append("file", data.file[0]);
        } else {
            toast.error("Please upload a ZIP file.");
            return;
        }

        if (data.image && data.image.length > 0) {
            formData.append("image", data.image[0]);
        } else {
            toast.error("Please upload an Image.");
            return;
        }

        console.log("✅ FormData AFTER Append:", [...formData.entries()]);

        await addProjectApi(formData);
        toast.success("Project added successfully!");
        reset();
        router.push("/admin/projects/view-projects");
    } catch (error) {
        console.error("❌ Error Adding Project:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Error adding project");
    }
  };

  
  

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* Work Title */}
          <div className="mb-3">
            <label className="form-label">Work Title</label>
            <input className="form-control" {...register("work_title", { required: true })} />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" {...register("description", { required: true })} onChange={handleDescriptionChange}></textarea>
            <small>{descriptionCount} characters left</small>
          </div>

          {/* Meta Title */}
          <div className="mb-3">
            <label className="form-label">Meta Title</label>
            <input className="form-control" {...register("meta_title")} />
          </div>

          {/* Meta Description */}
          <div className="mb-3">
            <label className="form-label">Meta Description</label>
            <input className="form-control" {...register("meta_description")} />
          </div>

          {/* Tags */}
          {/* <div className="mb-3">
            <label className="form-label">Tags</label>
            <input className="form-control" {...register("tags")} />
          </div> */}
          <TagsField value={tags} onChange={setTags} /> {/* ✅ Tags Input Field */}


          {/* File Type */}
          <div className="mb-3">
            <label className="form-label">File Type</label>
            <select className="form-control" {...register("file_type", { required: true })}>
              <option value="">Select File Type</option>
              <option value="DWG">DWG</option>
              <option value="DXF">DXF</option>
              <option value="PDF">PDF</option>
              <option value="JPEG">JPEG</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              {...register("category_id", { required: true })}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Subcategory (✅ Prevent Error on Undefined) */}
          <div className="mb-3">
            <label className="form-label">Subcategory</label>
            <select className="form-control" {...register("subcategory_id")}>
              <option value="">Select Subcategory</option>
              {subcategories.length > 0 ? (
                subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.title}</option>
                ))
              ) : (
                <option disabled>No subcategories available</option> // ✅ Prevents error
              )}
            </select>
          </div>

          {/* Project Type */}
          <div className="mb-3">
            <label className="form-label">Project Type</label>
            <select className="form-control" {...register("type", { required: true })}>
              <option value="Free">Free</option>
              <option value="Gold">Gold</option>
            </select>
          </div>

          {/* Upload Zip File */}
          <div className="mb-3">
            <label className="form-label">Upload Zip File</label>
            <input type="file" className="form-control" {...register("file", { required: true })} />
          </div>

          {/* Upload Image */}
          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input type="file" className="form-control" {...register("image", { required: true })} />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">Add Project</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProject;
