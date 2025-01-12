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

// const QuillNoSSRWrapper = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <p>Loading ...</p>,
// });

const UploadWork = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const QuillNoSSRWrapper = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { token } = useSelector((store) => store.logininfo.user);
  const { categoryAndSubCategory } = useSelector((store) => store.projectinfo);
  const [subCategory, setSubCategory] = useState([]);
  const [isLoading, startLoading, stopLoading] = useLoading();
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

  // Function to handle form submission
  const handleSubmit = (event) => {
    startLoading();
    event.preventDefault();
    // You can now access formData and perform any necessary actions, such as sending it to the server.
    uploadProjectApiHandler(formData, token)
      .then((res) => {
        // console.log(res);
        toast.success("Project Uploaded Successfully")
        stopLoading();
        router.push("/my-projects");
      })
      .catch((err) => {
        // console.log(err);
        stopLoading();
      });
  };

  const handleUploadfile = (file) => {
    setFormData({ ...formData, file: file[0] });
  };

  const handleUploadImage = (file) => {  
    setFormData({ ...formData, image: file[0] });
  };

  useEffect(()=>{
     if(categoryAndSubCategory.length===0){
      getCategoriesWithSubcategories().then((res)=>{
        dispatch(addCategoryAndSubCategoryData(res))
        setSubCategory(res[0]?.project_sub_categories)
        // console.log('api response upload==========',res)
      }).catch((err)=>{
        // console.log(err)
      })
     }
  },[categoryAndSubCategory])
  return (
    <Fragment>
      <Head>
        <title>Upload Work | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <section className="py-lg-5 py-4 auth-page">
        <div className="container">
          <div className="row mb-2">
            <div className="col-md-12">
              <PageHeading
                title={"Upload Work"}
                description={"Simple. Fast. Beautiful."}
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-9 col-xl-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-4 mb-md-5">
                  <UploadFiles
                    acceptedFiles=" .zip file only"
                  callback={handleUploadfile}
                  />
                </div>
                <div className="row mb-4 mb-md-5 g-3">
                  {/* Work Title */}
                  <div className="col-lg-12">
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
                  </div>
                  {/* Description */}
                  <div className="col-lg-12">
                    <div>
                      <label htmlFor="description">Description</label>
                    </div>
                    <QuillNoSSRWrapper
                      theme="snow"
                      placeholder="The clearer and shorter the better"
                      onChange={(content)=>setFormData({...formData, description: content})}
                    />
                  </div>
                  {/* File Type */}
                  <div className="col-lg-6">
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
                  </div>
                  {/* Category */}
                  <div className="col-lg-6">
                    <div>
                      <label htmlFor="category">Category</label>
                    </div>
                    <select
                      className="form-select"
                      aria-label="Category"
                      value={formData.category_id}
                      onChange={(e) =>{
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        }),
                        categoryAndSubCategory.filter((item)=>{
                          if(item.id == e.target.value){
                            setSubCategory(item.project_sub_categories)
                            // console.log("sub",item)
                          }
                        })

                      }
                      }
                    >
                      {
                        categoryAndSubCategory.map((item,index)=>{
                          return(
                            <option key={index} value={item.id}>{item.title}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                  {/* Subcategory */}
                  <div className="col-lg-6">
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
                    >{
                      subCategory.map((item,index)=>{
                        return(
                          <option key={index} value={item.id}>{item.title}</option>
                        )
                      })
                    }
            
                    </select>
                  </div>
                  {/* Keyword */}
                  <div className="col-lg-6">
                    <div>
                      <label htmlFor="keyword">Keyword</label>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Keyword"
                      value={formData.keyword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          keyword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mb-4 mb-md-5">
                  <div>
                    <label className="mb-2">Upload Image</label>
                  </div>
                  <UploadFiles callback={handleUploadImage} />
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
