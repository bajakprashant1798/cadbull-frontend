import { createSlice } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
const initialState = {
  breadCrumbs: [],
};

const breadCrumbSlice = createSlice({
  name: "breadCrumb",
  initialState,
  reducers: {
    addNewBreadCrumbPath: (state, action) => {
      let { path, url } = action.payload;
      if (
        typeof path === "string" &&
        path.trim() &&
        typeof url === "string" &&
        url.trim()
      ) {
        const allbreadCrumbs = state.breadCrumbs;
        const isExist = allbreadCrumbs.find((curPath) => curPath.url === url);
        if (isExist) return;
        allbreadCrumbs.push({ path, url });
        state.breadCrumbs = allbreadCrumbs;
      }
    },
  },
});
export const { addNewBreadCrumbPath } = breadCrumbSlice.actions;
export default breadCrumbSlice.reducer;
