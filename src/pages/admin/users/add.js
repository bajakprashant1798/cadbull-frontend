import AdminLayout from "@/layouts/AdminLayout";
import Icons from "@/components/Icons";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { addNewUserApi, getCountriesApi } from "@/service/api";
import useLoading from "@/utils/useLoading";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required."),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters."),
  firstname: Yup.string().required("First Name is required."),
  lastname: Yup.string().required("Last Name is required."),
  email: Yup.string().email("Invalid email format").required("Email is required."),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits.")
    .required("Phone number is required."),
  country: Yup.string().required("Country is required."),
  status: Yup.string().oneOf(["0", "1"], "Invalid status").required("Status is required."),
  role: Yup.string().oneOf(["1", "2", "3", "4", "5"], "Invalid role").required("Role is required."),
});

const AddUser = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const [countries, setCountries] = useState([]); // Store fetched countries
  const [isLoading, startLoading, stopLoading] = useLoading();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // ✅ Fetch countries when the component loads
  useEffect(() => {
    getCountriesApi()
      .then((res) => {
        console.log("🔍 Countries API Response:", res.data); // Log response
        setCountries(res.data.countries);
      })
      .catch((err) => console.error("❌ Error fetching countries:", err));
  }, [isAuthenticated]);
  

  const addUserHandler = (data) => {
    if (!isDirty) return;

    startLoading();
    addNewUserApi(data)
      .then(() => {
        stopLoading();
        toast.success("User added successfully!");
        reset();
      })
      .catch((err) => {
        stopLoading();
        toast.error("Error adding user. Try again.");
        console.error("❌ Error Adding User:", err);
      });
  };

  return (
    <Fragment>
      <Head>
        <title>Add User | Admin</title>
      </Head>
      <section className="py-lg-5 py-4 profile-page">
        <div className="container">
          <h2 className="mb-4">Add New User</h2>
          <form onSubmit={handleSubmit(addUserHandler)}>
            <div className="form-wrapper rounded-xxl p-4 p-md-5 mb-md-5 mb-4">
              <div className="row g-3">
                {/* Username */}
                <div className="col-lg-6">
                  <label>Username</label>
                  <input
                    type="text"
                    {...register("username")}
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                    placeholder="Enter username"
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </div>

                {/* Password */}
                <div className="col-lg-6">
                  <label>Password</label>
                  <input
                    type="password"
                    {...register("password")}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Enter password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>

                {/* First Name */}
                <div className="col-lg-6">
                  <label>First Name</label>
                  <input
                    type="text"
                    {...register("firstname")}
                    className={`form-control ${errors.firstname ? "is-invalid" : ""}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstname && <div className="invalid-feedback">{errors.firstname.message}</div>}
                </div>

                {/* Last Name */}
                <div className="col-lg-6">
                  <label>Last Name</label>
                  <input
                    type="text"
                    {...register("lastname")}
                    className={`form-control ${errors.lastname ? "is-invalid" : ""}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastname && <div className="invalid-feedback">{errors.lastname.message}</div>}
                </div>

                {/* Email */}
                <div className="col-lg-6">
                  <label>Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter email"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                {/* Phone */}
                <div className="col-lg-6">
                  <label>Phone</label>
                  <input
                    type="text"
                    {...register("phone")}
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                </div>

                {/* ✅ Country (Dropdown) */}
                <div className="col-lg-6">
                    <label>Country</label>
                    <select
                        {...register("country")}
                        className={`form-control ${errors.country ? "is-invalid" : ""}`}
                    >
                        <option value="">Select Country</option>
                        {countries.map((c, index) => (
                        <option key={index} value={c.country}>
                            {c.country}
                        </option>
                        ))}
                    </select>
                    {errors.country && <div className="invalid-feedback">{errors.country.message}</div>}
                </div>


                {/* Status */}
                <div className="col-lg-6">
                  <label>Status</label>
                  <select
                    {...register("status")}
                    className={`form-control ${errors.status ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
                </div>

                {/* Role */}
                <div className="col-lg-6">
                  <label>Role</label>
                  <select
                    {...register("role")}
                    className={`form-control ${errors.role ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Role</option>
                    <option value="1">Super Admin</option>
                    <option value="2">User</option>
                    <option value="3">Agent</option>
                    <option value="4">Data Operator</option>
                    <option value="5">Content Creator</option>
                  </select>
                  {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
                </div>

                {/* Submit Button */}
                <div className="col-lg-12">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-secondary w-100"
                  >
                    Add User
                  </button>
                </div>

              </div>
            </div>
          </form>
        </div>
      </section>
    </Fragment>
  );
};

AddUser.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AddUser;
