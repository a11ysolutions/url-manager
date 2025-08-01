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
  isSubmitting: false,
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
    setSubmissionState: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setSubmissionResult: (state, action) => {
      state.submissionResult = action.payload;
      state.isSubmitting = false;
    },
  },
});

export const {
  setSelectedUrls,
  setSelectedKeys,
  setFilter,
  clearFilters,
  clearSelections,
  setSubmissionState,
  setSubmissionResult,
} = selectionSlice.actions;

export const selectSelectedUrls = (state) => state.selection.selectedUrls;
export const selectSelectedKeys = (state) => state.selection.selectedKeys;
export const selectFilters = (state) => state.selection.filters;
export const selectIsSubmitting = (state) => state.selection.isSubmitting;
export const selectSubmissionResult = (state) => state.selection.submissionResult;
export const selectHasActiveFilters = (state) => 
  Object.values(state.selection.filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

export default selectionSlice.reducer;