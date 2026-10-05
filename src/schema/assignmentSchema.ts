import { z } from 'zod';
import type { TFunction } from '../i18n/I18nProvider';
import type { Assignment } from '../types/assignment';
import { isValidDisplayDate } from '../utils/date';
import { CODE_MAX_LENGTH, CODE_PATTERN, NAME_MAX_LENGTH } from '../utils/validation';

interface SchemaContext {
  t: TFunction;
  items: Assignment[];
  /** Düzenlenen kaydın id'si (benzersizlik kontrolünde hariç tutulur) */
  selectedId: string | null;
}

/** Form kuralları için tek doğruluk kaynağı. Tip de bu şemadan türetilir. */
export const createAssignmentSchema = ({ t, items, selectedId }: SchemaContext) =>
  z
    .object({
      code: z
        .string()
        .trim()
        .min(1, t('errRequired', { field: 'Code' }))
        .max(CODE_MAX_LENGTH)
        .regex(CODE_PATTERN, t('errCodePattern')),
      name: z
        .string()
        .trim()
        .min(1, t('errRequired', { field: 'Name' }))
        .max(NAME_MAX_LENGTH, t('errNameMax', { n: NAME_MAX_LENGTH })),
      assignDate: z
        .string()
        .min(1, t('errRequired', { field: 'Assign Date' }))
        .refine(isValidDisplayDate, t('errDate')),
      isUpdatable: z.boolean(),
    })
    .superRefine((value, ctx) => {
      const duplicate = items.some(
        (i) => i.code.toUpperCase() === value.code.toUpperCase() && i.id !== selectedId,
      );
      if (duplicate) ctx.addIssue({ code: 'custom', path: ['code'], message: t('errCodeDuplicate') });
    });

export type AssignmentSchemaOutput = z.infer<ReturnType<typeof createAssignmentSchema>>;
