import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedUrls: []
};

const selectedUrlsSlice = createSlice({
  name: 'selectedUrls',
  initialState,
  reducers: {
    setSelectedUrls: (state, action) => {
      state.selectedUrls = action.payload;
    },
    clearSelectedUrls: (state) => {
      state.selectedUrls = [];
    }
  }
});

export const { setSelectedUrls, clearSelectedUrls } = selectedUrlsSlice.actions;
export default selectedUrlsSlice.reducer;