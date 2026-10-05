import { useState } from 'react';
import { Alert, Box, Container, Paper, Snackbar, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentGrid } from './components/AssignmentGrid';
import { useAppSelector } from './store/hooks';

export default function App() {
  const [message, setMessage] = useState<string | null>(null);
  const isEditing = useAppSelector((s) => s.assignments.selectedId !== null);

  return (
    <Box component="main" sx={{ minHeight: '100vh', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <AssignmentIcon color="primary" sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>Assignment Manager</Typography>
            <Typography variant="body2" color="text.secondary">
              Kayıt ekleyin, listeleyin ve güncellenebilir kayıtları düzenleyin.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ mb: 2 }}>
                {isEditing ? 'Kaydı Düzenle' : 'Yeni Kayıt'}
              </Typography>
              <AssignmentForm onNotify={setMessage} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" fontWeight={600} sx={{ mb: 2 }}>Kayıtlar</Typography>
              <AssignmentGrid />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={message !== null}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setMessage(null)}>{message}</Alert>
      </Snackbar>
    </Box>
  );
}
