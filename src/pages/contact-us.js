import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import Head from "next/head";
import { Fragment, useEffect, useState, useRef } from "react";
import PageHeading from "@/components/PageHeading";
import ContactSuccessModal from "@/components/ContactSuccessModal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { getallprojects, sendContactForm } from "@/service/api";
import { useSelector } from "react-redux";
import logo from "@/assets/images/logo.png";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReCAPTCHA from "react-google-recaptcha";
import { trackContact, trackLead } from "@/lib/fbpixel";

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
  phone_no: Yup.string()
    .required("This field is required.")
    .min(8, "Please enter a valid phone number."),
  message: Yup.string()
    .required("This field is required.")
    .matches(/^[a-zA-Z\s].*$/, "Message must contain letters."),
});

const contactDetail = [
  {
    image: <Icons.PhoneRed />,
    detail: "+91 989 874 8697",
  },
  {
    image: <Icons.EmailRed />,
    detail: "support@cadbull.com",
  },
  {
    image: <Icons.AddressRed />,
    detail:
      "403 Fortune Business Hub Beside Shell Petrol Pump Science City Road, Sola, Ahmedabad"
  },
];

const ContactUs = () => {

  const [productCount, setProductCount] = useState(null);
  const token = useSelector((store) => store.logininfo.token);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  
  // State for phone number
  const [phone, setPhone] = useState("");
  
  // State for reCAPTCHA
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);
  
  // State for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State for the contact form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleCaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const contactSubmitHandler = async (contactData) => {
    try {
      // Check if reCAPTCHA is completed
      if (!recaptchaValue) {
        toast.error("Please complete the reCAPTCHA.");
        return;
      }

      // Include the phone number and captcha in the contact data
      const formDataWithPhone = {
        ...contactData,
        phone_no: phone,
        captcha: recaptchaValue
      };
      await sendContactForm(formDataWithPhone);
      
      // Track contact form submission with Meta Pixel
      trackContact();
      trackLead();
      
      // Show success modal instead of toast
      setShowSuccessModal(true);
      
      // Reset the form
      reset();
      setPhone("");
      setRecaptchaValue(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.error("❌ Error sending contact form:", error);
      toast.error("Failed to send your query. Please try again later.");
    }
  };

  // useEffect(() => {
  //   // We assume your API returns an object with a property like `totalProducts`
  //   getallprojects(1, 1, "", "", "") // Fetch only one product (or use a dedicated endpoint)
  //     .then((response) => {
  //       // Use total count from the API response (adjust field name accordingly)
  //       const count = response.data.totalProducts || 0;
  //       setProductCount(count);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching product count:", error);
  //     });
  // }, [isAuthenticated]);

  // Update form value when phone changes
  useEffect(() => {
    setValue("phone_no", phone);
  }, [phone, setValue]);


  // You can format productCount as needed (for example, using commas)
  // const formattedCount = productCount.toLocaleString();

  return (
    <Fragment>
      <Head>
        <title>Contact the Cadbull Support Team for your query</title>
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/contact-us`} />
        <meta name="description" content="Get in touch with Cadbull for support, feedback, or inquiries related to CAD drawings, DWG files, and architectural design content. We're here to help you." />

        <meta property="og:title" content="Contact the Cadbull Support Team for your query" />
        <meta property="og:description" content="Get in touch with Cadbull for support, feedback, or inquiries related to CAD drawings, DWG files, and architectural design content. We're here to help you." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_FRONT_URL}/contact-us`} />
        <meta property="og:image" content={logo} />
        <meta name="twitter:title" content="Contact the Cadbull Support Team for your query" />
        <meta name="twitter:description" content="Get in touch with Cadbull for support, feedback, or inquiries related to CAD drawings, DWG files, and architectural design content. We're here to help you." />
        <meta name="twitter:image" content={logo} />
        <meta name="keywords" content="autocad,autocad file,dwg file,dwg.,autocad files dwg,architecture plan,home plan, modern building,plan,hotel plan,architecture blocks,interior design blocks, autocad blocks,dwg blocks, modern architecture plan in dwg , modern architecture plan dwg, dwg files, architecture projects in autocad, dwg file download, download free dwg, 3ds, autocad, dwg, block, cad, 2d cad library, cad library dwg, cad model library, cad detail library, online cad library, cad symbol library, cad symbol library, cad parts library, cad furniture" />
      </Head>
      <section className="py-lg-5 py-4 auth-page">
        <div className="container">
          <div className="row mb-4 justify-content-center">
            <div className="col-xxl-12">
              <PageHeading
                title={"Contact Us"}
                // description={
                //   `Choose from ${productCount}+ Free & Premium CAD Files with new additions published every second month.`
                // }
                description={
                  `Got a question, idea, or just want to chat? We’re always happy to hear from you!`
                }
              />
            </div>
          </div>
                
          <div className="row mx-2 gx-4 gy-3 col-lg-8 mx-auto form-wrapper rounded-xxl align-items-center">
            <div className="col-md-12">
              <div className="mb-3 mb-md-4 p-md-4">
                <h3 className="mb-1 text-primary">
                  Get In
                  <span> Touch!</span>
                </h3>
                <div className="d-flex gap-3 align-items-md-center flex-column flex-md-row">
                  <p className="flex-shrink-0">
                    Tell us more about yourself and what you're got in mind{" "}
                  </p>
                  <div className="divider flex-shrink-0 flex-grow-1 w-xs-100"></div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="p-lg-4">
                {/* Form  */}
                <form onSubmit={handleSubmit(contactSubmitHandler)} className="row g-3 mb-3 mb-md-4">
                  {/* First Name  */}
                  <div className="col-xl-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>First Name</label>
                    </div>
                    <input
                      type="text"
                     {...register("first_name")}
                    className={`form-control ${
                      errors.first_name?.message ? "is-invalid" : ""
                    }`}
                    name="first_name"
                      placeholder="Type First Name"
                      // value=""
                    />
                     {errors.first_name?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.first_name?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Last Name  */}
                  <div className="col-xl-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Last Name</label>
                    </div>
                    <input
                    {...register("last_name")}
                    className={`form-control ${
                      errors.last_name?.message ? "is-invalid" : ""
                    }`}
                    name="last_name"
                    type="text"
                    placeholder="Type Last Name"
                    // value=""
                    />
                     {errors.last_name?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.last_name?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Phone Number *  */}
                  <div className="col-lg-12">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Phone />
                      <label>Phone Number</label>
                    </div>
                    <PhoneInput
                      country={'in'} // Default to India
                      value={phone}
                      onChange={val => setPhone('+' + val.replace(/^\+/, ''))}
                      enableSearch
                      inputProps={{
                        name: 'phone_no',
                        required: true,
                        className: `form-control ${errors.phone_no ? "is-invalid" : ""}`,
                      }}
                      inputStyle={{ 
                        width: "100%",
                        borderColor: errors.phone_no ? "#dc3545" : "#ced4da"
                      }}
                      containerStyle={{ width: "100%" }}
                      // Optional: onlyCountries={['us', 'in', 'ae', ...]}
                    />
                    {/* Hidden input for form validation */}
                    <input
                      type="hidden"
                      {...register("phone_no")}
                      value={phone}
                    />
                    {errors.phone_no?.message && (
                      <div className="invalid-feedback text-danger d-block">
                        {errors.phone_no?.message}
                      </div>
                    )}
                  </div>
                  {/* Email  */}
                  <div className="col-lg-12">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Email />
                      <label>Email Id</label>
                    </div>
                    <input
                      type="email"
                      {...register("email")}
                        name="email"
                     className={`form-control  ${errors.email?"is-invalid":""}`}
                      placeholder="Enter Your Email"
                      // value=""
                    />
                     {errors.email?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.email?.message}{" "}
                      </div>
                    )}
                  </div>
                  {/* Message */}
                  <div className="col-lg-12">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Edit />
                      <label className="no-required">Message</label>
                    </div>
                    <textarea
                     {...register("message")}
                     name="message"
                  className={`form-control  ${errors.message?"is-invalid":""}`}
                      placeholder="Write Message"
                    ></textarea>
                     {errors.message?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.message?.message}{" "}
                      </div>
                    )}
                  </div>

                  {/* reCAPTCHA */}
                  <div className="col-lg-12">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={handleCaptchaChange}
                    />
                  </div>

                  <div className="col-lg-12">
                    <div className="mt-2 mt-md-3">
                      <button
                        type="submit"
                        className="btn btn-lg btn-secondary w-100"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* <div className="col-md-7">
              <div className="form-wrapper-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.494254112248!2d72.49892347456726!3d23.078996079134274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9cc0b90151e1%3A0x9e601a850ba19348!2sFortune%20Business%20Hub!5e0!3m2!1sen!2sin!4v1707131007386!5m2!1sen!2sin"
                  className="w-100 rounded-3"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      
      {/* Success Modal */}
      <ContactSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </Fragment>
  );
};

ContactUs.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

// export async function getStaticProps() {
//   // For a static page, if you need to fetch any rarely updated data, do it here.
//   return {
//     props: {},
//     revalidate: 300, // Revalidate every 5 minutes (optional)
//   };
// }

export default ContactUs;
