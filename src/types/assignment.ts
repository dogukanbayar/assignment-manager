/** Domain modeli: tarih ISO (YYYY-MM-DD) saklanır. */
export interface Assignment {
  id: string;
  code: string;
  name: string;
  assignDate: string;
  isUpdatable: boolean;
}

export type AssignmentInput = Omit<Assignment, 'id'>;

/** Form modeli: tarih kullanıcıya DD/MM/YYYY olarak gösterilir. */
export interface AssignmentFormValues {
  code: string;
  name: string;
  assignDate: string;
  isUpdatable: boolean;
}

export const EMPTY_FORM_VALUES: AssignmentFormValues = {
  code: '',
  name: '',
  assignDate: '',
  isUpdatable: false,
};
