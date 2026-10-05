import { Controller, useWatch } from 'react-hook-form';
import { Alert, Box, Checkbox, Chip, FormControlLabel, Stack, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UpdateIcon from '@mui/icons-material/Update';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import TagIcon from '@mui/icons-material/Tag';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EventIcon from '@mui/icons-material/Event';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { FormTextField } from './FormTextField';
import { ActionButton } from './ActionButton';
import { DatePickerButton } from './DatePickerButton';
import { useI18n } from '../i18n/I18nProvider';
import type { AssignmentWorkspace } from '../hooks/useAssignmentWorkspace';
import type { AssignmentFormValues } from '../types/assignment';
import { DISPLAY_DATE_PATTERN, formatDateInput } from '../utils/date';
import { CODE_MAX_LENGTH, CODE_PATTERN, NAME_MAX_LENGTH } from '../utils/validation';

export function AssignmentForm({ workspace }: { workspace: AssignmentWorkspace }) {
  const { t } = useI18n();
  const { form, isEditMode, isDirty, isSubmitting, selected, submit, clean } = workspace;
  const { control, setValue } = form;
  const dateValue = useWatch({ control, name: 'assignDate' });

  return (
    <Box component="form" onSubmit={submit} noValidate aria-label={isEditMode ? t('editRecord') : t('newRecord')}>
      <Box sx={{ minHeight: 48, mb: 1 }}>
        {isEditMode && selected ? (
          <Alert icon={<EditNoteIcon fontSize="inherit" />} severity="info" variant="outlined" sx={{ py: 0 }}>
            <strong>{t('editing', { code: selected.code })}</strong>
            <Typography component="span" variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
              · {t('escHint')}
            </Typography>
          </Alert>
        ) : null}
      </Box>

      <Stack spacing={1}>
        <FormTextField<AssignmentFormValues>
          name="code"
          control={control}
          label="Code"
          tips={t('hintCode')}
          pattern={CODE_PATTERN}
          maxLength={CODE_MAX_LENGTH}
          transform={(v) => v.toUpperCase()}
          required
          placeholder="AB123"
          startIcon={<TagIcon fontSize="small" />}
          autoFocus
        />
        <FormTextField<AssignmentFormValues>
          name="name"
          control={control}
          label="Name"
          tips={t('hintName', { n: NAME_MAX_LENGTH })}
          maxLength={NAME_MAX_LENGTH}
          showCount
          required
          startIcon={<BadgeOutlinedIcon fontSize="small" />}
        />
        <FormTextField<AssignmentFormValues>
          name="assignDate"
          control={control}
          label="Assign Date"
          tips={t('hintDate')}
          pattern={DISPLAY_DATE_PATTERN}
          transform={formatDateInput}
          maxLength={10}
          inputMode="numeric"
          required
          placeholder="DD/MM/YYYY"
          startIcon={<EventIcon fontSize="small" />}
          endAdornment={
            <DatePickerButton
              value={dateValue ?? ''}
              label={t('openCalendar')}
              onPick={(v) => setValue('assignDate', v, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
            />
          }
        />
        <Controller
          name="isUpdatable"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="Is Updatable?"
              control={
                <Checkbox
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  inputRef={field.ref}
                />
              }
            />
          )}
        />
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
        <ActionButton
          type="submit"
          label={isEditMode ? t('update') : t('save')}
          tips={isEditMode ? t('tipUpdate') : t('tipSave')}
          icon={isEditMode ? <UpdateIcon /> : <SaveIcon />}
          color={isEditMode ? 'warning' : 'primary'}
          disabled={isSubmitting}
        />
        <ActionButton
          label={t('clean')}
          tips={t('tipClean')}
          action={clean}
          icon={<CleaningServicesIcon />}
          color="inherit"
          variant="outlined"
        />
        {isDirty && <Chip size="small" color="warning" variant="outlined" label={t('unsaved')} />}
      </Stack>
    </Box>
  );
}
