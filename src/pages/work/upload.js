import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Link from "next/link";
import Head from "next/head";
import { Fragment, useCallback, useDebugValue, useEffect, useMemo, useState } from "react";
import PageHeading from "@/components/PageHeading";
import UploadFiles from "@/components/UploadFile";
import dynamic from "next/dynamic";
import { getCategoriesWithSubcategories, uploadProjectApiHandler } from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addCategoryAndSubCategoryData } from "../../../redux/app/features/projectsSlice";
import useLoading from "@/utils/useLoading";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import withAuth from "@/HOC/withAuth";
import { drawings } from "..";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import logo from "@/assets/images/logo.png";

// const QuillNoSSRWrapper = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <p>Loading ...</p>,
// });

const UploadWork = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const QuillNoSSRWrapper = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { token } = useSelector((store) => store.logininfo);
  
  const { categoryAndSubCategory } = useSelector((store) => store.projectinfo);
  const [subCategory, setSubCategory] = useState([]);
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    file: null,
    work_title: "",
    description: "",
    file_type: "",
    category_id: "",
    subcategory_id: "",
    keyword: "",
    image: null,
  });

  const { user } = useSelector((store) => store.logininfo);
  // Inside UploadWork component:
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/auth/login");
  //   }
  // }, [isAuthenticated, router]);

  
  // Function to handle form submission
  // const handleSubmit = (event) => {
  //   startLoading();
  //   event.preventDefault();
  //   // You can now access formData and perform any necessary actions, such as sending it to the server.
  //   uploadProjectApiHandler(formData, token)
  //     .then((res) => {
  //       // console.log(res);
  //       toast.success("Project Uploaded Successfully")
  //       stopLoading();
  //       router.push("/my-projects");
  //     })
  //     .catch((err) => {
  //       // console.log(err);
  //       stopLoading();
  //     });
  // };

  // ✅ Helper function to check for a valid email
  const hasValidEmail = (email) => {
    return email && /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!formData.file) {
      toast.error("Please upload both a project file.");
      return;
    }
  
    startLoading();
    // console.log("formData: ", formData);
    
    try {
      await uploadProjectApiHandler(formData);
      toast.success("Project uploaded successfully! Pending approval.");
      stopLoading();
      router.push("/work/sent"); // Redirect to user projects page
    } catch (err) {
      toast.error("Upload failed. Please try again.");
      stopLoading();
    }
  };


  const handleUploadfile = (file) => {
    // setFormData({ ...formData, file: file[0] });
    setFormData({ file: file[0] });
    toast.success("Zip file uploaded!");
  };

  // const handleUploadImage = (file) => {  
  //   if (file.length > 0) {
  //     setFormData({ ...formData, image: file[0] });
  //     toast.success("Image uploaded!");
  //   }
  // };

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setFormData({
      ...formData,
      category_id: selectedCategoryId,
    });
  
    try {
      // Fetch subcategories only when user selects a category
      const categories = await getCategoriesWithSubcategories();
      dispatch(addCategoryAndSubCategoryData(categories));
  
      const selectedCategory = categories.find(item => item.id == selectedCategoryId);
      setSubCategory(selectedCategory ? selectedCategory.project_sub_categories : []);
  
    } catch (err) {
      console.error("❌ Error loading categories:", err);
      toast.error("Failed to load subcategories.");
    }
  };
  

  useEffect(()=>{
     if(categoryAndSubCategory.length===0){
      getCategoriesWithSubcategories().then((res)=>{
        dispatch(addCategoryAndSubCategoryData(res))
        setSubCategory(res[0]?.project_sub_categories)
        // console.log('api response upload==========',res)
      }).catch((err)=>{
        // console.log(err)
        console.error("❌ Error loading categories:", err);
      })
     }
  },[])
  return (
    <Fragment>
      <Head>
        <title>Upload and Share Your CAD Drawings and DWG Files on Cadbull</title>
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/work/upload`} />
        <meta name="description" content="Share your CAD designs and DWG files with the global community on Cadbull. Easily upload your architectural drawings to showcase and promote your work." />

        <meta property="og:title" content="Upload and Share Your CAD Drawings and DWG Files on Cadbull" />
        <meta property="og:description" content="Share your CAD designs and DWG files with the global community on Cadbull. Easily upload your architectural drawings to showcase and promote your work." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/work/upload`} />
        <meta property="og:image" content={logo} />
        <meta name="twitter:title" content="Upload and Share Your CAD Drawings and DWG Files on Cadbull" />
        <meta name="twitter:description" content="Share your CAD designs and DWG files with the global community on Cadbull. Easily upload your architectural drawings to showcase and promote your work." />
        <meta name="twitter:image" content={logo} />
        <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad furniture" />
      </Head>
      <section className="py-lg-5 py-4 auth-page">
        <div className="container">
          <div className="row mb-2">
            <div className="col-md-12">
              <PageHeading
                title={"Upload Work"}
                description={"Simple. Fast. Beautiful."}
              />

              {/* ✅ START: NEW CONDITIONAL MESSAGE BLOCK */}
              {!hasValidEmail(user?.email) && (
                <div className="alert alert-warning d-flex flex-column flex-md-row align-items-center justify-content-between p-3 mb-4">
                  <span>
                    To receive updates on your project's approval status, please add an email to your profile.
                  </span>
                  <Link href="/profile/edit" className="btn btn-primary rounded btn-sm mt-2 mt-md-0">
                    Add Email
                  </Link>
                </div>
              )}
              {/* ✅ END: NEW CONDITIONAL MESSAGE BLOCK */}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-9 col-xl-7">
              <form onSubmit={handleSubmit}>
                
                {/* <div className="row mb-4 mb-md-5 g-3"> */}
                  {/* Work Title */}
                  {/* <div className="col-lg-12">
                    <div>
                      <label htmlFor="workTitle">Work Title</label>
                    </div>
                    <p className="mb-1 text-gray">250 characters max</p>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Work Title"
                      value={formData.work_title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          work_title: e.target.value,
                        })
                      }
                    />
                  </div> */}
                  {/* Description */}
                  {/* <div className="col-lg-12">
                    <div>
                      <label htmlFor="description">Description</label>
                    </div>
                    <QuillNoSSRWrapper
                      theme="snow"
                      placeholder="The clearer and shorter the better"
                      onChange={(content)=>setFormData({...formData, description: content})}
                    />
                  </div> */}
                  {/* File Type */}
                  {/* <div className="col-lg-6">
                    <div>
                      <label htmlFor="fileType">File Type</label>
                    </div>
                    <select
                      className="form-select"
                      aria-label="File Type"
                      value={formData.file_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          file_type: e.target.value,
                        })
                      }
                    >
                      <option value="">Select File Type</option>
                     {drawings.map(({type,value},index)=>{
                      return  <option key={index} value={value}>{type}</option>
                     })}
                    </select>
                  </div> */}
                  {/* Category */}
                  {/* <div className="col-lg-6">
                    <div>
                      <label htmlFor="category">Category</label>
                    </div>
                    <select
                      className="form-select"
                      aria-label="Category"
                      value={formData.category_id}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select Category</option>
                      {
                        categoryAndSubCategory.map((item, index) => (
                          <option key={index} value={item.id}>• {item.title}</option>
                        ))
                      }
                    </select>

                  </div> */}
                  {/* Subcategory */}
                  {/* <div className="col-lg-6">
                    <div>
                      <label htmlFor="subcategory">Subcategory</label>
                    </div>
                    <select
                      className="form-select"
                      aria-label="Subcategory"
                      value={formData.subcategory_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subcategory_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Subcategory</option>
                      {
                        subCategory?.map((item, index) => (
                          <option key={index} value={item.id}>• {item.title}</option>
                        ))
                      }
                    </select>
                  </div> */}
                  {/* Keyword */}
                  {/* <div className="col-lg-6">
                    <div>
                      <label htmlFor="keyword">5 Keywords</label>
                    </div>
                    
                    <TagsInput
                      className="form-control tags-input"
                      value={tags}                // local state for tags
                      onChange={(newTags) => {
                        // Limit to 5 tags
                        if (newTags.length <= 5) {
                          setTags(newTags);
                          // Also update the formData (if you are using it for submission)
                          setFormData({
                            ...formData,
                            keyword: newTags.join(","),
                          });
                        } else {
                          toast.error("You can only add up to 5 tags.");
                        }
                      }}
                      onlyUnique
                      inputProps={{ placeholder: "Add tag" }}
                    />
                  </div> */}
                {/* </div> */}
                {/* <div className="mb-4 mb-md-5">
                  <div>
                    <label className="mb-2">Upload Image</label>
                  </div>
                  <UploadFiles callback={handleUploadImage} />
                </div> */}

                <div className="mb-4 mb-md-5">
                  <div>
                    <label className="mb-2">Upload File</label>
                  </div>
                  <UploadFiles
                    acceptedFiles=" .zip file only"
                  callback={handleUploadfile}
                  />
                </div>
                <div className="text-end">
                <button
                  className={`btn btn-secondary col-12 col-sm-4 col-md-3 ${isLoading ? 'spinning' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Uploading...' : 'SUBMIT WORK'}
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

UploadWork.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuth(UploadWork);
