import { configureStore } from "@reduxjs/toolkit";
import selectedUrlsReducer from "./selectedUrlsSlice";

export const store = configureStore({
  reducer: {
    selectedUrls: selectedUrlsReducer
  },
});

export default store;