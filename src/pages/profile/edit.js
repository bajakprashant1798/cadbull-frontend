import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import profile from "@/assets/icons/profile.png";
import upload from "@/assets/icons/upload.png";
import flag from "@/assets/icons/flag.png";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading";
import { useForm } from "react-hook-form";
import {
  deleteAccount,
  getUserProfile,
  removeFavouriteItem,
  requestAccountDeletion,
  updateProfilePicture,
  updateProfileWithoutPicture,
  updateUserProfileInfo,
} from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import withAuth from "@/HOC/withAuth";
import { useRouter } from "next/router";
import { logout, updateuserProfilepic } from "../../../redux/app/features/authSlice";
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
  paypal: Yup.string().required("This field is required."),
  phone_no: Yup.string()
    .required("This field  is required.")
    .matches(/^\d{10}$/, "Mobile number must be 10 digits."),
  gender: Yup.string().required("This field  is required."),

  
  address1: Yup.string().required("This field is required."),
  address2: Yup.string().required("This field is required."),
  city: Yup.string().required("This field is required."),
  state: Yup.string().required("This field is required."),
  occupation: Yup.string().required("This field is required."),
  interest: Yup.string().required("This field is required."),
  summary: Yup.string()
    .required("This field is required.")
    .matches(/^[a-zA-Z\s].*$/, "Summary must contain letters."),
  dob: Yup.string().required("This field is required."),
});

const EditProfile = () => {
  const Router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.logininfo || {});
  const profile_pic = user.profile_pic;
  console.log("tokenedit: ", token);
  console.log("useredit: ", user);
  
  const [resetState, setResetState] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [file, setFile] = useState(null);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors,isDirty },
  } = useForm({
    defaultValues: {
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: profileData.email,
      address1: profileData.address1,
      address2: profileData.address2,
      city: profileData.city,
      state: profileData.state,
      dob: profileData.dob,
      paypal: profileData.paypal,
      summary: profileData.summary,
      facebook: profileData.facebook,
      twiter: profileData.twiter,
      // phone_no: profileData.phone_no,
      gender: profileData.gender,
      occupation: profileData.occupation,
      interest: profileData.interest,
      // other_profile:''
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmitHandler = (updatedProfileData) => {
    //do nothing if form values is not modified 
     if(!isDirty) return
    updateUserProfileInfo(updatedProfileData, token)
      .then((res) => {
        // console.log("update profile api res", res.data);
        // reset(res.data);
        toast.success("Profile Updated Successfully", {
          position: "top-center",
        });
        setResetState(!resetState)
      })
      .catch((err) => {
        toast.error("Profile Updation Failed");
        // console.log("err", err);
      });
    };
    
    useEffect(() => {
      const updateProfilePic = () => {
        if (!file) return;
        updateProfilePicture(token, file)
          .then((res) => {
            // console.log("update profile pic", res.data)
            toast.success("Profile Picture Updated Successfully");
            const storedUserData = sessionStorage.getItem("userData");
             if(storedUserData){
                const oldDetails= JSON.parse(storedUserData);
                oldDetails.profile_pic = res.data.profile_pic_url;
                sessionStorage.setItem('userData',JSON.stringify(oldDetails))
                // console.log("edit profile pic url: ", oldDetails, res.data.profile_pic_url);
                // console.log("profile_pic: ", profile_pic);
                
             }
             
            dispatch(updateuserProfilepic(res.data.profile_pic_url));
          })
          .catch((err) => {
            if (err.response?.status === 404) {
              toast.error("Please create a profile before uploading a picture.");
            } else {
              toast.error("Profile Picture Updation Failed");
            }
          });
      };
    
      updateProfilePic();
    }, [file]); // Change the dependency to [file]
    

  useEffect(() => {
    getUserProfile(token)
      .then((res) => {
        // console.log("profile:", res.data);
        
        dispatch(loginSuccess({ user: res.data, status: true })); // Update Redux state
        sessionStorage.setItem("userData", JSON.stringify(res.data)); // Update session storage
      })
      .catch((err) => console.error(err));
  }, [resetState, profile_pic]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  // useEffect(() => {
  //   getUserProfile(token)
  //     .then((res) => {
  //       // console.log("user profile api", res.data);
  //       const data = res.data;
  //       reset(res.data);
  //       setProfileData(res.data);
  //     })
  //     .catch((err) => {
  //       // console.log(err);
  //       console.error(err);
  //     });
  // }, [resetState]);

  useEffect(() => {
    if (!token) {
      Router.push("/auth/login"); // Redirect to login if user is not logged in
    }
  }, [token]);

  // const removeAccountHandler = async () => {
  //   try {
  //     const res = await deleteAccount(token);
  //     if (res.status === 200) {
  //       dispatch(logout());
  //       sessionStorage.removeItem("userData");
  //       toast.success("Account Removed Successfully");
  //       Router.push("/");
  //     } else {
  //       throw new Error("Failed to remove account");
  //     }
  //   } catch (err) {
  //     toast.error(err.message || "An error occurred while removing the account");
  //   }
  // };
  // Trigger Account Deletion
  const removeAccountHandler = async () => {
    try {
      const res = await requestAccountDeletion(token);
      if (res.status === 200) {
        toast.success("A confirmation email has been sent. Check your inbox.");
      } else {
        throw new Error("Failed to initiate account deletion.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while initiating deletion.");
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Edit Profile | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <section className="py-lg-5 py-4 profile-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading
                title={"Edit Profile"}
                description={
                  "Choose from 254195+ Free & Premium CAD Files with new additions published every second month."
                }
              />
            </div>
          </div>
          {/* Form */}
          <div>
            <form
              className="needs-validation"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className="form-wrapper rounded-xxl p-3 p-md-4 p-lg-5 mb-md-4 mb-3">
                <div className="row g-3">
                  {/* Upload Profile Image */}
                  <div className="col-lg-12">
                    <div className="d-flex gap-3 align-items-center">
                     {
                      profile_pic?(
                        <>
                         <div className="position-relative d-inline-block round-image">
                        <img src={profile_pic} width={80} alt="profile" style={{borderRadius:"50%"}} />
                        <div className="upload-icon-wraper position-absolute end-0 bottom-0">
                          <input onChange={handleFileChange} type="file" className="opacity-0" />
                          <div className="icon-upload">
                            <img src={upload.src} width={24} alt="profile" />
                          </div>
                        </div>
                      </div>
                        </>

                      ):(
                        <>
                         <div className="position-relative d-inline-block">
                        <img src={profile.src} width={80} alt="profile" />
                        <div className="upload-icon-wraper position-absolute end-0 bottom-0">
                          <input onChange={handleFileChange} type="file" className="opacity-0" />
                          <div className="icon-upload">
                            <img src={upload.src} width={24} alt="profile" />
                          </div>
                        </div>
                      </div>
                        </>
  )
                     }
                      {/* Profile Detail  */}
                      <div>
                        <h4 className="text-primary">
                          {profileData.name} <span className="fw-bold">{profileData.last_name}</span>
                        </h4>
                        <p>
                          manage your personal information, password and more
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Personal Information */}
                  <div className="col-lg-12">
                    <div className="mt-3">
                      <h5 className="text-primary">
                        Personal <span className="fw-bold">Information</span>
                      </h5>
                    </div>
                  </div>
                  {/* First Name */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>First Name</label>
                    </div>
                    <input
                      {...register("first_name")}
                      name="first_name"
                      type="text"
                      className={`form-control ${
                        errors.first_name?.message ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your First Name"
                      defaultValue={profileData.first_name}
                    />
                    {errors.first_name?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.first_name?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Last Name */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Last Name</label>
                    </div>
                    <input
                      type="text"
                      {...register("last_name")}
                      name="last_name"
                      className={`form-control ${
                        errors.last_name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Last Name"
                      defaultValue={profileData.last_name}
                    />
                    {errors.last_name?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.last_name?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Email  */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Email />
                      <label>Email Address</label>
                    </div>
                    <input
                      type="email"
                      {...register("email")}
                      name="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Email Address"
                      defaultValue={profileData.email}
                    />
                    {errors.email?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.email?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* PayPal ID  */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.PayPal />
                      <label>PayPal ID</label>
                    </div>
                    <input
                      type="text"
                      {...register("paypal")}
                      name="paypal"
                      className={`form-control ${
                        errors.paypal ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your PayPal ID"
                      defaultValue={profileData.paypal}
                    />
                    {errors.paypal?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.paypal?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Mobile  */}
                  {/* <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Phone />
                      <label>Mobile</label>
                    </div>
                    <div className="input-group ">
                      <div
                        className={` input-group-text pe-0 bg-white ${
                          errors.phone_no ? " form-control is-invalid" : ""
                        }`}
                      >
                        <div className="dropdown ">
                          <button
                            className="dropdown-toggle border-0 bg-white"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img src={flag.src} width={24} alt="profile" />{" "}
                            <span> +91</span>
                          </button>
                          <ul className="dropdown-menu  border-0 shadow-lg pt-1 mt-2"></ul>
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
                        defaultValue={profileData.phone_no}
                      />
                      {errors.phone_no?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.phone_no?.message}{" "}
                        </div>
                      )}
                    </div>
                  </div> */}
                  {/* Address 1 */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Address />
                      <label>Address 1</label>
                    </div>
                    <input
                      type="text"
                      {...register("address1")}
                      name="address1"
                      className={` form-control  ${
                        errors.address1 ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Address"
                      defaultValue={profileData.address1}
                    />
                    {errors.address1?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.address1?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Address 2 */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Address />
                      <label>Address 2</label>
                    </div>
                    <input
                      type="text"
                      {...register("address2")}
                      name="address2"
                      className={` form-control  ${
                        errors.address2 ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Address"
                      defaultValue={profileData.address2}
                    />
                    {errors.address2?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.address2?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* City */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Building />
                      <label>City</label>
                    </div>
                    <select
                      // defaultValue="Gujrat"
                      {...register("city")}
                      name="city"
                      className={` form-select  ${
                        errors.city ? "is-invalid" : ""
                      }`}
                      aria-label="City"
                    >
                      <option value="">Select City</option>
                      <option value="mohali">Mohali</option>
                      <option value="shimla">Shimla</option>
                      <option value="gujrat">Gujrat</option>
                    </select>
                    {errors.city?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.city?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* State */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Building />
                      <label>State</label>
                    </div>
                    <select
                      // defaultValue="Ahmedabad"
                      {...register("state")}
                      name="state"
                      className={` form-select  ${
                        errors.state ? "is-invalid" : ""
                      }`}
                      aria-label="State"
                    >
                      <option value="">Select State</option>
                      <option value="punjab">Punjab</option>
                      <option value="himanchal">Himachal</option>
                      <option value="ahmedabad">Ahmedabad</option>
                    </select>
                    {errors.state?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.state?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Gender */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Gender</label>
                    </div>
                    <select
                      // defaultValue="Male"
                      {...register("gender")}
                      name="gender"
                      className={` form-select  ${
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
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.DOB />
                      <label>Birth Date</label>
                    </div>
                    <input
                      type="date"
                      {...register("dob")}
                      name="dob"
                      className={` form-control  ${
                        errors.dob ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Birth Date"
                      defaultValue={profileData.dob}
                    />
                    {errors.dob?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.dob?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Occupation */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Occupation</label>
                    </div>
                    <select
                      // defaultValue="Architect"
                      {...register("occupation")}
                      name="occupation"
                      className={` form-select  ${
                        errors.occupation ? "is-invalid" : ""
                      }`}
                      aria-label="State"
                    >
                      <option value="">Select Occupation</option>
                      <option value="Architect">Architect</option>
                      <option value="Designer">Designer</option>
                    </select>
                    {errors.occupation?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.occupation?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Interest */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Interest />
                      <label>Interest</label>
                    </div>
                    <select
                      // defaultValue="Academics community"
                      {...register("interest")}
                      name="interest"
                      className={` form-select  ${
                        errors.interest ? "is-invalid" : ""
                      }`}
                      aria-label="State"
                    >
                      <option value="">Select Interest</option>
                      <option value="Academics community">
                        Academics community
                      </option>
                      <option value="Academics community">
                        Academics community
                      </option>
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
                      className={` form-control  ${
                        errors.summary ? "is-invalid" : ""
                      }`}
                      {...register("summary")}
                      name="summary"
                      placeholder="Write Summary"
                    ></textarea>
                    {errors.summary?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.summary?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Title  */}
                  <div className="divider mt-4 mb-2"></div>
                  <div>
                    <h5 className="text-black">
                      Social <span>Profile</span>
                    </h5>
                  </div>
                  {/* Facebook * */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <label className="no-required">Facebook</label>
                    </div>
                    <div className="input-group">
                      <input
                        type="url"
                        {...register("facebook")}
                        name="facebook"
                        className="form-control border-end-0"
                        placeholder="Add Facebook Link"
                        // value="https:www.facebook.com/login"
                      />
                      <div className="input-group-text ps-0 bg-white">
                        {" "}
                        <Icons.FacebookProfile />
                      </div>
                    </div>
                  </div>
                  {/* Twitter * */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <label className="no-required">Twitter</label>
                    </div>
                    <div className="input-group">
                      <input
                        type="url"
                        {...register("twiter")}
                        name="twiter"
                        className="form-control border-end-0"
                        placeholder="Add Twitter Link"
                        // value="https:www.twitter.com/login"
                      />
                      <div className="input-group-text ps-0 bg-white">
                        {" "}
                        <Icons.Twitter />
                      </div>
                    </div>
                  </div>
                  {/* Add another social profile * */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <label className="no-required">
                        Add another social profile
                      </label>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        // {...register('other_profile')}
                        // name='other_profile'
                        className="form-control border-end-0"
                        placeholder="Add another social profile"
                        // value="www.example.com/login"
                      />
                      <div className="input-group-text ps-0 bg-white">
                        {" "}
                        <Icons.AddOutline />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Buttons  */}
              <div className="row justify-content-center">
                <div className="col-md-11 col-lg-8 form-button-group">
                  <div className="mt-2 mt-md-3 d-flex flex-column flex-md-row gap-3 gap-md-2">
                    <button
                      type="submit"
                      className="btn btn-secondary w-100 rounded-2"
                    >
                      Save Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        //do nothing if form values has not changed
                        if(!isDirty) return 
                        setResetState(!resetState);
                      }}
                      className="btn btn-danger-variant  w-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={()=>{
                       Router.push('/profile/billing')
                      }}
                      className="btn btn-primary w-100 rounded-2 btn-primary-variant{"
                    >
                      Manage Billing
                    </button>
                    <button
                      type="button"
                      className="btn btn-light-secondary w-100"
                      // onClick={() => removeAccountHandler()}
                      onClick={removeAccountHandler}
                    >
                      Delete Account
                    </button>
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

EditProfile.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default withAuth(EditProfile);
