import { Fragment } from "react";
import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import { useRouter } from "next/router";
import ProjectCard from "@/components/ProjectCard";
import Pagination from '@/components/Pagination';
import SectionHeading from "@/components/SectionHeading";
import { getallprojects } from "@/service/api";
import AdSense from "@/components/AdSense";
import { drawings } from "../../index";

// ✅ COST OPTIMIZATION: Handle pagination with ISR instead of SSR
export default function ProjectsPage({
  projects,
  totalPages,
  currentPage,
  totalProducts,
}) {
  const router = useRouter();

  const handlePageChange = (newPage) => {
    if (newPage === 1) {
      router.push('/');
    } else {
      router.push(`/projects/page/${newPage}`);
    }
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    if (newSort) {
      router.push(`/?file_type=${newSort}`);
    } else {
      router.push('/');
    }
  };

  return (
    <Fragment>
      <Head>
        <title>{`Autocad 2D and 3D CAD Blocks & Models Library - Page ${currentPage} | Cadbull`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}`} />
        <meta 
          name="description" 
          content={`Discover 269,000+ free & premium CAD files at Cadbull, 2D & 3D drawings, CAD blocks, & models across architecture, engineering & more. Page ${currentPage}.`} 
        />

        {/* Pagination SEO */}
        {currentPage > 1 && (
          <link 
            rel="prev" 
            href={currentPage === 2 ? `${process.env.NEXT_PUBLIC_FRONT_URL}` : `${process.env.NEXT_PUBLIC_FRONT_URL}/projects/page/${currentPage - 1}`} 
          />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/projects/page/${currentPage + 1}`} />
        )}
      </Head>

      <section className="py-md-5 py-3">
        <div className="container">
          <div className="row mb-4 mb-md-5">
            <div className="col-md-12">
              <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row gap-5">
                <div className="ps-5">
                  <SectionHeading
                    subHeading={"DISCOVER"}
                    mainHeading={`Files of the day - Page ${currentPage}`}
                    mainHeadingBold={"Cadbull"}
                  />
                </div>
                <div className="w-100">
                  <div className="d-flex gap-3 justify-content-end flex-column flex-md-row">
                    {/* Sort by file type */}
                    <div className="d-flex">
                      <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                        Sort by :
                      </span>
                      <select
                        className="form-select border-start-0 rounded-start-0"
                        onChange={handleSortChange}
                      >
                        <option value={''}>All</option>
                        {drawings.map(({ type, value }, index) => (
                          <option key={index} value={value}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {projects.map((project) => (
              <div className="col-md-6 col-lg-4" key={project.id}>
                <ProjectCard {...project} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>

      <AdSense slot="8339598320" format="fluid" layout="in-article" />
    </Fragment>
  );
}

// ✅ COST OPTIMIZATION: Use ISR for pagination pages
export async function getStaticProps({ params }) {
  const page = parseInt(params.page) || 1;
  
  try {
    const response = await getallprojects(page, 9, "", "");
    
    return {
      props: {
        projects: response.data.products || [],
        totalPages: response.data.totalPages || 1,
        currentPage: page,
        totalProducts: response.data.totalProducts || 0,
      },
      revalidate: 3600, // Regenerate every hour
    };
  } catch (error) {
    console.error('Error fetching projects for page:', error);
    return {
      props: {
        projects: [],
        totalPages: 1,
        currentPage: page,
        totalProducts: 0,
      },
      revalidate: 3600,
    };
  }
}

// ✅ Generate static paths for first 10 pages, rest on-demand
export async function getStaticPaths() {
  // Pre-generate first 10 pages
  const paths = Array.from({ length: 10 }, (_, i) => ({
    params: { page: (i + 2).toString() }, // Start from page 2 (page 1 is homepage)
  }));

  return {
    paths,
    fallback: 'blocking', // Generate other pages on-demand
  };
}

ProjectsPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
