import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/d64e9949-6407-4a4a-9a06-e202827e2a46/files/0a6fcc07-c8f3-4ad7-9dfa-e4d1560cf650.jpg';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
  }
};

const STATS = [
  { value: '38', label: 'центров в России' },
  { value: '1 день', label: 'на установку' },
  { value: '3 года', label: 'гарантия на работы' },
  { value: '19 000+', label: 'машин на газу' },
];

const BADGES = [
  { icon: 'PiggyBank', value: 'до 165 000 ₽', text: 'экономии в год' },
  { icon: 'CalendarCheck', value: 'от 4 месяцев', text: 'окупаемость ГБО' },
  { icon: 'Clock', value: 'от 5 часов', text: 'на установку' },
];

const Hero = () => {
  return (
    <section className="relative">
      <div className="relative overflow-hidden pt-[76px]">
        <img
          src={HERO_IMG}
          alt="Установка ГБО в центре Газ-Он"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1a2fF2] via-[#0b1a2fD9] to-[#0b1a2f99]" />

        <div className="container relative px-5 pb-24 pt-14 sm:px-8 lg:pb-32 lg:pt-20">
          <div className="max-w-2xl text-white">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/85">
                Федеральная сеть · 38 городов
              </span>
            </div>

            <h1 className="font-display text-[32px] leading-[1.1] sm:text-5xl lg:text-6xl">
              Установка <span className="text-accent">ГБО</span> нового поколения
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              «Газ-Он» — сеть центров установки газового оборудования. Итальянские комплекты,
              монтаж за один день и официальная регистрация в ГИБДД под ключ. Расходы на топливо
              падают вдвое уже в день выезда из бокса.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => scrollTo('contacts')}
                className="h-14 rounded-lg px-8 font-display text-base tracking-normal shadow-[0_14px_34px_-12px_rgba(4,96,205,0.9)]"
              >
                Записаться на установку
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo('calc')}
                className="h-14 rounded-lg border-white/40 bg-white/5 px-8 font-display text-base tracking-normal text-white backdrop-blur-sm hover:bg-white hover:text-primary"
              >
                <Icon name="Calculator" size={18} className="mr-2" />
                Рассчитать выгоду
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/15 pt-8 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl leading-none text-accent">{s.value}</div>
                  <div className="mt-2 text-xs leading-snug text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 -mt-12 px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {BADGES.map((b) => (
            <div
              key={b.value}
              className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-[0_12px_34px_-14px_rgba(16,42,86,0.35)]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon name={b.icon} size={22} />
              </span>
              <div>
                <div className="font-display text-lg leading-none text-primary">{b.value}</div>
                <div className="mt-1.5 text-sm text-muted-foreground">{b.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden border-y border-border bg-secondary py-3.5">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10">
              {[
                'BRC Италия',
                'Landi Renzo',
                'Официальная регистрация ГИБДД',
                'Digitronic',
                'Гарантия 3 года',
                'Атлас баллоны',
                'Установка за 1 день',
                'Рассрочка 0%',
              ].map((t) => (
                <span
                  key={t + k}
                  className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground"
                >
                  <Icon name="Hexagon" size={12} className="text-primary" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;