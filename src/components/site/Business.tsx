import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PhoneInput, { isPhoneComplete } from '@/components/site/PhoneInput';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import SectionHeading from './SectionHeading';

const PETROL_PRICE = 62;
const GAS_PRICE = 28;
const KIT_PRICE = 46000;
const LEAD_URL = 'https://functions.poehali.dev/bb046092-825c-4bb8-b1c4-59ffbca6e687';

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n));

const TERMS = [
  {
    icon: 'FileText',
    title: 'Работаем по договору и с НДС',
    text: 'Полный пакет закрывающих документов: договор, счёт, акт, УПД. Оплата по безналу, отсрочка до 14 дней для постоянных клиентов.',
  },
  {
    icon: 'Percent',
    title: 'Скидка от объёма',
    text: 'От 5 машин — 7%, от 10 — 12%, от 20 машин — индивидуальная цена и закреплённый мастер за вашим парком.',
  },
  {
    icon: 'CalendarClock',
    title: 'Переводим парк по графику',
    text: 'Ставим машины партиями по 2–3 штуки, чтобы работа не останавливалась. Согласуем график заранее, укладываемся в смену.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Регистрация в ГИБДД под ключ',
    text: 'Берём на себя экспертизу, оформление и внесение изменений в СТС по всем машинам сразу. Вам не нужно ездить по инстанциям.',
  },
  {
    icon: 'Wrench',
    title: 'Приоритетное обслуживание',
    text: 'Машины парка обслуживаем без очереди, ТО газовой системы по регламенту с напоминанием. Выездная диагностика на вашей базе.',
  },
  {
    icon: 'ChartLine',
    title: 'Отчёт по экономии',
    text: 'Раз в квартал считаем фактическую экономию по каждой машине — видно, как быстро окупились вложения.',
  },
];

const Business = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState(10);
  const [km, setKm] = useState(5000);
  const [rate, setRate] = useState(12);

  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const data = useMemo(() => {
    const gasRate = rate * 1.13;
    const petrolMonth = (km / 100) * rate * PETROL_PRICE;
    const gasMonth = (km / 100) * gasRate * GAS_PRICE;
    const savePerCar = petrolMonth - gasMonth;
    const discount = cars >= 20 ? 0.15 : cars >= 10 ? 0.12 : cars >= 5 ? 0.07 : 0;
    const kit = KIT_PRICE * (1 - discount);
    const saveFleet = savePerCar * cars;
    return {
      savePerCar,
      saveFleet,
      saveYear: saveFleet * 12,
      invest: kit * cars,
      discount: discount * 100,
      payback: savePerCar > 0 ? kit / savePerCar : 0,
    };
  }, [cars, km, rate]);


  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (company.trim().length < 2) e.company = 'Название компании или ИП';
    if (name.trim().length < 2) e.name = 'Укажите контактное лицо';
    if (!isPhoneComplete(phone)) e.phone = 'Телефон в формате 8 900 000-00-00';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Проверьте адрес почты';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    try {
      const res = await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          company,
          fleet: `${cars} авто`,
          car: `Автопарк ${cars} авто`,
          service: 'Коммерческое предложение для автопарка',
          comment: `Пробег на машину: ${fmt(km)} км/мес, расход ${rate} л/100 км. Расчётная экономия парка: ${fmt(data.saveFleet)} ₽/мес.`,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error();
      toast({
        title: 'Заявка на КП принята',
        description: `${name}, подготовим расчёт по ${cars} машинам и пришлём в течение рабочего дня.`,
      });
      setCompany('');
      setName('');
      setPhone('');
      setEmail('');
      setErrors({});
    } catch {
      toast({
        variant: 'destructive',
        title: 'Не удалось отправить заявку',
        description: 'Позвоните по телефону 8 (908) 004-80-80 — примем заявку и посчитаем парк.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="business"
      className="relative scroll-mt-20 overflow-hidden border-y border-border bg-secondary/40 py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[130px]" />
      <div className="container relative px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <SectionHeading
            eyebrow="Таксопаркам и бизнесу"
            title={
              <>
                Топливо — главная
                <br />
                <span className="text-primary">статья расходов парка</span>
              </>
            }
          />
          <p className="text-base leading-relaxed text-muted-foreground lg:pb-2">
            Чем больше машина ездит, тем быстрее окупается газ. Для таксопарков, доставки и
            корпоративных парков считаем экономию по всему автопарку, работаем по договору с
            отсрочкой и переводим машины по графику, не останавливая работу.
          </p>
        </div>

        <div className="mt-10 grid sm:mt-14 gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] sm:p-8 lg:p-10">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Icon name="Calculator" size={14} /> Расчёт на автопарк
            </div>

            <div className="mt-8 space-y-7 sm:mt-9 sm:space-y-10">
              <div>
                <div className="flex items-end justify-between gap-4">
                  <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground sm:text-sm sm:tracking-[0.16em]">
                    Машин в парке
                  </label>
                  <div className="font-display text-xl leading-none text-primary sm:text-2xl">{cars}</div>
                </div>
                <Slider
                  value={[cars]}
                  onValueChange={(v) => setCars(v[0])}
                  min={2}
                  max={50}
                  step={1}
                  className="mt-5"
                />
              </div>

              <div>
                <div className="flex items-end justify-between gap-4">
                  <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground sm:text-sm sm:tracking-[0.16em]">
                    Пробег на машину, км/мес
                  </label>
                  <div className="font-display text-xl leading-none text-primary sm:text-2xl">{fmt(km)}</div>
                </div>
                <Slider
                  value={[km]}
                  onValueChange={(v) => setKm(v[0])}
                  min={1000}
                  max={15000}
                  step={500}
                  className="mt-5"
                />
              </div>

              <div>
                <div className="flex items-end justify-between gap-4">
                  <label className="text-xs uppercase tracking-[0.12em] text-muted-foreground sm:text-sm sm:tracking-[0.16em]">
                    Расход, л/100 км
                  </label>
                  <div className="font-display text-xl leading-none text-primary sm:text-2xl">{rate}</div>
                </div>
                <Slider
                  value={[rate]}
                  onValueChange={(v) => setRate(v[0])}
                  min={6}
                  max={25}
                  step={0.5}
                  className="mt-5"
                />
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-primary p-6 text-primary-foreground sm:col-span-2">
                <div className="text-[11px] uppercase tracking-[0.16em] text-primary-foreground/70">
                  Экономия парка в год
                </div>
                <div className="mt-3 font-display text-3xl leading-none sm:text-4xl">
                  {fmt(data.saveYear)} ₽
                </div>
                <div className="mt-3 text-sm text-primary-foreground/80">
                  {fmt(data.saveFleet)} ₽ в месяц на {cars} машин
                </div>
              </div>
              <div className="rounded-xl bg-secondary p-6">
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Вложения в парк
                </div>
                <div className="mt-3 font-display text-2xl leading-none text-primary">
                  {fmt(data.invest)} ₽
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {data.discount > 0 ? `со скидкой ${data.discount}%` : 'скидка от 5 машин'}
                </div>
              </div>
              <div className="rounded-xl bg-secondary p-6">
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Окупаемость
                </div>
                <div className="mt-3 font-display text-2xl leading-none text-primary">
                  {data.payback < 1 ? 'меньше месяца' : `${data.payback.toFixed(1)} мес.`}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">при текущем пробеге</div>
              </div>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Расчёт по средним ценам: бензин АИ-95 — 62 ₽/л, пропан — 28 ₽/л, поправка на расход
              газа +13%. Точную смету зафиксируем в коммерческом предложении.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] sm:p-8 lg:p-10">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Icon name="Handshake" size={14} /> Условия для юрлиц
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {TERMS.map((t) => (
                  <div key={t.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon name={t.icon} size={18} />
                    </div>
                    <div className="mt-4 text-sm font-semibold leading-snug">{t.title}</div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] sm:p-8 lg:p-10"
            >
              <div className="font-display text-2xl leading-snug">
                Запросить коммерческое предложение
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Пришлём расчёт по вашему парку с ценой за машину, графиком работ и суммой экономии
                за год.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Компания
                  </label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="ООО «Такси Город»"
                    className="h-12 rounded-lg border-border bg-white"
                  />
                  {errors.company && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                      <Icon name="TriangleAlert" size={13} /> {errors.company}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Контактное лицо
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
                    placeholder="8 (900) 000-00-00"
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
                    E-mail для КП
                  </label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buh@company.ru"
                    inputMode="email"
                    className="h-12 rounded-lg border-border bg-white"
                  />
                  {errors.email && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                      <Icon name="TriangleAlert" size={13} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-lg bg-secondary px-5 py-4 text-sm text-muted-foreground">
                <Icon name="Car" size={16} className="shrink-0 text-primary" />
                В заявку попадёт ваш расчёт: {cars} машин, экономия {fmt(data.saveFleet)} ₽ в месяц
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="mt-7 h-14 w-full rounded-lg font-display text-base tracking-normal"
              >
                {sending ? 'Отправляем…' : 'Получить КП на автопарк'}
              </Button>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Ответим в течение
                рабочего дня.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business;
