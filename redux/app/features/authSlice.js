import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  error: false,
  user: {},
  token: "",
  cart: [],
  isAuthenticated: false,
};
// loginSlice
const authSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log("✅ LOGIN SUCCESS:", action.payload);
      // console.log("Updating state with:", action.payload);
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      console.log("state.user:", state.user);
      console.log("state.token:", state.token);
      // sessionStorage.setItem("token", action.payload.token);  // ✅ Store token
      // sessionStorage.setItem("userData", JSON.stringify(action.payload.user)); //
    },
    logout: (state, action) => {
      state.isAuthenticated = false;
      console.log("🔴 LOGOUT authslce", state.isAuthenticated);
      
      state.user = {};
      state.token = "";
      // Clear session storage
      localStorage.removeItem("userData");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // sessionStorage.clear();
      // window.location.href = "/";
    },
    updateuserProfilepic: (state, action) => {
      state.user.profile_pic = action.payload;
    },
    // Update profile data including profile_pic and profileId
    updateUserProfileId: (state, action) => {
      if (state.user) {
        state.user.profileId = action.payload.profileId;
      }
    },
  },
});
export const { loginSuccess, logout, setUpdatedUser, updateuserProfilepic, updateUserProfileId } =
  authSlice.actions;
export default authSlice.reducer;
