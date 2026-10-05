import type { KeyboardEvent } from 'react';
import {
  Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAssignment } from '../store/assignmentsSlice';
import type { Assignment } from '../types/assignment';

const COLUMNS = ['Code', 'Name', 'Assign Date', 'Is Updatable?'] as const;

export function AssignmentGrid() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.assignments.items);
  const selectedId = useAppSelector((s) => s.assignments.selectedId);

  const select = (row: Assignment) => {
    if (row.isUpdatable) dispatch(selectAssignment(row.id));
  };

  const onKeyDown = (e: KeyboardEvent, row: Assignment) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(row);
    }
  };

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 460 }}>
      <Table stickyHeader size="medium" aria-label="Kayıtlar">
        <TableHead>
          <TableRow>
            {COLUMNS.map((c) => (
              <TableCell key={c} sx={{ fontWeight: 700 }}>{c}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={COLUMNS.length}>
                <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary' }}>
                  <InboxOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>Henüz kayıt yok</Typography>
                  <Typography variant="body2">Soldaki formu doldurup Save ile ilk kaydı ekleyin.</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
          {items.map((row) => {
            const disabled = !row.isUpdatable;
            const selected = row.id === selectedId;
            return (
              <TableRow
                key={row.id}
                hover={!disabled}
                selected={selected}
                onClick={() => select(row)}
                onKeyDown={(e) => onKeyDown(e, row)}
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                aria-selected={selected}
                title={disabled ? 'Bu kayıt güncellenemez' : 'Düzenlemek için tıklayın'}
                sx={{
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  bgcolor: disabled ? 'grey.200' : undefined,
                  color: disabled ? 'text.disabled' : undefined,
                  '& td': { color: disabled ? 'text.disabled' : undefined },
                  '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
                }}
              >
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.assignDate}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    icon={row.isUpdatable ? <CheckCircleIcon /> : <LockIcon />}
                    label={row.isUpdatable ? 'Evet' : 'Hayır'}
                    color={row.isUpdatable ? 'success' : 'default'}
                    variant={row.isUpdatable ? 'filled' : 'outlined'}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
