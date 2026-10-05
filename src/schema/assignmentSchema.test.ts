import { describe, expect, it } from 'vitest';
import { createAssignmentSchema } from './assignmentSchema';
import { translations } from '../i18n/translations';
import type { Assignment } from '../types/assignment';

const t = (key: keyof typeof translations.en, params?: Record<string, string | number>) => {
  let text = translations.en[key];
  for (const [k, v] of Object.entries(params ?? {})) text = text.replace(`{${k}}`, String(v));
  return text;
};
const existing: Assignment[] = [
  { id: '1', code: 'AB123', name: 'x', assignDate: '2025-01-01', isUpdatable: true },
];
const valid = { code: 'CD456', name: 'Ahmet', assignDate: '14/03/2025', isUpdatable: false };
const schema = (selectedId: string | null = null) =>
  createAssignmentSchema({ t, items: existing, selectedId });

describe('assignment schema', () => {
  it('accepts valid values', () => {
    expect(schema().safeParse(valid).success).toBe(true);
  });

  it.each(['A1234', '12ABC', 'ABC12', 'AB12', 'AB1234'])('rejects code %s', (code) => {
    expect(schema().safeParse({ ...valid, code }).success).toBe(false);
  });

  it('rejects names longer than 12 characters', () => {
    expect(schema().safeParse({ ...valid, name: '1234567890123' }).success).toBe(false);
  });

  it('rejects impossible dates', () => {
    expect(schema().safeParse({ ...valid, assignDate: '31/02/2025' }).success).toBe(false);
  });

  it('rejects duplicate codes but allows the record being edited', () => {
    expect(schema().safeParse({ ...valid, code: 'ab123' }).success).toBe(false);
    expect(schema('1').safeParse({ ...valid, code: 'AB123' }).success).toBe(true);
  });
});
