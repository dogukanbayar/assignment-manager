import type { Assignment, AssignmentFormValues, AssignmentInput } from '../types/assignment';
import { displayToIso, isoToDisplay } from './date';

/** Form -> domain (tek dönüşüm noktası) */
export const toAssignmentInput = (values: AssignmentFormValues): AssignmentInput => ({
  code: values.code.trim().toUpperCase(),
  name: values.name.trim(),
  assignDate: displayToIso(values.assignDate),
  isUpdatable: values.isUpdatable,
});

/** Domain -> form */
export const toFormValues = (a: Assignment): AssignmentFormValues => ({
  code: a.code,
  name: a.name,
  assignDate: isoToDisplay(a.assignDate),
  isUpdatable: a.isUpdatable,
});
