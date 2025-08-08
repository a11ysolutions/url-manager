import { createSlice } from '@reduxjs/toolkit';

// Estado inicial - ¿qué datos queremos guardar?
const initialState = {
  selectedUrls: [], // Array de URLs completas seleccionadas
  isLoading: false, // ¿Está cargando algo?
  error: null       // ¿Hay algún error?
};

// Crear el slice - esto es como una "rebanada" del estado
const selectionSlice = createSlice({
  name: 'selection', // Nombre del slice
  initialState,     // Estado inicial
  reducers: {       // Acciones que pueden cambiar el estado
    // Acción: Agregar URLs a la selección
    addUrls: (state, action) => {
      const newUrls = action.payload; // Las URLs que queremos agregar
      newUrls.forEach(url => {
        // Solo agregar si no existe ya (evitar duplicados)
        if (!state.selectedUrls.includes(url)) {
          state.selectedUrls.push(url);
        }
      });
    },
    
    // Acción: Remover URLs de la selección
    removeUrls: (state, action) => {
      const urlsToRemove = action.payload; // Las URLs que queremos remover
      state.selectedUrls = state.selectedUrls.filter(url => !urlsToRemove.includes(url));
    },
    
    // Acción: Limpiar toda la selección
    clearSelection: (state) => {
      state.selectedUrls = [];
    },
    
    // Acción: Establecer selección completa (reemplazar)
    setSelection: (state, action) => {
      state.selectedUrls = action.payload;
    }
  }
});

// Exportar las acciones para usarlas en componentes
export const { 
  addUrls, 
  removeUrls, 
  clearSelection,
  setSelection 
} = selectionSlice.actions;

// Exportar selectores para leer el estado
export const selectSelectedUrls = (state) => state.selection.selectedUrls;
export const selectSelectedCount = (state) => state.selection.selectedUrls.length;

// Exportar el reducer
export default selectionSlice.reducer;