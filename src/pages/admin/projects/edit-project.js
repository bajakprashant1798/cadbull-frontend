import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import * as api from "@/service/api";
import { toast } from "react-toastify";
import { getProjectByIdApi, updateProjectApi, getAdminCategoriesWithSubcategories, checkProjectNameApi, generateAIContent } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});
// import TagsInput from "react-tagsinput";
// import "react-tagsinput/react-tagsinput.css"; // ✅ Import default styles

// function mysqlUtcToDatetimeLocalIST(mysqlUtc) {
//   if (!mysqlUtc) return "";
//   const utc = new Date(mysqlUtc.replace(" ", "T") + "Z");
//   const ist = new Date(utc.getTime() + 330 * 60 * 1000); // UTC+05:30
//   const pad = (n) => String(n).padStart(2, "0");
//   const yyyy = ist.getFullYear();
//   const mm = pad(ist.getMonth() + 1);
//   const dd = pad(ist.getDate());
//   const HH = pad(ist.getHours());
//   const MM = pad(ist.getMinutes());
//   return `${yyyy}-${mm}-${dd}T${HH}:${MM}`;
// }
function mysqlUtcToDatetimeLocalIST(mysqlUtc) {
  if (!mysqlUtc) return "";
  try {
    const isoish = String(mysqlUtc).replace(" ", "T");
    const utc = new Date(isoish.endsWith("Z") ? isoish : isoish + "Z");
    if (isNaN(utc.getTime())) return "";
    const ist = new Date(utc.getTime() + 330 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${ist.getFullYear()}-${pad(ist.getMonth() + 1)}-${pad(ist.getDate())}T${pad(ist.getHours())}:${pad(ist.getMinutes())}:${pad(ist.getSeconds())}`;
  } catch {
    return "";
  }
}

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

const EditProject = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const dispatch = useDispatch();
  // const { register, handleSubmit, setValue, watch } = useForm();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      popular: "0",
      status: "1",
    },
  });


  const router = useRouter();
  const { id } = router.query;

  const [workTitle, setWorkTitle] = useState(""); // Controlled input
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [checking, setChecking] = useState(false);
  const [titleValidation, setTitleValidation] = useState({ isValid: true, message: "" });
  const typingTimeout = useRef(null); // You need to import useRef!
  const [publishAtIst, setPublishAtIst] = useState(""); // "YYYY-MM-DDTHH:MM"

  // ✅ SEO Validation States
  const [seoTitleValidation, setSeoTitleValidation] = useState({ isValid: true, message: "" });
  const [seoDescriptionValidation, setSeoDescriptionValidation] = useState({ isValid: true, message: "" }); // Always valid now - no length restrictions
  const [seoMetaTitleValidation, setSeoMetaTitleValidation] = useState({ isValid: true, message: "" });
  const [seoMetaDescriptionValidation, setSeoMetaDescriptionValidation] = useState({ isValid: true, message: "" });

  // Watch form fields for SEO validation
  const watchMetaTitle = watch("meta_title", "");
  const watchMetaDescription = watch("meta_description", "");
  // Watch status to know if we should skip SEO/slug checks
  const statusWatch = watch("status", "1"); // "1"=Approved, "2"=Rejected
  const isRejected = String(statusWatch) === "2";

  const user = useSelector((store) => store.logininfo.user);
  const userRole = user?.role;


  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  // const [tags, setTags] = useState([]);
  const [tagsCsv, setTagsCsv] = useState("");   // comma-separated tags as-is
  const [submitting, setSubmitting] = useState(false); // lock UI while saving

  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [slug, setSlug] = useState("");         // Slug input
  const [slugMode, setSlugMode] = useState("standard"); // "standard", "old", or "custom"

  // Rich text editor state
  const [description, setDescription] = useState("");

  // React Quill configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
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

  // --- Add near other useState hooks ---
  const [newImages, setNewImages] = useState([]); // File[] selected but not yet uploaded
  const [uploadingImages, setUploadingImages] = useState(false);

  // --- Allowed image types (adjust if needed) ---
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
  ];

  // Pick files
  const handleSelectNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // filter invalids + 10MB cap per image
    const filtered = [];
    for (const f of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
        toast.error(`Unsupported type: ${f.name}`);
        continue;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`Too large (>10MB): ${f.name}`);
        continue;
      }
      filtered.push(f);
    }
    if (filtered.length) {
      setNewImages((prev) => [...prev, ...filtered]);
    }
    // reset input so same file can be re-picked later
    e.target.value = "";
  };

  // Remove a not-yet-uploaded image from the preview list
  const removeNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveNewImageUp = (idx) => {
    if (idx <= 0) return;
    setNewImages((prev) => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const moveNewImageDown = (idx) => {
    setNewImages((prev) => {
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
  };

  // Upload selected images
  const uploadNewImages = async () => {
    if (!newImages.length) return;
    if (!projectDetails?.id) {
      toast.error("Project not loaded yet.");
      return;
    }

    try {
      setUploadingImages(true);

      const fd = new FormData();
      // backend usually expects "images[]" (or "images"); keep both for safety
      newImages.forEach((file) => fd.append("images", file));
      // If your backend expects "image" for a single file, it should also accept array.
      // If it ONLY accepts `image`, do: newImages.forEach(f => fd.append("image", f))

      const res = await api.addProjectImagesApi(projectDetails.id, fd);

      // Normalize response: assume it returns an array of rows like
      // [{ id, image, position }, ...]
      const created = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      if (!created.length) {
        toast.error("Upload finished but no images returned.");
      } else {
        // Merge into gallery at the end
        setProjectDetails((prev) => ({
          ...prev,
          images: [...(prev?.images ?? []), ...created].sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999)),
        }));
        toast.success(`Uploaded ${created.length} image(s).`);
        setNewImages([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images.");
    } finally {
      setUploadingImages(false);
    }
  };

  const [generatingAI, setGeneratingAI] = useState(false);

  const handleAIContentGeneration = async () => {
    if (newImages.length === 0) {
      toast.error("Please select a NEW image to generate content.");
      return;
    }

    try {
      setGeneratingAI(true);
      const formData = new FormData();
      formData.append("image", newImages[0]); // Send the first new image

      const res = await generateAIContent(formData);
      const data = res.data;

      console.log("AI Response:", data);

      if (data) {
        // 1. Work Title
        if (data.work_title) {
          handleWorkTitleChange({ target: { value: data.work_title } });
        }

        // 2. Description
        if (data.description) {
          handleDescriptionChange(data.description);
        }

        // 3. Meta Title
        if (data.meta_title) {
          setValue("meta_title", data.meta_title);
        }

        // 4. Meta Description
        if (data.meta_description) {
          setValue("meta_description", data.meta_description);
        }

        // 5. Keywords (Tags)
        if (data.keywords) {
          setTagsCsv(data.keywords);
        }

        toast.success("Content generated successfully!");
      }

    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setGeneratingAI(false);
    }
  };

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
        // Handle both new and old API formats
        const projectData = projectRes.data?.data || projectRes.data;

        if (!projectData) {
          throw new Error("Invalid project details response");
        }

        // Set Form Data from projectRes.data
        // Object.keys(projectRes.data).forEach((key) => {
        //   // ✅ ADD THIS CONDITION to skip setting the credit_days value
        //   console.log(projectRes.data, "product data log");

        //   if (key !== 'credit_days') {
        //     setValue(key, projectRes.data[key] || "");
        //   }
        // });
        Object.keys(projectData).forEach((key) => {
          if (key === 'credit_days') return;          // keep your special handling
          setValue(key, projectData[key] ?? "");  // preserves 0
        });

        // Ensure selects get proper string values
        setValue("popular", String(projectData.popular ?? 0)); // "0" or "1"
        setValue("status", String(projectData.status ?? 1)); // "1" or "2"
        setValue("category_id", String(projectData.category_id ?? ""));
        setValue(
          "subcategory_id",
          projectData.subcategory_id != null ? String(projectData.subcategory_id) : ""
        );

        // ✅ Set Categories
        setCategories(categoriesRes.data);

        // setSlug(projectRes.data.slug || ""); // set initial slug
        // setSlugMode("custom"); // Or infer from slug format
        let initialSlug = "";
        let initialSlugMode = "standard";
        if (projectData.slug && projectData.slug.trim() !== "") {
          initialSlug = projectData.slug;
          initialSlugMode = "custom";
        } else if (projectData.work_title) {
          initialSlug = oldSiteSlugify(projectData.work_title);
          initialSlugMode = "old";
        }
        setSlug(initialSlug);
        setSlugMode(initialSlugMode);

        // setPublishAtIst(mysqlUtcToDatetimeLocalIST(projectRes.data.publish_at));
        setPublishAtIst(projectData.publish_at_ist || "");

        //// ✅ Set Form Data
        // Object.keys(projectRes.data).forEach((key) => setValue(key, projectRes.data[key] || ""));
        // setTags(projectRes.data.tags ? projectRes.data.tags.split(",") : []);
        setTagsCsv(projectData.tags || "");

        // Set description for React Quill
        setDescription(projectData.description || "");

        setProjectDetails(projectData); // For comparing on duplicate check
        setWorkTitle(projectData.work_title || ""); // Set controlled input
        setValue("work_title", projectData.work_title || "");

        // ✅ Initialize SEO validations with existing data
        setSeoTitleValidation(validateSEOTitle(projectData.work_title || ""));
        setSeoDescriptionValidation(validateSEODescription(projectData.description || ""));
        setSeoMetaTitleValidation(validateSEOMetaTitle(projectData.meta_title || ""));
        setSeoMetaDescriptionValidation(validateSEOMetaDescription(projectData.meta_description || ""));


        // ✅ Set Category & Subcategory
        if (projectData.category_id) {
          const selectedCategory = categoriesRes.data.find((cat) => cat.id === Number(projectData.category_id));
          setSubcategories(selectedCategory?.project_sub_categories || []);
          setValue("subcategory_id", projectData.subcategory_id || ""); // ✅ Handle null subcategory
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

  // ✅ Watch meta title changes for SEO validation
  useEffect(() => {
    // const seoValidation = validateSEOMetaTitle(watchMetaTitle);
    // setSeoMetaTitleValidation(seoValidation);
    if (isRejected) {
      setSeoMetaTitleValidation({ isValid: true, message: "Skipped (Rejected)" });
    } else {
      setSeoMetaTitleValidation(validateSEOMetaTitle(watchMetaTitle));
    }
  }, [watchMetaTitle, isRejected]);

  // ✅ Watch meta description changes for SEO validation
  useEffect(() => {
    // const seoValidation = validateSEOMetaDescription(watchMetaDescription);
    // setSeoMetaDescriptionValidation(seoValidation);
    if (isRejected) {
      setSeoMetaDescriptionValidation({ isValid: true, message: "Skipped (Rejected)" });
    } else {
      setSeoMetaDescriptionValidation(validateSEOMetaDescription(watchMetaDescription));
    }
  }, [watchMetaDescription, isRejected]);


  // 🟢 Move Up
  const handleMoveUp = async (imageId) => {
    try {
      const imgs = [...(projectDetails?.images ?? [])];
      const i = imgs.findIndex((x) => x.id === imageId);
      if (i <= 0) return;

      [imgs[i - 1], imgs[i]] = [imgs[i], imgs[i - 1]];
      setProjectDetails((prev) => ({ ...prev, images: imgs }));

      await api.reorderProjectImagesApi(projectDetails.id, imgs.map((x) => x.id));
    } catch (err) {
      toast.error("Couldn’t move image up.");
      console.error(err);
    }
  };

  // 🟢 Move Down
  const handleMoveDown = async (imageId) => {
    try {
      const imgs = [...(projectDetails?.images ?? [])];
      const i = imgs.findIndex((x) => x.id === imageId);
      if (i < 0 || i >= imgs.length - 1) return;

      [imgs[i], imgs[i + 1]] = [imgs[i + 1], imgs[i]];
      setProjectDetails((prev) => ({ ...prev, images: imgs }));

      await api.reorderProjectImagesApi(projectDetails.id, imgs.map((x) => x.id));
    } catch (err) {
      toast.error("Couldn’t move image down.");
      console.error(err);
    }
  };

  // 🗑️ Delete
  const handleDelete = async (imageId) => {
    try {
      if (!confirm("Delete this image?")) return;

      await api.deleteProjectImageApi(imageId);

      setProjectDetails((prev) => ({
        ...prev,
        images: (prev?.images ?? []).filter((x) => x.id !== imageId),
      }));

      toast.success("Image deleted.");
    } catch (err) {
      toast.error("Couldn’t delete image.");
      console.error(err);
    }
  };


  const handleWorkTitleChange = (e) => {
    const value = e.target.value;
    setWorkTitle(value);
    setValue("work_title", value); // Sync with react-hook-form

    // If rejected, skip all validation/duplicate checks UI-wise
    if (isRejected) {
      setIsDuplicate(false);
      setChecking(false);
      setTitleValidation({ isValid: true, message: "" });
      setSeoTitleValidation({ isValid: true, message: "Skipped (Rejected)" });
      return;
    }

    // ✅ Reset states
    setIsDuplicate(false);
    setTitleValidation({ isValid: true, message: "" });

    // ✅ Validate work title for URL safety
    const validation = validateWorkTitle(value);
    setTitleValidation(validation);

    // ✅ SEO Length validation for title
    const seoValidation = validateSEOTitle(value);
    setSeoTitleValidation(seoValidation);

    // ✅ Only check for duplicates if title is valid
    if (validation.isValid) {
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
    } else {
      // Clear duplicate check if title is invalid
      setChecking(false);
      setIsDuplicate(false);
    }
  };


  // ✅ Handle Category Selection
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setValue("category_id", categoryId);
    setValue("subcategory_id", ""); // ✅ Reset subcategory when changing category

    const selectedCategory = categories.find((cat) => cat.id === Number(categoryId));
    setSubcategories(selectedCategory?.project_sub_categories || []);
  };

  // Handle description changes from React Quill
  const handleDescriptionChange = (content) => {
    setDescription(content);
    setValue("description", content); // Sync with react-hook-form

    // ✅ SEO Length validation for description
    const seoValidation = validateSEODescription(content);
    setSeoDescriptionValidation(seoValidation);
  };

  // ✅ Submit Form with Updated Data
  const onSubmit = async (data) => {
    // Recompute in the handler just in case
    const isRejected = String(data.status ?? "1") === "2";
    // Skip duplicate-title + SEO + slug checks if Rejected
    if (!isRejected) {
      if (isDuplicate) {
        toast.error("Cannot save: Duplicate project title.");
        return;
      }
      if (!slug || !slug.trim()) {
        toast.error("Slug cannot be empty.");
        return;
      }
      if (!seoTitleValidation.isValid) {
        toast.error("Title length does not meet SEO requirements (60-70 characters).");
        return;
      }
      if (!seoMetaTitleValidation.isValid) {
        toast.error("Meta title length does not meet SEO requirements (50-60 characters).");
        return;
      }
      if (!seoMetaDescriptionValidation.isValid) {
        toast.error("Meta description length does not meet SEO requirements (150-160 characters).");
        return;
      }
    }

    // if (isDuplicate) {
    //   toast.error("Cannot save: Duplicate project title.");
    //   return;
    // }
    // if (!slug || !slug.trim()) {
    //   toast.error("Slug cannot be empty.");
    //   return;
    // }

    // // ✅ Check all SEO validations before submitting (excluding description which now has no restrictions)
    // if (!seoTitleValidation.isValid) {
    //   toast.error("Title length does not meet SEO requirements (60-70 characters).");
    //   return;
    // }
    // // Description validation removed - no length restrictions
    // if (!seoMetaTitleValidation.isValid) {
    //   toast.error("Meta title length does not meet SEO requirements (50-60 characters).");
    //   return;
    // }
    // if (!seoMetaDescriptionValidation.isValid) {
    //   toast.error("Meta description length does not meet SEO requirements (150-160 characters).");
    //   return;
    // }

    try {
      setSubmitting(true);
      const updatedData = {
        work_title: data.work_title,
        description: description, // Use description from React Quill state
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        tags: tagsCsv,
        file_type: data.file_type,
        // category_id: data.category_id,
        // subcategory_id: data.subcategory_id || null, // ✅ Handle null subcategory
        category_id: data.category_id && data.category_id !== "" ? data.category_id : null,
        subcategory_id: data.subcategory_id && data.subcategory_id !== "" ? data.subcategory_id : null,
        type: data.type,
        status: data.status !== undefined && data.status !== "" ? Number(data.status) : 1,
        popular: data.popular !== undefined && data.popular !== "" ? Number(data.popular) : 0,
        credit_days: data.credit_days,
        slug: slug, // Use slug from state
      };

      // ✅ Append files if they exist
      if (data.file && data.file.length > 0) {
        const file = data.file[0];

        // Check file size (1GB limit)
        if (file.size > 1024 * 1024 * 1024) {
          toast.error("File too large! Maximum size is 1GB. Please compress or reduce file size.");
          setSubmitting(false);
          return;
        }

        updatedData.file = data.file;
      }
      if (data.image && data.image.length > 0) {
        const image = data.image[0];

        // Check image size (10MB limit)
        if (image.size > 10 * 1024 * 1024) {
          toast.error("Image too large! Maximum size is 10MB. Please compress the image.");
          setSubmitting(false);
          return;
        }

        updatedData.image = data.image;
      }
      // If credit_days is blank, don’t send it (prevents "" → INT issues)
      if (updatedData.credit_days === "" || updatedData.credit_days == null) {
        delete updatedData.credit_days;
      }

      console.log("🚀 Sending Updated Project Data:", updatedData);

      const formData = new FormData();

      // for (const key in updatedData) {
      //   if (key === "file" || key === "image") {
      //     if (updatedData[key] && updatedData[key].length > 0) {
      //       formData.append(key, updatedData[key][0]); // Append file directly
      //     }
      //   } else {
      //     formData.append(key, updatedData[key]);
      //   }
      // }
      for (const key in updatedData) {
        const val = updatedData[key];
        if (val === null || val === undefined) continue; // don't append nulls (backend will treat as NULL)
        if (key === "file" || key === "image") {
          if (val && val.length > 0) formData.append(key, val[0]);
        } else {
          formData.append(key, val);
        }
      }

      // if (publishAtIst) {
      //   formData.append("publish_at_ist", publishAtIst);
      // } else {
      //   // If you want clearing the input to remove the schedule in DB:
      //   // formData.append("publish_at_ist", "");
      // }
      formData.append("publish_at_ist", publishAtIst || "");

      await updateProjectApi(id, formData);

      toast.success("Project updated successfully!");
      router.push("/admin/projects/view-projects");
    } catch (error) {
      console.error("❌ Error updating project:", error.response?.data || error.message);

      // Handle specific error types
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error("Update timeout - File too large or connection slow. Try with a smaller file or check your internet connection.");
      } else if (error.response?.status === 413) {
        toast.error("File too large - Please reduce file size and try again.");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error updating project. Please try again.");
      }
    } finally {
      setSubmitting(false);
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
            <label className="form-label">Work Title *</label>
            <input
              className="form-control"
              // {...register("work_title", { required: true })}
              {...register("work_title", { required: !isRejected })}
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
            <label className="form-label">Description</label>
            <div style={{ backgroundColor: '#fff' }}>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                className="quill-resize"
                // style={{ 
                //   minHeight: '200px',
                //   backgroundColor: '#fff'
                // }}
                placeholder="Enter project description with rich text formatting..."
              />
            </div>
            <small className="form-text text-muted mt-2 d-block">
              🎨 <strong>Formatting options available:</strong><br />
              • <strong>Bold</strong>, <em>Italic</em>, <u>Underline</u> text<br />
              • Headers (H1, H2, H3)<br />
              • Bullet points and numbered lists<br />
              • Links to external websites<br />
              • Text colors and highlighting<br />
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
          {/* <div className="mb-3">
            <label className="form-label">Tags</label>
            <TagsInput value={tags} onChange={setTags} />
          </div> */}
          {/* Tags (comma-separated, saved as-is) */}
          <div className="mb-3">
            <label className="form-label">Tags *</label>
            <textarea
              className="form-control"
              rows={2}
              value={tagsCsv}
              onChange={(e) => setTagsCsv(e.target.value)}
              placeholder="PVC backrest,CAD drawing,Sittem 440 CAD design,PVC backrest AutoCAD,Sittem 440 premium technical drawing,seating part CAD file"
              maxLength={500}                // your DB column is VARCHAR(500)
              disabled={submitting}
            />
            <small className="form-text text-muted">
              Paste all tags separated by commas. We’ll save exactly what you type.
            </small>
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
            <input
              type="file"
              className="form-control"
              {...register("file")}
              disabled={userRole === 5}
              accept=".zip,.rar,.tar,.gz"
            />
            <small className="form-text text-muted">
              📁 Maximum file size: 1GB. Leave empty to keep current file. Supported formats: ZIP, RAR, TAR, GZ
            </small>
          </div>

          {/* Upload New Image */}
          {/* <div className="mb-3">
            <label className="form-label">Upload New Image</label>
            <input 
              type="file" 
              className="form-control" 
              {...register("image")} 
              accept="image/*"
            />
            <small className="form-text text-muted">
              🖼️ Maximum file size: 10MB. Leave empty to keep current image. Supported formats: JPG, PNG, GIF, WEBP
            </small>
          </div> */}

          {/* Add More Images */}
          <div className="mb-3">
            <label className="form-label">Project Gallery Images</label>

            <div className="d-flex gap-2 align-items-center mb-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSelectNewImages}
                className="form-control"
                style={{ maxWidth: 360 }}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={uploadNewImages}
                disabled={!newImages.length || uploadingImages}
              >
                {uploadingImages ? "Uploading..." : `Upload ${newImages.length || ""} ${newImages.length === 1 ? "image" : "images"}`}
              </button>
            </div>

            {/* ✅ AI Generation Button */}
            <div className="mb-3 mt-3">
              <button
                type="button"
                className="btn btn-warning text-dark fw-bold"
                onClick={handleAIContentGeneration}
                disabled={generatingAI || (!newImages.length && !projectDetails?.image)}
              >
                {generatingAI ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Generating AI Content...
                  </>
                ) : (
                  "✨ Auto Generate AI Content"
                )}
              </button>
              <small className="d-block text-muted mt-1">
                Uses <b>New Image</b> (if selected) OR <b>Existing Cover Image</b> to generate content.
              </small>
            </div>

            {/* Pre-upload previews */}
            {newImages.length > 0 && (
              <div className="d-flex flex-wrap gap-3 mb-3">
                {newImages.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="border rounded p-2 text-center" style={{ width: 120, marginRight: 80 }}>
                      <img src={url} alt={file.name} width="100%" height="auto" />
                      <div className="small text-truncate mt-1">{file.name}</div>

                      <div className="d-flex justify-content-center gap-1 mt-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => moveNewImageUp(idx)}
                          disabled={idx === 0}
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => moveNewImageDown(idx)}
                          disabled={idx === newImages.length - 1}
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeNewImage(idx)}
                          title="Remove"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="image-gallery">
            {(projectDetails?.images ?? []).length === 0 ? (
              <small className="text-muted">No gallery images yet.</small>
            ) : (
              (projectDetails.images).map((img, index) => (
                <div key={img.id} className="image-item mb-3">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/product_img/small/${img.image}`}
                    width="100"
                    alt={`Project image ${index + 1}`}
                  />
                  <span>#{index + 1}</span>

                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleMoveUp(img.id); }}
                    disabled={index === 0}
                    aria-label="Move up"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleMoveDown(img.id); }}
                    disabled={index === (projectDetails.images.length - 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleDelete(img.id); }}
                    aria-label="Delete"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Project Status */}
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select className="form-control" {...register("status")}>
              <option value="1">Approved</option>
              <option value="2">Rejected</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Schedule Publish (IST)</label>
            <input
              type="datetime-local"
              className="form-control"
              value={publishAtIst}
              onChange={(e) => setPublishAtIst(e.target.value)}
            />
            <small className="form-text text-muted">
              Leave empty to publish immediately. This is interpreted as IST (UTC+05:30).
            </small>
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
          {/* <button type="submit" className="btn btn-primary" disabled={isDuplicate || checking || !titleValidation.isValid}>
            Save Changes
          </button> */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              submitting ||
              // isDuplicate && !isRejected ||
              // checking || 
              // !titleValidation.isValid ||
              (!isRejected && isDuplicate) ||
              (!isRejected && checking) ||
              (!isRejected && !titleValidation.isValid) ||
              // !seoTitleValidation.isValid ||
              // // !seoDescriptionValidation.isValid || // Removed - description has no length restrictions
              // !seoMetaTitleValidation.isValid ||
              // !seoMetaDescriptionValidation.isValid
              (!isRejected && ( // only block on SEO when NOT rejected
                !seoTitleValidation.isValid ||
                !seoMetaTitleValidation.isValid ||
                !seoMetaDescriptionValidation.isValid
              ))
            }
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>

          {/* ✅ SEO Requirements Summary (excluding description) */}
          {!isRejected && (!seoTitleValidation.isValid || !seoMetaTitleValidation.isValid || !seoMetaDescriptionValidation.isValid) && (
            <div className="mt-3 p-3" style={{ backgroundColor: "#fff3cd", border: "1px solid #ffeaa7", borderRadius: "4px" }}>
              <h6 style={{ color: "#856404", marginBottom: "8px" }}>⚠️ SEO Requirements Not Met</h6>
              <small style={{ color: "#856404" }}>
                Please ensure all fields meet SEO length requirements before saving:
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

export default EditProject;
