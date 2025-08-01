//Your code here
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedUrls: []
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedUrls: (state, action) => {
      state.selectedUrls = action.payload;
    }
  }
});

export const { setSelectedUrls } = selectionSlice.actions;
export default selectionSlice.reducer;