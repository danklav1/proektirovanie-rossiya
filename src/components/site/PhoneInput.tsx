import { forwardRef, useRef } from 'react';
import { Input } from '@/components/ui/input';

const onlyDigits = (v: string) => v.replace(/\D/g, '');

export const toPhoneBody = (raw: string) => {
  let d = onlyDigits(raw);
  if (d.startsWith('8') || d.startsWith('7')) d = d.slice(1);
  return d.slice(0, 10);
};

export const formatPhone = (raw: string) => {
  const b = toPhoneBody(raw);
  if (!b) return '';
  let out = `8 (${b.slice(0, 3)}`;
  if (b.length >= 3) out += ')';
  if (b.length > 3) out += ` ${b.slice(3, 6)}`;
  if (b.length > 6) out += `-${b.slice(6, 8)}`;
  if (b.length > 8) out += `-${b.slice(8, 10)}`;
  return out;
};

export const isPhoneComplete = (raw: string) => toPhoneBody(raw).length === 10;

const digitsBefore = (value: string, pos: number) => onlyDigits(value.slice(0, pos)).length;

const caretAfterDigits = (formatted: string, count: number) => {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) {
      seen += 1;
      if (seen === count) return i + 1;
    }
  }
  return formatted.length;
};

interface PhoneInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    const apply = (nextRaw: string, digitsKept: number) => {
      const formatted = formatPhone(nextRaw);
      onChange(formatted);
      requestAnimationFrame(() => {
        const el = innerRef.current;
        if (!el) return;
        const pos = caretAfterDigits(formatted, digitsKept);
        el.setSelectionRange(pos, pos);
      });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const pos = e.target.selectionStart ?? raw.length;
      apply(raw, digitsBefore(raw, pos));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const el = e.currentTarget;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      if (start !== end) return;

      if (e.key === 'Backspace' && start > 0 && !/\d/.test(el.value[start - 1])) {
        e.preventDefault();
        let i = start - 1;
        while (i >= 0 && !/\d/.test(el.value[i])) i -= 1;
        if (i < 0) return;
        const next = el.value.slice(0, i) + el.value.slice(i + 1);
        apply(next, digitsBefore(el.value, i));
      }

      if (e.key === 'Delete' && start < el.value.length && !/\d/.test(el.value[start])) {
        e.preventDefault();
        let i = start;
        while (i < el.value.length && !/\d/.test(el.value[i])) i += 1;
        if (i >= el.value.length) return;
        const next = el.value.slice(0, i) + el.value.slice(i + 1);
        apply(next, digitsBefore(el.value, i));
      }
    };

    return (
      <Input
        {...props}
        ref={setRefs}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
