import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { addProjectApi, getAdminCategoriesWithSubcategories, getCategoriesApi, checkProjectNameApi, generateAIContent } from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
// import TagsField from "@/components/TagsField";
import debounce from "lodash.debounce";
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

const AddProject = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const user = useSelector((store) => store.logininfo.user);
  const userRole = user?.role;
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
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

  const [publishAtIst, setPublishAtIst] = useState(""); // "YYYY-MM-DDTHH:MM" in IST

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

  const [images, setImages] = useState([]);

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
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eeat_new");
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
        setEeatData(prev => ({ ...prev, lastReviewed: todayStr }));
      }
    }
  }, []);

  const handleSaveEeat = () => {
    localStorage.setItem("eeat_new", JSON.stringify(eeatData));
    toast.success("E-E-A-T settings saved locally!");
  };

  const generateJsonLd = () => {
    const canonicalUrl = `https://cadbull.com/detail/temp/${slug || "project-slug"}`;
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
    const canonicalUrl = `https://cadbull.com/detail/temp/${slug || "project-slug"}`;
    return `<title>${watchMetaTitle || workTitle || "Project Title"}</title>\n` +
           `<meta name="description" content="${watchMetaDescription}" />\n` +
           `<link rel="canonical" href="${canonicalUrl}" />\n` +
           `<meta property="og:title" content="${watchMetaTitle || workTitle || "Project Title"}" />\n` +
           `<meta property="og:description" content="${watchMetaDescription}" />\n` +
           `<meta property="og:url" content="${canonicalUrl}" />\n` +
           `<meta name="robots" content="index, follow" />\n`;
  };

  const fileKey = (f) => `${f.name}_${f.size}_${f.lastModified}`;

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    // existing keys
    const existingKeys = new Set(images.map(fileKey));
    // filter out duplicates
    const uniqueNew = picked.filter(f => !existingKeys.has(fileKey(f)));

    // enforce max 10 across previous + new
    const room = Math.max(0, 10 - images.length);
    const toAdd = uniqueNew.slice(0, room);

    if (toAdd.length === 0) {
      toast.error("You can upload up to 10 images only.");
    } else {
      setImages(prev => [...prev, ...toAdd]); // APPEND ✅
    }

    // allow re-selecting the same file(s) in future
    e.target.value = "";
  };

  const [generatingAI, setGeneratingAI] = useState(false);

  const handleAIContentGeneration = async () => {
    if (images.length === 0) {
      toast.error("Please upload an image first to generate content.");
      return;
    }

    try {
      setGeneratingAI(true);
      const formData = new FormData();
      formData.append("image", images[0]); // Send the first image

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
          handleQuillDescriptionChange(data.description);
        }

        // 3. Meta Title
        if (data.meta_title) {
          setValue("meta_title", data.meta_title);
          // Trigger validation manually if needed, or rely on watch
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

  const moveImageUp = (idx) => {
    if (idx <= 0) return;
    setImages((prev) => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };
  const moveImageDown = (idx) => {
    if (idx >= images.length - 1) return;
    setImages((prev) => {
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
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
      if (images.length === 0) {
        toast.error("Please select at least one image before uploading.");
        return;
      }
      setSubmitting(true);
      const formData = new FormData();

      // data.tags = tags.join(",");
      // tags as plain CSV
      const tags = tagsCsv;

      // console.log("🚀 Form Data BEFORE Append:", data);
      console.log("🚀 Form BEFORE Append:", data);

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

      // ✅ Explicitly append all form fields
      formData.append("work_title", data.work_title || "");
      formData.append("description", cleanedDescription || ""); // Use cleaned rich text description
      formData.append("meta_title", data.meta_title || "");
      formData.append("meta_description", data.meta_description || "");
      formData.append("tldr", eeatData.tldr || "");
      formData.append("experience", eeatData.experience || "");
      formData.append("reviewed_by", eeatData.reviewedBy || "Cadbull");
      formData.append("last_reviewed", eeatData.lastReviewed || "");
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

      images.forEach((img) => formData.append("images", img));

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

      // if (data.image && data.image.length > 0) {
      //     const image = data.image[0];

      //     // Check image size (10MB limit)
      //     if (image.size > 10 * 1024 * 1024) {
      //       toast.error("Image too large! Maximum size is 10MB. Please compress the image.");
      //       setSubmitting(false);
      //       return;
      //     }

      //     formData.append("image", image);
      // } else {
      //     toast.error("Please upload an Image.");
      //     setSubmitting(false);
      //     return;
      // }

      // ⬇️ ADD THIS
      // if (publishAtIst) {
      //   formData.append("publish_at_ist", publishAtIst);
      //   // If you ever want the empty value to CLEAR the schedule, you can else-append an empty string:
      //   // } else {
      //   //   formData.append("publish_at_ist", "");
      //   // }
      // }
      formData.append("publish_at_ist", publishAtIst || "");
      formData.append("faqs", JSON.stringify(faqs));

      console.log("✅ FormData AFTER Append:", [...formData.entries()]);

      await addProjectApi(formData);
      toast.success("Project added successfully!");
      reset();
      setSelectedUserId(""); // Reset user selection
      setFaqs([]); // Reset FAQs
      router.push("/admin/projects/view-projects");
    } catch (error) {
      console.error("❌ Error Adding Project:", error.response?.data || error.message, error);

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
      <div className="container ">
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="row">
            <div className="col-lg-7">

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
            <div className="admin-editor-container" style={{ backgroundColor: '#fff' }}>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={handleQuillDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                className="quill-resize"
                style={{
                  backgroundColor: '#fff'
                }}
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
          {/* <div className="mb-3">
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
          </div> */}

          <label htmlFor="images" className="form-label">Upload Images (max 10)</label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange} // ✅ APPENDS across multiple picks
          />


          {images.length > 0 && (
            <div className="d-flex flex-wrap gap-3 mb-3">
              {images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={idx}
                    className="border rounded p-2 text-center"
                    style={{ width: 140, position: "relative", marginRight: 30 }}
                  >
                    {idx === 0 && (
                      <span
                        className="badge bg-primary"
                        style={{ position: "absolute", top: 6, left: 6 }}
                      >
                        Cover
                      </span>
                    )}

                    <img
                      src={url}
                      alt={file.name}
                      width="100%"
                      height="auto"
                      onLoad={() => URL.revokeObjectURL(url)}
                      style={{ borderRadius: 8 }}
                    />
                    <div className="small text-truncate mt-1" title={file.name}>
                      {file.name}
                    </div>

                    <div className="d-flex justify-content-center gap-1 mt-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => moveImageUp(idx)}
                        disabled={idx === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => moveImageDown(idx)}
                        disabled={idx === images.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, i) => i !== idx))
                        }
                        title="Remove"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="d-flex gap-2 align-items-center mt-2">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => setImages([])}
              disabled={!images.length}
            >
              Clear all images
            </button>
            <small className="text-muted ms-1">{images.length}/10 selected</small>
          </div>

          {/* ✅ AI Generation Button */}
          <div className="mb-3 mt-3">
            <button
              type="button"
              className="btn btn-warning text-dark fw-bold"
              onClick={handleAIContentGeneration}
              disabled={generatingAI || images.length === 0}
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
              Upload an image first, then click this to auto-fill Title, Description, and SEO fields.
            </small>
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

          {/* Schedule Publish (IST, optional) */}
          <div className="mb-3">
            <label className="form-label">Schedule Publish (IST)</label>
            <input
              type="datetime-local"
              className="form-control"
              value={publishAtIst}
              onChange={(e) => setPublishAtIst(e.target.value)}
            />
            <small className="form-text text-muted">
              Leave empty to publish immediately. This value is interpreted as IST (UTC+05:30).
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
                      cadbull.com <span className="text-muted">› detail › temp › {slug || "project-slug"}</span>
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
                        <span className="text-dark" style={{ fontSize: "0.75rem" }}>https://cadbull.com/detail/temp/{slug || "project-slug"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://cadbull.com/detail/temp/${slug}`);
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
                        <span className="text-dark" style={{ fontSize: "0.75rem" }}>https://cadbull.com/detail/temp/{slug || "project-slug"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`https://cadbull.com/detail/temp/${slug}`);
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

export default AddProject;
