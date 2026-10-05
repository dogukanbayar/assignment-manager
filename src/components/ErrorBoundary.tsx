import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
  title?: string;
  actionLabel?: string;
}

/** Render sırasında oluşan beklenmeyen hataları yakalar; beyaz ekran yerine kurtarma ekranı gösterir. */
export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Box
        role="alert"
        sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}
      >
        <Box>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
          <Typography variant="h6" sx={{ my: 1 }}>
            {this.props.title ?? 'Something went wrong'}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            {this.props.actionLabel ?? 'Reload page'}
          </Button>
        </Box>
      </Box>
    );
  }
}
