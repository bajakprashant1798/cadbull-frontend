import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import { projectsSlice } from "./features/projectsSlice";
import { rootReducer } from "./features/rootReducer";

export const store = configureStore({
  reducer: rootReducer,
});
