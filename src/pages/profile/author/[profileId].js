import { Fragment, useState, useEffect, useCallback } from "react";
import MainLayout from "@/layouts/MainLayout";
import Head from "next/head";
import profile from "@/assets/images/profile-arch.png"
import award1 from "@/assets/images/award-1.png"
import award2 from "@/assets/images/award-2.png";
import project from "@/assets/images/blog-1.png";
import save from "@/assets/icons/save.png";
import heart from "@/assets/icons/heart.png";
import SectionHeading from "@/components/SectionHeading";
import professionals from "@/assets/images/professionals.png"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Navigation } from 'swiper/modules';
import ConsultModal from "@/components/ConsultModal";
import Icons from "@/components/Icons";
import SortByAZ from "@/components/drawer/SortByAZ";
import SortByDate from "@/components/drawer/SortByDate";
import { getCompanyProducts, getCompanyProfile } from "@/service/api";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { debounce } from "@/pages";
import ProjectCard from "@/components/ProjectCard";
import Pagination from "@/components/Pagination";

const CompanyProfile = () => {
  // Get profileId from router query
  // const { profileId } = useRouter().query;
  const router = useRouter();
  const profileIdFromRoute = router.query.profileId;
  const profileIdFromRedux = useSelector((store) => store.logininfo.user?.profileId);
  const profileId = profileIdFromRoute || profileIdFromRedux;

  const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);

  // State for profile and products
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Sorting state (for A to Z / Z to A)
  const [sortOrder, setSortOrder] = useState(""); // default: "" (i.e. by date)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch profileId from URL or Redux store optionally
  useEffect(() => {
    if (!profileIdFromRoute && profileIdFromRedux) {
      router.replace(`/profile/author/${profileIdFromRedux}`);
    }
  }, [profileIdFromRoute, profileIdFromRedux]);


  // Fetch profile info
  const fetchProfile = async () => {
    try {
      const res = await getCompanyProfile(profileId);
      setProfile(res.data.profile);
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch company products with sort filter and pagination
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await getCompanyProducts(
        profileId,
        {
          page: currentPage,
          pageSize: 12,
          search: "", // Update if you add search functionality later
          sort: sortOrder, // "asc" for A→Z, "desc" for Z→A. Leave empty for default sorting.
        }
      );
      setProducts(res.data.products);
      setTotalProducts(res.data.totalProducts);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Re-fetch products whenever filters, sorting, or currentPage change
  useEffect(() => {
    if (profileId) {
      fetchProfile();
      fetchProducts();
    }
  }, [profileId, isAuthenticated, sortOrder, currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Handler for sort order change
  const handleSortChange = (e) => {
    setCurrentPage(1);
    setSortOrder(e.target.value);
  };

  return (
    <Fragment>
      <Head>
        <title>{profile ? profile.companyName : "Company Profile"} | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <section className="py-lg-5 py-4 company-page">
        <div className="container">
          <div className="form-wrapper rounded-xxl p-md-5">
          <div className="row mb-4 gy-3 ">
            <div className="col-md-2">
              <div className="profile-image-wrapper d-flex gap-2">
                <img src={profile?.profile_pic || "/default-profile.png"} className="rounded-circle company-logo-info { object-fit-cover"  alt="profile" />
                <div className="d-md-none">
                  <h4 className="fw-semibold text-primary">{`${profile?.first_name} ${profile?.last_name}`}</h4>
                  <p>{profile?.address1 || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-10">
              <div>
                <div className="d-flex gap-lg-5 mb-4">
                  {/* Name  */}
                  <div className="d-none d-md-block">
                    <h3 className="fw-semibold text-primary">{`${profile?.first_name} ${profile?.last_name}`}</h3>
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
                  <button className="nav-link active" id="v-pills-cad-tab" data-bs-toggle="pill" data-bs-target="#v-pills-cad" type="button" role="tab" aria-controls="v-pills-cad" aria-selected="false">CAD File (360)</button>
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
                    <select defaultValue="A to Z"  
                      value={sortOrder}
                      onChange={handleSortChange} 
                      className="form-select border-start-0 rounded-start-0" 
                      aria-label=".form-select-sm example"
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
                            <p>No projects uploaded.</p>
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


export default CompanyProfile;