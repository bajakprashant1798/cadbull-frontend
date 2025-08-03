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
  getArchitectProfileInfo,
  registerNewArchitechProfile,
  requestAccountDeletion,
  updateProfilePicture,
  updateUserProfileInfo,
  getCountries,
  getOccupations,
  getInterests,
  sendVerificationEmailApi,
} from "@/service/api";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import withAuth from "@/HOC/withAuth";
import { useRouter } from "next/router";
import { logout, updateuserProfilepic, loginSuccess, updateUserProfileId } from "../../../redux/app/features/authSlice";
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
  // // phone_no: Yup.string()
  // //   .required("This field  is required.")
  // //   .matches(/^\d{10}$/, "Mobile number must be 10 digits."),
  // zipcode:Yup.string()
  //     .required("This field  is required.")
  //     .matches(/^\d{6}$/, "Zip code must be 6 digits."),
  // gender: Yup.string().required("This field  is required."),

  
  // address1: Yup.string().required("This field is required."),
  // address2: Yup.string().required("This field is required."),
  // city: Yup.string().required("This field is required."),
  // state: Yup.string().required("This field is required."),
  // occupation: Yup.string().required("This field is required."),
  // interest: Yup.string().required("This field is required."),
  // summary: Yup.string()
  //   .required("This field is required.")
  //   .matches(/^[a-zA-Z\s].*$/, "Summary must contain letters."),
  // dob: Yup.string().required("This field is required."),
});

const EditProfile = () => {
  const Router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.logininfo || {});
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);

  // const profile_pic = user.profile_pic;
  const profile_pic =
  user.profile_pic?.startsWith("http") // already a full S3 URL
    ? user.profile_pic
    : user.profile_pic
    ? `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/profile_pic/medium/${user.profile_pic}`
    : null;

  // console.log(profile_pic, "profile_pic edit page");
    
  // console.log("tokenedit: ", token);
  // console.log("useredit: ", user);
  // console.log("profile_pic: ", profile_pic);
  
  const [resetState, setResetState] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [file, setFile] = useState(null);

  // States for dynamic dropdown lists
  const [countriesList, setCountriesList] = useState([]);
  const [occupationsList, setOccupationsList] = useState([]);
  const [interestsList, setInterestsList] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState("idle");

  const {
    register,
    handleSubmit,
    reset,
    getValues, // Get this function from useForm
    formState: { errors,isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      // first_name: profileData.first_name,
      // last_name: profileData.last_name,
      // email: profileData.email,
      // address1: profileData.address1,
      // address2: profileData.address2,
      // city: profileData.city,
      // state: profileData.state,
      // dob: profileData.dob,
      // paypal: profileData.paypal,
      // summary: profileData.summary,
      // facebook: profileData.facebook,
      // twiter: profileData.twiter,
      // // phone_no: profileData.phone_no,
      // gender: profileData.gender,
      // occupation: profileData.occupation,
      // interest: profileData.interest,
      // other_profile:''

      first_name: "",
      last_name: "",
      email: "",
      
      address1: "",
      address2: "",
      city: "",
      state: "",
      dob: "",
      paypal: "",
      summary: "",
      facebook: "",
      twiter: "",
      gender: "",
      occupation: "",
      interest: "",
      country: "", // New field for country
      zipcode: "",

      facebook: "",
      linkedin: "",
      instagram: "",
      pinterest: "",
      x: "",
      youtube: "",
    },
    
  });

  // This helper checks if the email is a valid email format
  const isValidEmail = (email) => {
    return email && /^\S+@\S+\.\S+$/.test(email);
  };
  
  // Get the verification status from the profile data
  const isVerified = profileData?.is_email_verify == 1;
  // console.log(profileData, "profileData");
  
  const hasNoRealEmail = !profileData?.email || !isValidEmail(profileData.email);

  // ✅ ADD THIS NEW HANDLER for the "Verify" button
  const handleSendVerification = async () => {
    const email = getValues("email"); // Get current value from the form field

    if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address before verifying.");
        return;
    }

    setVerificationStatus("sending");
    try {
        await sendVerificationEmailApi({ email });
        toast.success("Verification email has been sent. Please check your inbox.");
        setVerificationStatus("sent");
    } catch (error) {
        toast.error(error.response?.data?.error || "Failed to send verification email.");
        setVerificationStatus("idle");
    }
  };

  // onSubmitHandler: if profileData has an id, update; otherwise, create.
  const onSubmitHandler = (data) => {
    // console.log("onSubmitHandler called with data:", data);
    if (!isDirty) {
      // console.log("Form is not dirty. Submission halted.");
      return;
    }
  
    // Combine individual social fields into an array
    const socialNetworks = [];
    if (data.facebook) {
      socialNetworks.push({ social_network_name: "facebook", social_network_id: data.facebook });
    }
    if (data.twiter) {
      socialNetworks.push({ social_network_name: "twitter", social_network_id: data.twiter });
    }
    if (data.instagram) {
      socialNetworks.push({ social_network_name: "instagram", social_network_id: data.instagram });
    }
    if (data.linkedin) {
      socialNetworks.push({ social_network_name: "linkedin", social_network_id: data.linkedin });
    }
    if (data.pinterest) {
      socialNetworks.push({ social_network_name: "pinterest", social_network_id: data.pinterest });
    }
    if (data.youtube) {
      socialNetworks.push({ social_network_name: "youtube", social_network_id: data.youtube });
    }
  
    // Prepare payload by including the socialNetworks array
    const payload = {
      ...data,
      socialNetworks,
    };
  
    updateUserProfileInfo(payload) // This calls your upsert API endpoint
      .then((res) => {
        toast.success("Profile Saved Successfully");
  
        // Update local state with the new/updated profile.
        const updatedProfile = res.data.profile || res.data;
        const updatedUser = res.data.user; // Data from the users table
  
        setProfileData(updatedProfile);
        reset(updatedProfile);
  
        // Update localStorage with updated user details (for login persistence)
        if (updatedUser) {
          const userData = JSON.parse(localStorage.getItem("userData")) || {};
          userData.firstname = updatedUser.firstname;
          userData.lastname = updatedUser.lastname;

          if (updatedUser.profile_pic) {
            userData.profile_pic = updatedUser.profile_pic;
          }

          if (updatedProfile.profileId || updatedProfile.id) {
            // Assign profileId from updatedProfile.profileId or updatedProfile.id
            userData.profileId = updatedProfile.profileId || updatedProfile.id;
          }
          localStorage.setItem("userData", JSON.stringify(userData));
          // console.log("Updated userData:", userData);
  
          // Dispatch to update Redux state
          dispatch(loginSuccess({ user: updatedUser, status: true }));
          dispatch(updateUserProfileId({ profileId: updatedProfile.profileId || updatedProfile.id }));
        }
      })
      .catch((err) => {
        // Display specific error message from backend if available
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Profile operation failed. Please try again.");
        }
        console.error(err);
      });
  };
  
    

  // Fetch dynamic dropdown data: Countries, Occupations, Interests
  const handleCountryFocus = () => {
    if (!Array.isArray(countriesList) || countriesList.length === 0) {
      getCountries()
        .then((res) => {
          // Use res.data.countries if it exists; otherwise assume res.data is an array.
          const data = res.data.countries ? res.data.countries : res.data;
          setCountriesList(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Error fetching countries:", err));
    }
  };
  
  const handleOccupationsFocus = () => {
    if (!Array.isArray(occupationsList) || occupationsList.length === 0) {
      getOccupations()
        .then((res) => {
          const data = res.data.occupations ? res.data.occupations : res.data;
          setOccupationsList(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Error fetching occupations:", err));
    }
  };
  
  const handleInterestsFocus = () => {
    if (!Array.isArray(interestsList) || interestsList.length === 0) {
      getInterests()
        .then((res) => {
          const data = res.data.interests ? res.data.interests : res.data;
          setInterestsList(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Error fetching interests:", err));
    }
  };
  

  useEffect(() => {
    const updateProfilePic = () => {
      if (!file) return;
  
      // If profile doesn't exist, create one first before updating picture
      const updatePic = () => {
        updateProfilePicture( file)
          .then((res) => {
            toast.success("Profile Picture Updated Successfully");
            const storedUserData = localStorage.getItem("userData");
            if (storedUserData) {
              const oldDetails = JSON.parse(storedUserData);
              oldDetails.profile_pic = res.data.profile_pic_url;
              // If the response now includes a profileId, update it too:
              if (!res.data.profileId && profileData?.id) {
                oldDetails.profileId = profileData.id;
                dispatch(updateUserProfileId({ profileId: profileData.id }));
              }
              localStorage.setItem("userData", JSON.stringify(oldDetails));
            }
            dispatch(updateuserProfilepic(res.data.profile_pic_url));
            dispatch(updateUserProfileId({ profileId: res.data.profileId }));
          })
          .catch((err) => {
            if (err.response?.status === 404) {
              toast.error("Please create a profile before uploading a picture.");
            } else {
              toast.error("Profile Picture Updation Failed");
            }
          });
      };
  
      if (profileData && profileData.id) {
        // If profile exists, update picture directly
        updatePic();
      } else {
        // Otherwise, create a profile first (you might call registerNewArchitechProfile here)
        registerNewArchitechProfile({})
          .then((res) => {
            // Update local state and then update the profile picture
            setProfileData(res.data);
            reset(res.data);
            updatePic();
          })
          .catch((err) => {
            toast.error("Profile creation failed. Unable to upload picture.");
          });
      }
    };
  
    updateProfilePic();
  }, [file]);

  // Fetch the profile when the component mounts (or when resetState changes)
  // Fetch profile data when component mounts or when resetState changes
  useEffect(() => {
    getArchitectProfileInfo()
      .then((res) => {
        const profile = res.data;
        // Transform socialNetworks array to individual keys
        let socialDefaults = {};
        if (profile.socialNetworks && Array.isArray(profile.socialNetworks)) {
          profile.socialNetworks.forEach((item) => {
            // Use the social_network_name as key and id as value
            socialDefaults[item.social_network_name] = item.social_network_id;
          });
        }
        // Merge social defaults with the rest of the profile data
        const formDefaults = { ...profile, ...socialDefaults };
        setProfileData(formDefaults);
        
        reset(formDefaults);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          toast.info("No profile found. Please create one.");
        } else {
          toast.error("Error fetching profile data.");
          console.error(err);
        }
      });
  }, [isAuthenticated, dispatch, reset]);
  


  // useEffect(() => {
  //   console.log("Updated profileData:", profileData);
  // }, [profileData]);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     Router.push("/auth/login"); // Redirect to login if user is not logged in
  //   }
  // }, [isAuthenticated]);

 
  // Trigger Account Deletion
  const removeAccountHandler = async () => {
    try {
      const res = await requestAccountDeletion();
      if (res.status === 200) {
        toast.success("A confirmation email has been sent. Check your inbox.");
      } else {
        throw new Error("Failed to initiate account deletion.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Profile operation failed. Please try again.");
      }
      // console.error(err);
      // toast.error(err.message || "An error occurred while initiating deletion.");
    }
  };
  // {
  //   console.log("handleSubmit(onSubmitHandler)", handleSubmit(onSubmitHandler));
  // }

  // useEffect(() => {
  //   console.log("Validation errors:", errors);
  // }, [errors])
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
                          {profileData.first_name} <span className="fw-bold">{profileData.last_name}</span>
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
                  {/* <div className="col-lg-6 col-md-6">
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
                  </div> */}
                  {/* Email Field - with new verification logic */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Email />
                      <label>Email Address</label>
                    </div>
                    <div className="input-group">
                      <input
                        type="email"
                        {...register("email")}
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Enter Your Email Address"
                      />
                      {/* ✅ Conditional rendering for the verification button */}
                      {!isVerified && (
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={handleSendVerification}
                          disabled={verificationStatus !== 'idle'}
                        >
                          {verificationStatus === 'sending' && 'Sending...'}
                          {verificationStatus === 'sent' && 'Email Sent!'}
                          {verificationStatus === 'idle' && 'Verify'}
                        </button>
                      )}
                      {isVerified && (
                          <span className="input-group-text text-success">✓ Verified</span>
                      )}
                    </div>
                    {/* ✅ Conditional warning messages */}
                    {hasNoRealEmail && !errors.email && (
                      <p className="text-danger mt-1 small">
                        You do not have an email associated with your account. Please add and verify one.
                      </p>
                    )}
                    {!isVerified && profileData.email && isValidEmail(profileData.email) && (
                      <p className="text-warning mt-1 small">
                        Your email is not verified. <a href="#" onClick={handleSendVerification} className="link-primary">Click here to resend verification link.</a>
                      </p>
                    )}
                    {errors.email?.message && (
                      <div className="invalid-feedback text-danger">
                        {errors.email?.message}
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

                  {/* ✅ ADD THIS NEW BLOCK FOR THE PHONE NUMBER */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Phone />
                      <label>Mobile</label>
                    </div>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="form-control"
                      placeholder="Enter Your Phone Number"
                    />
                    {/* You can add validation errors here if you make it required */}
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
                    {/* <select
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
                    </select> */}

                    <input
                        type="text"
                        {...register("city")}
                        name="city"
                        className={`form-control ${errors.city ? "is-invalid" : ""}`}
                        placeholder="Enter Your City"
                        defaultValue={profileData.city}
                    />
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
                    {/* <select
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
                    </select> */}
                    <input
                        type="text"
                        {...register("state")}
                        name="state"
                        className={`form-control ${errors.state ? "is-invalid" : ""}`}
                        placeholder="Enter Your State"
                        defaultValue={profileData.state}
                    />
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

                  {/* Country Dropdown */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      {/* <Icons.Globe /> */}
                      <label>Country</label>
                    </div>
                    <select
                      {...register("country")}
                      name="country"
                      onFocus={handleCountryFocus}
                      className={`form-select ${errors.country ? "is-invalid" : ""}`}
                      aria-label="Country"
                      // defaultValue={profileData.country || ""}
                    >
                      <option value="">Select Country</option>
                      {countriesList.map((country, index) => (
                        <option key={index} value={country.country}>
                          {country.country}
                        </option>
                      ))}
                    </select>
                    {errors.country?.message && (
                      <div className="invalid-feedback text-danger">{errors.country?.message}</div>
                    )}
                  </div>

                  {/* Occupation Dropdown */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Occupation</label>
                    </div>
                    <select
                      {...register("occupation")}
                      name="occupation"
                      onFocus={handleOccupationsFocus} // still fetch options on focus if needed
                      className={`form-select ${errors.occupation ? "is-invalid" : ""}`}
                      aria-label="Occupation"
                      // The field’s value is controlled by react-hook-form (which is currently an empty string)
                    >
                      <option value="">Select Occupation</option>
                      {occupationsList.map((occ) => (
                        <option key={occ.id} value={occ.occupation}>
                          {occ.occupation}
                        </option>
                      ))}
                    </select>
                    {errors.occupation?.message && (
                      <div className="invalid-feedback text-danger">{errors.occupation?.message}</div>
                    )}
                  </div>

                  {/* Interest Dropdown */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Interest />
                      <label>Interest</label>
                    </div>
                    <select
                      {...register("interest")}
                      name="interest"
                      onFocus={handleInterestsFocus}
                      className={`form-select ${errors.interest ? "is-invalid" : ""}`}
                      aria-label="Interest"
                    >
                      <option value="">Select Interest</option>
                      {interestsList.map((int) => (
                        <option key={int.id} value={int.interest}>
                          {int.interest}
                        </option>
                      ))}
                    </select>
                    {errors.interest?.message && (
                      <div className="invalid-feedback text-danger">{errors.interest?.message}</div>
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
                      {...register("zipcode")}
                      name="zipcode"
                      className={`form-control  ${
                        errors.zipcode ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Your Zipcode"
                      // value="362720"
                    />
                      {errors.zipcode?.message && (
                        <div className="invalid-feedback text-danger">
                          {" "}
                          {errors.zipcode?.message}{" "}
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

                  {/* Instagram * */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <label className="no-required">Instagram</label>
                    </div>
                    <div className="input-group">
                      <input
                        type="url"
                        {...register("instagram")}
                        name="instagram"
                        className="form-control border-end-0"
                        placeholder="Add Instagram Link"
                        // value="https:www.Instagram.com/login"
                      />
                      <div className="input-group-text ps-0 bg-white">
                        {" "}
                        <Icons.Instagram />
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn * */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <label className="no-required">LinkedIn</label>
                    </div>
                    <div className="input-group">
                      <input
                        type="url"
                        {...register("linkedin")}
                        name="linkedin"
                        className="form-control border-end-0"
                        placeholder="Add Twitter Link"
                        // value="https:www.LinkedIn.com/login"
                      />
                      <div className="input-group-text ps-0 bg-white">
                        {" "}
                        <Icons.LinkedIn />
                      </div>
                    </div>
                  </div>

                  {/* Pinterest * */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <label className="no-required">Pinterest</label>
                    </div>
                    <div className="input-group">
                      <input
                        type="url"
                        {...register("pinterest")}
                        name="pinterest"
                        className="form-control border-end-0"
                        placeholder="Add Pinterest Link"
                        // value="https:www.pinterest.com/login"
                      />
                      <div className="input-group-text ps-0 bg-white">
                        {" "}
                        <Icons.Pinterest />
                      </div>
                    </div>
                  </div>
                  {/* YouTube * */}
                  <div className="col-lg-6 col-md-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <label className="no-required">YouTube</label>
                    </div>
                    <div className="input-group">
                      <input
                        type="url"
                        {...register("youtube")}
                        name="youtube"
                        className="form-control border-end-0"
                        placeholder="Add YouTube Link"
                        // value="https:www.youtube.com/login"
                      />
                      <div className="input-group-text ps-0 bg-white">
                        {" "}
                        <Icons.Youtube />
                      </div>
                    </div>
                  </div>
                  {/* Add another social profile * */}
                  {/* <div className="col-lg-6 col-md-6">
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
                  </div> */}
                </div>
              </div>
              {/* Buttons  */}
              <div className="row justify-content-center">
                <div className="col-md-11 col-lg-8 form-button-group">
                  <div className="mt-2 mt-md-3 d-flex flex-column flex-md-row gap-3 gap-md-2">
                    <button
                      type="submit"
                      className="btn btn-secondary w-100 rounded-2"
                      // onClick={() => console.log("Submit button clicked")}
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
