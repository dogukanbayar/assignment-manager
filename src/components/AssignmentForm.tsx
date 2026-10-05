import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Checkbox, FormControlLabel, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UpdateIcon from '@mui/icons-material/Update';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import TagIcon from '@mui/icons-material/Tag';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import EventIcon from '@mui/icons-material/Event';
import { FormTextField } from './FormTextField';
import { ActionButton } from './ActionButton';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addAssignment, selectAssignment, updateAssignment } from '../store/assignmentsSlice';
import { EMPTY_FORM_VALUES, type AssignmentFormValues } from '../types/assignment';
import {
  CODE_HINT,
  CODE_PATTERN,
  DATE_HINT,
  DATE_PATTERN,
  NAME_MAX_LENGTH,
  formatDateInput,
  isValidDate,
} from '../utils/validation';

interface Props {
  onNotify: (message: string) => void;
}

export function AssignmentForm({ onNotify }: Props) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.assignments.items);
  const selectedId = useAppSelector((s) => s.assignments.selectedId);
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const isEditMode = selected !== null;

  const { control, handleSubmit, reset } = useForm<AssignmentFormValues>({
    defaultValues: EMPTY_FORM_VALUES,
    mode: 'onTouched',
  });

  // Satır seçilince (veya seçim kalkınca) form alanlarını senkronize et
  useEffect(() => {
    if (selected) {
      const { id: _id, ...values } = selected;
      reset(values);
    } else {
      reset(EMPTY_FORM_VALUES);
    }
  }, [selected, reset]);

  const clean = () => {
    dispatch(selectAssignment(null));
    reset(EMPTY_FORM_VALUES);
  };

  const onSubmit = (values: AssignmentFormValues) => {
    const normalized = { ...values, code: values.code.trim().toUpperCase(), name: values.name.trim() };
    if (selected) {
      dispatch(updateAssignment({ id: selected.id, ...normalized }));
      onNotify(`${normalized.code} güncellendi`);
    } else {
      dispatch(addAssignment(normalized));
      onNotify(`${normalized.code} kaydedildi`);
    }
    clean();
  };

  const isCodeUnique = (raw: unknown) => {
    const value = String(raw);
    return (
      !items.some((i) => i.code.toUpperCase() === value.trim().toUpperCase() && i.id !== selectedId) ||
      'Bu kod zaten kayıtlı'
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Kayıt formu">
      <Stack spacing={1}>
        <FormTextField<AssignmentFormValues>
          name="code"
          control={control}
          label="Code"
          tips={CODE_HINT}
          pattern={CODE_PATTERN}
          patternMessage="İlk 2 karakter harf, son 3 karakter rakam olmalı"
          validate={isCodeUnique}
          maxLength={5}
          required
          placeholder="AB123"
          startIcon={<TagIcon fontSize="small" />}
          autoFocus
        />
        <FormTextField<AssignmentFormValues>
          name="name"
          control={control}
          label="Name"
          tips={`En fazla ${NAME_MAX_LENGTH} karakter`}
          maxLength={NAME_MAX_LENGTH}
          required
          placeholder="Örn. Ahmet"
          startIcon={<BadgeOutlinedIcon fontSize="small" />}
        />
        <FormTextField<AssignmentFormValues>
          name="assignDate"
          control={control}
          label="Assign Date"
          tips={DATE_HINT}
          pattern={DATE_PATTERN}
          patternMessage="Tarih GG/AA/YYYY formatında olmalı"
          validate={(v) => isValidDate(String(v)) || 'Geçerli bir tarih giriniz'}
          transform={formatDateInput}
          maxLength={10}
          inputMode="numeric"
          required
          placeholder="GG/AA/YYYY"
          startIcon={<EventIcon fontSize="small" />}
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

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
        <ActionButton
          type="submit"
          label={isEditMode ? 'Update' : 'Save'}
          tips={isEditMode ? 'Seçili kaydı güncelle' : 'Yeni kayıt oluştur'}
          icon={isEditMode ? <UpdateIcon /> : <SaveIcon />}
          color={isEditMode ? 'warning' : 'primary'}
        />
        <ActionButton
          label="Clean"
          tips="Formu temizle"
          action={clean}
          icon={<CleaningServicesIcon />}
          color="inherit"
          variant="outlined"
        />
      </Stack>
    </Box>
  );
}
