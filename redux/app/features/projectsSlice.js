import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: null,
  error: false,
  projects: [],
  singleProduct: {},
  favouriteList: [],
  sortList: "",
  categoriesList: [],
  subCategoriesList: [],
  categoryAndSubCategory:[],
  homepagestore: {
    currentPage: 1,
    totalPages: 1,
    searchTrem: "",
    sortTerm: "",
  },
  similarProjects: {
    currentPage: 1,
    projects: [],
  },
  subcat: [],
  allsubcat: [],

  subcatfilter: {
    // slug, page, pageSize, searchTerm, sortTerm, type
    slug: "",
    currentPage: 1,
    totalPages: 1,
    searchTerm: "",
    sortTerm: "",
    type: "",
  },
};

// all projects slice
export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    getProjects(state, action) {
      state.projects = action.payload.projects;
    },
    addAllCategoriesData(state, action) {
      state.categoriesList = action.payload || [];
    },
    resetCategoriesList: (state) => {
      state.categoriesList = []; // ✅ Reset when navigating away
    },
    addCategoryAndSubCategoryData:(state,action)=>{
      state.categoryAndSubCategory=action.payload
    },
    addAllSubCategoriesData(state, action) {
      state.subCategoriesList = action.payload;
    },
    getSubCategory(state, action) {
      state.subcat = action.payload;
    },
    getAllSubCategory(state, action) {
      state.allsubcat = action.payload;
    },
    subcatfilter: (state, action) => {
      state.subcat.projects = action.payload;
    },
    getCurrentPage(state, action) {
      state.homepagestore.currentPage = action.payload;
    },
    getserachTerm(state, action) {
      state.homepagestore.searchTrem = action.payload;
    },
    getSortTerm(state, action) {
      state.homepagestore.sortTerm = action.payload;
    },

    getSingleProject(state, action) {
      state.singleProduct = action.payload;
    },
    getSingleProjectError(state, action) {
      state.error = action.payload;
    },
    getSingleProjectSuccess(state, action) {
      state.singleProduct = action.payload;
    },
    getSingleProjectPage(state, action) {
      state.page = action.payload;
    },
    getSimilarProjects(state, action) {
      state.similarProjects.projects = action.payload.similarProjects.projects;
    },
    getSimilarProjectsPage(state, action) {
      state.similarProjects.currentPage = action.payload;
    },
    updateSortList(state, action) {
      state.sortList = action.payload;
    },
    addedFavouriteItem: (state, action) => {
      //! checking duplicate item in cart
      if (
        state.favouriteList.filter(
          (cartItem) => cartItem.id === action.payload?.id
        ).length
      ) {
        return;
      }
      state.favouriteList.push(action.payload);
    },
    updateFavouriteItemList: (state, action) => {},
    deleteFavouriteItem: (state, action) => {
      state.favouriteList = state.favouriteList.filter(
        (item) => item.uuid !== action.payload
      );
    },
    emptyCart: (state, action) => {
      state.cartData = [];
    },
    updatesubcatslug: (state, action) => {
      state.subcatfilter.slug = action.payload;
    },
    updatesubcatpage: (state, action) => {
      state.subcatfilter.currentPage = action.payload;
    },
    updatesubcatserachTerm: (state, action) => {
      state.subcatfilter.searchTerm = action.payload;
    },
    updatesubcatsortTerm: (state, action) => {
      state.subcatfilter.sortTerm = action.payload;
    },
    updatesubcatpagetype: (state, action) => {
      state.subcatfilter.type = action.payload;
      state.subcatfilter.currentPage = 1;
    },
    resetsubcatfilter: (state, action) => {
      state.subcatfilter = initialState.subcatfilter;
    },
  },
});
export const {
  getProjects,
  getSingleProject,
  getSingleProjectError,
  getSingleProjectSuccess,
  getSingleProjectPage,
  addCategoryAndSubCategoryData,
  getCurrentPage,
  getSimilarProjects,
  addedFavouriteItem,
  deleteFavouriteItem,
  updateSortList,
  getserachTerm,
  getSortTerm,
  getSimilarProjectsPage,
  getSubCategory,
  getAllSubCategory,
  subcatfilter,
  addAllCategoriesData,
  updatesubcatpage,
  updatesubcatslug,
  updatesubcatserachTerm,
  updatesubcatsortTerm,
  updatesubcatpagetype,
  resetsubcatfilter,
  addAllSubCategoriesData,
  resetCategoriesList
} = projectsSlice.actions;
export default projectsSlice.reducer;


