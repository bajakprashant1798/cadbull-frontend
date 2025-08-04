import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import * as api from "@/service/api";
import { toast } from "react-toastify";
import { getProjectByIdApi, updateProjectApi, getAdminCategoriesWithSubcategories, checkProjectNameApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css"; // ✅ Import default styles

function standardSlugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');
}
function oldSiteSlugify(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, '-')
    .replace(/\-+/g, '-')
    .replace(/^\-+|\-+$/g, '');
}

const EditProject = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue, watch } = useForm();
  const router = useRouter();
  const { id } = router.query;

  const [workTitle, setWorkTitle] = useState(""); // Controlled input
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [checking, setChecking] = useState(false);
  const typingTimeout = useRef(null); // You need to import useRef!

  const user = useSelector((store) => store.logininfo.user);
  const userRole = user?.role;


  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [slug, setSlug] = useState("");         // Slug input
  const [slugMode, setSlugMode] = useState("standard"); // "standard", "old", or "custom"

  // const [storedToken, setStoredToken] = useState(null);

  // ✅ Load token from sessionStorage safely
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const sessionToken = sessionStorage.getItem("accessToken");
  //     setStoredToken(sessionToken);
  //   }
  // }, []);

  // ✅ Restore Redux token if missing
  // useEffect(() => {
  //   if (!token && storedToken) {
  //     const savedUser = sessionStorage.getItem("userData");
  //     if (savedUser) {
  //       dispatch(loginSuccess({ user: JSON.parse(savedUser), token: storedToken }));
  //     }
  //   }
  // }, [dispatch, token, storedToken]);


  const handleGenerateStandardSlug = () => {
    setSlug(standardSlugify(workTitle));
    setSlugMode('standard');
  };
  const handleGenerateOldSiteSlug = () => {
    setSlug(oldSiteSlugify(workTitle));
    setSlugMode('old');
  };
  const handleSlugInputChange = (e) => {
    setSlug(e.target.value);
    setSlugMode('custom');
  };

  // ✅ Fetch Categories & Project Data
  useEffect(() => {
    if (!id) return;

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        // const authToken = token || storedToken;
        if (!isAuthenticated) {
          toast.error("Token is missing, please login again.");
          return router.push("/auth/login");
        }

        // console.log("Fetching project with token:", authToken);

        // ✅ Fetch categories and project details simultaneously
        const [categoriesRes, projectRes] = await Promise.all([
          api.getAdminCategoriesWithSubcategories(),
          api.getProjectByIdApi(id),
        ]);

        // console.log("✅ Categories Response:", categoriesRes.data);
        // console.log("✅ Project Response:", projectRes.data);

        if (!categoriesRes.data || !Array.isArray(categoriesRes.data)) {
          throw new Error("Invalid categories response");
        }
        if (!projectRes.data) {
          throw new Error("Invalid project details response");
        }

        // Set Form Data from projectRes.data
        Object.keys(projectRes.data).forEach((key) => {
          // ✅ ADD THIS CONDITION to skip setting the credit_days value
          if (key !== 'credit_days') {
            setValue(key, projectRes.data[key] || "");
          }
        });

        // ✅ Set Categories
        setCategories(categoriesRes.data);

        // setSlug(projectRes.data.slug || ""); // set initial slug
        // setSlugMode("custom"); // Or infer from slug format
        let initialSlug = "";
        let initialSlugMode = "standard";
        if (projectRes.data.slug && projectRes.data.slug.trim() !== "") {
          initialSlug = projectRes.data.slug;
          initialSlugMode = "custom";
        } else if (projectRes.data.work_title) {
          initialSlug = oldSiteSlugify(projectRes.data.work_title);
          initialSlugMode = "old";
        }
        setSlug(initialSlug);
        setSlugMode(initialSlugMode);


        //// ✅ Set Form Data
        // Object.keys(projectRes.data).forEach((key) => setValue(key, projectRes.data[key] || ""));
        setTags(projectRes.data.tags ? projectRes.data.tags.split(",") : []);

        setProjectDetails(projectRes.data); // For comparing on duplicate check
        setWorkTitle(projectRes.data.work_title || ""); // Set controlled input
        setValue("work_title", projectRes.data.work_title || "");


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
  }, [id, isAuthenticated]);

  const handleWorkTitleChange = (e) => {
    const value = e.target.value;
    setWorkTitle(value);
    setValue("work_title", value); // Sync with react-hook-form

    setIsDuplicate(false); // Reset state

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(async () => {
      if (!value.trim() || value.trim() === projectDetails?.work_title) {
        setIsDuplicate(false);
        setChecking(false);
        return;
      }
      setChecking(true);
      try {
        const res = await checkProjectNameApi(value.trim(), id || "");
        setIsDuplicate(res.data.exists);
      } catch (err) {
        setIsDuplicate(false);
      }
      setChecking(false);
    }, 350);
  };


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
    if (isDuplicate) {
      toast.error("Cannot save: Duplicate project title.");
      return;
    }
    if (!slug || !slug.trim()) {
      toast.error("Slug cannot be empty.");
      return;
    }

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

      const formData = new FormData();

      for (const key in updatedData) {
        if (key === "file" || key === "image") {
          if (updatedData[key] && updatedData[key].length > 0) {
            formData.append(key, updatedData[key][0]); // Append file directly
          }
        } else {
          formData.append(key, updatedData[key]);
        }
      }

      await updateProjectApi(id, formData);

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
        <div className="container  text-center">
          <h4>Loading project details...</h4>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container ">
        <h2>Edit Project</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* Work Title */}
          <div className="mb-3">
            <label className="form-label">Work Title</label>
            {/* <input className="form-control" {...register("work_title", { required: true })} /> */}
            <input
              className="form-control"
              {...register("work_title", { required: true })}
              value={workTitle}
              onChange={handleWorkTitleChange}
              autoComplete="off"
            />
            {checking && (
              <span style={{ color: "#888", fontSize: "13px" }}>Checking availability...</span>
            )}
            {isDuplicate && (
              <span style={{ color: "red", fontSize: "14px" }}>
                This project title already exists. Please choose another.
              </span>
            )}
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

          {/* Slug */}
          <div className="mb-3">
            <label className="form-label">Slug</label>
            <div className="d-flex gap-2 mb-2">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleGenerateStandardSlug}>
                Generate Standard Slug
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleGenerateOldSiteSlug}>
                Generate Old Site Slug
              </button>
            </div>
            <input
              className="form-control"
              value={slug}
              onChange={handleSlugInputChange}
              placeholder="Enter slug or use generate buttons"
            />
            {slugMode === "custom" && (
              <small className="text-warning">
                Changing the slug will affect product URLs and SEO. Only modify if you understand the impact.
              </small>
            )}
            <small className="form-text text-muted">
              Slug will be used in product URL for SEO.<br />
              <b>Example:</b> https://cadbull.com/detail/{id}/{slug || "<slug>"}
            </small>
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
              <option value="">Select File Type</option>
              <option value="DWG">DWG</option>
              <option value="DXF">DXF</option>
              <option value="PDF">PDF</option>
              <option value="JPEG">JPEG</option>
              <option value="3d sketchup">SKP (3D Sketchup)</option>
              <option value="3d max">MAX (3D Max)</option>
              <option value="Revit">Revit</option>
              <option value="Photoshop">Photoshop</option>
              <option value="App">App</option>
              <option value="Other">Other</option>
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
            {/* <input type="file" className="form-control" {...register("file")} /> */}
            <input
              type="file"
              className="form-control"
              {...register("file")}
              disabled={userRole === 5}
            />
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

          {/* ✅ ADD THIS NEW FIELD */}
          <div className="mb-3">
            <label className="form-label">Credit Subscription Days</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g., 30"
              {...register("credit_days")}
            />
            <small className="form-text text-muted">
              Enter the number of days to add to the uploader's subscription. Leave blank to make no change.
            </small>
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
          <button type="submit" className="btn btn-primary" disabled={isDuplicate || checking}>
            Save Changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProject;
