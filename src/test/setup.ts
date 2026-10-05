import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import { setFakeLatency } from '../api/fakeServer';

// jsdom'da bulunmayan tarayıcı API'leri
Element.prototype.scrollIntoView = () => {};

beforeEach(() => {
  localStorage.clear();
  setFakeLatency(0);
});

afterEach(() => cleanup());
