import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { Assignment, AssignmentFormValues } from '../types/assignment';

export interface AssignmentsState {
  items: Assignment[];
  selectedId: string | null;
}

const initialState: AssignmentsState = { items: [], selectedId: null };

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: {
      reducer(state, action: PayloadAction<Assignment>) {
        state.items.push(action.payload);
      },
      prepare(values: AssignmentFormValues) {
        return { payload: { id: nanoid(), ...values } };
      },
    },
    updateAssignment(state, action: PayloadAction<Assignment>) {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    selectAssignment(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
  },
});

export const { addAssignment, updateAssignment, selectAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
