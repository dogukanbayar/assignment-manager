/** İlk 2 karakter harf, son 3 karakter rakam. */
export const CODE_PATTERN = /^[A-Za-z]{2}\d{3}$/;
export const CODE_HINT = 'Format: 2 harf + 3 rakam (örn. AB123)';

export const NAME_MAX_LENGTH = 12;

export const DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;
export const DATE_HINT = 'Format: GG/AA/YYYY (örn. 31/12/2025)';

/** DD/MM/YYYY biçimindeki değerin takvimde gerçekten var olup olmadığını kontrol eder. */
export const isValidDate = (value: string): boolean => {
  if (!DATE_PATTERN.test(value)) return false;
  const [d, m, y] = value.split('/').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

/** Yazılırken rakamlardan sonra otomatik "/" ekler: 31122025 -> 31/12/2025 */
export const formatDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};
