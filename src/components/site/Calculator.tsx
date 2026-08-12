import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import SectionHeading from './SectionHeading';

const PETROL_PRICE = 62;
const GAS_PRICE = 28;
const KIT_PRICE = 46000;

const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n));

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
};

const Calculator = () => {
  const [km, setKm] = useState(2000);
  const [rate, setRate] = useState(11);

  const data = useMemo(() => {
    const gasRate = rate * 1.13;
    const petrolMonth = (km / 100) * rate * PETROL_PRICE;
    const gasMonth = (km / 100) * gasRate * GAS_PRICE;
    const save = petrolMonth - gasMonth;
    const payback = save > 0 ? KIT_PRICE / save : 0;
    return {
      petrolMonth,
      gasMonth,
      save,
      saveYear: save * 12,
      payback,
      percent: petrolMonth > 0 ? (save / petrolMonth) * 100 : 0,
    };
  }, [km, rate]);

  return (
    <section id="calc" className="relative scroll-mt-20 overflow-hidden border-y border-border bg-secondary/40 py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-20 top-0 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="container relative px-5 sm:px-8">
        <SectionHeading
          eyebrow="Расчёт выгоды"
          title={
            <>
              Посчитайте, сколько
              <br />
              <span className="text-primary">сгорает впустую</span>
            </>
          }
          description="Двигайте ползунки под свой режим езды. Расчёт по средним ценам: бензин АИ-95 — 62 ₽/л, пропан — 28 ₽/л, поправка на расход газа +13%."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] p-8 sm:p-10">
            <div className="space-y-12">
              <div>
                <div className="flex items-end justify-between gap-4">
                  <label className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                    Пробег в месяц
                  </label>
                  <span className="font-display text-3xl leading-none text-primary">
                    {fmt(km)} <span className="text-lg text-muted-foreground">км</span>
                  </span>
                </div>
                <Slider
                  value={[km]}
                  onValueChange={(v) => setKm(v[0])}
                  min={200}
                  max={8000}
                  step={100}
                  className="mt-6"
                />
                <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>200 км</span>
                  <span>8 000 км</span>
                </div>
              </div>

              <div>
                <div className="flex items-end justify-between gap-4">
                  <label className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                    Расход бензина
                  </label>
                  <span className="font-display text-3xl leading-none text-primary">
                    {rate.toFixed(1)} <span className="text-lg text-muted-foreground">л / 100 км</span>
                  </span>
                </div>
                <Slider
                  value={[rate]}
                  onValueChange={(v) => setRate(v[0])}
                  min={5}
                  max={25}
                  step={0.5}
                  className="mt-6"
                />
                <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>5 л</span>
                  <span>25 л</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-secondary p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Сейчас на бензине
                  </div>
                  <div className="mt-2 font-display text-2xl text-foreground/70 line-through decoration-destructive decoration-2">
                    {fmt(data.petrolMonth)} ₽
                  </div>
                </div>
                <div className="rounded-xl bg-secondary p-5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Станет на газу
                  </div>
                  <div className="mt-2 font-display text-2xl text-primary">
                    {fmt(data.gasMonth)} ₽
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-primary p-8 text-primary-foreground shadow-[0_24px_50px_-18px_rgba(4,96,205,0.6)] sm:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-[0.09] grid-lines" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.24em] opacity-70">
                Экономия в месяц
              </div>
              <div className="mt-3 font-display text-6xl leading-none sm:text-7xl">
                {fmt(data.save)} ₽
              </div>

              <div className="mt-10 space-y-2">
                <div className="flex items-center justify-between gap-4 rounded-lg bg-white/12 px-5 py-4">
                  <span className="text-sm uppercase tracking-[0.14em] opacity-80">За год</span>
                  <span className="font-display text-2xl">{fmt(data.saveYear)} ₽</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg bg-white/12 px-5 py-4">
                  <span className="text-sm uppercase tracking-[0.14em] opacity-80">
                    Топливо дешевле на
                  </span>
                  <span className="font-display text-2xl">{Math.round(data.percent)}%</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg bg-white/12 px-5 py-4">
                  <span className="text-sm uppercase tracking-[0.14em] opacity-80">
                    Окупаемость комплекта
                  </span>
                  <span className="font-display text-2xl">
                    {data.payback > 0 && data.payback < 60 ? `${data.payback.toFixed(1)} мес.` : '—'}
                  </span>
                </div>
              </div>

              <p className="mt-8 flex items-start gap-2.5 text-sm leading-relaxed opacity-80">
                <Icon name="Info" size={17} className="mt-0.5 shrink-0" />
                Расчёт ориентировочный. Точную смету по вашему мотору мастер назовёт после
                бесплатной диагностики — она занимает 20 минут.
              </p>

              <Button
                onClick={() => scrollTo('contacts')}
                variant="secondary"
                size="lg"
                className="mt-8 h-14 w-full rounded-lg font-display text-base tracking-normal"
              >
                Зафиксировать цену
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
