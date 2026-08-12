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
  { id: 'faq', label: 'Вопросы' },
  { id: 'contacts', label: 'Контакты' },
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
            onClick={() => go('contacts')}
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
            <SheetContent side="right" className="w-[300px] border-border bg-white">
              <div className="mt-10 flex flex-col gap-1">
                {NAV.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => go(n.id)}
                    className="border-b border-border/70 py-3.5 text-left font-display text-lg text-foreground transition-colors hover:text-primary"
                  >
                    {n.label}
                  </button>
                ))}
                <a
                  href="tel:+79080048080"
                  className="mt-6 flex items-center gap-2 font-display text-xl text-primary"
                >
                  <Icon name="Phone" size={18} />
                  8 (908) 004-80-80
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;