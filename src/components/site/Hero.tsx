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

const Hero = () => {
  return (
    <section className="relative grain overflow-hidden pt-[76px]">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[130px] animate-glow-pulse" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="container relative px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="stagger">
            <div
              className="mb-7 inline-flex items-center gap-2.5 border border-primary/40 bg-primary/10 px-4 py-2"
              style={{ animationDelay: '0ms' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-primary">
                Федеральная сеть · 38 городов
              </span>
            </div>

            <h1
              className="font-display text-[13vw] font-bold uppercase leading-[0.88] tracking-[-0.01em] sm:text-[8.5vw] lg:text-[5.6rem]"
              style={{ animationDelay: '80ms' }}
            >
              Бензин
              <br />
              <span className="relative inline-block">
                <span className="text-muted-foreground/45 line-through decoration-accent decoration-[6px]">
                  дорожает
                </span>
              </span>
              <br />
              <span className="text-primary">вы — нет</span>
            </h1>

            <p
              className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: '160ms' }}
            >
              «Газ-Он» — сеть центров установки ГБО нового поколения. Итальянское оборудование
              5-го&nbsp;поколения, установка за один день и официальная регистрация в ГИБДД под ключ.
              Расход в деньгах падает вдвое уже в день выезда из бокса.
            </p>

            <div className="mt-9 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
              <Button
                size="lg"
                onClick={() => scrollTo('contacts')}
                className="h-14 px-8 font-display text-base uppercase tracking-[0.12em]"
              >
                Записаться на установку
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo('calc')}
                className="h-14 px-8 font-display text-base uppercase tracking-[0.12em] border-border hover:border-primary hover:text-primary"
              >
                <Icon name="Calculator" size={18} className="mr-2" />
                Рассчитать выгоду
              </Button>
            </div>

            <div
              className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-border pt-8 sm:grid-cols-4"
              style={{ animationDelay: '320ms' }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl leading-none text-primary">{s.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-scale-in" style={{ animationDelay: '200ms' }}>
            <div className="absolute -inset-3 hatch opacity-70" />
            <div className="relative overflow-hidden border border-border">
              <img
                src={HERO_IMG}
                alt="Установка ГБО в центре Газ-Он"
                className="h-[380px] w-full object-cover sm:h-[520px] lg:h-[620px]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 p-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-primary">
                    Экономия на 100 км
                  </div>
                  <div className="font-display text-5xl leading-none">до 55%</div>
                </div>
                <div className="border border-primary/40 bg-background/70 px-4 py-2.5 backdrop-blur-sm">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Окупаемость
                  </div>
                  <div className="font-display text-xl text-foreground">4–7 месяцев</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-y border-border bg-card/40 py-3.5">
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
                  className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground"
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