import Icon from '@/components/ui/icon';

const go = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
};

const LINKS = [
  { id: 'about', label: 'О сети' },
  { id: 'calc', label: 'Расчёт выгоды' },
  { id: 'process', label: 'Как проходит' },
  { id: 'equipment', label: 'Оборудование' },
  { id: 'prices', label: 'Цены' },
  { id: 'faq', label: 'Вопросы' },
];

const Footer = () => (
  <footer className="relative grain border-t border-border bg-background">
    <div className="container px-5 py-16 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center bg-primary text-primary-foreground">
              <Icon name="Flame" size={22} strokeWidth={2.4} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-2xl font-semibold uppercase tracking-[0.14em]">
                Газ<span className="text-primary">-</span>Он
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                ГБО нового поколения
              </span>
            </span>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Федеральная сеть центров установки газобаллонного оборудования. Работаем с 2014 года,
            38 центров, официальная регистрация переоборудования в ГИБДД.
          </p>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Разделы</div>
          <ul className="mt-5 space-y-3">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary">Контакты</div>
          <a
            href="tel:+79080048080"
            className="mt-5 block font-display text-2xl tracking-wide transition-colors hover:text-primary"
          >
            8 (908) 004-80-80
          </a>
          <a
            href="mailto:zayavka@gaz-on.ru"
            className="mt-3 block text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            zayavka@gaz-on.ru
          </a>
          <div className="mt-3 text-sm text-muted-foreground">Ежедневно, 8:00–21:00 МСК</div>
          <button
            onClick={() => go('contacts')}
            className="mt-6 inline-flex items-center gap-2 border border-border px-5 py-3 text-sm uppercase tracking-[0.12em] transition-colors hover:border-primary hover:text-primary"
          >
            <Icon name="CalendarCheck" size={16} /> Записаться
          </button>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Газ-Он. Все права защищены.</span>
        <span>Информация на сайте не является публичной офертой.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
