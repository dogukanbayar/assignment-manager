import type { ReactNode } from 'react';
import { Controller, type Control, type FieldPath, type FieldValues, type RegisterOptions } from 'react-hook-form';
import { InputAdornment, TextField, Tooltip } from '@mui/material';

export interface FormTextFieldProps<T extends FieldValues> {
  /** react-hook-form alan adı */
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  /** Hover'da gösterilen ipucu (pattern açıklaması vb.) */
  tips?: string;
  /** Doğrulama için regex; uyuşmazsa `patternMessage` gösterilir */
  pattern?: RegExp;
  patternMessage?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  startIcon?: ReactNode;
  /** Ek doğrulama kuralları (ör. benzersizlik, tarih geçerliliği) */
  validate?: RegisterOptions<T, FieldPath<T>>['validate'];
  /** Değer değişmeden önce dönüştürme (ör. tarih maskesi) */
  transform?: (value: string) => string;
  inputMode?: 'text' | 'numeric';
  autoFocus?: boolean;
}

/**
 * Generic, yeniden kullanılabilir metin alanı.
 * pattern, tips, enabled/disabled, name, maxLength vb. parametrik alınır.
 */
export function FormTextField<T extends FieldValues>({
  name,
  control,
  label,
  tips,
  pattern,
  patternMessage,
  required = false,
  disabled = false,
  maxLength,
  placeholder,
  startIcon,
  validate,
  transform,
  inputMode,
  autoFocus,
}: FormTextFieldProps<T>) {
  const rules: RegisterOptions<T, FieldPath<T>> = {
    required: required ? `${label} zorunludur` : false,
    ...(maxLength ? { maxLength: { value: maxLength, message: `En fazla ${maxLength} karakter` } } : {}),
    ...(pattern ? { pattern: { value: pattern, message: patternMessage ?? 'Geçersiz format' } } : {}),
    ...(validate ? { validate } : {}),
  } as RegisterOptions<T, FieldPath<T>>;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Tooltip title={tips ?? ''} placement="top-start" arrow disableHoverListener={!tips}>
          <TextField
            {...field}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(transform ? transform(e.target.value) : e.target.value)}
            label={label}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message ?? tips ?? ' '}
            autoFocus={autoFocus}
            fullWidth
            size="medium"
            autoComplete="off"
            slotProps={{
              htmlInput: { maxLength, inputMode, 'aria-describedby': undefined },
              input: startIcon ? { startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment> } : undefined,
            }}
          />
        </Tooltip>
      )}
    />
  );
}
