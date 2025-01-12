import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawers: {
    sortBy: false,
    category: false,
    subcategory: false,
    // Add more drawers here as needed
  },
};

export const drawerSlice = createSlice({
  name: "drawer slice",
  initialState,
  reducers: {
    openDrawerHandler: (state, action) => {
      const { drawerType } = action.payload;
      state.drawers[drawerType] = true;
    },
    closeDrawerHandler: (state, action) => {
      const { drawerType } = action.payload;
      state.drawers[drawerType] = false;
    },
  },
});

export const { openDrawerHandler, closeDrawerHandler } = drawerSlice.actions;
export default drawerSlice.reducer;
