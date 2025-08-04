import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import * as api from "@/service/api";
import AdminLayout from "@/layouts/AdminLayout";
import { toast } from "react-toastify";
import { loginSuccess } from "../../../../redux/app/features/authSlice"; // Import Redux action

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  // const { token } = useSelector((store) => store.logininfo);
  const isAuthenticated = useSelector((store) => store.logininfo.isAuthenticated);
  const { register, handleSubmit, reset } = useForm();
  
  // const [storedToken, setStoredToken] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load token from sessionStorage safely
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const sessionToken = sessionStorage.getItem("accessToken");
  //     setStoredToken(sessionToken);
  //   }
  // }, []);

  // ✅ Restore Redux token if missing
  // useEffect(() => {
  //   if (!token && storedToken) {
  //     const savedUser = localStorage.getItem("userData");
  //     if (savedUser) {
  //       dispatch(loginSuccess({ user: JSON.parse(savedUser), token: storedToken }));
  //     }
  //   }
  // }, [dispatch, token, storedToken]);

  // ✅ Fetch user data
  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        // const authToken = token || storedToken;
        if (!isAuthenticated) {
          toast.error("Token is missing, please login again.");
          return router.push("/auth/login");
        }

        // console.log("Fetching user with token:", authToken);
        const response = await api.getUserByIdApi(id);

        if (response.data?.user) {
          reset(response.data.user);
          console.log("User data loaded:", response.data.user);
        } else {
          toast.error("User data is missing");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Error fetching user details");
      } finally {
        setLoading(false); // ✅ Ensure loading state updates
      }
    };

    fetchUserData();
  }, [id, reset, isAuthenticated,  router]);

  // ✅ Fetch country list
  useEffect(() => {
    // const authToken = token || storedToken;
    if (!isAuthenticated) return;
    
    api.getCountriesApi()
      .then((res) => setCountries(res.data.countries))
      .catch((err) => console.error("❌ Error fetching countries:", err));
  }, [ isAuthenticated]);

  const onSubmit = async (data) => {
    try {
      // const authToken = token || storedToken;
      await api.updateUserApi(id, data);
      toast.success("User updated successfully!");
      router.push("/admin/users/view-users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    }
  };

  // ✅ Ensure page does not stay stuck in loading state
  if (loading) return <p>Loading user data...</p>;

  return (
    <AdminLayout>
      <div className="container ">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input className="form-control" {...register("firstname")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input className="form-control" {...register("lastname")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" {...register("email")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input className="form-control" type="text" {...register("phone")} />
          </div>

          <div className="mb-3">
            <label className="form-label">Country</label>
            <select className="form-control" {...register("country")}>
              {[...new Set(countries.map(c => c.country))].map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select className="form-control" {...register("status")}>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select className="form-control" {...register("role")}>
              <option value="1">Admin</option>
              <option value="2">User</option>
              <option value="3">Agent</option>
              <option value="4">Data Operator</option>
              <option value="5">Content Creator</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Update User</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditUser;
