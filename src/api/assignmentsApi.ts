import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Assignment, AssignmentInput } from '../types/assignment';
import { fakeServer, type ApiError } from './fakeServer';

const toResult = async <T>(fn: () => Promise<T>) => {
  try {
    return { data: await fn() };
  } catch (e) {
    const error: ApiError =
      typeof e === 'object' && e !== null && 'code' in e
        ? (e as ApiError)
        : { code: 'UNKNOWN', message: 'Unexpected error' };
    return { error };
  }
};

export const assignmentsApi = createApi({
  reducerPath: 'assignmentsApi',
  baseQuery: fakeBaseQuery<ApiError>(),
  endpoints: (build) => ({
    getAssignments: build.query<Assignment[], void>({
      queryFn: () => toResult(() => fakeServer.list()),
    }),

    addAssignment: build.mutation<Assignment, AssignmentInput>({
      queryFn: (input) => toResult(() => fakeServer.create(input)),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(assignmentsApi.util.updateQueryData('getAssignments', undefined, (draft) => void draft.push(data)));
        } catch {
          /* hata çağıran tarafta yönetilir */
        }
      },
    }),

    /** İyimser (optimistic) güncelleme: hata olursa önbellek otomatik geri alınır. */
    updateAssignment: build.mutation<Assignment, Assignment>({
      queryFn: (assignment) => toResult(() => fakeServer.update(assignment)),
      async onQueryStarted(assignment, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          assignmentsApi.util.updateQueryData('getAssignments', undefined, (draft) => {
            const i = draft.findIndex((a) => a.id === assignment.id);
            if (i !== -1) draft[i] = assignment;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    deleteAssignment: build.mutation<string, string>({
      queryFn: (id) => toResult(() => fakeServer.remove(id)),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            assignmentsApi.util.updateQueryData('getAssignments', undefined, (draft) =>
              draft.filter((a) => a.id !== id),
            ),
          );
        } catch {
          /* hata çağıran tarafta yönetilir */
        }
      },
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useAddAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentsApi;
