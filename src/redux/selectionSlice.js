import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedUrls: [],
  selectedKeys: {},
  filters: {
    application: [],
    client: [],
    template: [],
    siteEdition: [],
  },
  submissionResult: null,
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedUrls: (state, action) => {
      state.selectedUrls = action.payload;
    },
    setSelectedKeys: (state, action) => {
      state.selectedKeys = action.payload;
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        application: [],
        client: [],
        template: [],
        siteEdition: [],
      };
    },
    clearSelections: (state) => {
      state.selectedUrls = [];
      state.selectedKeys = {};
    },
    setSubmissionResult: (state, action) => {
      state.submissionResult = action.payload;
    },
  },
});

export const {
  setSelectedUrls,
  setSelectedKeys,
  setFilter,
  clearFilters,
  clearSelections,
  setSubmissionResult,
} = selectionSlice.actions;

export const selectSelectedUrls = (state) => state.selection.selectedUrls;
export const selectSelectedKeys = (state) => state.selection.selectedKeys;
export const selectFilters = (state) => state.selection.filters;

export const selectSubmissionResult = (state) => state.selection.submissionResult;
export const selectHasActiveFilters = (state) => 
  Object.values(state.selection.filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

export default selectionSlice.reducer;