import { Alert, Box, Button, Container, Paper, Snackbar, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { AppHeader } from './components/AppHeader';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentGrid } from './components/AssignmentGrid';
import { ConfirmDialog } from './components/ConfirmDialog';
import { useAssignmentWorkspace } from './hooks/useAssignmentWorkspace';
import { useI18n } from './i18n/I18nProvider';

export default function App() {
  const { t } = useI18n();
  const ws = useAssignmentWorkspace();
  const { notification } = ws;

  return (
    <Box component="main" sx={{ minHeight: '100vh', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <AppHeader />

        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper ref={ws.formPanelRef} variant="outlined" sx={{ p: 3, scrollMarginTop: 16 }}>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ mb: 2 }}>
                {ws.isEditMode ? t('editRecord') : t('newRecord')}
              </Typography>
              <AssignmentForm workspace={ws} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper variant="outlined" sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ mb: 2 }}>
                {t('records')}
              </Typography>
              <AssignmentGrid
                items={ws.items}
                selectedId={ws.selectedId}
                highlightedId={ws.highlightedId}
                isLoading={ws.isLoading}
                isError={ws.isError}
                onRetry={ws.refetch}
                onSelect={ws.selectRow}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <ConfirmDialog
        open={ws.confirmOpen}
        title={t('discardTitle')}
        description={t('discardBody')}
        confirmLabel={t('discard')}
        cancelLabel={t('keepEditing')}
        onConfirm={ws.confirmDiscard}
        onCancel={ws.keepEditing}
      />

      <Snackbar
        key={notification?.message}
        open={notification !== null}
        autoHideDuration={6000}
        onClose={(_, reason) => reason !== 'clickaway' && ws.closeNotification()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notification?.severity ?? 'success'}
          variant="filled"
          onClose={ws.closeNotification}
          action={
            notification?.undo ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  notification.undo?.();
                }}
              >
                {t('undo')}
              </Button>
            ) : undefined
          }
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
