import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "@/layouts/MainLayout";
import { fetchStrapiAPI, getStrapiMedia } from "@/lib/strapiApi";

// SEO Metadata
const seo = {
    title: "Cadbull Blog - Latest Architecture & CAD News",
    description: "Explore the latest updates, tutorials, and architectural insights from Cadbull.",
};

const BlogListing = ({ blogs }) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState("All");

    // Mock categories until implemented in Strapi
    const categories = ["All", "Technology", "Architecture", "Tutorials", "Guides", "Industry News"];

    // Filter logic
    const filteredBlogs = blogs?.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

        // Match category when available in Strapi. For now, if "All", show everything.
        // If we had a category field: const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
        const matchesCategory = selectedCategory === "All";

        return matchesSearch && matchesCategory;
    });

    const featuredPost = filteredBlogs && filteredBlogs.length > 0 ? filteredBlogs[0] : null;
    const remainingPosts = filteredBlogs && filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

    return (
        <>
            <Head>
                <title>Cadbull Articles - Latest Architecture & CAD Updates</title>
                <meta name="description" content={seo.description} />
                <link rel="canonical" href="https://cadbull.com/articles" />
            </Head>

            <main className="min-vh-100 d-flex flex-column bg-light">
                {/* Hero Section */}
                <section className="py-5 bg-white border-bottom">
                    <div className="container text-center">
                        <div className="mb-5">
                            <h1 className="display-4 fw-bold text-dark mb-3">Cadbull Blog</h1>
                            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                                Insights, tutorials, and news from the world of CAD and design
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="mx-auto" style={{ maxWidth: '500px' }}>
                            <div className="input-group input-group-lg shadow-sm">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="fa fa-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0 ps-0"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-4 bg-white border-bottom sticky-top" style={{ zIndex: 10, top: '0px' }}> {/* Adjust top if header is fixed */}
                    <div className="container">
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`btn rounded-pill px-4 ${selectedCategory === category ? 'btn-primary' : 'btn-outline-secondary border-0 bg-light text-dark'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="container py-5">
                    {/* Featured Post */}
                    {featuredPost && (
                        <div className="mb-5">
                            <h2 className="h4 fw-bold mb-4">Featured Article</h2>
                            <Link href={`/articles/${featuredPost.id}/${featuredPost.slug}`} className="text-decoration-none">
                                <div className="card shadow-sm border-0 overflow-hidden hover-shadow transition-all">
                                    <div className="row g-0">
                                        <div className="col-md-7 position-relative" style={{ minHeight: "350px" }}>
                                            {featuredPost.featured_image ? (
                                                <Image
                                                    src={getStrapiMedia(featuredPost.featured_image)}
                                                    alt={featuredPost.title}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                    priority
                                                />
                                            ) : (
                                                <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center text-white">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-5 d-flex flex-column justify-content-center p-4 p-lg-5 bg-white">
                                            <div className="mb-3">
                                                <span className="badge bg-light text-primary border border-primary-subtle rounded-pill px-3 py-2">
                                                    Featured
                                                </span>
                                            </div>
                                            <h3 className="card-title fw-bold text-dark mb-3 display-6" style={{ fontSize: '1.75rem' }}>
                                                {featuredPost.title}
                                            </h3>
                                            <p className="card-text text-muted mb-4 line-clamp-3">
                                                {featuredPost.excerpt}
                                            </p>
                                            <div className="d-flex align-items-center text-muted small mt-auto">
                                                <i className="fa fa-calendar me-2"></i>
                                                {new Date(featuredPost.published_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                                                <span className="mx-2">•</span>
                                                <i className="fa fa-clock-o me-2"></i>
                                                5 min read
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Blog Grid */}
                    <div className="mb-5">
                        <h2 className="h4 fw-bold mb-4">Latest Articles</h2>
                        {remainingPosts.length > 0 ? (
                            <div className="row g-4">
                                {remainingPosts.map((blog) => {
                                    const imageUrl = getStrapiMedia(blog.featured_image);
                                    const date = new Date(blog.published_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

                                    return (
                                        <div key={blog.id} className="col-md-6 col-lg-4">
                                            <Link href={`/articles/${blog.id}/${blog.slug}`} className="text-decoration-none h-100 d-block">
                                                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden hover-translate-up transition-all">
                                                    <div className="position-relative" style={{ height: "220px" }}>
                                                        {imageUrl ? (
                                                            <Image
                                                                src={imageUrl}
                                                                alt={blog.title}
                                                                fill
                                                                style={{ objectFit: "cover" }}
                                                                className="transition-transform duration-500 hover-scale"
                                                            />
                                                        ) : (
                                                            <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center text-white">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="card-body p-4">
                                                        <div className="mb-3">
                                                            <span className="badge bg-light text-secondary border rounded-pill">
                                                                Article
                                                            </span>
                                                        </div>
                                                        <h5 className="card-title fw-bold text-dark mb-3 line-clamp-2" style={{ minHeight: '3rem' }}>
                                                            {blog.title}
                                                        </h5>
                                                        <p className="card-text text-muted small line-clamp-2 mb-4">
                                                            {blog.excerpt}
                                                        </p>
                                                        <div className="d-flex align-items-center justify-content-between text-muted small mt-auto pt-3 border-top">
                                                            <div>
                                                                <i className="fa fa-calendar me-1"></i> {date}
                                                            </div>
                                                            <span>Read More &rarr;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <div className="text-muted mb-3"><i className="fa fa-search fa-3x"></i></div>
                                <h4 className="text-muted">No articles found</h4>
                                <p className="text-muted">Try adjusting your search or category.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Newsletter Section */}
                <section className="py-5 bg-primary text-white mt-auto">
                    <div className="container text-center">
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                <h2 className="fw-bold mb-3">Subscribe to Our Newsletter</h2>
                                <p className="mb-4 text-white-50">
                                    Get the latest articles, tutorials, and CAD news delivered straight to your inbox.
                                </p>
                                <div className="input-group input-group-lg bg-white rounded-3 p-1">
                                    <input
                                        type="email"
                                        className="form-control border-0 shadow-none"
                                        placeholder="Enter your email"
                                        aria-label="Email"
                                    />
                                    <button className="btn btn-dark rounded-3 px-4" type="button">Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

// Use MainLayout
BlogListing.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export async function getStaticProps() {
    try {
        // Fetch blogs from Strapi
        // Sort by published_date descending
        const blogsRes = await fetchStrapiAPI("/blogs", {
            sort: "published_date:desc",
            populate: "*",
            pagination: {
                limit: 12, // Fetch latest 12 posts for the main page
            },
        });

        return {
            props: {
                blogs: blogsRes.data || [],
            },
            revalidate: 300, // Revalidate every 5 minutes
        };
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return {
            props: {
                blogs: [],
            },
            revalidate: 60, // Try shorter revalidation on error
        };
    }
}

export default BlogListing;
