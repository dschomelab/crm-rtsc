import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

export function DatePicker({ value, onChange, className, placeholder = 'dd/mm/aaaa', error, disabled, min, max }: DatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const nativeRef = React.useRef<HTMLInputElement>(null);

  const displayValue = value
    ? (() => {
        // Format stored ISO to dd/mm/yyyy for display
        if (value.includes('-')) {
          const [y, m, d] = value.split('T')[0].split('-');
          return `${d}/${m}/${y}`;
        }
        return value;
      })()
    : '';

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    let formatted = raw;
    if (raw.length > 4) formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`;
    else if (raw.length > 2) formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    e.target.value = formatted;

    if (raw.length === 8) {
      const d = raw.slice(0, 2), m = raw.slice(2, 4), y = raw.slice(4);
      onChange(`${y}-${m}-${d}`);
    } else if (raw.length === 0) {
      onChange('');
    }
  };

  const handleIconClick = () => {
    nativeRef.current?.showPicker?.();
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value || '');
  };

  return (
    <div className={cn('relative', className)}>
      <Input
        ref={inputRef}
        value={displayValue}
        onChange={handleDisplayChange}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        className="pr-9"
      />
      <input
        ref={nativeRef}
        type="date"
        value={value.split('T')[0] || ''}
        onChange={handleNativeChange}
        min={min}
        max={max}
        className="sr-only"
      />
      <button
        type="button"
        onClick={handleIconClick}
        disabled={disabled}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <CalendarIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
