import { Fragment, useState, useEffect, useCallback } from "react";
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
// import profile from "@/assets/images/profile-arch.png"
import { assets } from "@/utils/assets";
const profile_dummy = assets.icons("profile.png");
// import profile_dummy from "@/assets/icons/profile.png";
import axios from "axios";


import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import Icons from "@/components/Icons";
import SortByAZ from "@/components/drawer/SortByAZ";
import SortByDate from "@/components/drawer/SortByDate";
// import { getCompanyProducts, getCompanyProfile } from "@/service/api";
import { useRouter } from "next/router";
import { performance } from "@/utils/performance";
import { useSelector } from "react-redux";
import ProjectCard from "@/components/ProjectCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";

const CompanyProfile = ({ initialProfile, initialProducts, initialPagination, seoData }) => {
  // Get profileId from router query
  // const { profileId } = useRouter().query;
  const router = useRouter();
  // const profileIdFromRoute = router.query.profileId;
  // const profileIdFromRedux = useSelector((store) => store.logininfo.user?.profileId);
  // const profileId = profileIdFromRoute || profileIdFromRedux;

  // Look for 'userId' in the URL query now
  const userIdFromRoute = router.query.profileId; 
  // Get the logged-in user's own ID from Redux
  const userIdFromRedux = useSelector((store) => store.logininfo.user?.id);
  // console.log(userIdFromRoute, userIdFromRedux, "User ID from Route and Redux");
  
  // The final ID to use for fetching
  const userId = userIdFromRoute || userIdFromRedux;

  const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);

  // State for profile and products - initialized with SSR data
  const [profile, setProfile] = useState(initialProfile);
  const [products, setProducts] = useState(initialProducts);

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Sorting state (for A to Z / Z to A)
  const [sortOrder, setSortOrder] = useState(""); // default: "" (i.e. by date)
  
  // Pagination states - initialized with SSR data
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalProducts, setTotalProducts] = useState(initialPagination.totalProducts);

  // Fetch profileId from URL or Redux store optionally
  // useEffect(() => {
  //   if (!profileIdFromRoute && profileIdFromRedux) {
  //     router.replace(`/profile/author/${profileIdFromRedux}`);
  //   }
  // }, [profileIdFromRoute, profileIdFromRedux]);

  useEffect(() => {
    // Use the new userId variables
    if (!userIdFromRoute && userIdFromRedux) {
      router.replace(`/profile/author/${userIdFromRedux}`);
    }
  }, [userIdFromRoute, userIdFromRedux]); // FIX: Use the new variable names here


  // Fetch profile info (only when needed for updates)
  const fetchProfile = async () => {
    try {
      const res = await getCompanyProfile(userId);
      setProfile(res.data.profile);
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch company products (only when needed for client-side updates)
  // const fetchProducts = async (page = currentPage, sort = sortOrder) => {
  //   setLoadingProducts(true);
  //   try {
  //     const res = await getCompanyProducts(
  //       userId,
  //       {
  //         page: page,
  //         pageSize: 12,
  //         search: "",
  //         sort: sort,
  //       }
  //     );
  //     setProducts(res.data.products);
  //     setTotalProducts(res.data.totalProducts);
  //     setTotalPages(res.data.totalPages);
  //   } catch (error) {
  //     console.error("Error fetching products", error);
  //   } finally {
  //     setLoadingProducts(false);
  //   }
  // };

  // Only re-fetch if user ID changes or if we need to update client-side
  useEffect(() => {
    // Update currentPage and sortOrder from URL when route changes
    const page = parseInt(router.query.page) || 1;
    const sort = router.query.sort || "";
    
    setCurrentPage(page);
    setSortOrder(sort);
    
    // If the URL parameters changed, fetch new data
    if (page !== currentPage || sort !== sortOrder) {
      fetchProducts(page, sort);
    }
  }, [router.query.page, router.query.sort]);

  // Handle page change - use router.push to update URL
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    // Update URL with new page parameter, keeping sort if it exists
    const currentUrl = router.asPath.split('?')[0];
    const params = new URLSearchParams();
    
    if (newPage > 1) params.append('page', newPage.toString());
    if (sortOrder) params.append('sort', sortOrder);
    
    const queryString = params.toString();
    const newUrl = queryString ? `${currentUrl}?${queryString}` : currentUrl;
    
    router.push(newUrl);
  };

  // Handler for sort order change (desktop dropdown)
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    handleSortUpdate(newSort);
  };

  // Handler for mobile sort change
  const handleMobileSortChange = (newSort) => {
    handleSortUpdate(newSort);
    
    // Close the offcanvas
    const offcanvasElement = document.getElementById('staticBackdrop3');
    if (offcanvasElement) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  };

  // Common sort update logic
  const handleSortUpdate = (newSort) => {
    const currentUrl = router.asPath.split('?')[0];
    const params = new URLSearchParams();
    
    // Always reset to page 1 when sorting changes
    if (newSort) params.append('sort', newSort);
    
    const queryString = params.toString();
    const newUrl = queryString ? `${currentUrl}?${queryString}` : currentUrl;
    
    router.push(newUrl);
  };

  // Handle date filter change (for future implementation)
  const handleDateChange = (fromDate, toDate) => {
    // console.log('Date filter:', { fromDate, toDate });
    // TODO: Implement date filtering
  };

  return (
    <Fragment>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        
        {/* ✅ CANONICAL URL - Always point to main profile page (page 1) */}
        <link rel="canonical" href={seoData.canonicalUrl} />
        
        {/* ✅ NOINDEX AND NOFOLLOW for paginated pages (page 2+) */}
        {seoData.noindex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* ✅ PAGINATION META TAGS */}
        {seoData.prevPage && <link rel="prev" href={seoData.prevPage} />}
        {seoData.nextPage && <link rel="next" href={seoData.nextPage} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:url" content={seoData.canonicalUrl} />
        <meta property="og:type" content="profile" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
      </Head>
      <section className="py-lg-5 py-4 company-page">
        <div className="container">
          <div className="form-wrapper rounded-xxl p-md-5">
          <div className="row mb-4 gy-3 ">
            <div className="col-md-2">
              <div className="profile-image-wrapper d-flex gap-2">
                <img 
                  src={profile?.profile_pic || profile_dummy} 
                  className="rounded-circle company-logo-info { object-fit-cover"  
                  alt="profile" 
                  onError={e => { e.target.onerror = null; e.target.src = profile_dummy }}
                />
                <div className="d-md-none">
                  {(profile?.firstname || profile?.lastname) ? (
                    <h4 className="fw-semibold text-primary">
                      {[profile?.firstname, profile?.lastname].filter(Boolean).join(" ")}
                    </h4>
                  ) 
                  : (
                    <h4 className="fw-semibold text-primary">Update your profile and add your name.</h4>
                  )
                  }

                  <p>{profile?.address1 || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-10">
              <div>
                <div className="d-flex gap-lg-5 mb-4">
                  {/* Name  */}
                  <div className="d-none d-md-block">
                    {(profile?.firstname || profile?.lastname) ? (
                      <h3 className="fw-semibold text-primary">
                        {[profile?.firstname, profile?.lastname].filter(Boolean).join(" ")}
                      </h3>
                    ) : (
                      <Link href="/profile/edit"><h3 className="fw-semibold text-primary">Update your profile and add your name.</h3></Link>
                    )}
                    <p>{profile?.address1 || ""}</p>
                  </div>
                  {/* Project Detail  */}
                  <div className="d-flex gap-3 align-items-center">
                    <div>
                      <h6 className="text-primary fw-semibold lh-sm">{totalProducts}</h6>
                      <p className="text-grey">Projects</p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row py-3 py-md-4">
            <div className="col-md-12">
              <div className="d-flex justify-content-between gap-4 gap-md-2 flex flex-column flex-md-row">
                <div className="nav nav-pills flex-nowrap" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  {/* <button className="nav-link " id="v-pills-image-tab" data-bs-toggle="pill" data-bs-target="#v-pills-image" type="button" role="tab" aria-controls="v-pills-image" aria-selected="true">Image (500)</button> */}
                  <button className="nav-link active" id="v-pills-cad-tab" data-bs-toggle="pill" data-bs-target="#v-pills-cad" type="button" role="tab" aria-controls="v-pills-cad" aria-selected="false">My Files</button>
                </div>
                  <div className='d-lg-none'>
                    <ul className='list-unstyled gap-1 gap-md-3 justify-content-center d-flex gap-3 gap-md-2 align-items-center justify-content-md-center mb-md-0'>
                      <li>
                        <button type='button' data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop4" aria-controls="staticBackdrop" className='link-btn d-inline-flex align-items-center'>
                          <Icons.Date />
                          <span className='ms-2 fw-bold text-primary'>Date</span>
                        </button>
                      </li>
                      <li className='text-grey'>|</li>
                      <li>
                        <button type='button' data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop3" aria-controls="staticBackdrop" className='link-btn d-inline-flex align-items-center'>
                          <Icons.Categories />
                          <span className='ms-2 fw-bold text-primary'>Sort by</span>
                        </button>
                      </li>
                    </ul>
                    <hr />
                    
                  </div>
                <div className="d-none d-lg-flex gap-2 justify-content-center justify-content-md-end">
                  {/* <div className="d-flex">
                    <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                      Date :
                    </span>
                    <input type="date" className="form-control shadow-none border-start-0 rounded-start-0"/>
                  </div> */}
                  <div className="d-flex">
                    <span className="input-group-text bg-white border-end-0 rounded-end-0 pe-0">
                      Sort by :
                    </span>
                    <select 
                      value={sortOrder}
                      onChange={handleSortChange} 
                      className="form-select border-start-0 rounded-start-0" 
                      aria-label="Sort products"
                    >
                      <option value="">Default (by Date)</option>
                      <option value="asc">A to Z</option>
                      <option value="desc">Z to A</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="tab-content" id="v-pills-tabContent">
                
                <div className="tab-pane fade show active pt-4" id="v-pills-cad" role="tabpanel" aria-labelledby="v-pills-cad-tab" tabIndex="0">
                  <div className="row g-4">
                    {/* Projects List */}
                    <div className="row">
                      <div className="col-md-12">
                        {loadingProducts ? (
                          <p>Loading projects...</p>
                        ) : products && products.length > 0 ? (
                          <div className="row g-4">
                            {products.map((proj) => (
                              <div className="col-lg-4 col-sm-6" key={proj.id}>
                                <ProjectCard {...proj} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="col-12 text-center">
                            <p>No files uploaded.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pagination */}
                    {!loadingProducts && totalPages > 1 && (
                      <div className="row mt-4">
                        <div className="col-12">
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Mobile Sort Components */}
      <SortByAZ 
        onSortChange={handleMobileSortChange} 
        currentSort={sortOrder}
      />
      <SortByDate 
        onDateChange={handleDateChange}
      />
    </Fragment>
  );
}

CompanyProfile.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}

// // ✅ COST OPTIMIZATION: Convert to ISR for 95% cost reduction
// export async function getStaticProps({ params }) {
//   const timings = {};
//   const startTime = Date.now();
//   const profileId = params.profileId;
  
//   return await performance.trackPagePerformance('ProfilePage', { 
//     pageType: 'ISR', 
//     isSSR: false, 
//     cacheStatus: 'generating',
//     profileId 
//   }, async () => {
//     const page = 1; // ISR always serves page 1, pagination handled client-side
//     const sortOrder = "";
    
//     try {
//       performance.logMemoryUsage('Profile-Start', { profileId });

//       // Track profile data API call
//       const profileRes = await performance.timeAPICall(
//         'GetCompanyProfile',
//         () => getCompanyProfile(profileId),
//         `getCompanyProfile/${profileId}`
//       );
//       const profile = profileRes.data.profile;
//       timings.profileAPI = Date.now() - startTime;
      
//       if (!profile) {
//         return { notFound: true };
//       }
      
//       // Track products data API call
//       const productsRes = await performance.timeAPICall(
//         'GetCompanyProducts',
//         () => getCompanyProducts(profileId, {
//           page,
//           pageSize: 12,
//           search: "",
//           sort: sortOrder,
//         }),
//         `getCompanyProducts/${profileId}?page=${page}&pageSize=12`
//       );
//       timings.productsAPI = Date.now() - startTime - timings.profileAPI;
      
//       const products = productsRes.data.products || [];
//       const totalProducts = productsRes.data.totalProducts || 0;
//       const totalPages = productsRes.data.totalPages || 1;

//       performance.logMemoryUsage('Profile-AfterAPIs', { profileId });
      
//       // Generate SEO data
//       const profileName = [profile.firstname, profile.lastname].filter(Boolean).join(" ") || "User";
//       const baseUrl = `${process.env.NEXT_PUBLIC_FRONT_URL}/profile/author/${profileId}`;
      
//       // ✅ SEO Configuration for ISR
//       const seoData = {
//         title: `${profileName} - CAD Designer Profile | Cadbull`,
//         description: `View ${profileName}'s CAD designs and architectural drawings. Browse ${totalProducts} professional CAD files including house plans, elevations, and technical drawings on Cadbull.`,
//         canonicalUrl: baseUrl,
//         noindex: false, // ISR version is always indexable
//         prevPage: null,
//         nextPage: null,
//       };

//       // Log cost event for ISR generation
//       performance.logCostEvent('ISR-Generation', {
//         page: 'ProfilePage',
//         profileId,
//         productCount: totalProducts,
//         profileName,
//       });
      
//       const result = {
//         props: {
//           initialProfile: profile,
//           initialProducts: products,
//           initialPagination: {
//             currentPage: page,
//             totalPages,
//             totalProducts,
//           },
//           seoData,
//         },
//         // ✅ ISR: Regenerate every 2 hours (profile data doesn't change often)
//         revalidate: 7200, // 2 hours = fresh enough for profile updates
//       };

//       timings.total = Date.now() - startTime;
//       performance.generateSummary('ProfilePage-ISR', timings);
      
//       return result;
      
//     } catch (error) {
//       console.error('Error in profile getStaticProps:', error);
//       performance.logCostEvent('ISR-Error', {
//         page: 'ProfilePage',
//         profileId,
//         error: error.message,
//       });
      
//       return { 
//         notFound: true,
//         revalidate: 3600, // Retry in 1 hour if error
//       };
//     }
//   });
// }

export async function getStaticProps({ params }) {
  const profileId = params.profileId;
  if (!/^\d+$/.test(String(profileId))) return { notFound: true, revalidate: 60 };

  const API_BASE = process.env.NEXT_PUBLIC_API_MAIN || 'https://api.cadbull.com/api'; // ensure /api

  try {
    // Axios: use .data
    const { data: profJson } = await axios.get(`${API_BASE}/profile/author/${profileId}`);
    const profile = profJson?.profile || null;

    if (!profile) {
      const front = process.env.NEXT_PUBLIC_FRONT_URL || 'https://cadbull.com';
      return {
        props: {
          initialProfile: null,
          initialProducts: [],
          initialPagination: { currentPage: 1, totalPages: 1, totalProducts: 0 },
          seoData: {
            title: 'User Profile | Cadbull',
            description: 'This profile is temporarily unavailable.',
            canonicalUrl: `${front}/profile/author/${profileId}`,
            noindex: false, prevPage: null, nextPage: null,
          },
        },
        revalidate: 600,
      };
    }

    const { data: prodJson } = await axios.get(
      `${API_BASE}/profile/author/${profileId}/products`,
      { params: { page: 1, pageSize: 12 } }
    );

    const products = prodJson?.products || [];
    const totalProducts = prodJson?.totalProducts || 0;
    const totalPages = prodJson?.totalPages || 1;

    const name = [profile.firstname, profile.lastname].filter(Boolean).join(' ') || 'User';
    const front = process.env.NEXT_PUBLIC_FRONT_URL || 'https://cadbull.com';

    return {
      props: {
        initialProfile: profile,
        initialProducts: products,
        initialPagination: { currentPage: 1, totalPages, totalProducts },
        seoData: {
          title: `${name} - CAD Designer Profile | Cadbull`,
          description: `View ${name}'s CAD designs and drawings on Cadbull.`,
          canonicalUrl: `${front}/profile/author/${profileId}`,
          noindex: false, prevPage: null, nextPage: null,
        },
      },
      revalidate: 7200,
    };
  } catch (e) {
    const front = process.env.NEXT_PUBLIC_FRONT_URL || 'https://cadbull.com';
    return {
      props: {
        initialProfile: null,
        initialProducts: [],
        initialPagination: { currentPage: 1, totalPages: 1, totalProducts: 0 },
        seoData: {
          title: 'User Profile | Cadbull',
          description: 'This profile is temporarily unavailable.',
          canonicalUrl: `${front}/profile/author/${profileId}`,
          noindex: false, prevPage: null, nextPage: null,
        },
      },
      revalidate: 600,
    };
  }
}

// ✅ Generate static paths for popular profiles (first 100)
export async function getStaticPaths() {
  // Pre-generate paths for first 100 profiles
  const paths = Array.from({ length: 100 }, (_, i) => ({
    params: { profileId: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: 'blocking', // Generate other profiles on-demand
  };
}

export default CompanyProfile;