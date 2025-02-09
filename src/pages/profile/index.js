import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import flag from "@/assets/icons/flag.png";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import withAuth from "@/HOC/withAuth";
import { useForm } from "react-hook-form";
import { getArchitectProfileInfo, registerNewArchitechProfile, updateUserProfileInfo } from "@/service/api";
import { useSelector } from "react-redux";
import useLoading from "@/utils/useLoading";
import compareObjChanges from "@/utils/compareObjChanges";
const validationSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("This field is required.")
    .matches(/^[a-zA-Z\s]+$/, "First Name must be letters."),
  last_name: Yup.string()
    .required("This field is required.")
    .matches(/^[a-zA-Z\s]+$/, "Last Name must be letters."),

  email: Yup.string()
    .required("This field is required.")
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
      message: "Please enter a valid email address",
    }),
  // paypal: Yup.string().required("This field is required."),
  phone_no: Yup.string()
    .required("This field  is required.")
    .matches(/^\d{10}$/, "Mobile number must be 10 digits."),
    zip_code:Yup.string()
    .required("This field  is required.")
    .matches(/^\d{6}$/, "Zip code must be 6 digits."),
  gender: Yup.string().required("This field  is required."),

  // resume: Yup.mixed()
  //   .required('Resume is required.')
  //   .test('fileType', 'Only PDF files are accepted.', (value) => {
  //     const file = value[0]; // Type assertion
  //   //   console.log('selected file ',file)
  //     return file && file.type === 'application/pdf';
  //   })
  //   .test('fileSize', 'File size must be 10 MB or less.', (value) => {
  //     const file = value[0]; // Type assertion
  //     return file && file.size <= 10 * 1024 * 1024; // 10 MB in bytes
  //   }),

  address: Yup.string().required("This field is required."),
  awards: Yup.string()
  .required("This field is required.")
  .matches(/^[a-zA-Z\s]+$/, "Award Name must contain letters."),
  award_date:Yup.string().required('This field is required.'),
  city: Yup.string().required("This field is required."),
  state: Yup.string().required("This field is required."),
  country: Yup.string().required("This field is required."),
  occuption: Yup.string().required("This field is required."),
  interest: Yup.string().required("This field is required."),
  summary: Yup.string()
    .required("This field is required.")
    .matches(/^[a-zA-Z\s].*$/, "Summary must contain letters."),
  birth_date: Yup.string().required("This field is required."),
});

const DesignerProfile = () => {
  const { token } = useSelector((store) => store.logininfo);
  // console.log("token:", token);
  
  const [isLoading,startLoading,stopLoading]=useLoading()
  const [existingArchitectProfile,setExistingArchitectProfile]=useState({})
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors,isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const createOrUpdateProfileHandler = (profileData) => {
     //do nothing if form field is not changed
     if(!isDirty) return 
    startLoading()

    const apiCall = existingArchitectProfile?.first_name
      ? updateUserProfileInfo // If profile exists, call update API
      : registerNewArchitechProfile; // If profile doesn't exist, call create API

      apiCall(profileData, token)
      .then((res) => {
        stopLoading();
        if (existingArchitectProfile?.first_name) {
          toast.success("Profile updated successfully");
        } else {
          toast.success("Your architect profile created successfully");
        }
        
        setExistingArchitectProfile({});
        
        
      })
      .catch((err) => {
        stopLoading();
        toast.error("Something went wrong");
        console.error("Error:", err);
      });
  };
  // console.log('error ',errors)
  //default values
  useEffect(()=>{
    setValue("country","india",{shouldValidate:true})
  },[])

  // Fetch existing profile information
  useEffect(() => {
    if (Object.keys(existingArchitectProfile).length === 0) {
       
      getArchitectProfileInfo(token)
        .then((res) => {
          const profileData = res.data;
          reset(profileData); // Populate form with fetched data
          setExistingArchitectProfile(profileData); // Set existing profile data
        })
        .catch((err) => {
          console.error('Error:', err);
          if (err.response?.status === 404) {
            // Handle 404: Profile not found
            toast.error('Profile not found. Please create a new profile.');
          } else {
            toast.error('Something went wrong. Please try again.');
          }
        });
    }
  }, [existingArchitectProfile, token, reset]);

  //  useEffect(()=>{

  //   if(Object.values(existingArchitectProfile).length==0){
  //     getArchitectProfileInfo(token).then((res)=>{
  //      const {first_name,last_name,email,phone_no,gender,occuption,interest,city,country,state,summary,award_date,awards,address,zip_code,birth_date}=res.data
  //      reset({
  //       first_name,last_name,email,phone_no,gender,occuption,interest,city,country,state,summary,award_date,awards,address,zip_code,birth_date
  //      });
  //      setExistingArchitectProfile({
  //       first_name,last_name,email,phone_no,gender,occuption,interest,city,country,state,summary,award_date,awards,address,zip_code,birth_date
  //      })
  //     }).catch((err)=>{
  //       console.log('error',err)
  //       // setExistingArchitectProfile()
  //      })
  //    }
  //  },[
  //   existingArchitectProfile, token, reset
  //  ])
  return (
    <Fragment>
      <Head>
        <title>Architect Profile | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>

      <section className="py-lg-5 py-4 profile-page designer-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading
                title={"Architect Profile"}
                description={
                  "Choose from 254195+ Free & Premium CAD Files with new additions published every second month."
                }
              />
            </div>
          </div>
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit(createOrUpdateProfileHandler)}>
              <div className="form-wrapper rounded-xxl p-4 p-md-5 mb-md-5 mb-4">
                <div className="row g-3">
                  {/* Personal Information */}
                  <div className="col-lg-12">
                    <div className="mt-3">
                      <h5 className="text-primary">
                        Personal <span className="fw-bold">Information</span>
                      </h5>
                    </div>
                  </div>
                  {/* First Name */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>First Name</label>
                    </div>
                    <input
                      type="text"
                      name="first_name"
                      {...register('first_name')}
                      className={`form-control ${
                        errors.first_name?.message ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your First Name"
                      // value="Zaha Hadid"
                    />
                      {errors.first_name?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.first_name?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Last Name */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Last Name</label>
                    </div>
                    <input
                      type="text"
                      name="last_name"
                      {...register('last_name')}
                      className={`form-control ${
                        errors.last_name?.message ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Last Name"
                      // value="LLP"
                    />
                      {errors.last_name?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.last_name?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Email  */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Email />
                      <label>Email Address</label>
                    </div>
                    <input
                      type="email"
                      name="email"
                      {...register('email')}
                      className={`form-control ${
                        errors.email?.message ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Email Address"
                      // value="technical.elenationllp@gmail.com"
                    />
                      {errors.email?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.email?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Mobile  */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Phone />
                      <label>Mobile</label>
                    </div>
                    <div className="input-group">
                      <div 
                      className={` input-group-text pe-0 bg-white ${
                        errors.phone_no ? " form-control is-invalid" : ""
                      }`}
                      
                      >
                        <div className="dropdown">
                          <button
                            className="dropdown-toggle border-0 bg-white"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img src={flag.src} width={24} alt="profile" />{" "}
                            <span> +91</span>
                          </button>
                          <ul className="dropdown-menu  border-0 shadow-lg pt-1 mt-2">
                            <li>
                              <a className="dropdown-item">+92</a>
                            </li>
                            <li>
                              <a className="dropdown-item">+93</a>
                            </li>
                            <li>
                              <a className="dropdown-item">+93</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <input
                        type="text"
                        {...register("phone_no")}
                        name="phone_no"
                        className={`ps-1 border-start-0 form-control  ${
                          errors.phone_no ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Your Mobile"
                        // value="989 874 8697"
                      />
                        {errors.phone_no?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.phone_no?.message}{" "}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Awards  */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Awards />
                      <label>Awards</label>
                    </div>
                    <div className="d-flex gap-2">
                     <div className="w-100">
                     <input
                        type="text"
                        {...register("awards")}
                        name="awards"
                        className={`form-control  ${
                          errors.awards ? "is-invalid" : ""
                        }`}
                        placeholder="Type of awards name"
                        // value=""
                      />
                       {errors.awards?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.awards?.message}{" "}
                        </div>
                      )}
                     </div>
                     <div className="w-100">
                     <input
                        type="date"
                        {...register("award_date")}
                        name="award_date"
                        className={`form-control  ${
                          errors.award_date ? "is-invalid" : ""
                        }`}
                        placeholder="Select of Year"
                        // value=""
                      />
                      {errors.award_date?.message && (
                        <div className="invalid-feedback text-danger ">
                          {" "}
                          {errors.award_date?.message}{" "}
                        </div>
                      )}
                     </div>
                       
                    </div>
                  </div>
                  {/* Address  */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Address />
                      <label>Address</label>
                    </div>
                    <input
                      type="text"
                      {...register("address")}
                      name="address"
                      className={`form-control  ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Address"
                      //value="403 Fortune Business Hub, Beside Science City, Science City Road Sola,"
                    />
                      {errors.address?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.address?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* City */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Building />
                      <label>City</label>
                    </div>
                    <select
                      defaultValue="Gujrat"
                      {...register("city")}
                      name="city"
                      className={`form-control  ${
                        errors.city ? "is-invalid" : ""
                      }`}
                      aria-label="City"
                    >
                      <option value="">Select City</option>
                      <option value="mohali">Mohali</option>
                      <option value="shimla">Shimla</option>
                      <option value="ahmedabad">Ahmedabad</option>
                    </select>
                    {errors.city?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.city?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* State */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Building />
                      <label>State</label>
                    </div>
                    <select
                      defaultValue="Ahmedabad"
                      {...register("state")}
                      name="state"
                      className={`form-control  ${
                        errors.state ? "is-invalid" : ""
                      }`}
                      aria-label="State"
                    >
                      <option value="">Select State</option>
                      <option value="punjab">Punjab</option>
                      <option value="himanchal">Himachal</option>
                      <option value="gujrat">Gujrat</option>
                    </select>
                    {errors.state?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.state?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Zipcode  */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Zipcode />
                      <label>Zipcode</label>
                    </div>
                    <input
                      type="text"
                      {...register("zip_code")}
                      name="zip_code"
                      className={`form-control  ${
                        errors.zip_code ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Zipcode"
                      // value="362720"
                    />
                      {errors.zip_code?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.zip_code?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Country  */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Map />
                      <label>Country</label>
                    </div>
                    <div className="input-group w-100 select-country">
                      <div className="input-group-text pe-0 bg-white w-100">
                        <div className="dropdown w-100 text-start">
                          <button
                            className="dropdown-toggle border-0 bg-white w-100 text-start"
                            type="button"
                            
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img src={flag.src} width={24} alt="profile" />
                            <span className="ms-2">India</span>
                          </button>
                          <ul
                          //  {...register("country")}
                          //  name="country"
                           className={`dropdown-menu  border-0 shadow-lg pt-1 mt-2 w-100 form-control  ${
                             errors.country ? "is-invalid" : ""
                           }`}
                           
                           >
                            <li onClick={()=>{
                               setValue("country","india",{shouldValidate:true})
                            }}>
                              <a className="dropdown-item">
                                <img src={flag.src} width={24} alt="profile" />
                                <span className="ms-2">India</span>
                              </a>
                            </li>
                            {/* <li>
                              <a className="dropdown-item">
                                <img src={flag.src} width={24} alt="profile" />
                                <span className="ms-2">India</span>
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item">
                                <img src={flag.src} width={24} alt="profile" />
                                <span className="ms-2">India</span>
                              </a>
                            </li> */}
                          </ul>
                          {errors.country?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.country?.message}{" "}
                        </div>
                      )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Gender</label>
                    </div>
                    <select
                      // defaultValue="Male"
                      {...register("gender")}
                      name="gender"
                      className={`form-control  ${
                        errors.gender ? "is-invalid" : ""
                      }`}
                      aria-label="State"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.gender?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Birth Date */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.DOB />
                      <label>Birth Date</label>
                    </div>
                    <input
                      type="date"
                      {...register("birth_date")}
                      name="birth_date"
                      className={`form-control  ${
                        errors.birth_date ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Birth Date"
                      // value="20 Feb, 2023"
                    />
                      {errors.birth_date?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.birth_date?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Occupation */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Occupation</label>
                    </div>
                    <select
                      defaultValue="Architect"
                      {...register("occuption")}
                      name="occuption"
                      className={`form-control  ${
                        errors.occuption ? "is-invalid" : ""
                      }`}
                      aria-label="State"
                    >
                      <option value="">Select Occupation</option>
                      <option value="architect">Architect</option>
                      <option value="designer">Designer</option>
                    </select>
                    {errors.occuption?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.occuption?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Interest */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Interest />
                      <label>Interest</label>
                    </div>
                    <select
                      defaultValue="Academics community"
                      {...register("interest")}
                      name="interest"
                      className={`form-control  ${
                        errors.interest ? "is-invalid" : ""
                      }`}
                      aria-label="State"
                    >
                      <option value="">Select Interest</option>
                      <option value="academics community">Academics community</option>
                      <option value="academics community">Academics community</option>
                    </select>
                    {errors.interest?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.interest?.message}{" "}
                        </div>
                      )}
                  </div>
                  {/* Summary */}
                  <div className="col-lg-12">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Edit />
                      <label>Summary</label>
                    </div>
                    <textarea
                      placeholder="Write Summary"
                      {...register("summary")}
                      name="summary"
                      className={`form-control  ${
                        errors.summary ? "is-invalid" : ""
                      }`}
                    ></textarea>
                      {errors.summary?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.summary?.message}{" "}
                        </div>
                      )}
                  </div>
                  <div className="row justify-content-start">
                <div className="col-md-11 col-lg-8 form-button-group">
                  <div className="mt-2 mt-md-3 d-flex flex-column flex-md-row gap-3 gap-md-2">
                    <button
                      type="submit"
                      disabled={isLoading && true}
                      className="btn btn-secondary w-100 rounded-2"
                    >
                     {existingArchitectProfile?.first_name?" Update Profile":"Create Profile"}
                    </button>
                     <button
                      type="button"
                      disabled={isLoading && true}
                      style={{visibility:existingArchitectProfile?.first_name?"visible":'hidden'}}
                      onClick={() => {
                        //do nothing if form values has not changed
                        if(!isDirty) return 
                        setExistingArchitectProfile({})
                      }}
                      className="btn btn-danger-variant  w-100 "
                    >
                      Cancel
                    </button>
                    
                    
                  </div>
                </div>
              </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

DesignerProfile.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuth(DesignerProfile);
