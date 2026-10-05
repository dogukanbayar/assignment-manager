export interface Assignment {
  id: string;
  code: string;
  name: string;
  /** DD/MM/YYYY */
  assignDate: string;
  isUpdatable: boolean;
}

export type AssignmentFormValues = Omit<Assignment, 'id'>;

export const EMPTY_FORM_VALUES: AssignmentFormValues = {
  code: '',
  name: '',
  assignDate: '',
  isUpdatable: false,
};
