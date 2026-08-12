import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV = [
  { id: 'about', label: 'О сети' },
  { id: 'fuel', label: 'Цены на топливо' },
  { id: 'calc', label: 'Расчёт выгоды' },
  { id: 'process', label: 'Как проходит' },
  { id: 'equipment', label: 'Оборудование' },
  { id: 'works', label: 'Наши работы' },
  { id: 'prices', label: 'Цены' },
  { id: 'business', label: 'Бизнесу' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'booking', label: 'Запись' },
  { id: 'contacts', label: 'Контакты' },
];

const MOBILE_NAV = [
  { id: 'process', label: 'Установка ГБО', icon: 'Wrench', hint: 'Как проходит и что входит' },
  { id: 'prices', label: 'Цены', icon: 'Tag', hint: 'Стоимость комплектов' },
  { id: 'works', label: 'Наши работы', icon: 'Images', hint: 'Фото из боксов сети' },
  { id: 'reviews', label: 'Отзывы', icon: 'Star', hint: '4.9 из 5 · 2 400+ отзывов' },
  { id: 'booking', label: 'Запись', icon: 'CalendarDays', hint: 'Онлайн на 14 дней вперёд' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-white/95 text-foreground shadow-[0_6px_24px_-16px_rgba(16,42,86,0.6)] backdrop-blur-md'
          : 'border-b border-white/10 bg-transparent text-white'
      }`}
    >
      <div className="container flex h-[76px] items-center justify-between gap-6 px-5 sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 shrink-0"
          aria-label="Газ-Он, на главную"
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon name="Flame" size={22} strokeWidth={2.4} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-2xl">
              Газ<span className="text-accent">-</span>Он
            </span>
            <span className={`mt-1.5 block text-[10px] uppercase tracking-[0.2em] ${scrolled ? 'text-muted-foreground' : 'text-white/70'}`}>
              ГБО нового поколения
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-6">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`relative whitespace-nowrap text-[13px] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${
                scrolled ? 'text-muted-foreground hover:text-primary' : 'text-white/85 hover:text-white'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+79080048080"
            className={`hidden whitespace-nowrap font-display text-lg transition-colors md:block ${
              scrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-accent'
            }`}
          >
            8 (908) 004-80-80
          </a>
          <Button
            onClick={() => go('booking')}
            className="hidden rounded-lg font-display tracking-normal sm:inline-flex"
          >
            Записаться
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className={`xl:hidden ${scrolled ? '' : 'border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary'}`}
                aria-label="Меню">
                <Icon name="Menu" size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[88vw] max-w-[400px] flex-col gap-0 overflow-y-auto border-border bg-white p-0"
            >
              <div className="flex items-center gap-3 border-b border-border px-5 py-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon name="Flame" size={22} strokeWidth={2.4} />
                </span>
                <span className="leading-none">
                  <span className="block font-display text-2xl">
                    Газ<span className="text-accent">-</span>Он
                  </span>
                  <span className="mt-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    ГБО нового поколения
                  </span>
                </span>
              </div>

              <nav className="flex flex-col gap-2 px-5 py-5">
                {MOBILE_NAV.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => go(n.id)}
                    className="flex items-center gap-4 rounded-xl border border-border bg-white px-4 py-3.5 text-left transition-colors active:bg-secondary"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={n.icon} size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg leading-tight">{n.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{n.hint}</span>
                    </span>
                    <Icon
                      name="ChevronRight"
                      size={18}
                      className="ml-auto shrink-0 text-muted-foreground"
                    />
                  </button>
                ))}
              </nav>

              <div className="mt-auto border-t border-border bg-secondary/40 px-5 py-5">
                <a
                  href="tel:+79080048080"
                  className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-primary font-display text-lg text-primary-foreground"
                >
                  <Icon name="Phone" size={20} />
                  8 (908) 004-80-80
                </a>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Звоните — мастер ответит и подберёт комплект
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;