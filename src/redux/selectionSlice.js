import { createSlice } from "@reduxjs/toolkit";

const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    selectedUrls: [],
  },
  reducers: {
    setSelectedUrls: (state, action) => {
      state.selectedUrls = action.payload;
    },
  },
});

export const { setSelectedUrls } = selectionSlice.actions;
export default selectionSlice.reducer;