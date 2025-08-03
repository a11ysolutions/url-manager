//Your code here
import { createSlice } from "@reduxjs/toolkit";

const selectionSlice = createSlice({
  name: "selection",
  initialState: [],
  reducers: {
    setSelection: (state, action) => action.payload,
  },
});

export const { setSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
