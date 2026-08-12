import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SectionHeading from './SectionHeading';

const WORKS = [
  {
    img: 'https://cdn.poehali.dev/projects/d64e9949-6407-4a4a-9a06-e202827e2a46/files/6194c7b8-284d-49d4-9335-b8138a792f3c.jpg',
    tag: 'Подкапотное пространство',
    title: 'Редуктор и рампа форсунок',
    car: 'Kia Rio 1.6, BRC Sequent',
    text: 'Редуктор закреплён на штатных точках, магистрали убраны в защитную гофру, проводка проложена вдоль заводской косы. Доступ к маслу и фильтрам не перекрыт.',
  },
  {
    img: 'https://cdn.poehali.dev/projects/d64e9949-6407-4a4a-9a06-e202827e2a46/files/886c487d-92db-4b71-8ff3-ef5aa83dc0d0.jpg',
    tag: 'Багажник',
    title: 'Тороидальный баллон в нише запаски',
    car: 'Skoda Octavia, баллон 54 л',
    text: 'Баллон встал в нишу запасного колеса — пол багажника остаётся ровным, объём не теряется. Вентиляционная коробка выведена под днище по нормативу.',
  },
  {
    img: 'https://cdn.poehali.dev/projects/d64e9949-6407-4a4a-9a06-e202827e2a46/files/916821ed-1b8b-4e72-8246-475499f766dd.jpg',
    tag: 'Коммерческий транспорт',
    title: 'Цилиндрический баллон в фургоне',
    car: 'ГАЗель Next, баллон 100 л',
    text: 'Крепление на усиленных кронштейнах к силовым элементам кузова. Грузовое пространство сохранено, баллон закрыт защитой от груза.',
  },
  {
    img: 'https://cdn.poehali.dev/projects/d64e9949-6407-4a4a-9a06-e202827e2a46/files/84e09a9d-427a-4048-a5ae-9c0e8a5aa12c.jpg',
    tag: 'Заправочный узел',
    title: 'ВЗУ под лючком бензобака',
    car: 'Toyota Camry, скрытый монтаж',
    text: 'Выносное заправочное устройство ставим под лючок — снаружи машина выглядит стоково. Заправка на любой газовой АЗС без переходников.',
  },
];

const Gallery = () => {
  const [i, setI] = useState(0);
  const w = WORKS[i];

  const prev = () => setI((v) => (v - 1 + WORKS.length) % WORKS.length);
  const next = () => setI((v) => (v + 1) % WORKS.length);

  const scrollToContacts = () => {
    const el = document.getElementById('contacts');
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 76,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="works" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Наши работы"
            title={
              <>
                Как выглядит
                <br />
                <span className="text-primary">аккуратный монтаж</span>
              </>
            }
          />
          <p className="text-base leading-relaxed text-muted-foreground lg:pb-2">
            Фотографии из наших боксов: подкапотное пространство, багажник, коммерческий транспорт
            и заправочный узел. Смотрите, как мы прокладываем магистрали и крепим баллоны —
            по этому и отличается работа сервиса от гаражной установки.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-xl border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)]">
            <img
              key={w.img}
              src={w.img}
              alt={w.title}
              className="h-[320px] w-full animate-fade-in object-cover sm:h-[460px] lg:h-[520px]"
              loading="lazy"
            />
            <span className="absolute left-5 top-5 rounded-full bg-primary px-3.5 py-1.5 text-[10px] uppercase tracking-[0.14em] text-primary-foreground">
              {w.tag}
            </span>

            <div className="absolute bottom-5 right-5 flex gap-2">
              <button
                onClick={prev}
                aria-label="Предыдущее фото"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Следующее фото"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </div>

            <div className="absolute bottom-7 left-5 flex gap-1.5">
              {WORKS.map((item, idx) => (
                <button
                  key={item.img}
                  onClick={() => setI(idx)}
                  aria-label={`Фото ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? 'w-7 bg-white' : 'w-3 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-white p-8 shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] sm:p-10">
            <div className="text-sm text-muted-foreground">
              Работа {i + 1} из {WORKS.length}
            </div>
            <h3 className="mt-4 font-display text-2xl leading-snug">{w.title}</h3>
            <div className="mt-3 flex items-center gap-2 text-sm text-primary">
              <Icon name="Car" size={16} />
              {w.car}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{w.text}</p>

            <div className="mt-8 space-y-3 border-t border-border pt-6">
              {WORKS.map((item, idx) => (
                <button
                  key={item.title}
                  onClick={() => setI(idx)}
                  className={`flex w-full items-center gap-4 rounded-lg p-2.5 text-left transition-colors ${
                    idx === i ? 'bg-secondary' : 'hover:bg-secondary/60'
                  }`}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-14 w-20 shrink-0 rounded-md object-cover"
                    loading="lazy"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{item.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {item.tag}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <Button
              size="lg"
              onClick={scrollToContacts}
              className="mt-8 h-14 w-full rounded-lg font-display text-base tracking-normal"
            >
              Хочу так же — записаться
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
