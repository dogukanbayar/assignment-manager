import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

type Mode = 'light' | 'dark';
interface ThemeModeContextValue {
  mode: Mode;
  toggle: () => void;
}

const STORAGE_KEY = 'assignment-manager:theme';
const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const detectMode = (): Mode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const createAppTheme = (mode: Mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#8aa4ff' : '#2f5bea' },
      background:
        mode === 'dark' ? { default: '#0f1220', paper: '#171a2b' } : { default: '#f4f6fb', paper: '#ffffff' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
  });

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(detectMode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next: Mode = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
