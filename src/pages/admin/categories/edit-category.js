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
  const [currentParentId, setCurrentParentId] = useState("0"); // Track current parent_id
  const [parentSearchTerm, setParentSearchTerm] = useState(""); // Search term for parent categories
  const [showParentDropdown, setShowParentDropdown] = useState(false); // Control dropdown visibility
  const typingTimeout = useRef(null);
  const dropdownRef = useRef(null); // Reference for click outside detection

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
          const categoryData = res.data.category;
          reset(categoryData);
          setCategoryName(categoryData.name || "");
          // Set the current parent_id, defaulting to "0" if null/undefined
          setCurrentParentId(categoryData.parent_id?.toString() || "0");
        })
        .catch(() => toast.error("Error fetching category details"));

      // Get ALL categories for parent selection (use high perPage to get all)
      getCategoriesApi("", 1, 1000)
        .then((res) => setParentCategories(res.data.categories))
        .catch(() => toast.error("Error fetching parent categories"));
    }
  }, [id, isAuthenticated, reset]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowParentDropdown(false);
        setParentSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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

  // Filter parent categories based on search term
  const filteredParentCategories = parentCategories
    .filter((cat) => cat.id.toString() !== id) // Exclude current category
    .filter((cat) => 
      cat.name.toLowerCase().includes(parentSearchTerm.toLowerCase())
    );

  // Get selected parent category name for display
  const getSelectedParentName = () => {
    if (currentParentId === "0") return "None";
    const selectedParent = parentCategories.find(cat => cat.id.toString() === currentParentId);
    return selectedParent ? selectedParent.name : "None";
  };

  // Handle parent category selection
  const handleParentSelection = (categoryId, categoryName) => {
    setCurrentParentId(categoryId.toString());
    setValue("parent_id", categoryId.toString());
    setParentSearchTerm("");
    setShowParentDropdown(false);
  };


  return (
    <AdminLayout>
      <div className="container ">
        <h2>Edit Category</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Parent Category</label>
            <div style={{ position: "relative" }} ref={dropdownRef}>
              {/* Selected Parent Display */}
              <div 
                className="form-control d-flex justify-content-between align-items-center" 
                style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}
                onClick={() => setShowParentDropdown(!showParentDropdown)}
              >
                <span>{getSelectedParentName()}</span>
                <span>{showParentDropdown ? "▲" : "▼"}</span>
              </div>

              {/* Searchable Dropdown */}
              {showParentDropdown && (
                <div 
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  {/* Search Input */}
                  <div style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search categories..."
                      value={parentSearchTerm}
                      onChange={(e) => setParentSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {/* None Option */}
                  <div
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      backgroundColor: currentParentId === "0" ? "#e9ecef" : "transparent"
                    }}
                    onClick={() => handleParentSelection(0, "None")}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = currentParentId === "0" ? "#e9ecef" : "transparent"}
                  >
                    <strong>None</strong>
                  </div>

                  {/* Filtered Categories */}
                  {filteredParentCategories.length > 0 ? (
                    filteredParentCategories.map((cat) => (
                      <div
                        key={cat.id}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          backgroundColor: currentParentId === cat.id.toString() ? "#e9ecef" : "transparent"
                        }}
                        onClick={() => handleParentSelection(cat.id, cat.name)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#f8f9fa"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = currentParentId === cat.id.toString() ? "#e9ecef" : "transparent"}
                      >
                        {cat.name}
                        {cat.parent_id !== 0 && (
                          <small style={{ color: "#666", marginLeft: "8px" }}>
                            (Subcategory)
                          </small>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "8px 12px", color: "#666", fontStyle: "italic" }}>
                      No categories found
                    </div>
                  )}
                </div>
              )}

              {/* Hidden input for form submission */}
              <input
                type="hidden"
                {...register("parent_id")}
                value={currentParentId}
              />
            </div>
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
