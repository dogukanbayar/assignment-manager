import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { main: '#2f5bea' },
    background: { default: '#f4f6fb' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
});
