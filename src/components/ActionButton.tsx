import type { MouseEventHandler, ReactNode } from 'react';
import { Button, Tooltip, type ButtonProps } from '@mui/material';

export interface ActionButtonProps {
  label: string;
  /** Tıklama aksiyonu (type="submit" ise gerekmez) */
  action?: MouseEventHandler<HTMLButtonElement>;
  tips?: string;
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
  icon?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

/** Generic buton: label, action, tips, renk, enabled/disabled, ikon parametrik. */
export function ActionButton({
  label,
  action,
  tips,
  color = 'primary',
  variant = 'contained',
  icon,
  disabled = false,
  type = 'button',
  fullWidth = false,
}: ActionButtonProps) {
  return (
    <Tooltip title={tips ?? ''} arrow disableHoverListener={!tips}>
      {/* span: disabled butonda da tooltip çalışsın */}
      <span style={{ display: fullWidth ? 'block' : 'inline-flex' }}>
        <Button
          type={type}
          onClick={action}
          color={color}
          variant={variant}
          startIcon={icon}
          disabled={disabled}
          fullWidth={fullWidth}
          size="large"
        >
          {label}
        </Button>
      </span>
    </Tooltip>
  );
}
