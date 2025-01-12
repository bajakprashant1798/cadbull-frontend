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
      console.log("Updating state with:", action.payload);
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      console.log("state.token:", state.token);
    },
    logout: (state, action) => {
      state.isAuthenticated = false;
      state.user = {};
      state.token = "";
    },
    updateuserProfilepic: (state, action) => {
      state.user.profile_pic = action.payload;
    },
  },
});
export const { loginSuccess, logout, setUpdatedUser, updateuserProfilepic } =
  authSlice.actions;
export default authSlice.reducer;
