export type LeadStatusValue = 'new' | 'in_work' | 'booked' | 'declined';

export const STATUS_LIST: { value: LeadStatusValue; label: string; dot: string; chip: string }[] = [
  {
    value: 'new',
    label: 'Новая',
    dot: 'bg-primary',
    chip: 'bg-primary text-primary-foreground border-primary',
  },
  {
    value: 'in_work',
    label: 'В работе',
    dot: 'bg-accent',
    chip: 'bg-accent text-accent-foreground border-accent',
  },
  {
    value: 'booked',
    label: 'Записан',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-500 text-white border-emerald-500',
  },
  {
    value: 'declined',
    label: 'Отказ',
    dot: 'bg-muted-foreground',
    chip: 'bg-muted-foreground text-white border-muted-foreground',
  },
];

export const statusMeta = (value: string) =>
  STATUS_LIST.find((s) => s.value === value) || STATUS_LIST[0];

interface StatusPickerProps {
  value: string;
  saving?: boolean;
  onChange: (value: LeadStatusValue) => void;
}

export const StatusPicker = ({ value, saving, onChange }: StatusPickerProps) => (
  <div className={`flex flex-wrap gap-1.5 ${saving ? 'opacity-50' : ''}`}>
    {STATUS_LIST.map((s) => {
      const active = s.value === value;
      return (
        <button
          key={s.value}
          type="button"
          disabled={saving}
          onClick={() => !active && onChange(s.value)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            active
              ? s.chip
              : 'border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'
          }`}
        >
          {s.label}
        </button>
      );
    })}
  </div>
);

export const StatusBadge = ({ value }: { value: string }) => {
  const s = statusMeta(value);
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-white px-2.5 py-1 text-xs font-medium">
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};
