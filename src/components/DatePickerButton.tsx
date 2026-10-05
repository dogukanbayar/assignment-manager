import { useRef } from 'react';
import { IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { displayToIso, isValidDisplayDate, isoToDisplay } from '../utils/date';

interface Props {
  /** Mevcut değer (DD/MM/YYYY) */
  value: string;
  onPick: (displayValue: string) => void;
  label: string;
  disabled?: boolean;
}

/** Yazarak giriş korunur; takvim butonu yerel tarih seçiciyi açar (ek bağımlılık yok). */
export function DatePickerButton({ value, onPick, label, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const iso = isValidDisplayDate(value) ? displayToIso(value) : '';

  const open = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === 'function') el.showPicker();
    else el.focus();
  };

  return (
    <>
      <IconButton aria-label={label} edge="end" size="small" onClick={open} disabled={disabled}>
        <CalendarMonthIcon fontSize="small" />
      </IconButton>
      <input
        ref={inputRef}
        type="date"
        value={iso}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => e.target.value && onPick(isoToDisplay(e.target.value))}
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
      />
    </>
  );
}
