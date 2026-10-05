import { configureStore } from '@reduxjs/toolkit';
import { assignmentsApi } from '../api/assignmentsApi';
import uiReducer from './uiSlice';

/** Test izolasyonu için fabrika; uygulama `store` singleton'ını kullanır. */
export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      [assignmentsApi.reducerPath]: assignmentsApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(assignmentsApi.middleware),
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
