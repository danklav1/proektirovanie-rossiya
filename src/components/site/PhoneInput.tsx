import { forwardRef, useRef } from 'react';
import { Input } from '@/components/ui/input';

const PREFIX = '+7 ';

const onlyDigits = (v: string) => v.replace(/\D/g, '');

export const toPhoneBody = (raw: string) => {
  let d = onlyDigits(raw);
  if (d.startsWith('8') || d.startsWith('7')) d = d.slice(1);
  return d.slice(0, 10);
};

export const formatPhone = (raw: string) => {
  const b = toPhoneBody(raw);
  if (!b) return PREFIX;
  let out = `${PREFIX}(${b.slice(0, 3)}`;
  if (b.length >= 3) out += ')';
  if (b.length > 3) out += ` ${b.slice(3, 6)}`;
  if (b.length > 6) out += `-${b.slice(6, 8)}`;
  if (b.length > 8) out += `-${b.slice(8, 10)}`;
  return out;
};

export const isPhoneComplete = (raw: string) => toPhoneBody(raw).length === 10;

const bodyDigitsBefore = (value: string, pos: number) => {
  const all = onlyDigits(value);
  const before = onlyDigits(value.slice(0, pos)).length;
  if (all[0] === '7' || all[0] === '8') return Math.max(0, before - 1);
  return before;
};

const caretAfterBodyDigits = (formatted: string, count: number) => {
  if (count <= 0) return PREFIX.length;
  let seen = 0;
  for (let i = PREFIX.length; i < formatted.length; i += 1) {
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
  ({ value, onChange, onFocus, onClick, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    const setCaret = (pos: number) => {
      requestAnimationFrame(() => {
        const el = innerRef.current;
        if (!el) return;
        const safe = Math.max(PREFIX.length, pos);
        el.setSelectionRange(safe, safe);
      });
    };

    const apply = (nextRaw: string, digitsKept: number) => {
      const formatted = formatPhone(nextRaw);
      onChange(formatted);
      setCaret(caretAfterBodyDigits(formatted, digitsKept));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const pos = e.target.selectionStart ?? raw.length;
      apply(raw, bodyDigitsBefore(raw, pos));
    };

    const guardCaret = (el: HTMLInputElement) => {
      const start = el.selectionStart ?? 0;
      if (start < PREFIX.length) setCaret(PREFIX.length);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const el = e.currentTarget;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;

      if (e.key === 'Backspace' && start === end && start <= PREFIX.length) {
        e.preventDefault();
        setCaret(PREFIX.length);
        return;
      }

      if (start !== end) return;

      if (e.key === 'Backspace' && start > 0 && !/\d/.test(el.value[start - 1])) {
        e.preventDefault();
        let i = start - 1;
        while (i >= PREFIX.length && !/\d/.test(el.value[i])) i -= 1;
        if (i < PREFIX.length) return;
        const next = el.value.slice(0, i) + el.value.slice(i + 1);
        apply(next, bodyDigitsBefore(el.value, i));
      }

      if (e.key === 'Delete' && start < el.value.length && !/\d/.test(el.value[start])) {
        e.preventDefault();
        let i = start;
        while (i < el.value.length && !/\d/.test(el.value[i])) i += 1;
        if (i >= el.value.length) return;
        const next = el.value.slice(0, i) + el.value.slice(i + 1);
        apply(next, bodyDigitsBefore(el.value, i));
      }
    };

    return (
      <Input
        {...props}
        ref={setRefs}
        value={value || PREFIX}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          if (!value) onChange(PREFIX);
          guardCaret(e.currentTarget);
          onFocus?.(e);
        }}
        onClick={(e) => {
          guardCaret(e.currentTarget);
          onClick?.(e);
        }}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
