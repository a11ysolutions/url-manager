import { createSlice } from '@reduxjs/toolkit';

const selectionSlice = createSlice({
    name: 'selection',
    initialState: {
        selectedUrls: [],
        filters: {
            applications: [],
            clients: [],
            templates: [],
            siteEditions: []
        }
    },
    reducers: {
        setSelectedUrls: (state, action) => {
            state.selectedUrls = action.payload;
        },
        clearSelection: (state) => {
            state.selectedUrls = [];
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                applications: [],
                clients: [],
                templates: [],
                siteEditions: []
            };
        }
    }
});

export const {
    setSelectedUrls,
    clearSelection,
    setFilters,
    clearFilters
} = selectionSlice.actions;

export default selectionSlice.reducer;
