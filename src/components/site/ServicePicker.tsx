import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ServicePickerProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  title?: string;
}

const ServicePicker = ({
  value,
  onChange,
  options,
  placeholder = 'Выберите услугу',
  title = 'Какая услуга нужна?',
}: ServicePickerProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 rounded-lg border-border bg-white text-left">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-w-[min(28rem,calc(100vw-2rem))]">
          {options.map((s) => (
            <SelectItem key={s} value={s} className="whitespace-normal py-2.5 pr-3">
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-between gap-3 rounded-lg border border-border bg-white px-3 text-left text-base"
      >
        <span className={value ? 'line-clamp-2 leading-tight' : 'text-muted-foreground'}>
          {value || placeholder}
        </span>
        <Icon name="ChevronDown" size={16} className="shrink-0 opacity-50" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85vh] rounded-t-2xl">
          <DrawerHeader className="pb-2 text-left">
            <DrawerTitle className="font-display text-xl">{title}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">
            <div className="space-y-2">
              {options.map((s) => {
                const active = s === value;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      onChange(s);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left text-[15px] leading-snug transition-colors ${
                      active
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-white text-foreground'
                    }`}
                  >
                    <span>{s}</span>
                    {active && <Icon name="Check" size={18} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ServicePicker;