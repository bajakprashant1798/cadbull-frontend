import MainLayout from "@/layouts/MainLayout";
import Icons from "@/components/Icons";
import profile from "@/assets/icons/profile.png";
import upload from "@/assets/icons/upload.png";
import flag from "@/assets/icons/flag.png";
import contact from "@/assets/icons/contact.png";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { getallprojects, sendContactForm } from "@/service/api";
import { useSelector } from "react-redux";
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
    .required("This field  is required.")
    .matches(/^\d{10}$/, "Mobile number must be 10 digits."),
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

  // State for the contact form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const contactSubmitHandler = async (contactData) => {
    try {
      await sendContactForm(contactData);
      toast.success('Your query has been sent successfully!');
      reset(); // Reset the form
    } catch (error) {
      console.error("❌ Error sending contact form:", error);
      toast.error("Failed to send your query. Please try again later.");
    }
  };

  useEffect(() => {
    // We assume your API returns an object with a property like `totalProducts`
    getallprojects(1, 1, "", "", "") // Fetch only one product (or use a dedicated endpoint)
      .then((response) => {
        // Use total count from the API response (adjust field name accordingly)
        const count = response.data.totalProducts || 0;
        setProductCount(count);
      })
      .catch((error) => {
        console.error("Error fetching product count:", error);
      });
  }, [token]);


  // You can format productCount as needed (for example, using commas)
  // const formattedCount = productCount.toLocaleString();

  return (
    <Fragment>
      <Head>
        <title>Contact Us | Cadbull </title>
        <meta name="description" content="World Largest 2d CAD Library." />
      </Head>
      <section className="py-lg-5 py-4 auth-page">
        <div className="container">
          <div className="row mb-4 justify-content-center">
            <div className="col-xxl-12">
              <PageHeading
                title={"Contact Us"}
                description={
                  `Choose from ${productCount}+ Free & Premium CAD Files with new additions published every second month.`
                }
              />

              <div className="text-md-center mt-3 mb-4">
                {/* Contact Detail  */}
                <ul className="d-xxl-flex justify-content-between gap-2 align-content-center mb-0">
                  {contactDetail.map((res, index) => {
                    return (
                      <li
                        key={index}
                        className="d-flex gap-2 align-items-center mb-3 mb-xxl-0"
                      >
                        <span>{res.image}</span>
                        <h6 className="text-primary fw-semibold">
                          {res.detail}
                        </h6>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <div className="row mx-2 gx-4 gy-3 form-wrapper rounded-xxl align-items-center">
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
            <div className="col-md-5">
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
                    <div className="input-group">
                      <div 
                      className={` input-group-text pe-0 bg-white ${errors.phone_no?" form-control is-invalid":""}`}
                      >
                        <div className="dropdown">
                          <button
                            className="dropdown-toggle border-0 bg-white"
                            type="button"
                            // data-bs-toggle="dropdown"
                            // aria-expanded="false"
                          >
                            <img src={flag.src} width={24} alt="profile" />{" "}
                            <span> +91</span>
                          </button>
                          {/* <ul className="dropdown-menu  border-0 shadow-lg pt-1 mt-2">
                            <li>
                              <a className="dropdown-item">+92</a>
                            </li>
                            <li>
                              <a className="dropdown-item">+93</a>
                            </li>
                            <li>
                              <a className="dropdown-item">+93</a>
                            </li>
                          </ul> */}
                        </div>
                      </div>
                      <input
                        type="text"
                        {...register("phone_no")}
                        name="phone_no"
                        className={`ps-1 border-start-0 form-control  ${errors.phone_no?"is-invalid":""}`}
                        placeholder="Enter Your Phone Number"
                        // value=""
                      />
                       {errors.phone_no?.message && (
                      <div className="invalid-feedback text-danger">
                        {" "}
                        {errors.phone_no?.message}{" "}
                      </div>
                    )}
                    </div>
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
            <div className="col-md-7">
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
            </div>
          </div>
        </div>
      </section>
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
