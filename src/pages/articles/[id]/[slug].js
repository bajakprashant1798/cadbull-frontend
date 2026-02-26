import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import { fetchStrapiAPI, getStrapiMedia } from "@/lib/strapiApi";

const BlogDetail = ({ blog }) => {
    if (!blog) return null;

    const { title, content, excerpt, featured_image, published_date, seo, slug } = blog;

    // DEBUG: Client-side check for API access
    React.useEffect(() => {
        console.log("🔍 [Debug] Checking API Access for ID:", blog.id);
        const debugFetch = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"}/api/blogs?filters[id][$eq]=${blog.id}&populate=*`;
                console.log("🔍 [Debug] Fetching:", apiUrl);
                const res = await fetch(apiUrl);
                console.log("🔍 [Debug] Status:", res.status);
                const json = await res.json();
                console.log("🔍 [Debug] Response:", json);
            } catch (err) {
                console.error("🔍 [Debug] Error:", err);
            }
        };
        debugFetch();
    }, [blog.id]);
    const imageUrl = getStrapiMedia(featured_image);
    const date = new Date(published_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const seoMeta = seo || {};
    const metaTitle = seoMeta.metaTitle || title;
    const metaDescription = seoMeta.metaDescription || excerpt;
    const canonicalUrl = seoMeta.canonicalURL || `https://cadbull.com/articles/${blog.id}/${slug}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "image": imageUrl ? [imageUrl] : [],
        "datePublished": published_date,
        "author": {
            "@type": "Organization",
            "name": "Cadbull"
        },
        "description": excerpt
    };

    return (
        <>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <link rel="canonical" href={canonicalUrl} />
                {seoMeta.metaImage && <meta property="og:image" content={getStrapiMedia(seoMeta.metaImage)} />}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </Head>

            <main className="bg-light pb-5">
                {/* Hero / Header Section */}
                <section className="bg-white border-bottom pt-5 pb-4">
                    <div className="container text-center">
                        <nav aria-label="breadcrumb" className="d-flex justify-content-center mb-4">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">Home</Link></li>
                                <li className="breadcrumb-item"><Link href="/articles" className="text-decoration-none text-muted">Articles</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Current Article</li>
                            </ol>
                        </nav>

                        <div className="row justify-content-center">
                            <div className="col-lg-10 col-xl-8">
                                <h1 className="fw-bold display-5 mb-3 text-dark">{title}</h1>

                                <div className="d-flex align-items-center justify-content-center text-muted mb-3">
                                    <div className="d-flex align-items-center me-4">
                                        <i className="fa fa-calendar me-2"></i>
                                        <span>{date}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="fa fa-clock-o me-2"></i>
                                        <span>5 min read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <article className="container mt-n5" style={{ marginTop: '-2rem' }}>
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-9">
                            {/* Featured Image */}
                            {imageUrl && (
                                <div className="card border-0 shadow-sm overflow-hidden mb-5 rounded-4">
                                    <div className="position-relative w-100" style={{ height: '500px' }}>
                                        <Image
                                            src={imageUrl}
                                            alt={title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            priority
                                            sizes="(max-width: 1200px) 100vw, 1200px"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Article Body */}
                            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
                                <div className="blog-content fs-5 lh-lg font-serif"> {/* Use a serif font class if available or default sans */}
                                    {blog.content ? (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: blog.content }}
                                        />
                                    ) : (
                                        <p className="text-muted fst-italic">
                                            No content available for this article.
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 pt-5 border-top d-flex justify-content-between align-items-center">
                                    <Link href="/articles" className="btn btn-outline-secondary rounded-pill px-4">
                                        &larr; Back to Articles
                                    </Link>
                                    {/* Share buttons placeholder */}
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-light text-dark border-0"><i className="fa fa-twitter"></i></button>
                                        <button className="btn btn-sm btn-outline-light text-dark border-0"><i className="fa fa-facebook"></i></button>
                                        <button className="btn btn-sm btn-outline-light text-dark border-0"><i className="fa fa-linkedin"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
            <style jsx>{`
                .blog-content h1, .blog-content h2, .blog-content h3 {
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    font-weight: 700;
                    color: #212529;
                }
                .blog-content p {
                    margin-bottom: 1.5rem;
                    line-height: 1.8;
                }
                .blog-content ul, .blog-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 2rem;
                }
                .blog-content li {
                    margin-bottom: 0.5rem;
                }
                .blog-content figure {
                    margin: 2rem auto;
                    max-width: 100%;
                    text-align: center;
                }
                .blog-content figure.image-style-align-left {
                    float: left;
                    margin-right: 1.5rem;
                }
                .blog-content figure.image-style-align-right {
                    float: right;
                    margin-left: 1.5rem;
                }
                .blog-content figure.image-style-align-center {
                    margin-left: auto;
                    margin-right: auto;
                }
                .blog-content img {
                    max-width: 100% !important;
                    height: auto !important;
                    border-radius: 0.5rem;
                    display: inline-block;
                }
            `}</style>
        </>
    );
};

BlogDetail.getLayout = (page) => <MainLayout>{page}</MainLayout>;

// // Use SSR for easier debugging and to avoid potential build-time fetching issues for now
export async function getServerSideProps({ params }) {
    console.log("🔥 [SSR] Fetching blog for ID:", params.id);
    try {
        // Attempt filtering using shorthand syntax to avoid '$' character issues with WAF/Firewalls
        // filters[id]=123 instead of filters[id][$eq]=123
        const blogRes = await fetchStrapiAPI("/blogs", {
            filters: {
                id: params.id
            },
            populate: {
                featured_image: true,
                seo: { populate: "*" }
            },
        });

        console.log("� [SSR] Strapi Response Length:", blogRes?.data?.length);

        const blog = blogRes?.data?.[0];

        if (!blog) {
            console.warn(`❌ [SSR] Blog not found for id: ${params.id}`);
            return { notFound: true };
        }

        console.log("✅ [SSR] Blog found:", blog.title);

        return {
            props: { blog }
        };
    } catch (error) {
        console.error("❌ [SSR] Error fetching blog:", error);
        return { notFound: true };
    }
}

export default BlogDetail;
