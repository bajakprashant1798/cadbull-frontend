import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
};

export const modalSlice = createSlice({
  name: "modal slice",
  initialState,
  reducers: {
    openModalHandler: (state, action) => {
      state.showModal = true;
    },
    closeModalHandler: (state, action) => {
      state.showModal = false;
    },
  },
});

export const { openModalHandler, closeModalHandler } = modalSlice.actions;
export default modalSlice.reducer;
