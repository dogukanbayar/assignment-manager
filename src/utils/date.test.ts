import { describe, expect, it } from 'vitest';
import { displayToIso, formatDateInput, isValidDisplayDate, isoToDisplay } from './date';

describe('date utils', () => {
  it('converts between display and ISO formats', () => {
    expect(displayToIso('31/12/2025')).toBe('2025-12-31');
    expect(isoToDisplay('2025-12-31')).toBe('31/12/2025');
    expect(isoToDisplay('garbage')).toBe('');
  });

  it('validates real calendar dates only', () => {
    expect(isValidDisplayDate('29/02/2024')).toBe(true);
    expect(isValidDisplayDate('29/02/2025')).toBe(false);
    expect(isValidDisplayDate('31/04/2025')).toBe(false);
    expect(isValidDisplayDate('1/1/2025')).toBe(false);
  });

  it('auto-inserts slashes while typing', () => {
    expect(formatDateInput('3')).toBe('3');
    expect(formatDateInput('311')).toBe('31/1');
    expect(formatDateInput('31122025')).toBe('31/12/2025');
    expect(formatDateInput('31/12/2025999')).toBe('31/12/2025');
  });
});
