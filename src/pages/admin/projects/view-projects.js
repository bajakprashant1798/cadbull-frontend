import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getProjectsApi, getAdminCategoriesWithSubcategories } from "@/service/api";
import PaginationAdmin from "@/components/PaginationAdmin";
import { useRouter } from "next/router";
import AdminLayout from "@/layouts/AdminLayout";
import { handledownload } from "@/service/globalfunction";

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
            <div className="container py-5">
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
                                <th>ID</th>
                                <th>Username</th>
                                <th style={{ maxWidth: "200px", wordWrap: "break-word", whiteSpace: "normal" }}>Title</th>
                                <th style={{ maxWidth: "150px", wordWrap: "break-word", whiteSpace: "normal" }}>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <tr key={project.id}>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No projects found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <PaginationAdmin
                    currentPage={searchParams.page}
                    totalPages={totalPages}
                    goToPreviousPage={() => setSearchParams({ ...searchParams, page: Math.max(1, searchParams.page - 1) })}
                    goToNextPage={() => setSearchParams({ ...searchParams, page: Math.min(totalPages, searchParams.page + 1) })}
                    dispatchCurrentPage={(page) => setSearchParams({ ...searchParams, page })}
                />
            </div>
        </AdminLayout>
    );
};

export default ViewProjects;
