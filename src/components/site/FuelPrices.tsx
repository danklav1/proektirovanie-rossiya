import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SectionHeading from './SectionHeading';

const FUELS = [
  {
    key: 'ai95',
    name: 'Бензин АИ-95',
    price: 62,
    consumption: 10,
    icon: 'Fuel',
    note: 'Базовый вариант для большинства машин',
  },
  {
    key: 'diesel',
    name: 'Дизель',
    price: 70,
    consumption: 7.5,
    icon: 'Truck',
    note: 'Экономичнее по литрам, но дороже литр и обслуживание',
  },
  {
    key: 'lpg',
    name: 'Пропан (ГБО)',
    price: 28,
    consumption: 11.3,
    icon: 'Flame',
    note: 'Литр вдвое дешевле, расход выше на 13%',
    best: true,
  },
];

const PRICE_HISTORY = [
  { year: '2019', ai95: 45.1, diesel: 47.2, lpg: 22.4 },
  { year: '2020', ai95: 46.3, diesel: 48.1, lpg: 19.8 },
  { year: '2021', ai95: 49.6, diesel: 51.4, lpg: 25.1 },
  { year: '2022', ai95: 51.8, diesel: 55.9, lpg: 26.3 },
  { year: '2023', ai95: 54.7, diesel: 62.5, lpg: 27.0 },
  { year: '2024', ai95: 58.2, diesel: 66.8, lpg: 27.6 },
  { year: '2025', ai95: 62.0, diesel: 70.1, lpg: 28.0 },
];

const KM = 1000;

const TABS = [
  { id: 'ai95', label: 'Бензин АИ-95' },
  { id: 'diesel', label: 'Дизель' },
  { id: 'lpg', label: 'Пропан' },
];

const scrollToCalc = () => {
  const el = document.getElementById('calc');
  if (el) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
  }
};

const money = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-white px-4 py-3 shadow-lg">
      <div className="font-display text-sm">{label} год</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="mt-1.5 flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name}</span>
          <span className="ml-auto font-semibold">{p.value} ₽/л</span>
        </div>
      ))}
    </div>
  );
};

const FuelPrices = () => {
  const [tab, setTab] = useState('ai95');
  const active = PRICE_HISTORY[PRICE_HISTORY.length - 1];
  const first = PRICE_HISTORY[0];
  const growth = Math.round(((active.ai95 - first.ai95) / first.ai95) * 100);
  const lpgGrowth = Math.round(((active.lpg - first.lpg) / first.lpg) * 100);

  return (
    <section
      id="fuel"
      className="relative scroll-mt-20 overflow-hidden border-y border-border bg-secondary/40 py-16 sm:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="container relative px-5 sm:px-8">
        <SectionHeading
          eyebrow="Цены на топливо"
          title={
            <>
              Бензин дорожает
              <br />
              <span className="text-primary">газ — почти нет</span>
            </>
          }
          description="Средние розничные цены по России. За семь лет бензин подорожал заметно сильнее пропана — и разрыв продолжает расти."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {FUELS.map((f) => {
            const cost = (f.price * f.consumption * KM) / 100;
            return (
              <article
                key={f.key}
                className={`rounded-xl p-8 transition-all ${
                  f.best
                    ? 'bg-primary text-primary-foreground shadow-[0_24px_50px_-18px_rgba(4,96,205,0.6)]'
                    : 'border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      f.best ? 'bg-white/15' : 'bg-secondary text-primary'
                    }`}
                  >
                    <Icon name={f.icon} size={22} />
                  </span>
                  {f.best && (
                    <span className="rounded-full bg-accent px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-accent-foreground">
                      Выгодно
                    </span>
                  )}
                </div>

                <h3 className="mt-6 font-display text-xl">{f.name}</h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-4xl leading-none">{f.price} ₽</span>
                  <span className={`pb-1 text-sm ${f.best ? 'opacity-75' : 'text-muted-foreground'}`}>
                    за литр
                  </span>
                </div>

                <div
                  className={`mt-6 space-y-2.5 border-t pt-5 text-sm ${
                    f.best ? 'border-white/20' : 'border-border'
                  }`}
                >
                  <div className="flex justify-between gap-4">
                    <span className={f.best ? 'opacity-75' : 'text-muted-foreground'}>
                      Расход на 100 км
                    </span>
                    <span className="font-semibold">{f.consumption} л</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className={f.best ? 'opacity-75' : 'text-muted-foreground'}>
                      1000 км обойдутся
                    </span>
                    <span className="font-display text-lg leading-none">{money(cost)}</span>
                  </div>
                </div>

                <p className={`mt-5 text-xs leading-relaxed ${f.best ? 'opacity-80' : 'text-muted-foreground'}`}>
                  {f.note}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-border bg-white p-6 shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl">Как росли цены на топливо</h3>
              <p className="mt-2 text-sm text-muted-foreground text-left font-medium">
                Средняя цена за литр по России, 2019–2025
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                    tab === t.id
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PRICE_HISTORY} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="fuelFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="lpgFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={54}
                  domain={[15, 'dataMax + 6']}
                  tickFormatter={(v) => `${v} ₽`}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={tab}
                  name={TABS.find((t) => t.id === tab)?.label}
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#fuelFill)"
                  dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                {tab !== 'lpg' && (
                  <Area
                    type="monotone"
                    dataKey="lpg"
                    name="Пропан"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="6 5"
                    fill="url(#lpgFill)"
                    dot={false}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid gap-5 border-t border-border pt-8 sm:grid-cols-3">
            <div>
              <div className="font-display text-3xl leading-none text-primary">+{growth}%</div>
              <div className="mt-2 text-sm text-muted-foreground">рост цены бензина с 2019 года</div>
            </div>
            <div>
              <div className="font-display text-3xl leading-none text-primary">+{lpgGrowth}%</div>
              <div className="mt-2 text-sm text-muted-foreground">рост цены пропана за тот же срок</div>
            </div>
            <div>
              <div className="font-display text-3xl leading-none text-primary">в 2,2 раза</div>
              <div className="mt-2 text-sm text-muted-foreground">
                разница в цене литра бензина и газа сегодня
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-xl bg-secondary p-6 sm:p-7">
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Хотите узнать, сколько именно сэкономит ваша машина? Подставьте свой пробег и расход —
              расчёт займёт полминуты.
            </p>
            <Button
              size="lg"
              onClick={scrollToCalc}
              className="h-14 rounded-lg px-8 font-display text-base tracking-normal"
            >
              <Icon name="Calculator" size={18} className="mr-2" />
              Рассчитать мою экономию
            </Button>
          </div>
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Icon name="Info" size={14} className="mt-0.5 shrink-0" />
          Цены усреднены по данным АЗС и могут отличаться в вашем регионе. Расчёт стоимости 1000 км
          сделан для среднего легкового автомобиля.
        </p>
      </div>
    </section>
  );
};

export default FuelPrices;