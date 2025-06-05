import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  error: false,
  user: {},
  // token: "",
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
      console.log("state.isAuthenticate: ", state.isAuthenticated);
      
      // state.token = action.payload.accessToken;

      // console.log("state.user:", state.user);
      // console.log("state.token:", state.token);
    },
    logout: (state, action) => {
      state.isAuthenticated = false;
      state.user = {};

      // Only remove from localStorage if running on client
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("userData");
      }

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
