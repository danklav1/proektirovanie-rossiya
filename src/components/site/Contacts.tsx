import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import SectionHeading from './SectionHeading';

const CITIES = [
  { city: 'Курган', address: 'ул. Омская, 167/1 ст2', hours: 'Пн–Сб, 10:00–20:00' },
  { city: 'Екатеринбург', address: 'ул. Монтёрская, 8, бокс 3', hours: 'Пн–Сб, 9:00–20:00' },
  { city: 'Казань', address: 'ул. Тэцевская, 14а', hours: 'Пн–Сб, 9:00–20:00' },
  { city: 'Нижний Новгород', address: 'ш. Жиркомбината, 21', hours: 'Ежедневно, 8:00–21:00' },
  { city: 'Уфа', address: 'ул. Трамвайная, 4к2', hours: 'Пн–Сб, 9:00–19:00' },
];

const LEAD_URL = 'https://functions.poehali.dev/bb046092-825c-4bb8-b1c4-59ffbca6e687';

const SERVICES = [
  'Установка ГБО под ключ',
  'Только регистрация в ГИБДД',
  'ТО и настройка газовой системы',
  'Перенос ГБО на другой автомобиль',
  'Перевод автопарка (юрлицо)',
];

const Contacts = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [car, setCar] = useState('');
  const [service, setService] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Укажите, как к вам обращаться';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) e.phone = 'Телефон в формате 8 900 000-00-00';
    if (car.trim().length < 3) e.car = 'Марка, модель и объём двигателя';
    if (!service) e.service = 'Выберите услугу';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      const res = await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, car, service, comment }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Ошибка отправки');
      toast({
        title: 'Заявка принята',
        description: `${name}, мастер перезвонит на ${phone} в течение 15 минут и подберёт комплект.`,
      });
      setName('');
      setPhone('');
      setCar('');
      setService('');
      setComment('');
      setErrors({});
    } catch {
      toast({
        variant: 'destructive',
        title: 'Не удалось отправить заявку',
        description: 'Позвоните нам по телефону 8 (908) 004-80-80 — примем заявку по телефону.',
      });
    } finally {
      setSending(false);
    }
  };

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

  return (
    <section
      id="contacts"
      className="relative scroll-mt-20 overflow-hidden border-t border-border bg-secondary/40 py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[130px]" />
      <div className="container relative px-5 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] p-8 sm:p-10">
            <SectionHeading
              eyebrow="Запись"
              title={
                <>
                  Оставьте заявку —
                  <br />
                  <span className="text-primary">посчитаем ваш мотор</span>
                </>
              }
              description="Мастер перезвонит в течение 15 минут, задаст пару вопросов по машине и назовёт точную стоимость. Диагностика в боксе — бесплатно."
            />

            <form onSubmit={onSubmit} className="mt-10 space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
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
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Автомобиль
                  </label>
                  <Input
                    value={car}
                    onChange={(e) => setCar(e.target.value)}
                    placeholder="Kia Rio 1.6, 2019"
                    className="h-12 rounded-lg border-border bg-white"
                  />
                  {errors.car && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                      <Icon name="TriangleAlert" size={13} /> {errors.car}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Услуга
                  </label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger className="h-12 rounded-lg border-border bg-white">
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                      <Icon name="TriangleAlert" size={13} /> {errors.service}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Комментарий
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Пробег, тип впрыска, удобное время для звонка"
                  rows={3}
                  className="rounded-lg border-border bg-white resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="h-14 w-full rounded-lg font-display text-base tracking-normal"
              >
                {sending ? 'Отправляем…' : 'Записаться на диагностику'}
              </Button>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Мы не передаём
                номера третьим лицам и не звоним с рекламой.
              </p>
            </form>
          </div>

          <div className="rounded-xl border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[11px] uppercase tracking-[0.26em] text-primary">Центры</span>
            </div>
            <h3 className="mt-5 font-display text-3xl leading-none">
              Где нас найти
            </h3>

            <div className="mt-8 space-y-3">
              {CITIES.map((c) => (
                <div
                  key={c.city}
                  className="group rounded-xl border border-border bg-white p-4 transition-colors hover:border-primary/40 hover:bg-secondary"
                >
                  <div className="flex items-start gap-4 px-1">
                    <Icon name="MapPin" size={18} className="mt-1 shrink-0 text-primary" />
                    <div>
                      <div className="font-display text-lg tracking-wide">{c.city}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{c.address}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground/70">
                        {c.hours}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-primary p-6 text-primary-foreground">
              <div className="text-[11px] uppercase tracking-[0.16em] text-primary-foreground/70">
                Единый номер сети
              </div>
              <a
                href="tel:+79080048080"
                className="mt-2 block font-display text-3xl transition-opacity hover:opacity-80"
              >
                8 (908) 004-80-80
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/79080048080"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm transition-colors hover:bg-white hover:text-primary"
                >
                  <Icon name="MessageCircle" size={16} /> WhatsApp
                </a>
                <a
                  href="mailto:gazon.45@mail.ru"
                  className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm transition-colors hover:bg-white hover:text-primary"
                >
                  <Icon name="Mail" size={16} /> gazon.45@mail.ru
                </a>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2.5 text-sm text-muted-foreground">
              <Icon name="Truck" size={17} className="mt-0.5 shrink-0 text-primary" />
              Переводите автопарк? Приедем на вашу площадку и составим график без простоя техники.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
