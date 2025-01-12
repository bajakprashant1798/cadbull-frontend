import axios from "axios";

//-----------------------AUTH API START-----------------------//

// API for user signup
export const signupApiHandler = (user) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/auth/signup`, user, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// API for user login
export const loginApiHandler = (user) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/auth/signin`, user);
};

// API to update user profile without a picture
export const updateProfileWithoutPicture = (user, token) => {
  return axios.patch(`${process.env.NEXT_PUBLIC_API_MAIN}/users/profile`, {user,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
};

// update profile picture 
export const updateProfilePicture=(token,file)=>{
  const formData = new FormData();
  formData.append('profile_photo', file);
   return axios.put(`${process.env.NEXT_PUBLIC_API_MAIN}/profile/photo`,formData,{
   headers:{
    Authorization:`Bearer ${token}`,
    "Content-Type": "multipart/form-data",
   },
  });
};


// API to get user profile
export const getUserProfile = (token) => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// API to initiate password reset
export const forgetPassword = (email) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_MAIN}/user/forgot-password`,
    email
  );
};

// API to reset password
export const resetPassword = (token, newPassword) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/user/reset-password`, {
    token: token,
    newPassword: newPassword,
  });
};

// API for social login
export const socialLogin = async (data) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_MAIN}/auth/social-auth`,
    data
  );
};

// API to verify OTP during login
export const verifyOtpApiHandler = async (data) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/auth/login/otp`, data);
};

// API to send OTP for various purposes
export const sendOtpApiHandler = async (mobile) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/auth/send-otp`, {
    phone_number: mobile,
  });
};

// API to update user profile information
export const updateUserProfileInfo = async (userData, token) => {
  return axios.put(
    `${process.env.NEXT_PUBLIC_API_MAIN}/profile`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// API to delete user account
export const deleteAccount = async (token) => {
  return axios.delete(
    `${process.env.NEXT_PUBLIC_API_MAIN}/profile`,
    
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//-----------------------AUTH API END-----------------------//


//-----------------------PROJECT API START-----------------------//

// Get all categories from the API
export const getallCategories = (searchTerm = "") => {
  const url = `${process.env.NEXT_PUBLIC_API_MAIN}/categories`;
  const params = searchTerm ? { search: searchTerm } : {};
  return axios.get(url, { params });
};

// Get all subcategories for a given category slug
export const getallsubCategories = (searchTerm = "", slug = "") => {
  const url = `${process.env.NEXT_PUBLIC_API_MAIN}/sub/${slug}`;
  const params = searchTerm ? { search: searchTerm } : {};
  return axios.get(url, { params });
};

// Get all projects based on pagination, search, sort, and type
export const getallprojects = (page, pageSize, searchTerm, sortTerm, type) => {
  const url = `${process.env.NEXT_PUBLIC_API_MAIN}/projects`;
  const params = {
    page: page,
    pageSize: pageSize,
  };
  if (searchTerm && searchTerm != '') {
    params.search = searchTerm;
  }
  if (type && type != '') {
    params.type = type;
  }
  if (sortTerm && sortTerm != '') {
    params.file_type = sortTerm;
  }

  return axios.get(url, { params });
};

// Get details of a single project by ID or search term
export const getsingleallprojects = (searchTerm = "", id = "") => {
  const url = `${process.env.NEXT_PUBLIC_API_MAIN}/project/${id}`;
  const params = searchTerm ? { search: searchTerm } : {};
  return axios.get(url, { params });
};

// Get similar projects for a given project ID
export const getsimilerllprojects = (page, pageSize, id = "") => {
  const url = `${process.env.NEXT_PUBLIC_API_MAIN}/project/sub/${id}`;
  const params = {
    page: page,
    pageSize: pageSize,
  };
  return axios.get(url, { params });
};

// Add a project to favorites
export const addFavouriteItem = (item, token) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/favorites`, item, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get favorite items for a user
export const getFavouriteItems = (token) => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Remove a project from favorites
export const removeFavouriteItem = (token, id) => {
  return axios.delete(`${process.env.NEXT_PUBLIC_API_MAIN}/favorite/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get public IP address
const getPublicIPAddress = async () => {
  try {
    const response = await axios.get("https://api.ipify.org/?format=json");
    const ip_address = response.data.ip;
    return ip_address;
  } catch (error) {
    console.error("Error fetching public IP address:", error);
    throw error;
  }
};

// Call viewProfile API to view a project
export const callViewProfileAPI = async (uuid) => {
  try {
    const ip_address = await getPublicIPAddress();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_MAIN}/project/view`,
      {
        project_uuid: uuid,
        ip_address: ip_address,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error calling viewProfile API:", error);
    throw error;
  }
};

// Download a project with the specified UUID
export const downloadProject = async (token, uuid) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_MAIN}/project/download/${uuid}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Record download history for a project
export const downloadHistory = async (token, uuid) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_MAIN}/project/${uuid}/download-history`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Initiate a subscription payment
export const handleSubscription = async (priceId) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_MAIN}/subscription/payment-initiate`,
    { subscriptionPlanId: priceId }
  );
};

// Get payment information for a user
export const getPaymentInformation = async (userId, sessionId) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_MAIN}/subscription/store`,
    {
      userId,
      sessionId,
    }
  );
};

// Upload a project to the API
export const uploadProjectApiHandler = async (formData, token) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_MAIN}/project/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading project:", error);
    throw error;
  }
};
//get subscription details 
export const getSubscriptionDetail=(token)=>{
  return axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/user/plan`,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
}
//get subscription details 
export const cancelSubscriptionRequest=(subscriptionId,token)=>{
  return axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/subscription/cancel-subscription`,{subscriptionId},{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
}
//create new architect profile 
export const registerNewArchitechProfile=(profileData,token)=>{
  return axios.post(`${process.env.NEXT_PUBLIC_API_MAIN}/profile`,profileData,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
}
//create new architect profile 
export const getArchitectProfileInfo=(token)=>{
  return axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/profile`,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
}
// Get categories with their subcategories
export const getCategoriesWithSubcategories = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_MAIN}/categories-with-subcategories`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);
    throw error;
  }
};

// Get a list of uploaded projects for a user
export const getUploadedProjectList = async (token, page, pageSize) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_MAIN}/project/uploaded/list?pageSize=${pageSize}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Remove a project with the specified UUID
export const removeProject = async (token, uuid) => {
  return axios.delete(
    `${process.env.NEXT_PUBLIC_API_MAIN}/project/remove/${uuid}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Get a list of blogs
export const getBlogs = async () => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/blogs`);
};

//-----------------------PROJECT API END-----------------------//


//---------------------WALLET API START-----------------------//

// Get the wallet balance for a user
export const getWalletBalance = async (token) => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/wallet`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Redeem wallet balance for a user with a specified amount
export const redeemWalletBalance = async (token, amount) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_MAIN}/wallet/redeem`,
    {
      amount: amount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Get a list of wallet redemption requests for a user
export const getRedeemRequestList = async (token) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_MAIN}/wallet/redeem/requests`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//---------------------WALLET API END-----------------------//


//------------------------OTHER APIs------------------------//


//{{url}}/sub/3d Ships and cruises CAD Blocks & CAD Model (113)/projects

export const getSubCategories = ({slug, currentPage, pageSize=12, searchTerm, sortTerm, type}) => {
  const url = `${process.env.NEXT_PUBLIC_API_MAIN}/sub/${slug}/projects`;
  const params = {
    page: currentPage,
    perPage: pageSize,
  };
  if (searchTerm) {
    params.search = searchTerm;
  }
  if (type) {
    params.type = type;
  }
  if(sortTerm){
    params.file_type= sortTerm;
  }

  return axios.get(url, { params });
};

export const getTermsPrivacyAndFaqData=()=>{
  return axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/terms`)
}

