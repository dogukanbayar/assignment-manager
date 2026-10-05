/**
 * Tarih yardımcıları.
 * Domain/API katmanında tarih ISO (YYYY-MM-DD) saklanır; DD/MM/YYYY yalnızca gösterim ve giriş içindir.
 */
export const DISPLAY_DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;

/** DD/MM/YYYY değerinin takvimde gerçekten var olup olmadığını kontrol eder. */
export const isValidDisplayDate = (value: string): boolean => {
  if (!DISPLAY_DATE_PATTERN.test(value)) return false;
  const [d, m, y] = value.split('/').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

/** 31/12/2025 -> 2025-12-31 */
export const displayToIso = (value: string): string => {
  const [d, m, y] = value.split('/');
  return `${y}-${m}-${d}`;
};

/** 2025-12-31 -> 31/12/2025 (geçersiz girdide boş string) */
export const isoToDisplay = (iso: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
};

/** Yazarken rakamlardan sonra otomatik "/" ekler: 31122025 -> 31/12/2025 */
export const formatDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};
