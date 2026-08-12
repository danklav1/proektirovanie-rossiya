import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const LEAD_URL = 'https://functions.poehali.dev/bb046092-825c-4bb8-b1c4-59ffbca6e687';

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (!d) return '';
  const body = d.length === 11 ? d.slice(1) : d;
  const p = ['8'];
  if (body.length) p.push(` (${body.slice(0, 3)}`);
  if (body.length >= 3) p.push(') ');
  if (body.length > 3) p.push(body.slice(3, 6));
  if (body.length > 6) p.push(`-${body.slice(6, 8)}`);
  if (body.length > 8) p.push(`-${body.slice(8, 10)}`);
  return p.join('');
};

const CallbackButton = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Укажите, как к вам обращаться';
    if (phone.replace(/\D/g, '').length < 11) e.phone = 'Телефон в формате 8 900 000-00-00';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    try {
      const res = await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service: 'Обратный звонок' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Ошибка отправки');
      toast({
        title: 'Заявка принята',
        description: `${name}, перезвоним на ${phone} в течение 15 минут.`,
      });
      setName('');
      setPhone('');
      setErrors({});
      setOpen(false);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Не удалось отправить заявку',
        description: 'Позвоните нам сами: 8 (908) 004-80-80.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Заказать обратный звонок"
        className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-primary py-3 pl-3 pr-3 text-primary-foreground shadow-[0_16px_36px_-12px_rgba(4,96,205,0.75)] transition-all hover:pr-6 sm:bottom-8 sm:right-8"
      >
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/25" />
          <Icon name="Phone" size={20} className="relative" />
        </span>
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap font-display text-sm opacity-0 transition-all duration-300 group-hover:max-w-[180px] group-hover:opacity-100 sm:inline">
          Заказать звонок
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Обратный звонок</DialogTitle>
            <DialogDescription>
              Оставьте имя и телефон — мастер перезвонит в течение 15 минут и ответит на вопросы
              по установке ГБО.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-2 space-y-4" noValidate>
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Имя
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Александр"
                className="h-12 rounded-lg border-border bg-white"
              />
              {errors.name && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                  <Icon name="TriangleAlert" size={13} /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Телефон
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="8 (900) 000-00-00"
                inputMode="tel"
                className="h-12 rounded-lg border-border bg-white"
              />
              {errors.phone && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                  <Icon name="TriangleAlert" size={13} /> {errors.phone}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="h-14 w-full rounded-lg font-display text-base tracking-normal"
            >
              {sending ? 'Отправляем…' : 'Жду звонка'}
            </Button>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CallbackButton;
