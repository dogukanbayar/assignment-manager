import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  /** Formda düzenlenen kaydın id'si */
  selectedId: string | null;
  /** Son kaydedilen/güncellenen satır (kısa süreli vurgu için) */
  highlightedId: string | null;
}

const initialState: UiState = { selectedId: null, highlightedId: null };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectAssignment(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    highlightAssignment(state, action: PayloadAction<string | null>) {
      state.highlightedId = action.payload;
    },
  },
});

export const { selectAssignment, highlightAssignment } = uiSlice.actions;
export default uiSlice.reducer;
