import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PhoneInput, { isPhoneComplete } from '@/components/site/PhoneInput';
import ServicePicker from '@/components/site/ServicePicker';
import { useToast } from '@/hooks/use-toast';
import SectionHeading from './SectionHeading';

const BOOKING_URL = 'https://functions.poehali.dev/76e007e7-6777-479c-91d6-914f910805a6';

const SERVICES = [
  'Установка ГБО под ключ',
  'Только регистрация в ГИБДД',
  'ТО и настройка газовой системы',
  'Перенос ГБО на другой автомобиль',
  'Перевод автопарка (юрлицо)',
];

const CENTERS = [
  { city: 'Курган', address: 'ул. Омская, 167/1 ст2', hours: 'Пн–Сб, 10:00–20:00' },
  { city: 'Екатеринбург', address: 'ул. Монтёрская, 8, бокс 3', hours: 'Пн–Сб, 9:00–20:00' },
  { city: 'Казань', address: 'ул. Тэцевская, 14а', hours: 'Пн–Сб, 9:00–20:00' },
  { city: 'Нижний Новгород', address: 'ш. Жиркомбината, 21', hours: 'Ежедневно, 8:00–21:00' },
  { city: 'Уфа', address: 'ул. Трамвайная, 4к2', hours: 'Пн–Сб, 9:00–19:00' },
];

interface Day {
  date: string;
  day: number;
  weekday: string;
  month: string;
  closed: boolean;
  isToday: boolean;
  busy: string[];
  free: number;
}

const Booking = () => {
  const { toast } = useToast();
  const [days, setDays] = useState<Day[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [center, setCenter] = useState(CENTERS[0].city);
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ date: string; time: string } | null>(null);

  const activeCenter = CENTERS.find((c) => c.city === center) || CENTERS[0];

  const loadSlots = async (city: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BOOKING_URL}?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      setDays(data.days || []);
      setTimes(data.times || []);
    } catch {
      setDays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots(center);
    setDate('');
    setTime('');
  }, [center]);

  const selectedDay = useMemo(() => days.find((d) => d.date === date), [days, date]);

  const humanDate = selectedDay
    ? `${selectedDay.weekday}, ${selectedDay.day} ${selectedDay.month}`
    : '';

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!date) e.date = 'Выберите дату';
    if (!time) e.time = 'Выберите время';
    if (name.trim().length < 2) e.name = 'Укажите, как к вам обращаться';
    if (!isPhoneComplete(phone)) e.phone = 'Введите номер полностью';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    try {
      const res = await fetch(BOOKING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          city: activeCenter.city,
          address: activeCenter.address,
          service,
          date,
          time,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Ошибка записи');
      setDone({ date: humanDate, time });
      setName('');
      setPhone('');
      setComment('');
      setTime('');
      loadSlots(center);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Не удалось записаться',
        description:
          err instanceof Error && err.message
            ? err.message
            : 'Позвоните нам: 8 (908) 004-80-80',
      });
      loadSlots(center);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="booking"
      className="relative scroll-mt-20 overflow-hidden border-t border-border py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]" />
      <div className="container relative px-5 sm:px-8">
        <SectionHeading
          eyebrow="Запись"
          title={
            <>
              Онлайн-запись
              <br />
              <span className="text-primary">на удобное время</span>
            </>
          }
          description="Выберите центр, услугу и свободный слот на ближайшие две недели. Подтверждение придёт звонком мастера."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="rounded-xl border border-border bg-white p-5 shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] sm:p-8">
            <div className="mb-6">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Центр установки
              </p>
              <div className="flex snap-x gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {CENTERS.map((c) => (
                  <button
                    key={c.city}
                    type="button"
                    onClick={() => setCenter(c.city)}
                    className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2.5 text-sm transition-colors ${
                      c.city === center
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {c.city}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Услуга
              </p>
              <ServicePicker value={service} onChange={setService} options={SERVICES} />
            </div>

            <div className="mb-6">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Дата · ближайшие 14 дней
              </p>
              {loading ? (
                <p className="text-sm text-muted-foreground">Загружаем расписание…</p>
              ) : (
                <div className="flex snap-x gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-7 sm:gap-2 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
                  {days.map((d) => {
                    const active = d.date === date;
                    const disabled = d.closed || d.free === 0;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setDate(d.date);
                          setTime('');
                        }}
                        className={`flex w-[72px] shrink-0 snap-start flex-col items-center rounded-xl border px-2 py-3 transition-colors sm:w-auto ${
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : disabled
                              ? 'cursor-not-allowed border-border bg-muted/60 text-muted-foreground/60'
                              : 'border-border bg-white text-foreground hover:border-primary'
                        }`}
                      >
                        <span className="text-[11px] uppercase tracking-wide opacity-70">
                          {d.weekday}
                        </span>
                        <span className="font-display text-xl leading-tight">{d.day}</span>
                        <span className="mt-0.5 text-[10px] leading-none opacity-70">
                          {d.closed ? 'выходной' : d.free === 0 ? 'нет мест' : `${d.free} слотов`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.date && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                  <Icon name="TriangleAlert" size={13} /> {errors.date}
                </p>
              )}
            </div>

            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Время
              </p>
              {!selectedDay ? (
                <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  Сначала выберите дату
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {times.map((t) => {
                    const busy = selectedDay.busy.includes(t);
                    const active = t === time;
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={busy}
                        onClick={() => setTime(t)}
                        className={`rounded-lg border py-3 text-sm transition-colors ${
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : busy
                              ? 'cursor-not-allowed border-border bg-muted/60 text-muted-foreground/50 line-through'
                              : 'border-border bg-white text-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.time && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                  <Icon name="TriangleAlert" size={13} /> {errors.time}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-secondary/50 p-5 sm:p-7 lg:sticky lg:top-24">
            {done ? (
              <div className="text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon name="Check" size={28} />
                </span>
                <h3 className="font-display text-xl">Вы записаны</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {done.date}, {done.time} · {activeCenter.city}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Мастер перезвонит и подтвердит запись. Если планы поменяются — позвоните нам.
                </p>
                <Button
                  variant="outline"
                  className="mt-5 h-12 w-full rounded-lg"
                  onClick={() => setDone(null)}
                >
                  Записать ещё машину
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="rounded-lg border border-border bg-white p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Ваша запись
                  </p>
                  <p className="mt-2 font-display text-lg leading-tight">
                    {humanDate && time ? `${humanDate}, ${time}` : 'Дата и время не выбраны'}
                  </p>
                  <p className="mt-3 text-sm text-foreground/90">{service}</p>
                  <div className="mt-3 flex gap-2 border-t border-border pt-3 text-sm text-muted-foreground">
                    <Icon name="MapPin" size={15} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      {activeCenter.city}, {activeCenter.address}
                      <span className="block text-xs">{activeCenter.hours}</span>
                    </span>
                  </div>
                </div>

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
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    placeholder="+7 (900) 000-00-00"
                    className="h-12 rounded-lg border-border bg-white"
                  />
                  {errors.phone && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                      <Icon name="TriangleAlert" size={13} /> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Автомобиль и пожелания
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Kia Rio 1.6, 2019, пробег 90 000"
                    rows={2}
                    className="resize-none rounded-lg border-border bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={sending}
                  className="h-14 w-full rounded-lg font-display text-base tracking-normal"
                >
                  {sending ? 'Записываем…' : 'Записаться'}
                </Button>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
