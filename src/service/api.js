// api.js
import axios from "axios";

// ✅ Create Centralized Axios Instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_MAIN,
  withCredentials: true, // Allows sending cookies if needed
  timeout: 20000, // 20 seconds
});

// ✅ Helper Functions to Retrieve Tokens
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken"); // ✅ From localStorage

// ✅ Request Interceptor: Attach Authorization Header
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Refresh Token Handling
// ✅ Response Interceptor: Refresh Token Handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Handle Timeout Errors
    if (error.code === "ECONNABORTED") {
      console.error("❌ Request Timeout Error: Retrying...");
      return Promise.reject(error);
    }

    // ✅ If Access Token Expired & No Retry Attempt Yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("hello");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.error("❌ No Refresh Token Found in Storage. Redirecting to login...");
          handleLogout();
          return Promise.reject(error);
        }

        console.log("🔄 Refreshing Token with:", refreshToken);

        // ✅ Send Refresh Token in Headers
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_MAIN}/auth/refresh-token`,
          {},
          { headers: { "x-refresh-token": refreshToken } }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        console.log("✅ New Access Token Received:", newAccessToken);

        // ✅ Store New Access Token
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // ✅ Retry Original Request with New Token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh Token Failed:", refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Logout function (Ensures proper redirect to `/`)
const handleLogout = () => {
  console.log("🔴 Logging out user due to refresh token expiry...");

  // ✅ Remove tokens from storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");

  // ✅ Ensure logout event is triggered
  window.dispatchEvent(new Event("userLoggedOut"));

  // ✅ Refresh the page ONCE after logout
  if (!localStorage.getItem("logoutReloaded")) {
    localStorage.setItem("logoutReloaded", "true");
    setTimeout(() => {
      window.location.reload(); // ✅ Ensures Redux state update before reload
    }, 100);
  }

  // ✅ Redirect only if user is on a protected route
  if (window.location.pathname.startsWith("/admin")) {
    window.location.href = "/auth/login";
  }
};







// ===================
// AUTH API ENDPOINTS
// ===================

export const signupApiHandler = (user) => {
  return api.post("/auth/signup", user, {
    headers: { "Content-Type": "application/json" },
  });
};

export const loginApiHandler = (user) => {
  return api.post("/auth/signin", user);
};

export const updateProfileWithoutPicture = (user, token) => {
  return api.patch("/users/profile", { user }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProfilePicture = (token, file) => {
  const formData = new FormData();
  formData.append("profile_photo", file);
  return api.put("/profile/photo", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserProfile = () => {
  // No need to pass token manually—the interceptor adds the access token.
  return api.get("/user/profile");
};

export const getUserData = () => {
  return api.get("/users/user-profile");
};

export const getUserDetails = () => {
  return api.get("/users/details");
};

export const forgetPassword = (email) => {
  return api.post("/user/forgot-password", email);
};

export const resetPassword = (token, newPassword) => {
  return api.post("/user/reset-password", { token, newPassword });
};

export const socialLogin = async (data) => {
  return api.post("/auth/social-auth", data);
};

export const verifyEmailApiHandler = async (token) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_MAIN}/auth/verify-email/${token}`)
    .then((response) => {
      if (!response.ok) throw new Error("Verification failed");
      return response.json();
    });
};

export const verifyOtpApiHandler = async (data) => {
  return api.post("/auth/login/otp", data);
};

export const sendOtpApiHandler = async (mobile) => {
  return api.post("/auth/send-otp", { phone_number: mobile });
};

export const updateUserProfileInfo = async (userData, token) => {
  return api.put("/profile", userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAccount = async () => {
  return api.delete("/profile");
};

// ===================
// PROJECT API ENDPOINTS
// ===================

export const getallCategories = (searchTerm = "") => {
  const params = searchTerm ? { search: searchTerm } : {};
  return api.get("/categories", { params });
};

export const getallsubCategories = (searchTerm = "", slug = "") => {
  const params = searchTerm ? { search: searchTerm } : {};
  return api.get(`/categories/sub/${slug}`, { params });
};

export const getallprojects = (page, pageSize, searchTerm = "", sortTerm = "", type = "") => {
  const params = { page, pageSize };
  if (searchTerm && searchTerm.trim() !== "") params.search = searchTerm;
  if (type && type.trim() !== "") params.type = type;
  if (sortTerm && sortTerm.trim() !== "") params.file_type = sortTerm;
  return api.get("/projects", { params });
};

export const getPaginatedProjects = (page, limit = 9) => {
  return api.get("/projects/latest", { params: { page, limit } });
};

export const getsingleallprojects = (searchTerm = "", id = "") => {
  const params = searchTerm ? { search: searchTerm } : {};
  return api.get(`/projects/${id}`, { params });
};

export const getsimilerllprojects = (page, pageSize, id = "") => {
  const params = { page, pageSize };
  return api.get(`/projects/sub/${id}`, { params });
};

export const addFavouriteItem = (product_id, token) => {
  return api.post("/favorites/toggle", { product_id }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getFavouriteItems = (token) => {
  return api.get("/favorites", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeFavouriteItem = (token, id) => {
  return api.delete(`/favorites/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const checkIfFavorited = async (token, id) => {
  return api.get(`/favorites/check/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getPublicIPAddress = async () => {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("❌ Error fetching public IP address:", error);
    return "0.0.0.0"; // Fallback IP
  }
};


export const callViewProfileAPI = async (uuid) => {
  try {
    const ip_address = await getPublicIPAddress();
    const response = await api.post("/project/view", {
      project_uuid: uuid,
      ip_address,
    });
    return response.data;
  } catch (error) {
    console.error("Error calling viewProfile API:", error);
    throw error;
  }
};

export const downloadProject = async (token, id, router) => {
  return api({
    url: `/projects/download/${id}`,
    method: "POST",
    responseType: "blob",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(async (err) => {
    console.log("🚨 Catching Error:", err);
    if (err.response?.status === 403) {
      const blobData = err.response.data;
      const textData = await blobData.text();
      const jsonData = JSON.parse(textData);
      if (jsonData?.redirectUrl) {
        router.push(jsonData.redirectUrl);
      } else {
        console.error("❌ Download error:", err);
      }
    }
  });
};

export const downloadHistory = async (token, uuid) => {
  return api.post(`/projects/${uuid}/download-history`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const handleSubscription = async (priceId, userId) => {
  return api.post("/subscription/payment-initiate", { subscriptionPlanId: priceId, userId });
};

export const getPaymentInformation = async (userId, sessionId) => {
  return api.post("/subscription/store", { userId, sessionId });
};

export const uploadProjectApiHandler = async (formData, token) => {
  try {
    const data = new FormData();
    data.append("file", formData.file);
    data.append("image", formData.image);
    data.append("work_title", formData.work_title);
    data.append("description", formData.description);
    data.append("file_type", formData.file_type);
    if (formData.category_id && formData.category_id !== "") {
      data.append("category_id", formData.category_id);
    }
    if (formData.subcategory_id && formData.subcategory_id !== "") {
      data.append("subcategory_id", formData.subcategory_id);
    }
    data.append("keyword", formData.keyword);
    const response = await api.post("/projects/upload", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        console.log(`Upload Progress: ${progress}%`);
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error uploading project:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to upload project.");
    } else {
      throw new Error("Network error. Please try again.");
    }
  }
};

export const getSubscriptionDetail = (token) => {
  return api.get("/subscription/user/plan", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const cancelSubscriptionRequest = (subscriptionId, token) => {
  return api.post("/subscription/cancel-subscription", { subscriptionId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const registerNewArchitechProfile = (profileData, token) => {
  return api.post("/profile", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getArchitectProfileInfo = (token) => {
  return api.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCategoriesWithSubcategories = async () => {
  try {
    const response = await api.get("/projects/categories-with-subcategories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);
    throw error;
  }
};

export const getUploadedProjectList = async (token, page = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/projects/uploaded/list?pageSize=${pageSize}&page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    return response;
  } catch (error) {
    console.error("Error fetching uploaded projects:", error);
    throw error;
  }
};

export const removeProject = async (token, id) => {
  return api.delete(`/projects/remove/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getBlogs = async () => {
  return api.get("/blogs");
};



// ========================
// ✅ Get Subcategories for Projects Page (Public API)
// ========================
export const getSubCategories = async ({ slug, currentPage, pageSize = 12, searchTerm, sortTerm, type }) => {
  try {
    const url = `/categories/sub/${slug}/projects`;
    const params = { page: currentPage, perPage: pageSize };

    if (searchTerm) params.search = searchTerm;
    if (type) params.type = type;
    if (sortTerm) params.file_type = sortTerm;

    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching subcategories:", error);
    throw error;
  }
};






// ------------------- Admin APIs -------------------- //
// ✅ Add a New Admin User
export const addNewUserApi = async (data) => {
  return api.post("/admin/users", data);
};

// ✅ Get User by ID
export const getUserByIdApi = (id) => {
  return api.get(`/admin/users/${id}`);
};

// ✅ Get Users by Role with Filters
export const getUsersByRoleApi = async (role, searchTerm, filterStatus, page, perPage) => {
  return api.get("/admin/users", {
    params: { role, search: searchTerm, status: filterStatus, page, perPage },
  });
};

// ✅ Update an Existing User
export const updateUserApi = (id, data) => {
  return api.put(`/admin/users/${id}`, data);
};

// ✅ Toggle User Status (Activate/Deactivate)
export const toggleUserStatusApi = (id) => {
  return api.patch(`/admin/users/${id}/toggle-status`);
};

// ✅ Get Country List
export const getCountriesApi = async () => {
  return api.get("/admin/countries");
};

// ----------------- Admin Categories ----------------- //
// ✅ Add New Category
export const addCategoryApi = (data) => {
  return api.post("/admin/categories", data);
};

// ✅ Edit Existing Category
export const editCategoryApi = (id, data) => {
  return api.put(`/admin/categories/${id}`, data);
};

// ✅ Fetch Categories (Supports Pagination, Search, Sorting)
export const getCategoriesApi = async (status, page = 1, perPage = 10, search = "", sortColumn = "id", sortOrder = "desc") => {
  return api.get("/admin/categories", {
    params: { status, page, perPage, search, sortColumn, sortOrder },
  });
};

// ✅ Fetch Single Category by ID
export const getCategoryByIdApi = (id) => {
  return api.get(`/admin/categories/${id}`);
};

// ========================
// ✅ Get Subcategories for Admin Panel (Protected API)
// ========================
export const getSubcategoriesApi = async (categoryId) => {
  try {
    const response = await api.get(`/admin/categories/${categoryId}/subcategories`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching admin subcategories:", error);
    throw error;
  }
};

// ✅ Toggle Category Status (Activate/Deactivate)
export const toggleCategoryStatusApi = (id) => {
  return api.patch(`/admin/categories/${id}/toggle-status`);
};

// ----------------- Admin Occupations ----------------- //
export const getOccupationsApi = (page = 1, perPage = 10, search = "") => {
  return api.get("/admin/occupations", {
    params: { page, perPage, search },
  });
};

export const getOccupationByIdApi = (id) => {
  return api.get(`/admin/occupations/${id}`);
};

export const addOccupationApi = (data) => {
  return api.post("/admin/occupations", data);
};

export const editOccupationApi = (id, data) => {
  return api.put(`/admin/occupations/${id}`, data);
};

export const deleteOccupationApi = (id) => {
  return api.delete(`/admin/occupations/${id}`);
};

// ----------------- Admin Interests ----------------- //
export const getInterestsApi = (page = 1, perPage = 10, search = "") => {
  return api.get("/admin/interests", {
    params: { page, perPage, search },
  });
};

export const getInterestByIdApi = (id) => {
  return api.get(`/admin/interests/${id}`);
};

export const addInterestApi = (data) => {
  return api.post("/admin/interests", data);
};

export const editInterestApi = (id, data) => {
  return api.put(`/admin/interests/${id}`, data);
};

export const deleteInterestApi = (id) => {
  return api.delete(`/admin/interests/${id}`);
};

// ----------------- Admin Search ----------------- //
export const getSearchWordsApi = (page = 1, perPage = 10, search = "") => {
  return api.get("/admin/searches", {
    params: { page, perPage, search },
  });
};

export const deleteSearchWordApi = (id) => {
  return api.delete(`/admin/searches/${id}`);
};

// ----------------- Admin Change Password ----------------- //
export const changePasswordApi = (data) => {
  return api.post("/admin/change-password", data);
};

// ----------------- Admin Newsletter ----------------- //
export const addSubscriberApi = async (data) => {
  return api.post("/admin/newsletters", data);
};

export const getSubscribersApi = async (searchTerm = "", page = 1, perPage = 10) => {
  return api.get("/admin/newsletters", {
    params: { search: searchTerm, page, perPage },
  });
};

export const getSubscriberByIdApi = async (id) => {
  return api.get(`/admin/newsletters/${id}`);
};

export const updateSubscriberApi = async (id, data) => {
  return api.put(`/admin/newsletters/${id}`, data);
};

export const deleteSubscriberApi = async (id) => {
  return api.delete(`/admin/newsletters/${id}`);
};

// ----------------- Admin Project ----------------- //
// ✅ Add Project (With File Upload)
export const addProjectApi = async (formData) => {
  return api.post("/admin/projects", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Fetch Projects with Pagination
export const getProjectsApi = async (searchTerm = "", product_id = "", status = "all", category_id = "", subcategory_id = "", page = 1, perPage = 10) => {
  return api.get("/admin/projects", {
    params: { searchTerm, product_id, status, category_id, subcategory_id, page, perPage },
  });
};

// ✅ Get Project by ID
export const getProjectByIdApi = (id) => {
  return api.get(`/admin/projects/${id}`);
};

// ✅ Update Project (With File Upload)
export const updateProjectApi = async (id, data) => {
  const formData = new FormData();

  // ✅ Append all non-file fields
  Object.keys(data).forEach((key) => {
    if (key !== "file" && key !== "image") {
      formData.append(key, data[key]);
    }
  });

  // ✅ Append file & image if they exist
  if (data.file && data.file.length > 0) {
    formData.append("file", data.file[0]);
  }
  if (data.image && data.image.length > 0) {
    formData.append("image", data.image[0]);
  }

  return api.put(`/admin/projects/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Delete Project
export const deleteProjectApi = (id) => {
  return api.delete(`/admin/projects/${id}`);
};

// ✅ Fetch Categories with Subcategories for Admin Panel
export const getAdminCategoriesWithSubcategories = async () => {
  return api.get("/admin/categories-with-subcategories");
};


// ==========================
// ✅ Newsletter Email APIs
// ==========================

// ✅ Save a new newsletter email
export const saveNewsletterEmailApi = async (data, token) => {
  return api.post("/admin/newsletter-email", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Since we're uploading an image
    },
  });
};

// ✅ Fetch all saved newsletter emails
export const getNewsletterEmailsApi = async (token) => {
  return api.get("/admin/newsletter-email", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Send a saved newsletter email to subscribers
// ✅ Send newsletter email to subscribers (With Image)
export const sendNewsletterEmailApi = (id, formData, token) => {
  return api.post(`/admin/newsletter-email/send/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
};



/**
 * ✅ Fetch Users Earnings for Admin Panel
 * API Route: GET `/admin/users/earnings`
 */
export const getUsersEarningsApi = async (filterStatus, page = 1, perPage = 10, token, search = "") => {
  console.log("📢 API Call: getUsersEarningsApi()");
  console.log("🔹 Token:", token);
  console.log("🔹 Query Params:", { filterStatus, page, perPage, search });

  return api.get("/admin/earnings", {
    params: { status: filterStatus, page, perPage, search },
    headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
  });
};


// ✅ Fetch Redeem Requests
export const getRedeemRequestsApi = async (is_redeem, page = 1, perPage = 10, token) => {
  return api.get("/admin/redeem-requests", {
    params: { is_redeem, page, perPage },
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Toggle Redeem Status
export const toggleRedeemStatusApi = async (redeemId, userId, redeemMoney, token) => {
  return api.patch("/admin/redeem-requests/toggle-status", {
    redeemId,
    userId,
    redeemMoney
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};




// ------------------- Admin APIs -------------------- //


// ✅ Fetch Occupations
export const getOccupations = async () => {
  return api.get("/occupations");
};

// ✅ Add Experience
export const addExperience = async (data) => {
  return api.post("/experiences", data);
};

// ✅ Fetch Experiences
export const getExperiences = async () => {
  return api.get("/experiences");
};


/**
 * ✅ Get the wallet balance for the logged-in user.
 * API Route: GET `/wallet/balance`
 */
export const getWalletBalance = async () => {
  return api.get("/wallet/balance");
};

/**
 * ✅ Submit a wallet withdrawal request.
 * API Route: POST `/wallet/redeem`
 */
export const redeemWalletBalance = async (amount) => {
  return api.post("/wallet/redeem", { amount });
};

/**
 * ✅ Get a list of wallet redemption requests for the logged-in user.
 * API Route: GET `/wallet/redeem-requests`
 */
export const getRedeemRequestList = async () => {
  return api.get("/wallet/redeem-requests");
};




export default api;
