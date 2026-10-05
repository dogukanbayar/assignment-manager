import { createSelector } from '@reduxjs/toolkit';
import { assignmentsApi } from '../api/assignmentsApi';
import type { Assignment } from '../types/assignment';
import type { RootState } from './store';

const EMPTY: Assignment[] = [];
const selectResult = assignmentsApi.endpoints.getAssignments.select();

export const selectAssignments = createSelector(selectResult, (r) => r.data ?? EMPTY);
export const selectSelectedId = (s: RootState) => s.ui.selectedId;
export const selectHighlightedId = (s: RootState) => s.ui.highlightedId;
export const selectSelectedAssignment = createSelector(
  [selectAssignments, selectSelectedId],
  (items, id) => items.find((i) => i.id === id) ?? null,
);
