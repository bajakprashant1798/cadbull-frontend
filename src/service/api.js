// api.js
import axios from "axios";
import store from "../../redux/app/store"; // Adjust based on your file structure
import { logout } from "../../redux/app/features/authSlice";
import { APITimer } from "../utils/apiTiming";


// ✅ Create Centralized Axios Instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_MAIN,
  // baseURL: "/api",
  withCredentials: true, // Allows sending cookies if needed
  timeout: 20000, // 20 seconds
});

// ✅ Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    // Run this logic only on the client-side
    if (typeof window !== "undefined") {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const accessToken = userData?.accessToken;
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//// ✅ Response Interceptor: Refresh Token Handling
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
      // ✅ ADD THIS LOG to see which API call failed
      console.log(
        `[AXIOS INTERCEPTOR] Received 401 for: ${originalRequest.method.toUpperCase()} ${originalRequest.url}. Attempting token refresh...`
      );

      originalRequest._retry = true;

      if (typeof window === "undefined") {
        return Promise.reject(error);
      }

      try {
        // The browser will automatically send the httpOnly refresh token cookie
        // because of `withCredentials: true`.
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_MAIN}/auth/refresh-token`,
          {},
          { withCredentials: true } // Ensures cookies are sent
        );

        const { accessToken: newAccessToken } = refreshResponse.data;

        // Update the access token in localStorage
        const userDataString = localStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          userData.accessToken = newAccessToken;
          localStorage.setItem("userData", JSON.stringify(userData));
        }

        // Update the authorization header for the original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // ✅ Retry Original Request with New Token
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh Token Failed (cookie-based):", refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper logout function – it dispatches the logout action and clears any client-stored data.
const handleLogout = () => {
  store.dispatch(logout());
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData");
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

// In your service/api.js (or a separate auth helper file)
export const logoutApiHandler = async () => {
  return api.post("/auth/logout");
};


export const getUserProfile = () => {
  // No need to pass token manually—the interceptor adds the access token.
  return api.get("/profile");
};

export const getUserData = () => {
  return api.get("/users/user-data");
};

export const getUserDetails = () => {
  return api.get("/users/details");
};

export const forgetPassword = (email) => {
  return api.post("/auth/forgot-password", email);
};

export const resetPassword = (token, newPassword) => {
  return api.post("/auth/reset-password", { token, password: newPassword }, {
    headers: { "Content-Type": "application/json" },
  });
};


export const socialLogin = async (data) => {
  return api.post("/auth/social-auth", data);
};

// export const verifyEmailApiHandler = async (token) => {
//   return fetch(`${process.env.NEXT_PUBLIC_API_MAIN}/auth/verify-email/${token}`)
//     .then((response) => {
//       if (!response.ok) throw new Error("Verification failed");
//       return response.json();
//     });
// };
export const verifyEmailApiHandler = async (token) => {
  return api.get(`/auth/verify-email/${token}`);
};

export const verifyOtpApiHandler = async (data) => {
  return api.post("/auth/login/otp", data);
};

export const sendOtpApiHandler = async (mobile) => {
  return api.post("/auth/send-otp", { phone_number: mobile });
};

export const linkPhoneApiHandler = async ({ idToken, email, phone_number }) => {
  return api.post("/auth/link-phone", {
    idToken,
    email,
    phone_number,
  });
};

// export const deleteAccount = async () => {
//   return api.delete("/profile");
// };

// Request Account Deletion
export const requestAccountDeletion = async () => {
  return api.post(`/delete-account/request`);
};

// Confirm Account Deletion
export const confirmAccountDeletion = async (token) => {
  return api.get(`/delete-account/confirm/${token}`);
};


// ===================
// PROJECT API ENDPOINTS
// ===================

export const getallCategories = async (searchTerm = "") => {
  const timer = new APITimer('getallCategories');
  try {
    const params = searchTerm ? { search: searchTerm } : {};
    timer.mark('request-params-prepared');
    
    const response = await api.get("/categories", { params });
    timer.mark('response-received');
    
    timer.complete(true, { categoriesCount: response.data?.categories?.length || 0 });
    return response;
  } catch (error) {
    timer.error(error);
    throw error;
  }
};

// Add this at the bottom of api.js (or wherever you want)
export const getCategoryBySlug = (slug) => {
  return api.get(`/categories/slug/${slug}`);
};


export const getallsubCategories = async (searchTerm = "", slug = "") => {
  const timer = new APITimer('getallsubCategories');
  try {
    const params = searchTerm ? { search: searchTerm } : {};
    timer.mark('request-params-prepared');
    
    const response = await api.get(`/categories/sub/${slug}`, { params });
    timer.mark('response-received');
    
    timer.complete(true, { subCategoriesCount: response.data?.subCategories?.length || 0, slug });
    return response;
  } catch (error) {
    timer.error(error);
    throw error;
  }
};

export const getallprojects = async (page, pageSize, searchTerm = "", sortTerm = "", type = "") => {
  const timer = new APITimer('getallprojects');
  try {
    const params = { page, pageSize };
    if (searchTerm && searchTerm.trim() !== "") params.search = searchTerm;
    if (type && type.trim() !== "") params.type = type;
    if (sortTerm && sortTerm.trim() !== "") params.file_type = sortTerm;
    
    timer.mark('request-params-prepared');
    
    const response = await api.get("/projects", { params });
    timer.mark('response-received');
    
    timer.complete(true, { 
      projectsCount: response.data?.products?.length || 0, 
      totalPages: response.data?.totalPages || 0,
      page,
      searchTerm,
      type,
      sortTerm
    });
    return response;
  } catch (error) {
    timer.error(error);
    throw error;
  }
};

export const getPaginatedProjects = (page, limit = 9) => {
  return api.get("/projects/latest", { params: { page, limit } });
};

export const getsingleallprojects = (searchTerm = "", id = "") => {
  const params = searchTerm ? { search: searchTerm } : {};
  return api.get(`/projects/${id}`, { params });
};

export const getsimilerllprojects = (page, pageSize, subcatId, excludeIds = null) => {
  const params = { page, pageSize };
  if (excludeIds) params.excludeIds = excludeIds;
  return api.get(`/projects/sub/${subcatId}`, { params });
};

export const addFavouriteItem = (product_id) => {
  return api.post("/favorites/toggle", { product_id }, {
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getFavouriteItems = () => {
  return api.get("/favorites");
};

export const getPaginatedFavouriteItems = ( page = 1, pageSize = 10) => {
  return api.get("/favorites/paginated", {
    params: { page, pageSize },
    // headers: { Authorization: `Bearer ${token}` },
  });
};


export const removeFavouriteItem = ( id) => {
  return api.delete(`/favorites/${id}`);
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

// export const downloadProject = async ( id, router) => {
//   try {
//     const response = await api.get(`/projects/download/${id}`, {
//       responseType: "blob", // Required to handle file downloads
//       // headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.status === 200) {
//       return response; // Return the response blob
//     }
//   } catch (err) {
//     console.error("🚨 Download Error:", err);

//     if (err.response) {
//       const status = err.response.status;

//       // 🔹 Handle Gold Subscription Redirect (403)
//       if (status === 403) {
//         const blobData = err.response.data;
//         const textData = await blobData.text();
//         // try {
//         //   const jsonData = JSON.parse(textData);
//         //   if (jsonData?.redirectUrl) {
//         //     console.warn("🚀 Redirecting to:", jsonData.redirectUrl);
//         //     router.push(jsonData.redirectUrl);
//         //   } else {
//         //     console.error("❌ Error: No redirect URL in response.");
//         //   }
//         // } catch (parseError) {
//         //   console.error("❌ JSON Parse Error:", parseError);
//         // }
//         try {
//           const jsonData = JSON.parse(textData);
//           throw new Error(jsonData.message || "Download limit reached.");
//         } catch (parseError) {
//           console.error("❌ JSON Parse Error:", parseError);
//           throw new Error("Download limit reached.");
//         }
//       }

//       // 🔹 Handle Unauthorized (401)
//       if (status === 401) {
//         console.warn("❌ Unauthorized. Please log in.");
//         router.push("/auth/login");
//         throw new Error("Unauthorized. Please log in.");
//       }
//     }
//   }
// };

export const downloadProject = async (id, router) => {
  const response = await api.get(`/projects/download/${id}`); // no blob
  return response;
};



// export const downloadHistory = async ( uuid) => {
//   return api.post(`/projects/${uuid}/download-history`, {});
// };

export const handleSubscription = async (priceId, userId) => {
  return api.post("/subscription/payment-initiate", { subscriptionPlanId: priceId, userId });
};

export const getPaymentInformation = async (userId, sessionId) => {
  return api.post("/subscription/store", { userId, sessionId });
};

export const uploadProjectApiHandler = async (formData) => {
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
        // Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        // console.log(`Upload Progress: ${progress}%`);
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
// export const updateUserProfileInfo(data, token) {
//   return api.put("/profile", data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };

export const getSubscriptionDetail = () => {
  return api.get("/subscription/user/plan");
};

export const cancelSubscriptionRequest = (subscriptionId) => {
  return api.post("/subscription/cancel-subscription", { subscriptionId });
};

// profile api
export const registerNewArchitechProfile = (profileData) => {
  return api.post("/profile", profileData);
};

export const getArchitectProfileInfo = () => {
  return api.get("/profile");
};

export const updateUserProfileInfo = async (userData) => {
  return api.put("/profile", userData);
};

export const updateProfilePicture = ( file) => {
  const formData = new FormData();
  formData.append("profile_photo", file);
  return api.put("/profile/photo", formData, {
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProfileWithoutPicture = (user, token) => {
  return api.patch("/profile", { user }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Use GET instead of PATCH for retrieving data
export const getCompanyProfile = (userId) => {
  return api.get(`/profile/author/${userId}`);
};

export const getCompanyProducts = (
  userId,
  { page = 1, pageSize = 12, search = "", sort, from, to } = {}
) => {
  // console.log("api call back", profileId, page, pageSize, search, sort, from, to);
  return api.get(`/profile/author/${userId}/products`, {
    params: { page, pageSize, search, sort, from, to },
    // headers: { Authorization: `Bearer ${token}` },
  });
};

export const sendVerificationEmailApi = (data) => {
  return api.post("/profile/send-verification-email", data);
};

// profile api

export const getCategoriesWithSubcategories = async () => {
  try {
    const response = await api.get("/projects/categories-with-subcategories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);
    throw error;
  }
};

export const getUploadedProjectList = async ( page = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/projects/uploaded/list?pageSize=${pageSize}&page=${page}`, {
      // headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    return response;
  } catch (error) {
    console.error("Error fetching uploaded projects:", error);
    throw error;
  }
};

export const removeProject = async ( id) => {
  return api.delete(`/projects/remove/${id}`);
};

// ✅ ADD THIS
export const claimCreditsApi = (projectId) => {
  return api.post(`/projects/${projectId}/claim-credits`);
};

export const getBlogs = async () => {
  return api.get("/blogs");
};



// ========================
// ✅ Get Subcategories for Projects Page (Public API)
// ========================
export const getSubCategories = async ({ slug, currentPage, pageSize, search, file_type, type }) => {
  try {
    const url = `/categories/sub/${slug}/projects`;
    const params = { page: currentPage, perPage: pageSize };

    console.log("Fetching subcategories with params:", { slug, currentPage, pageSize, search, file_type, type });
    

    if (search) params.search = search;
    if (type) params.type = type;
    if (file_type) params.file_type = file_type;

    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching subcategories:", error, slug);
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
// export const getUsersByRoleApi = async (role, search = "", status = "", page = 1, perPage = 10, sortColumn = "id", sortOrder = "asc") => {
//   return api.get("/admin/users", {
//     params: { 
//       role, search, status, page, perPage, sortColumn, sortOrder,
//     }
//   });
// };
// Accept a single "params" object to allow extra params (like last)
export const getUsersByRoleApi = async (params) => {
  return api.get("/admin/users", { 
    params: {
      ...params,
      // Add support for ID-based pagination
      afterId: params.afterId,
      beforeId: params.beforeId,
      last: params.last
    }
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
  return api.post("/admin/projects", formData);
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
export const updateProjectApi = async (id, formData) => {
  return api.put(`/admin/projects/${id}`, formData); // ✅ Let Axios detect content type
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
export const saveNewsletterEmailApi = async (data) => {
  return api.post("/admin/newsletter-email", data, {
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Since we're uploading an image
    },
  });
};

// ✅ Fetch all saved newsletter emails
export const getNewsletterEmailsApi = async () => {
  return api.get("/admin/newsletter-email");
};

// ✅ Send a saved newsletter email to subscribers
// ✅ Send newsletter email to subscribers (With Image)
export const sendNewsletterEmailApi = (id, formData) => {
  return api.post(`/admin/newsletter-email/send/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};



/**
 * ✅ Fetch Users Earnings for Admin Panel
 * API Route: GET `/admin/users/earnings`
 */
export const getUsersEarningsApi = async (filterStatus, page = 1, perPage = 10, token, search = "") => {
  // console.log("📢 API Call: getUsersEarningsApi()");
  // console.log("🔹 Token:", token);
  // console.log("🔹 Query Params:", { filterStatus, page, perPage, search });

  return api.get("/admin/earnings", {
    params: { status: filterStatus, page, perPage, search },
    // headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
  });
};


// ✅ Fetch Redeem Requests
export const getRedeemRequestsApi = async (is_redeem, page = 1, perPage = 10) => {
  return api.get("/admin/redeem-requests", {
    params: { is_redeem, page, perPage },
    // headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ Toggle Redeem Status
export const toggleRedeemStatusApi = async (redeemId, userId, redeemMoney) => {
  return api.patch("/admin/redeem-requests/toggle-status", {
    redeemId,
    userId,
    redeemMoney
  });
};


// Duplicate check for categories (for use in Add/Edit Category page)
export const checkCategoryNameApi = (name, id = "") => {
  return api.get("/admin/categories/check-name", { params: { name, id } });
};
// Duplicate check for projects (for use in Add/Edit Project page)
export const checkProjectNameApi = (work_title, id = "") => {
  return api.get("/admin/projects/check-name", { params: { work_title, id } });
};


// ------------------- Admin APIs -------------------- //


// ✅ Fetch Occupations
export const getOccupations = async () => {
  return api.get("/profile/occupations");
};

// ✅ Fetch countries
export const getCountries = async () => {
  return api.get("/profile/countries");
};

// ✅ Fetch interests
export const getInterests = (page = 1, perPage = 10, search = "") => {
  return api.get("/profile/interests", {
    params: { page, perPage, search },
  });
};

// ✅ Add Experience
export const addExperience = async (data) => {
  return api.post("/experiences", data);
};

// ✅ Fetch Experiences
export const getExperiences = async (accessToken) => {
  return api.get("/experiences", {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
  });
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

// search result api
export const getSearchResults = async (query, page = 1, perPage = "", file_type, type) => {
  return api.get(`/projects/search`, {
      params: { query, page, perPage, file_type, type },
  });
};



// user project delete
export const deleteUserProject = async (id) => {
  return api.delete(`/userProjects/${id}`);
};

// Expects formData (FormData instance) and a valid token
export const createUserProject = async (formData) => {
  return api.post("/userProjects", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      // Authorization: `Bearer ${token}`,
    },
  });
};

// User Prjects
export const getUserProjects = async (page = 1, pageSize = 10) => {
  return api.get("/userProjects", {
    params: { page, pageSize },
  });
};


// ========================
// ✅ Contact Us API Endpoint
// ========================

export const sendContactForm = async (contactData) => {
  try {
    const response = await api.post("/contact", contactData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error sending contact form:", error);
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to send contact form.");
    } else {
      throw new Error("Network error. Please try again.");
    }
  }
};

// ========================
// ✅ Static Content API Endpoints
// ========================

export const getTermsPrivacyAndFaqData = async () => {
  try {
    // This function can be expanded later to fetch dynamic content from backend
    // For now, returning empty structure to prevent import errors
    return {
      data: {
        terms: {
          privacy_policy: null,
          term_condition: null,
          terms_conditions: null
        },
        privacy: null,
        faq: []
      }
    };
  } catch (error) {
    console.error("❌ Error fetching terms/privacy/FAQ data:", error);
    throw new Error("Failed to fetch content data.");
  }
};

export default api;
