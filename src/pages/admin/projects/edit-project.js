import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import * as api from "@/service/api";
import { toast } from "react-toastify";
import { getProjectByIdApi, updateProjectApi, getAdminCategoriesWithSubcategories, checkProjectNameApi, generateAIContent } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import { handledownload } from "@/service/globalfunction";
import { 
  FaShieldAlt, 
  FaGlobe, 
  FaCode, 
  FaChevronDown, 
  FaPlus, 
  FaTrash, 
  FaCheckCircle 
} from "react-icons/fa";

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

  // --- E-E-A-T & SEO Preview States ---
  const [eeatData, setEeatData] = useState({
    tldr: "",
    experience: "",
    reviewedBy: "Cadbull",
    lastReviewed: ""
  });
  const [previewTab, setPreviewTab] = useState("json-ld");

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (id && typeof window !== "undefined") {
      const saved = localStorage.getItem(`eeat_${id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setEeatData({
            tldr: parsed.tldr || "",
            experience: parsed.experience || "",
            reviewedBy: parsed.reviewedBy || "Cadbull",
            lastReviewed: parsed.lastReviewed || todayStr
          });
        } catch (e) {
          console.error("Failed to parse saved E-E-A-T data", e);
          setEeatData(prev => ({ ...prev, lastReviewed: todayStr }));
        }
      } else {
        setEeatData({
          tldr: "",
          experience: "",
          reviewedBy: "Cadbull",
          lastReviewed: todayStr
        });
      }
    }
  }, [id]);

  const handleSaveEeat = () => {
    if (id) {
      localStorage.setItem(`eeat_${id}`, JSON.stringify(eeatData));
      toast.success("E-E-A-T settings saved locally!");
    }
  };

  const generateJsonLd = () => {
    const canonicalUrl = `https://cadbull.com/detail/${id || "temp"}/${slug || "project-slug"}`;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": workTitle || "Project Title",
      "description": watchMetaDescription || "Project description meta tags for search engines.",
      "image": "https://cadbull.com/placeholder-cover.jpg",
      "url": canonicalUrl,
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    };
    
    if (eeatData.reviewedBy) {
      schema.reviewedBy = {
        "@type": "Person",
        "name": eeatData.reviewedBy
      };
    }
    if (eeatData.lastReviewed) {
      schema.dateReviewed = eeatData.lastReviewed;
    }
    if (eeatData.tldr) {
      schema.abstract = eeatData.tldr;
    }
    if (eeatData.experience) {
      schema.author = {
        "@type": "Person",
        "name": "Expert Contributor",
        "knowsAbout": eeatData.experience
      };
    }

    return JSON.stringify(schema, null, 2);
  };

  const generateHeadTags = () => {
    const canonicalUrl = `https://cadbull.com/detail/${id || "temp"}/${slug || "project-slug"}`;
    return `<title>${watchMetaTitle || workTitle || "Project Title"}</title>\n` +
           `<meta name="description" content="${watchMetaDescription}" />\n` +
           `<link rel="canonical" href="${canonicalUrl}" />\n` +
           `<meta property="og:title" content="${watchMetaTitle || workTitle || "Project Title"}" />\n` +
           `<meta property="og:description" content="${watchMetaDescription}" />\n` +
           `<meta property="og:url" content="${canonicalUrl}" />\n` +
           `<meta name="robots" content="index, follow" />\n`;
  };

  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [slug, setSlug] = useState("");         // Slug input
  const [slugMode, setSlugMode] = useState("standard"); // "standard", "old", or "custom"

  // Rich text editor state
  const [description, setDescription] = useState("");
  const [faqs, setFaqs] = useState([]);

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
  const [selectedImage, setSelectedImage] = useState(null); // For zoom modal
  const [zoomScale, setZoomScale] = useState(1); // For image zoom level
  const [pan, setPan] = useState({ x: 0, y: 0 }); // For image panning
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

  // Helper to check if any image exists
  const hasExistingImages = (projectDetails?.images && projectDetails.images.length > 0) || !!projectDetails?.image;
  const hasNewImages = newImages.length > 0;
  const canGenerateAI = hasNewImages || hasExistingImages;

  const handleAIContentGeneration = async () => {
    // 1. Identify which image to use
    let imageToSend = null;
    let isNewImage = false;

    if (newImages.length > 0) {
      imageToSend = newImages[0];
      isNewImage = true;
    } else if (projectDetails?.images && projectDetails.images.length > 0) {
      // Use the first image from the gallery
      imageToSend = projectDetails.images[0].image;
    } else if (projectDetails?.image) {
      // Fallback
      imageToSend = projectDetails.image;
    }

    if (!imageToSend) {
      toast.error("No image available to generate content.");
      return;
    }

    try {
      setGeneratingAI(true);
      const formData = new FormData();

      if (isNewImage) {
        formData.append("image", imageToSend); // File object
      } else {
        formData.append("existingImage", imageToSend); // String filename
      }

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
        setFaqs(projectData.faqs || []);

        const todayStr = new Date().toISOString().split('T')[0];
        setEeatData(prev => ({
          tldr: prev.tldr || projectData.tldr || "",
          experience: prev.experience || projectData.experience || "",
          reviewedBy: prev.reviewedBy || projectData.reviewed_by || "Cadbull",
          lastReviewed: prev.lastReviewed || (projectData.last_reviewed ? projectData.last_reviewed.split('T')[0] : todayStr)
        }));

        //// ✅ Set Form Data
        // Object.keys(projectRes.data).forEach((key) => setValue(key, projectRes.data[key] || ""));
        // setTags(projectRes.data.tags ? projectRes.data.tags.split(",") : []);
        setTagsCsv(projectData.tags || "");

        // Set description for React Quill
        let rawDesc = projectData.description || "";
        // Auto-repair HTML corrupted by the previous buggy RegExp
        rawDesc = rawDesc.replace(/\s*style=">/g, '>');
        setDescription(rawDesc);

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

      let cleanedDescription = description;
      if (cleanedDescription) {
        cleanedDescription = cleanedDescription.replace(/<a\b[^>]*>/gi, (tagMatch) => {
          return tagMatch.replace(/ style="[^"]*"/gi, (styleMatch) => {
            // Remove color, background-color, background properties
            let newStyleAttr = styleMatch.replace(/\b(?:color|background-color|background)\s*:[^;"]+;?/gi, '');
            // If the style attribute becomes empty or just contains quotes/spaces, remove it
            if (/style="\s*"/.test(newStyleAttr) || newStyleAttr === ' style=""') return '';
            return newStyleAttr;
          });
        });
      }

      const updatedData = {
        work_title: data.work_title,
        description: cleanedDescription, // Use cleaned description for API
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
        tldr: eeatData.tldr || "",
        experience: eeatData.experience || "",
        reviewed_by: eeatData.reviewedBy || "Cadbull",
        last_reviewed: eeatData.lastReviewed || "",
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
      formData.append("publish_at_ist", publishAtIst || "");
      formData.append("faqs", JSON.stringify(faqs));

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

  const metaTitleVal = watchMetaTitle || "";
  const metaDescVal = watchMetaDescription || "";
  const titleVal = workTitle || "";
  
  const openGraphScore = 100;
  
  let aeoScore = 0;
  if (description && description.replace(/<[^>]*>/g, '').trim().length > 0) aeoScore += 40;
  if (faqs && faqs.length > 0) aeoScore += 20;
  if (eeatData.reviewedBy && eeatData.reviewedBy.trim().length > 0) aeoScore += 20;
  if (eeatData.lastReviewed) aeoScore += 20;
  
  let geoScore = 0;
  if (eeatData.experience && eeatData.experience.trim().length > 0) geoScore += 50;
  if (eeatData.tldr && eeatData.tldr.trim().length > 0) geoScore += 50;
  
  let sxoScore = 0;
  const mtLength = metaTitleVal.length;
  const mdLength = metaDescVal.length;
  if (mtLength >= 50 && mtLength <= 60) sxoScore += 50;
  else if (mtLength > 0) sxoScore += Math.max(0, 50 - Math.abs(mtLength - 55) * 2);
  if (mdLength >= 150 && mdLength <= 160) sxoScore += 50;
  else if (mdLength > 0) sxoScore += Math.max(0, 50 - Math.abs(mdLength - 155) * 1);
  
  let aioScore = 0;
  const tldrLen = eeatData.tldr.length;
  if (tldrLen >= 200 && tldrLen <= 400) aioScore += 50;
  else if (tldrLen > 0) aioScore += Math.max(10, 50 - Math.abs(tldrLen - 300) * 0.15);
  if (eeatData.experience && eeatData.experience.trim().length > 0) aioScore += 50;
  
  const overallScore = Math.round((openGraphScore + aeoScore + geoScore + sxoScore + aioScore) / 5);

  return (
    <AdminLayout>
      {/* Zoom Modal */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column", // Stack image and controls
          }}
          onClick={() => { setSelectedImage(null); setZoomScale(1); setPan({ x: 0, y: 0 }); }}
        >
          <div
            style={{
              position: "relative",
              width: "90%",
              height: "80%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden", // Crop if zoomed out of bounds of this container
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking background of container
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={selectedImage}
              alt="Zoomed"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: "8px",
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none"
              }}
              draggable={false}
            />
          </div>

          {/* Zoom Controls Bar */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "15px",
              background: "rgba(255,255,255,0.1)",
              padding: "10px 20px",
              borderRadius: "30px",
              backdropFilter: "blur(5px)",
              zIndex: 10000 // Ensure controls are above everything
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-light rounded-circle"
              style={{ width: 40, height: 40, fontWeight: "bold", fontSize: "18px" }}
              onClick={() => setZoomScale(prev => Math.max(0.5, prev - 0.5))}
              title="Zoom Out"
            >
              −
            </button>
            <span style={{ color: "white", alignSelf: "center", minWidth: "60px", textAlign: "center" }}>
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              className="btn btn-sm btn-light rounded-circle"
              style={{ width: 40, height: 40, fontWeight: "bold", fontSize: "18px" }}
              onClick={() => setZoomScale(prev => Math.min(5, prev + 0.5))}
              title="Zoom In"
            >
              +
            </button>
            <button
              className="btn btn-sm btn-outline-light rounded-pill px-3"
              onClick={() => { setZoomScale(1); setPan({ x: 0, y: 0 }); }}
              title="Reset Zoom"
            >
              Reset
            </button>
            <button
              className="btn btn-sm btn-danger rounded-circle ms-3"
              style={{ width: 40, height: 40, fontWeight: "bold" }}
              onClick={() => { setSelectedImage(null); setZoomScale(1); setPan({ x: 0, y: 0 }); }}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="container ">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Edit Project</h2>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => handledownload(id, isAuthenticated, router)}
          >
            📥 Download Project
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="row">
            <div className="col-lg-7">
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
            <div className="admin-editor-container" style={{ backgroundColor: '#fff' }}>
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
                disabled={generatingAI || !canGenerateAI}
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
                Uses <b>New Image</b> (if selected) OR <b>First Gallery Image</b> to generate content.
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
                <div key={img.id} className="image-item mb-3 p-2 border rounded" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8f9fa" }}>
                  <div
                    style={{ cursor: "zoom-in", position: "relative" }}
                    onClick={() => {
                      setSelectedImage(`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/product_img/original/${img.image}`);
                      setZoomScale(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    title="Click to zoom"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/product_img/small/${img.image}`}
                      style={{
                        width: "150px",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: "1px solid #dee2e6"
                      }}
                      alt={`Project image ${index + 1}`}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      padding: "2px 5px",
                      borderRadius: "3px",
                      fontSize: "10px"
                    }}>
                      Zoom 🔍
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <span className="fw-bold">Image #{index + 1}</span>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={(e) => { e.preventDefault(); handleMoveUp(img.id); }}
                        disabled={index === 0}
                        aria-label="Move up"
                        title="Move Up"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={(e) => { e.preventDefault(); handleMoveDown(img.id); }}
                        disabled={index === (projectDetails.images.length - 1)}
                        aria-label="Move down"
                        title="Move Down"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => { e.preventDefault(); handleDelete(img.id); }}
                        aria-label="Delete"
                        title="Delete Image"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FAQs Section */}
          {userRole !== 2 && (
            <div className="mb-4 section-card p-4 bg-light border rounded">
              <h5 className="mb-3">Product FAQs</h5>
              {faqs.map((faq, index) => (
                <div key={index} className="mb-3 p-3 bg-white border rounded position-relative">
                  <div className="mb-2">
                    <label className="form-label">Question</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={faq.question || ""} 
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].question = e.target.value;
                        setFaqs(newFaqs);
                      }} 
                      placeholder="e.g. Which software opens this DWG file?"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Answer</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      value={faq.answer || ""} 
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].answer = e.target.value;
                        setFaqs(newFaqs);
                      }} 
                      placeholder="e.g. Compatible with AutoCAD 2018 and later."
                    ></textarea>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger position-absolute" 
                    style={{ top: '10px', right: '10px' }}
                    onClick={() => {
                      const newFaqs = faqs.filter((_, i) => i !== index);
                      setFaqs(newFaqs);
                    }}
                  >
                    Delete FAQ
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                className="btn btn-outline-primary btn-sm mt-2" 
                onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
              >
                + Add FAQ
              </button>
            </div>
          )}

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
            </div>

            <div className="col-lg-5">
              <div className="p-4 rounded-4 shadow-sm mb-4 bg-white border border-light-subtle">
                
                {/* 1. E-E-A-T & AI Overviews Section */}
                <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1rem" }}>
                      <FaShieldAlt className="text-primary" /> E-E-A-T & AI Overviews
                    </h5>
                    <button
                      type="button"
                      onClick={handleSaveEeat}
                      className="btn btn-sm btn-outline-primary px-3 py-1 fw-bold rounded-pill"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Save Settings
                    </button>
                  </div>
                  
                  {/* TL;DR Textarea */}
                  <div className="mb-3">
                    <label className="form-label text-secondary mb-1" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                      📝 TL;DR (SHOWN ON TOP FOR AI OVERVIEWS)
                    </label>
                    <textarea
                      className="form-control bg-white border-light-subtle text-dark"
                      rows="3"
                      value={eeatData.tldr}
                      onChange={(e) => setEeatData(prev => ({ ...prev, tldr: e.target.value }))}
                      placeholder="Summarize the core elements of the CAD file in a concise overview..."
                      style={{ fontSize: "0.85rem" }}
                    />
                    <small className="text-muted d-block mt-1" style={{ fontSize: "0.75rem" }}>
                      {eeatData.tldr.length} chars · Aim for 200-400 chars
                    </small>
                  </div>
                  
                  {/* First-hand Experience Textarea */}
                  <div className="mb-3">
                    <label className="form-label text-secondary mb-1" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                      💡 FIRST-HAND EXPERIENCE
                    </label>
                    <textarea
                      className="form-control bg-white border-light-subtle text-dark"
                      rows="3"
                      value={eeatData.experience}
                      onChange={(e) => setEeatData(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="Add expert tips, observations, or how you verified this design in practice..."
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                  
                  {/* Reviewed By & Date */}
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-secondary mb-1" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        REVIEWED BY
                      </label>
                      <input
                        type="text"
                        className="form-control bg-white border-light-subtle text-dark"
                        value={eeatData.reviewedBy}
                        onChange={(e) => setEeatData(prev => ({ ...prev, reviewedBy: e.target.value }))}
                        placeholder="Dr. Jane Smith"
                        style={{ fontSize: "0.85rem" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary mb-1" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                        LAST REVIEWED
                      </label>
                      <input
                        type="date"
                        className="form-control bg-white border-light-subtle text-dark"
                        value={eeatData.lastReviewed}
                        onChange={(e) => setEeatData(prev => ({ ...prev, lastReviewed: e.target.value }))}
                        style={{ fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  {/* Live Preview of E-E-A-T Card on product page */}
                  <div className="mt-4 pt-3 border-top border-secondary-subtle">
                    <label className="form-label text-uppercase text-secondary fw-bold mb-2" style={{ fontSize: "0.75rem" }}>
                      👀 Product Page Preview (E-E-A-T Quality Card)
                    </label>
                    {(eeatData.tldr || eeatData.experience) ? (
                      <div className="bg-white p-3 rounded-3 border border-light-subtle shadow-sm text-start" style={{ borderLeft: "4px solid #0d6efd" }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FaShieldAlt className="text-primary" size={16} />
                          <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "0.95rem" }}>E-E-A-T & Quality Verification</h6>
                        </div>

                        {eeatData.tldr && (
                          <div className="mb-2">
                            <small className="fw-semibold text-dark d-block mb-1" style={{ fontSize: "0.8rem" }}>📝 AI Overview (TL;DR)</small>
                            <p className="mb-0 text-muted" style={{ fontSize: "0.75rem", lineHeight: "1.5" }}>
                              {eeatData.tldr}
                            </p>
                          </div>
                        )}

                        {eeatData.experience && (
                          <div className="mb-2">
                            <small className="fw-semibold text-dark d-block mb-1" style={{ fontSize: "0.8rem" }}>💡 First-hand Experience</small>
                            <p className="mb-0 text-muted" style={{ fontSize: "0.75rem", lineHeight: "1.5" }}>
                              {eeatData.experience}
                            </p>
                          </div>
                        )}

                        <div className="pt-2 border-top border-light-subtle d-flex flex-wrap justify-content-between align-items-center gap-2" style={{ fontSize: "0.7rem" }}>
                          <span className="text-muted">
                            Reviewed by: <strong className="text-dark">{eeatData.reviewedBy || "Cadbull"}</strong>
                          </span>
                          <span className="text-muted">
                            Last reviewed: <strong className="text-dark">
                              {(() => {
                                const dateStr = eeatData.lastReviewed || new Date();
                                try {
                                  const d = new Date(dateStr);
                                  if (isNaN(d.getTime())) return String(dateStr);
                                  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                } catch (e) {
                                  return String(dateStr);
                                }
                              })()}
                            </strong>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted text-center py-3 border border-dashed rounded-3 bg-white" style={{ fontSize: "0.8rem" }}>
                        (E-E-A-T card will appear here when TL;DR or Experience is entered)
                      </div>
                    )}
                  </div>

                </div>
                
                {/* 2. Google Search Preview Section */}
                <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                  <h5 className="mb-3 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1rem" }}>
                    <FaGlobe className="text-primary" /> Google Preview
                  </h5>
                  <div className="p-3 rounded-3 text-start bg-white border border-light-subtle shadow-sm">
                    <div className="text-truncate" style={{ fontSize: "0.75rem", color: "#202124" }}>
                      cadbull.com <span className="text-muted">› detail › {id || "temp"} › {slug || "project-slug"}</span>
                    </div>
                    <h6 className="mt-1 mb-1 text-truncate" style={{ fontSize: "1.1rem", color: "#1a0dab", fontWeight: "400", cursor: "pointer" }}>
                      {metaTitleVal || titleVal || "Enter Title..."}
                    </h6>
                    <p className="mb-0 text-muted" style={{ fontSize: "0.8rem", lineHeight: "1.4", color: "#4d5156" }}>
                      {metaDescVal || "Explore this professional CAD drawing detail including 2D layouts, dimensions, and specifications..."}
                    </p>
                  </div>
                </div>
                
                {/* 3. Metadata Preview Section */}
                <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1rem" }}>
                      <FaCode className="text-success" /> Metadata Preview
                    </h5>
                    <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: "0.7rem" }}>Live</span>
                  </div>
                  
                  {/* Canonical, OG:URL, Robots tags */}
                  <div className="mb-3" style={{ fontSize: "0.8rem" }}>
                    <div className="mb-2 p-2 rounded bg-white border border-light-subtle d-flex justify-content-between align-items-center shadow-sm">
                      <div className="text-truncate" style={{ maxWidth: "80%" }}>
                        <span className="text-secondary text-uppercase me-2 fw-semibold" style={{ fontSize: "0.65rem" }}>Canonical:</span>
                        <span className="text-dark" style={{ fontSize: "0.75rem" }}>https://cadbull.com/detail/{id || "temp"}/{slug || "project-slug"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://cadbull.com/detail/${id || "temp"}/${slug}`);
                          toast.success("Canonical copied!");
                        }}
                        className="btn btn-link p-0 text-primary text-decoration-none"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="mb-2 p-2 rounded bg-white border border-light-subtle d-flex justify-content-between align-items-center shadow-sm">
                      <div className="text-truncate" style={{ maxWidth: "80%" }}>
                        <span className="text-secondary text-uppercase me-2 fw-semibold" style={{ fontSize: "0.65rem" }}>OG:URL:</span>
                        <span className="text-dark" style={{ fontSize: "0.75rem" }}>https://cadbull.com/detail/{id || "temp"}/{slug || "project-slug"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://cadbull.com/detail/${id || "temp"}/${slug}`);
                          toast.success("OG:URL copied!");
                        }}
                        className="btn btn-link p-0 text-primary text-decoration-none"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="p-2 rounded bg-white border border-light-subtle d-flex justify-content-between align-items-center shadow-sm">
                      <div>
                        <span className="text-secondary text-uppercase me-2 fw-semibold" style={{ fontSize: "0.65rem" }}>Robots:</span>
                        <span className="text-dark" style={{ fontSize: "0.75rem" }}>index, follow</span>
                      </div>
                      <span className="badge bg-success text-white" style={{ fontSize: "0.65rem" }}>OK</span>
                    </div>
                  </div>
                  
                  {/* Schema / Head Tabbed Code Block */}
                  <div className="d-flex mb-2" style={{ borderBottom: "1px solid #dee2e6" }}>
                    <button
                      type="button"
                      className={`btn btn-sm px-3 py-1 ${previewTab === "json-ld" ? "bg-secondary text-white fw-bold" : "text-muted"}`}
                      onClick={() => setPreviewTab("json-ld")}
                      style={{ fontSize: "0.8rem", border: "1px solid #dee2e6", borderBottom: "none", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }}
                    >
                      JSON-LD
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm px-3 py-1 ${previewTab === "head" ? "bg-secondary text-white fw-bold" : "text-muted"}`}
                      onClick={() => setPreviewTab("head")}
                      style={{ fontSize: "0.8rem", border: "1px solid #dee2e6", borderBottom: "none", borderTopLeftRadius: "4px", borderTopRightRadius: "4px", marginLeft: "2px" }}
                    >
                      &lt;head&gt;
                    </button>
                  </div>
                  
                  <div className="p-2 rounded bg-dark" style={{ position: "relative", border: "1px solid #dee2e6" }}>
                    <button
                      type="button"
                      onClick={() => {
                        const content = previewTab === "json-ld" ? generateJsonLd() : generateHeadTags();
                        navigator.clipboard.writeText(content);
                        toast.success("Copied to clipboard!");
                      }}
                      className="btn btn-sm btn-outline-info"
                      style={{ position: "absolute", top: "8px", right: "8px", fontSize: "0.7rem" }}
                    >
                      Copy
                    </button>
                    <pre className="text-info mb-0" style={{ fontSize: "0.7rem", maxHeight: "200px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
                      <code>
                        {previewTab === "json-ld" ? generateJsonLd() : generateHeadTags()}
                      </code>
                    </pre>
                  </div>
                </div>
                
                {/* 4. Advanced SEO Panel Checklist Scorecard */}
                <div className="p-3 rounded-3" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: "1rem" }}>
                      Advanced SEO Panel
                    </h5>
                    <span className="badge bg-primary px-2 py-1" style={{ fontSize: "0.85rem" }}>
                      Score: {overallScore}%
                    </span>
                  </div>
                  
                  <div className="progress mb-3" style={{ height: "10px", backgroundColor: "#e9ecef" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${overallScore}%` }}
                      aria-valuenow={overallScore}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  
                  <div className="text-dark" style={{ fontSize: "0.8rem" }}>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light-subtle">
                      <span>🌐 Open Graph Score</span>
                      <span className="text-success fw-bold">{openGraphScore}%</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light-subtle">
                      <span>🤖 AEO (Answer Engine) Score</span>
                      <span className={aeoScore >= 80 ? "text-success fw-bold" : aeoScore >= 50 ? "text-warning fw-bold" : "text-danger fw-bold"}>
                        {aeoScore}%
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light-subtle">
                      <span>🌍 GEO (Generative Engine) Score</span>
                      <span className={geoScore >= 80 ? "text-success fw-bold" : geoScore >= 50 ? "text-warning fw-bold" : "text-danger fw-bold"}>
                        {geoScore}%
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light-subtle">
                      <span>⚡ SXO (Search Experience) Score</span>
                      <span className={sxoScore >= 80 ? "text-success fw-bold" : sxoScore >= 50 ? "text-warning fw-bold" : "text-danger fw-bold"}>
                        {sxoScore}%
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2">
                      <span>🤖 AIO (AI Overview) Score</span>
                      <span className={aioScore >= 80 ? "text-success fw-bold" : aioScore >= 50 ? "text-warning fw-bold" : "text-danger fw-bold"}>
                        {aioScore}%
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProject;
