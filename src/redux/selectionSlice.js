import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedUrls: [], // Array de URLs completas seleccionadas
  isLoading: false,
  error: null
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    // Agregar URLs a la selección (evita duplicados)
    addUrls: (state, action) => {
      const newUrls = action.payload;
      newUrls.forEach(url => {
        if (!state.selectedUrls.includes(url)) {
          state.selectedUrls.push(url);
        }
      });
    },
    
    // Remover URLs de la selección
    removeUrls: (state, action) => {
      const urlsToRemove = action.payload;
      state.selectedUrls = state.selectedUrls.filter(url => !urlsToRemove.includes(url));
    },
    
    // Limpiar toda la selección
    clearSelection: (state) => {
      state.selectedUrls = [];
    },
    
    // Establecer selección completa (útil para reemplazar)
    setSelection: (state, action) => {
      state.selectedUrls = action.payload;
    },
    
    // Toggle de una URL individual
    toggleUrl: (state, action) => {
      const url = action.payload;
      const index = state.selectedUrls.indexOf(url);
      if (index > -1) {
        state.selectedUrls.splice(index, 1);
      } else {
        state.selectedUrls.push(url);
      }
    }
  }
});

export const { 
  addUrls, 
  removeUrls, 
  clearSelection, 
  setSelection, 
  toggleUrl 
} = selectionSlice.actions;

// Selectores
export const selectSelectedUrls = (state) => state.selection.selectedUrls;
export const selectSelectedCount = (state) => state.selection.selectedUrls.length;
export const selectIsUrlSelected = (state, url) => state.selection.selectedUrls.includes(url);

export default selectionSlice.reducer;