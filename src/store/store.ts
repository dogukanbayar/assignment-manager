import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer, { type AssignmentsState } from './assignmentsSlice';

const STORAGE_KEY = 'assignment-manager:v1';

const loadState = (): { assignments: AssignmentsState } | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const items = JSON.parse(raw);
    return Array.isArray(items) ? { assignments: { items, selectedId: null } } : undefined;
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  reducer: { assignments: assignmentsReducer },
  preloadedState: loadState(),
});

store.subscribe(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().assignments.items));
  } catch {
    /* storage dolu/kapalı olabilir; uygulama çalışmaya devam eder */
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
