import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { addProjectApi, getAdminCategoriesWithSubcategories, getCategoriesApi, checkProjectNameApi } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
// import TagsField from "@/components/TagsField";
import debounce from "lodash.debounce";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});


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

// ✅ Validate work title for URL safety
function validateWorkTitle(title) {
  if (!title || !title.trim()) {
    return { isValid: false, message: "Work title cannot be empty." };
  }

  // Check for URL-unsafe characters that would break routing
  const unsafeChars = /[\/\\?#%&=+<>{}[\]|^`"']/;
  if (unsafeChars.test(title)) {
    const foundChars = title.match(/[\/\\?#%&=+<>{}[\]|^`"']/g);
    return { 
      isValid: false, 
      message: `Work title contains URL-unsafe characters: ${[...new Set(foundChars)].join(', ')}. These characters will break the product URL.` 
    };
  }

  // Check for multiple consecutive spaces (can cause slug issues)
  if (/\s{2,}/.test(title)) {
    return { 
      isValid: false, 
      message: "Work title cannot contain multiple consecutive spaces." 
    };
  }

  // Check for leading/trailing spaces
  if (title !== title.trim()) {
    return { 
      isValid: false, 
      message: "Work title cannot start or end with spaces." 
    };
  }

  // Check minimum length
  if (title.trim().length < 3) {
    return { 
      isValid: false, 
      message: "Work title must be at least 3 characters long." 
    };
  }

  // Check maximum length
  if (title.length > 100) {
    return { 
      isValid: false, 
      message: "Work title cannot exceed 100 characters." 
    };
  }

  return { isValid: true, message: "" };
}

// ✅ SEO Length Validation Functions
function validateSEOTitle(title) {
  const length = title ? title.length : 0;
  if (length < 60) {
    return { isValid: false, message: `Title too short for SEO (${length}/60-70 chars). Add more descriptive words.` };
  }
  if (length > 70) {
    return { isValid: false, message: `Title too long for SEO (${length}/60-70 chars). Reduce length for better search results.` };
  }
  return { isValid: true, message: `Perfect SEO length (${length}/60-70 chars)` };
}

// ✅ Removed fixed length validation for description - now allows any length
function validateSEODescription(description) {
  // Strip HTML tags to get plain text length for display only
  const plainText = description ? description.replace(/<[^>]*>/g, '').trim() : '';
  const length = plainText.length;
  // Always return valid - no length restrictions for description
  return { isValid: true, message: `Description length: ${length} characters` };
}

function validateSEOMetaTitle(metaTitle) {
  const length = metaTitle ? metaTitle.length : 0;
  if (length < 50) {
    return { isValid: false, message: `Meta title too short for SEO (${length}/50-60 chars). Add more descriptive words.` };
  }
  if (length > 60) {
    return { isValid: false, message: `Meta title too long for SEO (${length}/50-60 chars). Reduce length for better search results.` };
  }
  return { isValid: true, message: `Perfect SEO length (${length}/50-60 chars)` };
}

function validateSEOMetaDescription(metaDescription) {
  const length = metaDescription ? metaDescription.length : 0;
  if (length < 150) {
    return { isValid: false, message: `Meta description too short for SEO (${length}/150-160 chars). Add more details.` };
  }
  if (length > 160) {
    return { isValid: false, message: `Meta description too long for SEO (${length}/150-160 chars). Reduce content for better search results.` };
  }
  return { isValid: true, message: `Perfect SEO length (${length}/150-160 chars)` };
}


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
  // const [tags, setTags] = useState([]);
  const [tagsCsv, setTagsCsv] = useState("");    // CSV tags as-is
  const [submitting, setSubmitting] = useState(false); // lock while uploading
  
  const [workTitle, setWorkTitle] = useState(""); // Controlled input for title
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [checking, setChecking] = useState(false);
  const [titleValidation, setTitleValidation] = useState({ isValid: true, message: "" });
  const typingTimeout = useRef(null);

  // ✅ SEO Validation States
  const [seoTitleValidation, setSeoTitleValidation] = useState({ isValid: true, message: "" });
  const [seoDescriptionValidation, setSeoDescriptionValidation] = useState({ isValid: true, message: "" }); // Always valid now - no length restrictions
  const [seoMetaTitleValidation, setSeoMetaTitleValidation] = useState({ isValid: true, message: "" });
  const [seoMetaDescriptionValidation, setSeoMetaDescriptionValidation] = useState({ isValid: true, message: "" });

  // Watch form fields for SEO validation
  const watchMetaTitle = watch("meta_title", "");
  const watchMetaDescription = watch("meta_description", "");

  // Rich text editor state
  const [description, setDescription] = useState("");

  const [slug, setSlug] = useState("");         // Slug input
  const [slugMode, setSlugMode] = useState("standard"); // "standard", "old", or "custom"

  // ✅ Add user selection state
  const [selectedUserId, setSelectedUserId] = useState("");

  // ✅ Predefined users list (same as old site)
  const predefinedUsers = [
    { id: 7481, name: 'Eiz Luna' },
    { id: 7491, name: 'Fernando Zapata' },
    { id: 7492, name: 'Harriet Burrows' },
    { id: 7494, name: 'Jafania Waxy' },
    { id: 7495, name: 'Jong kelly' },
    { id: 7497, name: 'Liam White' },
    { id: 7499, name: 'Neha Mishra' },
    { id: 7500, name: 'Niraj Yadav' },
    { id: 7502, name: 'Umar mehmood' },
    { id: 7503, name: 'Wang Fang' },
    { id: 187903, name: 'Priyanka' },
    { id: 188335, name: 'Zalak' },
    { id: 188338, name: 'K.H.J' },
    { id: 217174, name: 'Manveen' },
    { id: 221223, name: 'Piyap' },
    { id: 223239, name: 'apoorva' },
    { id: 223249, name: 'viddhi' },
    { id: 332154, name: 'Dipika' },
    { id: 332155, name: 'Nilam' },
    { id: 332156, name: 'Poonam' },
    { id: 332157, name: 'Jiya' },
    { id: 332158, name: 'Chirag' },
    { id: 332159, name: 'Komal' },
    { id: 332160, name: 'Vaishali' },
    { id: 420447, name: 'Justine' },
    { id: 420455, name: 'Marvel' },
    { id: 420459, name: 'Robert' },
    { id: 420468, name: 'Keval' },
    { id: 420471, name: 'Parth' },
    { id: 420473, name: 'Dhara' },
    { id: 420475, name: 'Guptil' },
    { id: 420477, name: 'Ravindra' },
    { id: 420481, name: 'Forel' },
    { id: 420487, name: 'Vaas' },
    { id: 1135846, name: 'Rashmi' },
    { id: 784758, name: 'Akanksha' },
    { id: 1102609, name: 'Sethupathi' },
    { id: 1418808, name: 'Meera' },
    { id: 1418820, name: 'Pavithra' },
    { id: 1418824, name: 'Rachna Jilka' }
  ];

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
      // toggle to add extra line breaks when pasting HTML:
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

  // ✅ Fetch Categories on Component Mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!workTitle && slug === "") {
      setSlug(""); // empty
      setSlugMode("standard");
    }
  }, []);

  // ✅ Watch meta title changes for SEO validation
  useEffect(() => {
    const seoValidation = validateSEOMetaTitle(watchMetaTitle);
    setSeoMetaTitleValidation(seoValidation);
  }, [watchMetaTitle]);

  // ✅ Watch meta description changes for SEO validation
  useEffect(() => {
    const seoValidation = validateSEOMetaDescription(watchMetaDescription);
    setSeoMetaDescriptionValidation(seoValidation);
  }, [watchMetaDescription]);

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
  

  // ✅ Handle Description Character Count (for legacy textarea)
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    setDescriptionCount(250 - text.length);
  };

  // Handle description changes from React Quill
  const handleQuillDescriptionChange = (content) => {
    setDescription(content);
    setValue("description", content); // Sync with react-hook-form
    
    // ✅ SEO Length validation for description
    const seoValidation = validateSEODescription(content);
    setSeoDescriptionValidation(seoValidation);
  };

  const checkDuplicateTitle = debounce(async (value) => {
    if (!value.trim()) {
      setIsDuplicate(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    try {
      const res = await checkProjectNameApi(value.trim());
      setIsDuplicate(res.data.exists);
    } catch (err) {
      setIsDuplicate(false);
    }
    setChecking(false);
  }, 400); // 400ms debounce

  const handleWorkTitleChange = (e) => {
    const value = e.target.value;
    setWorkTitle(value);
    setValue("work_title", value); // Sync with react-hook-form

    // ✅ Reset states
    setIsDuplicate(false);
    setTitleValidation({ isValid: true, message: "" });

    // ✅ Validate work title for URL safety
    const validation = validateWorkTitle(value);
    setTitleValidation(validation);

    // ✅ SEO Length validation for title
    const seoValidation = validateSEOTitle(value);
    setSeoTitleValidation(seoValidation);

    // ✅ Auto-generate slug only if title is valid
    if (validation.isValid && (slugMode === "standard" || slug.trim() === "")) {
      setSlug(standardSlugify(value));
    }

    // ✅ Only check for duplicates if title is valid
    if (validation.isValid && value.trim()) {
      checkDuplicateTitle(value); // Use debounced function
    }
  };

  useEffect(() => {
    return () => {
      checkDuplicateTitle.cancel();
    };
  }, []);


  // const handleWorkTitleChange = (e) => {
  //   const value = e.target.value;
  //   setWorkTitle(value);
  //   setValue("work_title", value); // Sync with react-hook-form
    
  //   setIsDuplicate(false);

  //   if (slugMode === "standard" || slug.trim() === "") {
  //     setSlug(standardSlugify(value));
  //   }
  //   if (typingTimeout.current) clearTimeout(typingTimeout.current);
    

  //   typingTimeout.current = setTimeout(async () => {
  //     if (!value.trim()) {
  //       setIsDuplicate(false);
  //       setChecking(false);
  //       return;
  //     }
  //     setChecking(true);
  //     try {
  //       const res = await checkProjectNameApi(value.trim());
  //       setIsDuplicate(res.data.exists);
  //     } catch (err) {
  //       setIsDuplicate(false);
  //     }
  //     setChecking(false);
  //   }, 350);
  // };

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

  // ✅ Submit Form
  const onSubmit = async (data) => {
    if (isDuplicate) {
      toast.error("Cannot save: Duplicate project title.");
      return;
    }
    if (!slug || !slug.trim()) {
      toast.error("Slug cannot be empty.");
      return;
    }
    if (!selectedUserId) {
      toast.error("Please select a username.");
      return;
    }

    // ✅ Check all SEO validations before submitting (excluding description which now has no restrictions)
    if (!seoTitleValidation.isValid) {
      toast.error("Title length does not meet SEO requirements (60-70 characters).");
      return;
    }
    // Description validation removed - no length restrictions
    if (!seoMetaTitleValidation.isValid) {
      toast.error("Meta title length does not meet SEO requirements (50-60 characters).");
      return;
    }
    if (!seoMetaDescriptionValidation.isValid) {
      toast.error("Meta description length does not meet SEO requirements (150-160 characters).");
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();

      // data.tags = tags.join(",");
      // tags as plain CSV
      const tags = tagsCsv;

      // console.log("🚀 Form Data BEFORE Append:", data);
      console.log("🚀 Form BEFORE Append:", data);

      // ✅ Explicitly append all form fields
      formData.append("work_title", data.work_title || "");
      formData.append("description", description || ""); // Use rich text description
      formData.append("meta_title", data.meta_title || "");
      formData.append("meta_description", data.meta_description || "");
      // In formData append:
      formData.append("slug", slug);
      // formData.append("tags", data.tags || "");
      formData.append("tags", tags || "");
      formData.append("file_type", data.file_type || "");
      // formData.append("category_id", data.category_id || "");
      // formData.append("subcategory_id", data.subcategory_id ? data.subcategory_id : null);
      
      // coerce numeric-ish fields so backend never gets '' for INT columns
      const categoryId = data.category_id ? Number(data.category_id) : null;
      const subcategoryId = data.subcategory_id ? Number(data.subcategory_id) : null;
      formData.append("category_id", categoryId);
      if (subcategoryId !== null) formData.append("subcategory_id", subcategoryId);
      // popular defaults to 0 (regular project) on create
      formData.append("popular", 0);
      formData.append("type", data.type || "Free");
      
      // ✅ Add selected user_id
      // formData.append("user_id", selectedUserId);
      formData.append("user_id", Number(selectedUserId));

      // ✅ Ensure file & image exist before appending
      if (data.file && data.file.length > 0) {
          const file = data.file[0];
          
          // Check file size (1GB limit)
          if (file.size > 1024 * 1024 * 1024) {
            toast.error("File too large! Maximum size is 1GB. Please compress or reduce file size.");
            setSubmitting(false);
            return;
          }
          
          formData.append("file", file);
      } else {
          toast.error("Please upload a ZIP file.");
          setSubmitting(false);
          return;
      }

      if (data.image && data.image.length > 0) {
          const image = data.image[0];
          
          // Check image size (10MB limit)
          if (image.size > 10 * 1024 * 1024) {
            toast.error("Image too large! Maximum size is 10MB. Please compress the image.");
            setSubmitting(false);
            return;
          }
          
          formData.append("image", image);
      } else {
          toast.error("Please upload an Image.");
          setSubmitting(false);
          return;
      }

      console.log("✅ FormData AFTER Append:", [...formData.entries()]);

      await addProjectApi(formData);
      toast.success("Project added successfully!");
      reset();
      setSelectedUserId(""); // Reset user selection
      router.push("/admin/projects/view-projects");
    } catch (error) {
        console.error("❌ Error Adding Project:", error.response?.data || error.message);
        
        // Handle specific error types
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          toast.error("Upload timeout - File too large or connection slow. Try with a smaller file or check your internet connection.");
        } else if (error.response?.status === 413) {
          toast.error("File too large - Please reduce file size and try again.");
        } else if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Error adding project. Please try again.");
        }
    } finally {
       setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container ">
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          
          {/* ✅ Choose Username */}
          <div className="mb-3">
            <label className="form-label">Choose Username *</label>
            <select 
              className="form-control" 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">Select Username</option>
              {predefinedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} (ID: {user.id})
                </option>
              ))}
            </select>
            <small className="form-text text-muted">
              This project will be attributed to the selected user, not the admin.
            </small>
          </div>

          {/* Work Title */}
          <div className="mb-3">
            <label className="form-label">Work Title *</label>
            <input
              className="form-control"
              {...register("work_title", { required: true })}
              value={workTitle}
              onChange={handleWorkTitleChange}
              autoComplete="off"
              placeholder="Enter project title (will be used in URL)"
            />
            <small className="form-text text-muted">
              ⚠️ <strong>Important:</strong> Avoid special characters like / \ ? # % & = + &lt; &gt; as they will break the product URL.
              <br />
              <strong>Good example:</strong> "Modern House Design 2024"
              <br />
              <strong>Bad example:</strong> "House/Villa Design 50% Off"
            </small>
            {checking && (
              <div style={{ color: "#888", fontSize: "13px" }}>Checking availability...</div>
            )}
            {!titleValidation.isValid && (
              <div style={{ color: "red", fontSize: "14px" }}>
                {titleValidation.message}
              </div>
            )}
            {isDuplicate && titleValidation.isValid && (
              <div style={{ color: "red", fontSize: "14px" }}>
                This project title already exists. Please choose another.
              </div>
            )}
            {/* ✅ SEO Length Validation */}
            <div style={{ 
              color: seoTitleValidation.isValid ? "green" : "red", 
              fontSize: "13px",
              fontWeight: "500",
              marginTop: "4px"
            }}>
              📊 SEO Title Length: {seoTitleValidation.message}
            </div>
          </div>

          {/* Description with Rich Text Editor */}
          <div className="mb-3">
            <label className="form-label">Description *</label>
            <div style={{ backgroundColor: '#fff' }}>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={handleQuillDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                style={{ 
                  minHeight: '200px',
                  backgroundColor: '#fff'
                }}
                placeholder="Enter project description with rich text formatting..."
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
            {/* ✅ Description Character Count (No length restrictions) */}
            <div style={{ 
              color: "green", 
              fontSize: "13px",
              fontWeight: "500",
              marginTop: "4px"
            }}>
              📊 {seoDescriptionValidation.message}
            </div>
          </div>

          {/* Meta Title */}
          <div className="mb-3">
            <label className="form-label">Meta Title</label>
            <input 
              className="form-control" 
              {...register("meta_title")} 
              placeholder="Enter SEO meta title (50-60 characters)"
            />
            {/* ✅ SEO Length Validation for Meta Title */}
            <div style={{ 
              color: seoMetaTitleValidation.isValid ? "green" : "red", 
              fontSize: "13px",
              fontWeight: "500",
              marginTop: "4px"
            }}>
              📊 SEO Meta Title Length: {seoMetaTitleValidation.message}
            </div>
          </div>

          {/* Meta Description */}
          <div className="mb-3">
            <label className="form-label">Meta Description</label>
            <textarea 
              className="form-control" 
              {...register("meta_description")}
              rows="3"
              placeholder="Enter SEO meta description (150-160 characters)"
            />
            {/* ✅ SEO Length Validation for Meta Description */}
            <div style={{ 
              color: seoMetaDescriptionValidation.isValid ? "green" : "red", 
              fontSize: "13px",
              fontWeight: "500",
              marginTop: "4px"
            }}>
              📊 SEO Meta Description Length: {seoMetaDescriptionValidation.message}
            </div>
          </div>

          {/* Slug */}
          {/* Slug */}
          <div className="mb-3">
            <label className="form-label">Slug</label>
            <div className="d-flex gap-2 mb-2">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleGenerateStandardSlug}>
                Generate Standard Slug
              </button>
            </div>
            <input
              className="form-control"
              value={slug}
              onChange={handleSlugInputChange}
              placeholder="Enter slug or use generate"
              required
            />
            <small className="form-text text-muted">
              Slug will be used in product URL for SEO. <br />
              <b>Example:</b> https://cadbull.com/detail/123/<span className="text-primary">{slug || "<slug>"}</span>
            </small>
          </div>



          {/* Tags */}
          {/* <div className="mb-3">
            <label className="form-label">Tags</label>
            <input className="form-control" {...register("tags")} />
          </div> */}
          {/* <TagsField value={tags} onChange={setTags} /> */}
          {/* Tags (comma-separated, saved exactly as typed) */}
          <div className="mb-3">
            <label className="form-label">Tags *</label>
            <textarea
              className="form-control"
              rows={2}
              value={tagsCsv}
              onChange={(e) => setTagsCsv(e.target.value)}
              placeholder="PVC backrest,CAD drawing,Sittem 440 CAD design,PVC backrest AutoCAD,Sittem 440 premium technical drawing,seating part CAD file"
              maxLength={500}            // your DB column is VARCHAR(500)
              disabled={submitting}
            />
            <small className="form-text text-muted">
              Paste all tags separated by commas. We’ll save exactly what you type.
            </small>
          </div>

          {/* File Type */}
          <div className="mb-3">
            <label className="form-label">File Type</label>
            <select className="form-control" {...register("file_type", { required: true })}>
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
            <label className="form-label">Upload Zip File *</label>
            <input 
              type="file" 
              className="form-control" 
              {...register("file", { required: true })} 
              accept=".zip,.rar,.tar,.gz"
            />
            <small className="form-text text-muted">
              📁 Maximum file size: 1GB. Supported formats: ZIP, RAR, TAR, GZ
            </small>
          </div>

          {/* Upload Image */}
          <div className="mb-3">
            <label className="form-label">Upload Image *</label>
            <input 
              type="file" 
              className="form-control" 
              {...register("image", { required: true })} 
              accept="image/*"
            />
            <small className="form-text text-muted">
              🖼️ Maximum file size: 10MB. Supported formats: JPG, PNG, GIF, WEBP
            </small>
          </div>

          {/* Submit Button */}
          {/* <button type="submit" className="btn btn-primary" disabled={isDuplicate || checking || !selectedUserId || !titleValidation.isValid}>
            Upload
          </button> */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              submitting || 
              isDuplicate || 
              checking || 
              !selectedUserId || 
              !titleValidation.isValid ||
              !seoTitleValidation.isValid ||
              // !seoDescriptionValidation.isValid || // Removed - description has no length restrictions
              !seoMetaTitleValidation.isValid ||
              !seoMetaDescriptionValidation.isValid
            }
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>

          {/* ✅ SEO Requirements Summary (excluding description) */}
          {(!seoTitleValidation.isValid || !seoMetaTitleValidation.isValid || !seoMetaDescriptionValidation.isValid) && (
            <div className="mt-3 p-3" style={{ backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "4px" }}>
              <h6 style={{ color: "#856404", marginBottom: "8px" }}>⚠️ SEO Requirements Not Met</h6>
              <small style={{ color: "#856404" }}>
                Please ensure all fields meet SEO length requirements before uploading:
                <ul style={{ marginTop: "8px", marginBottom: "0" }}>
                  <li>Title: 60-70 characters</li>
                  <li>Description: No length restrictions (write as much as needed)</li>
                  <li>Meta Title: 50-60 characters</li>
                  <li>Meta Description: 150-160 characters</li>
                </ul>
              </small>
            </div>
          )}

        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProject;
