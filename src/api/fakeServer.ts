import type { Assignment, AssignmentInput } from '../types/assignment';

/**
 * Sahte (fake) backend: localStorage üzerinde çalışan, gecikmeli ve hata üretebilen bir API.
 * Gerçek bir REST API'ye geçmek için yalnızca bu dosyanın değiştirilmesi yeterlidir.
 */
const STORAGE_KEY = 'assignment-manager:v2';

export type ApiErrorCode = 'DUPLICATE_CODE' | 'NOT_FOUND' | 'UNKNOWN';
export interface ApiError {
  code: ApiErrorCode;
  message: string;
}

let latencyMs = Number(import.meta.env.VITE_API_LATENCY ?? 300);
export const setFakeLatency = (ms: number) => {
  latencyMs = ms;
};

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, latencyMs));

const read = (): Assignment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const write = (items: Assignment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    throw { code: 'UNKNOWN', message: 'Storage unavailable' } satisfies ApiError;
  }
};

const fail = (code: ApiErrorCode, message: string): never => {
  throw { code, message } satisfies ApiError;
};

const isDuplicate = (items: Assignment[], code: string, ignoreId?: string) =>
  items.some((i) => i.code.toUpperCase() === code.toUpperCase() && i.id !== ignoreId);

export const fakeServer = {
  async list(): Promise<Assignment[]> {
    await delay();
    return read();
  },
  async create(input: AssignmentInput): Promise<Assignment> {
    await delay();
    const items = read();
    if (isDuplicate(items, input.code)) fail('DUPLICATE_CODE', 'Code already exists');
    const created: Assignment = { id: crypto.randomUUID(), ...input };
    write([...items, created]);
    return created;
  },
  async update(assignment: Assignment): Promise<Assignment> {
    await delay();
    const items = read();
    const index = items.findIndex((i) => i.id === assignment.id);
    if (index === -1) fail('NOT_FOUND', 'Record not found');
    if (isDuplicate(items, assignment.code, assignment.id)) fail('DUPLICATE_CODE', 'Code already exists');
    items[index] = assignment;
    write(items);
    return assignment;
  },
  async remove(id: string): Promise<string> {
    await delay();
    write(read().filter((i) => i.id !== id));
    return id;
  },
};

/** Sadece uygulama girişinde çağrılır: ilk açılışta incelemeci tüm durumları görebilsin. */
export const seedDemoData = () => {
  if (localStorage.getItem(STORAGE_KEY) !== null) return;
  write([
    { id: crypto.randomUUID(), code: 'AB123', name: 'Ahmet', assignDate: '2025-03-14', isUpdatable: true },
    { id: crypto.randomUUID(), code: 'CD456', name: 'Zeynep', assignDate: '2025-07-02', isUpdatable: false },
    { id: crypto.randomUUID(), code: 'EF789', name: 'Mehmet Ali', assignDate: '2025-11-21', isUpdatable: true },
  ]);
};
