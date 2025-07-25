import { configureStore } from "@reduxjs/toolkit";
import selectionReducer from "./selectionSlice";

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
  },
});

export default store;
