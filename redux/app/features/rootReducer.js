import authSlice from "./authSlice";
import breadCrumbSlice from "./breadCrumbSlice";
import drawerSlice from "./drawerSlice";
import modalSlice from "./modalSlice";
import projectsSlice from "./projectsSlice";

export const rootReducer = {
  logininfo: authSlice,
  projectinfo: projectsSlice,
  modalState: modalSlice,
  breadCrumbState:breadCrumbSlice,
  drawerState:drawerSlice
};
