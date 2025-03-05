import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import { projectsSlice } from "./features/projectsSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { rootReducer } from "./features/rootReducer";

// Configure persist settings
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["logininfo"], // list the slices you want to persist (e.g., authentication)
};

// Wrap your root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store; // ✅ Correct Default Export