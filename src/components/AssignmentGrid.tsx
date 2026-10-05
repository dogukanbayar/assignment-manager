import { useMemo, useState, type KeyboardEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControlLabel,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useI18n } from '../i18n/I18nProvider';
import type { Assignment } from '../types/assignment';
import { isoToDisplay } from '../utils/date';

type SortKey = 'code' | 'name' | 'assignDate' | 'isUpdatable';
type Order = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'assignDate', label: 'Assign Date' },
  { key: 'isUpdatable', label: 'Is Updatable?' },
];

const flash = keyframes`
  from { background-color: rgba(76, 175, 80, 0.45); }
  to { background-color: transparent; }
`;

interface Props {
  items: Assignment[];
  selectedId: string | null;
  highlightedId: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelect: (row: Assignment) => void;
}

export function AssignmentGrid({
  items,
  selectedId,
  highlightedId,
  isLoading,
  isError,
  onRetry,
  onSelect,
}: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [onlyUpdatable, setOnlyUpdatable] = useState(false);
  const [orderBy, setOrderBy] = useState<SortKey | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = items.filter(
      (r) =>
        (!onlyUpdatable || r.isUpdatable) &&
        (!q || [r.code, r.name, isoToDisplay(r.assignDate)].some((v) => v.toLowerCase().includes(q))),
    );
    if (orderBy) {
      const dir = order === 'asc' ? 1 : -1;
      rows = [...rows].sort((a, b) => {
        const av = a[orderBy];
        const bv = b[orderBy];
        return (
          (typeof av === 'boolean'
            ? Number(av) - Number(bv as boolean)
            : String(av).localeCompare(String(bv))) * dir
        );
      });
    }
    return rows;
  }, [items, query, onlyUpdatable, orderBy, order]);

  const maxPage = Math.max(0, Math.ceil(visible.length / rowsPerPage) - 1);
  const currentPage = Math.min(page, maxPage);
  const pageRows = visible.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  const requestSort = (key: SortKey) => {
    setOrder(orderBy === key && order === 'asc' ? 'desc' : 'asc');
    setOrderBy(key);
  };

  const onKeyDown = (e: KeyboardEvent, row: Assignment) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(row);
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ sm: 'center' }}
        sx={{ mb: 2 }}
      >
        <TextField
          size="small"
          fullWidth
          type="search"
          label={t('search')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControlLabel
          sx={{ whiteSpace: 'nowrap', mr: 0 }}
          label={t('onlyUpdatable')}
          control={
            <Switch
              size="small"
              checked={onlyUpdatable}
              onChange={(e) => {
                setOnlyUpdatable(e.target.checked);
                setPage(0);
              }}
            />
          }
        />
      </Stack>

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              {t('retry')}
            </Button>
          }
        >
          {t('loadError')}
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table size="medium" aria-label={t('records')} aria-busy={isLoading}>
          <TableHead>
            <TableRow>
              {COLUMNS.map((c) => (
                <TableCell
                  key={c.key}
                  sortDirection={orderBy === c.key ? order : false}
                  sx={{ fontWeight: 700 }}
                >
                  <TableSortLabel
                    active={orderBy === c.key}
                    direction={orderBy === c.key ? order : 'asc'}
                    onClick={() => requestSort(c.key)}
                  >
                    {c.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading &&
              [0, 1, 2].map((i) => (
                <TableRow key={`sk-${i}`}>
                  {COLUMNS.map((c) => (
                    <TableCell key={c.key}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMNS.length}>
                  <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary' }}>
                    <InboxOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body1" fontWeight={600}>
                      {items.length === 0 ? t('emptyTitle') : t('noResults')}
                    </Typography>
                    {items.length === 0 && <Typography variant="body2">{t('emptyBody')}</Typography>}
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {pageRows.map((row) => {
              const disabled = !row.isUpdatable;
              const selected = row.id === selectedId;
              return (
                <Tooltip
                  key={row.id}
                  title={disabled ? t('notUpdatableTip') : ''}
                  describeChild
                  followCursor
                  placement="top"
                >
                  <TableRow
                    hover={!disabled}
                    selected={selected}
                    onClick={() => onSelect(row)}
                    onKeyDown={(e) => onKeyDown(e, row)}
                    tabIndex={disabled ? -1 : 0}
                    aria-disabled={disabled}
                    aria-selected={selected}
                    sx={(theme) => ({
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      bgcolor: disabled ? theme.palette.action.disabledBackground : undefined,
                      '& td': { color: disabled ? theme.palette.text.disabled : undefined },
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: -2,
                      },
                      ...(row.id === highlightedId && {
                        '@media (prefers-reduced-motion: no-preference)': {
                          animation: `${flash} 2.2s ease-out`,
                        },
                      }),
                    })}
                  >
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{isoToDisplay(row.assignDate)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={row.isUpdatable ? <CheckCircleIcon /> : <LockIcon />}
                        label={row.isUpdatable ? t('yes') : t('no')}
                        color={row.isUpdatable ? 'success' : 'default'}
                        variant={row.isUpdatable ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                  </TableRow>
                </Tooltip>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={visible.length}
        page={currentPage}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={t('rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) => t('displayedRows', { from, to, count })}
      />
      <Box
        role="status"
        aria-live="polite"
        sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
      >
        {!isLoading && t('resultCount', { n: visible.length })}
      </Box>
    </Box>
  );
}
