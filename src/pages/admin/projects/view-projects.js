import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProjectsApi, getAdminCategoriesWithSubcategories } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import AdminLayout from "@/layouts/AdminLayout";
import { handledownload } from "@/service/globalfunction";
import { useMemo } from "react";

/** Returns { ok: boolean, issues: string[] } */
const useSeoCheck = (project) => {
  return useMemo(() => {
    const issues = [];
    const trim = (s) => (s || "").toString().trim();

    const wtLen = trim(project.work_title).length;
    // Work Title target: 60–70 chars (ideal ≈68)
    if (wtLen < 60 || wtLen > 70) issues.push(`Work Title length = ${wtLen}`);

    const mtLen = trim(project.meta_title).length;
    // Meta Title target: 50–60 chars
    if (mtLen < 50 || mtLen > 60) issues.push(`Meta Title length = ${mtLen}`);

    const mdLen = trim(project.meta_description).length;
    // Meta Description target: 150–160 chars
    if (mdLen < 150 || mdLen > 160) issues.push(`Meta Description length = ${mdLen}`);

    const hasTags = !!trim(project.tags);
    if (!hasTags) issues.push(`Tags missing`);

    return { ok: issues.length === 0, issues };
    // Only recompute if any of these actually change
  }, [
    project.id,
    project.work_title,
    project.meta_title,
    project.meta_description,
    project.tags,
  ]);
};

/** Small cell component that shows a green check or red alert with a tooltip */
const SeoHealthCell = ({ project }) => {
  const { ok, issues } = useSeoCheck(project);

  const titleText = ok
    ? "All good"
    : `Fix:\n• ${issues.join("\n• ")}`;

  return (
    <div style={{ textAlign: "center" }} title={titleText} aria-label={titleText}>
      {ok ? (
        <span
          style={{
            display: "inline-block",
            width: 22,
            height: 22,
            lineHeight: "22px",
            borderRadius: "50%",
            background: "#28a745",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          ✓
        </span>
      ) : (
        <span
          style={{
            display: "inline-block",
            width: 22,
            height: 22,
            lineHeight: "22px",
            borderRadius: "50%",
            background: "#dc3545",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          !
        </span>
      )}
    </div>
  );
};

// ✅ Image Exists Checker Component
const ImageExistsChecker = ({ imagePath, projectId }) => {
    const [imageExists, setImageExists] = useState(null); // null = loading, true = exists, false = missing
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (!imagePath) {
            setImageExists(false);
            return;
        }

        const checkImageExists = async () => {
            // ✅ Construct possible image URLs
            const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
            
            let possibleUrls = [];
            
            if (imagePath.includes('/')) {
                // ✅ New format with year/month: "2025/01/filename.jpg"
                const sizes = ['small', 'medium', 'large', 'original'];
                possibleUrls = sizes.map(size => 
                    `${baseUrl}/product_img/${size}/${imagePath}`
                );
            } else {
                // ✅ Old format without subfolders: "filename.jpg"
                const sizes = ['small', 'medium', 'large', 'original'];
                possibleUrls = sizes.map(size => 
                    `${baseUrl}/product_img/${size}/${imagePath}`
                );
            }

            // ✅ Also try the old thumb.cadbull.com format
            // possibleUrls.push(`https://thumb.cadbull.com/img/product_img/original/${imagePath}`);
            // possibleUrls.push(`https://thumb.cadbull.com/img/product_img/small/${imagePath}`);

            // ✅ Test each URL until one works
            for (const url of possibleUrls) {
                try {
                    const response = await fetch(url, { 
                        method: 'HEAD',
                        mode: 'cors'
                    });
                    if (response.ok) {
                        setImageUrl(url);
                        setImageExists(true);
                        return;
                    }
                } catch (error) {
                    // Continue to next URL
                    console.log(`Image not found at: ${url}`);
                }
            }
            
            // ✅ If no image found anywhere
            console.warn(`No image found for project ${projectId} with path: ${imagePath}`);
            setImageExists(false);
        };

        checkImageExists();
    }, [imagePath, projectId]);

    // ✅ Loading state
    if (imageExists === null) {
        return (
            <div style={{ 
                padding: "8px 12px", 
                textAlign: "center", 
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                fontSize: "12px"
            }}>
                Checking...
            </div>
        );
    }

    // ✅ Missing image state
    if (imageExists === false || !imagePath) {
        return (
            <div style={{ 
                padding: "8px 12px", 
                textAlign: "center", 
                backgroundColor: "#dc3545",
                color: "white",
                border: "1px solid #dc3545",
                borderRadius: "4px",
                fontWeight: "bold",
                fontSize: "12px"
            }}>
                Missing Image
                {!imagePath && <><br/><small>(No path)</small></>}
            </div>
        );
    }

    // ✅ Image exists - show it
    return (
        <div style={{ textAlign: "center" }}>
            <img 
                src={imageUrl}
                alt={`Product ${projectId}`}
                style={{ 
                    maxWidth: "80px", 
                    maxHeight: "80px",
                    border: "1px solid #28a745",
                    borderRadius: "4px",
                    objectFit: "cover"
                }}
                onError={() => {
                    console.error(`Failed to load image: ${imageUrl}`);
                    setImageExists(false);
                }}
                onLoad={() => {
                    console.log(`✅ Image loaded successfully: ${imageUrl}`);
                }}
            />
        </div>
    );
};

const ViewProjects = () => {
    // const { token } = useSelector((store) => store.logininfo);
    const isAuthenticated = useSelector(
        (store) => store.logininfo.isAuthenticated
    );
    const router = useRouter();

    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useState({
        searchTerm: "",
        product_id: "",
        status: "all",
        category_id: "",
        subcategory_id: "",
        page: 1,
        perPage: 10, // ✅ Show Number of Entries
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchProjects();
            fetchCategories();
        }
    }, [searchParams, isAuthenticated]);

    // ✅ Fetch Projects with Search & Pagination
    const fetchProjects = () => {
        getProjectsApi(
            searchParams.searchTerm,
            searchParams.product_id,
            searchParams.status,
            searchParams.category_id,
            searchParams.subcategory_id,
            searchParams.page,
            searchParams.perPage,
            
        )
            .then((res) => {
                setProjects(res.data.projects || []);
                setTotalPages(res.data.totalPages || 1);
            })
            .catch((err) => console.error("❌ Error fetching projects:", err));
    };

    // ✅ Fetch Categories with Subcategories
    const fetchCategories = async () => {
        try {
            const res = await getAdminCategoriesWithSubcategories();
            setCategories(Array.isArray(res.data) ? res.data : []);
            // console.log(res.data);
            
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
            setCategories([]);
        }
    };

    // ✅ Handle Input Change for Search
    const handleInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    // ✅ Handle Category Change & Load Subcategories
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSearchParams({ ...searchParams, category_id: categoryId, subcategory_id: "" });

        const selectedCategory = categories.find((cat) => cat.id === Number(categoryId));
        setSubcategories(selectedCategory?.project_sub_categories || []);
    };


    return (
        <AdminLayout>
            <div className="container ">
                <h2>View Projects</h2>

                {/* 🔍 Search Filters */}
                <div className="row mb-3">
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Keyword" name="searchTerm" value={searchParams.searchTerm} onChange={handleInputChange} />
                    </div>
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Product ID" name="product_id" value={searchParams.product_id} onChange={handleInputChange} />
                    </div>
                    <div className="col">
                        <select className="form-control" name="status" value={searchParams.status} onChange={handleInputChange}>
                            <option value="all">All</option>
                            <option value="0">Pending</option>
                            <option value="1">Approved</option>
                            <option value="2">Rejected</option>
                        </select>
                    </div>
                    <div className="col">
                        <select className="form-control" name="category_id" value={searchParams.category_id} onChange={handleCategoryChange}>
                            <option value="">Select Category</option>
                            {categories?.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <select className="form-control" name="subcategory_id" value={searchParams.subcategory_id} onChange={handleInputChange}>
                            <option value="">Select Subcategory</option>
                            {subcategories.map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <select className="form-control" name="perPage" value={searchParams.perPage} onChange={handleInputChange}>
                            <option value="10">Show 10 Entries</option>
                            <option value="20">Show 20 Entries</option>
                            <option value="50">Show 50 Entries</option>
                        </select>
                    </div>
                    <div className="col">
                        <button className="btn btn-primary" onClick={fetchProjects}>Search</button>
                    </div>
                </div>

                {/* 📂 Projects Table */}
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>SEO</th>
                                <th>ID</th>
                                <th>Username</th>
                                <th style={{ maxWidth: "200px", wordWrap: "break-word", whiteSpace: "normal" }}>Title</th>
                                <th style={{ maxWidth: "150px", wordWrap: "break-word", whiteSpace: "normal" }}>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                                <th>Image Exists</th>
                                <th>Publish Date (IST)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <tr key={project.id}>
                                        <td style={{ textAlign: "center", minWidth: "70px" }}>
                                            <SeoHealthCell project={project} />
                                        </td>
                                        <td>{project.id}</td>
                                        <td>{project.username || "N/A"}</td>
                                        <td style={{ maxWidth: "200px", wordWrap: "break-word", whiteSpace: "normal" }}>
                                            {project.work_title}
                                        </td>
                                        <td style={{ maxWidth: "150px", wordWrap: "break-word", whiteSpace: "normal" }}>
                                            {project.category_name || "N/A"}
                                        </td>
                                        <td>{project.status === "1" ? "Approved" : project.status === "2" ? "Rejected" : "Pending"}</td>
                                        
                                        <td>
                                            <button className="btn btn-primary btn-sm" onClick={() => router.push(`/admin/projects/edit-project?id=${project.id}`)}>Edit</button>
                                            {/* <a href={`${process.env.NEXT_PUBLIC_API_MAIN_NO_API}/uploads/project_files/${project.file}`} className="btn btn-sm btn-success ms-2" download>Download</a> */}
                                            <button
                                                className="btn btn-sm btn-success ms-2"
                                                onClick={() => handledownload(project.id, isAuthenticated, router)}
                                            >
                                                Download
                                            </button>

                                        </td>

                                        {/* ✅ Image Exists Column */}
                                        <td style={{ textAlign: "center", minWidth: "120px" }}>
                                            <ImageExistsChecker 
                                                imagePath={project.image} 
                                                projectId={project.id}
                                            />
                                        </td>

                                        <td>
                                            {project.publish_at_ist ? (() => {
                                                const publishTime = new Date(project.publish_at_ist.replace(" ", "T"));
                                                const now = new Date();
                                                const isFuture = publishTime > now;
                                                return (
                                                <span className={isFuture ? "text-[#20325A] fw-bold scheduled-product-date" : ""}>
                                                    {publishTime.toLocaleString("en-IN", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                                    {isFuture && " (Scheduled)"}
                                                </span>
                                                );
                                            })() : (
                                                <span className="text-muted fst-italic">
                                                {project.status === "0"
                                                    ? "Not scheduled"
                                                    : project.status === "1"
                                                    ? "Published (no date)"
                                                    : "N/A"}
                                                </span>
                                            )}
                                        </td>
                                        
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No projects found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {/* <PaginationAdmin
                    currentPage={searchParams.page}
                    totalPages={totalPages}
                    goToPreviousPage={() => setSearchParams({ ...searchParams, page: Math.max(1, searchParams.page - 1) })}
                    goToNextPage={() => setSearchParams({ ...searchParams, page: Math.min(totalPages, searchParams.page + 1) })}
                    dispatchCurrentPage={(page) => setSearchParams({ ...searchParams, page })}
                /> */}

                <PaginationAdmin
                    currentPage={searchParams.page}
                    totalPages={totalPages}
                    goToFirstPage={() => setSearchParams({ ...searchParams, page: 1 })}
                    goToPreviousPage={() => setSearchParams({ ...searchParams, page: Math.max(1, searchParams.page - 1) })}
                    goToNextPage={() => setSearchParams({ ...searchParams, page: Math.min(totalPages, searchParams.page + 1) })}
                    goToLastPage={() => setSearchParams({ ...searchParams, page: totalPages })}
                    dispatchCurrentPage={(page) => setSearchParams({ ...searchParams, page })}
                    />

            </div>
        </AdminLayout>
    );
};

export default ViewProjects;
