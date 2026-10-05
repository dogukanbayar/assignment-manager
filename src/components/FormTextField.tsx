import type { ReactNode } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { InputAdornment, TextField, Tooltip } from '@mui/material';

export interface FormTextFieldProps<T extends FieldValues> {
  /** react-hook-form alan adı */
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  /** Hover'da ve yardım metninde gösterilen ipucu (pattern açıklaması vb.) */
  tips?: string;
  /**
   * Doğrulama regex'i. `resolver` verilmediğinde RHF kuralı olarak, her durumda
   * HTML `pattern` özniteliği olarak uygulanır. (Resolver varsa kurallar onda toplanır.)
   */
  pattern?: RegExp;
  patternMessage?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  /** Karakter sayacı (örn. 8/12) göster */
  showCount?: boolean;
  placeholder?: string;
  startIcon?: ReactNode;
  endAdornment?: ReactNode;
  /** Resolver'sız kullanım için ek doğrulama */
  validate?: RegisterOptions<T, FieldPath<T>>['validate'];
  /** Değer değişmeden önce dönüştürme (maske, büyük harf vb.) */
  transform?: (value: string) => string;
  inputMode?: 'text' | 'numeric';
  autoFocus?: boolean;
}

/** Generic metin alanı: name, pattern, tips, enabled/disabled, maxLength vb. parametriktir. */
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
  showCount = false,
  placeholder,
  startIcon,
  endAdornment,
  validate,
  transform,
  inputMode,
  autoFocus,
}: FormTextFieldProps<T>) {
  const rules = {
    required: required ? `${label} is required` : false,
    ...(maxLength ? { maxLength: { value: maxLength, message: `Max ${maxLength}` } } : {}),
    ...(pattern ? { pattern: { value: pattern, message: patternMessage ?? 'Invalid format' } } : {}),
    ...(validate ? { validate } : {}),
  } as RegisterOptions<T, FieldPath<T>>;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const value = String(field.value ?? '');
        const message = fieldState.error?.message ?? tips ?? ' ';
        return (
          <Tooltip title={tips ?? ''} placement="top-start" arrow disableHoverListener={!tips}>
            <TextField
              name={field.name}
              value={value}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(transform ? transform(e.target.value) : e.target.value)}
              inputRef={field.ref}
              label={label}
              required={required}
              disabled={disabled}
              placeholder={placeholder}
              error={Boolean(fieldState.error)}
              helperText={
                showCount && maxLength ? (
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span>{message}</span>
                    <span aria-hidden="true">
                      {value.length}/{maxLength}
                    </span>
                  </span>
                ) : (
                  message
                )
              }
              autoFocus={autoFocus}
              fullWidth
              autoComplete="off"
              slotProps={{
                htmlInput: { maxLength, inputMode, pattern: pattern?.source },
                input: {
                  startAdornment: startIcon ? (
                    <InputAdornment position="start">{startIcon}</InputAdornment>
                  ) : undefined,
                  endAdornment: endAdornment ? (
                    <InputAdornment position="end">{endAdornment}</InputAdornment>
                  ) : undefined,
                },
              }}
            />
          </Tooltip>
        );
      }}
    />
  );
}
