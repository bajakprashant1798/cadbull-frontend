import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { addCategoryApi, getCategoriesApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import { checkCategoryNameApi } from "@/service/api";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

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

  // Rich text editor state
  const [description, setDescription] = useState("");

  // React Quill configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const quillFormats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'code-block',
    'align', 'color', 'background',
    'script'
  ];

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

  // Handle description changes from React Quill
  const handleDescriptionChange = (content) => {
    setDescription(content);
    setValue("description", content); // Sync with react-hook-form
  };

  const onSubmit = async (data) => {
    if (isDuplicate) {
      toast.error("Cannot save: Duplicate category name.");
      return;
    }
    try {
      // Include rich text description in submission
      const categoryData = {
        ...data,
        description: description
      };
      await addCategoryApi(categoryData);
      toast.success("Category added successfully!");
      router.push("/admin/categories/all-categories");
    } catch (error) {
      toast.error("Error adding category");
    }
  };

  return (
    <AdminLayout>
      <div className="container ">
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
            <div style={{ backgroundColor: '#fff' }}>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                style={{ 
                  minHeight: '200px',
                  backgroundColor: '#fff'
                }}
                placeholder="Enter category description with rich text formatting..."
              />
            </div>
            <small className="form-text text-muted mt-2 d-block">
              🎨 <strong>Formatting options available:</strong><br/>
              • <strong>Bold</strong>, <em>Italic</em>, <u>Underline</u> text<br/>
              • Headers (H1, H2, H3)<br/>
              • Bullet points and numbered lists<br/>
              • Links to external websites<br/>
              • Text colors and highlighting<br/>
              • Code blocks and quotes
            </small>
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
