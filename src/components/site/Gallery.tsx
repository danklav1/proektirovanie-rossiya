import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SectionHeading from './SectionHeading';

const CDN = 'https://cdn.poehali.dev/projects/d64e9949-6407-4a4a-9a06-e202827e2a46/files';

const FILTERS = [
  { id: 'all', label: 'Все работы' },
  { id: 'sedan', label: 'Легковые' },
  { id: 'suv', label: 'Кроссоверы' },
  { id: 'commercial', label: 'Коммерческий транспорт' },
];

const WORKS = [
  {
    type: 'sedan',
    img: `${CDN}/6194c7b8-284d-49d4-9335-b8138a792f3c.jpg`,
    tag: 'Подкапотное пространство',
    title: 'Редуктор и рампа форсунок',
    car: 'Kia Rio 1.6, BRC Sequent',
    text: 'Редуктор закреплён на штатных точках, магистрали убраны в защитную гофру, проводка проложена вдоль заводской косы. Доступ к маслу и фильтрам не перекрыт.',
    price: '39 900 ₽',
    term: '6 часов',
  },
  {
    type: 'sedan',
    img: `${CDN}/886c487d-92db-4b71-8ff3-ef5aa83dc0d0.jpg`,
    tag: 'Багажник',
    title: 'Тороидальный баллон в нише запаски',
    car: 'Skoda Octavia, баллон 54 л',
    text: 'Баллон встал в нишу запасного колеса — пол багажника остаётся ровным, объём не теряется. Вентиляционная коробка выведена под днище по нормативу.',
    price: '54 900 ₽',
    term: '1 день',
  },
  {
    type: 'sedan',
    img: `${CDN}/84e09a9d-427a-4048-a5ae-9c0e8a5aa12c.jpg`,
    tag: 'Заправочный узел',
    title: 'ВЗУ под лючком бензобака',
    car: 'Toyota Camry, скрытый монтаж',
    text: 'Выносное заправочное устройство ставим под лючок — снаружи машина выглядит стоково. Заправка на любой газовой АЗС без переходников.',
    price: '89 900 ₽',
    term: '1 день',
  },
  {
    type: 'sedan',
    img: `${CDN}/b12449f5-7af4-4f04-82f8-19178068de30.jpg`,
    tag: 'Настройка',
    title: 'Калибровка карты газа',
    car: 'Hyundai Solaris 1.6',
    text: 'После монтажа прописываем карту под конкретный мотор и катаем машину по городу и трассе. Состав смеси доводим до заводских значений — переход на газ не чувствуется.',
    price: 'входит в комплект',
    term: '2 часа',
  },
  {
    type: 'suv',
    img: `${CDN}/cf5addfb-7f5c-4ba6-af53-1ab04b4e68d2.jpg`,
    tag: 'Подкапотное пространство',
    title: 'ГБО на большой мотор кроссовера',
    car: 'Toyota Land Cruiser 4.6 V8',
    text: 'Для V8 ставим два редуктора и усиленные магистрали. Расход по деньгам падает вдвое — на таком моторе комплект окупается быстрее всего.',
    price: '96 500 ₽',
    term: '2 дня',
  },
  {
    type: 'suv',
    img: `${CDN}/c1f9a77a-138e-4f63-9265-ffef47b004b1.jpg`,
    tag: 'Днище',
    title: 'Баллон под кузовом внедорожника',
    car: 'Mitsubishi Pajero, баллон 90 л',
    text: 'Баллон вынесен под днище в стальную защитную люльку — багажник остаётся полностью свободным. Клиренс и геометрия не пострадали.',
    price: '74 300 ₽',
    term: '1,5 дня',
  },
  {
    type: 'commercial',
    img: `${CDN}/916821ed-1b8b-4e72-8246-475499f766dd.jpg`,
    tag: 'Коммерческий транспорт',
    title: 'Цилиндрический баллон в фургоне',
    car: 'ГАЗель Next, баллон 100 л',
    text: 'Крепление на усиленных кронштейнах к силовым элементам кузова. Грузовое пространство сохранено, баллон закрыт защитой от груза.',
    price: '68 400 ₽',
    term: '2 дня',
  },
  {
    type: 'commercial',
    img: `${CDN}/f49d8bc4-0ce7-495c-af6e-f317c1abec6a.jpg`,
    tag: 'Автопарк',
    title: 'Перевод парка доставки на газ',
    car: '6 микроавтобусов, юрлицо',
    text: 'Переводили парк партиями по две машины, чтобы доставка не вставала. Все документы и регистрацию оформили одним пакетом на компанию.',
    price: 'от 61 000 ₽ / авто',
    term: '5 дней на парк',
  },
];

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [i, setI] = useState(0);

  const list = useMemo(
    () => (filter === 'all' ? WORKS : WORKS.filter((x) => x.type === filter)),
    [filter],
  );
  const w = list[Math.min(i, list.length - 1)];

  const pick = (id: string) => {
    setFilter(id);
    setI(0);
  };

  const prev = () => setI((v) => (v - 1 + list.length) % list.length);
  const next = () => setI((v) => (v + 1) % list.length);

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
            Фотографии из наших боксов: подкапотное пространство, багажник, днище и коммерческий
            транспорт. Смотрите, как мы прокладываем магистрали и крепим баллоны — по этому и
            отличается работа сервиса от гаражной установки.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {FILTERS.map((f) => {
            const count = f.id === 'all' ? WORKS.length : WORKS.filter((x) => x.type === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => pick(f.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                  filter === f.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    filter === f.id ? 'bg-white/20' : 'bg-secondary text-primary'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="relative overflow-hidden rounded-xl border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)]">
            <img
              key={w.img}
              src={w.img}
              alt={w.title}
              className="h-[380px] w-full animate-fade-in object-cover sm:h-[560px] lg:h-[700px]"
              loading="lazy"
            />
            <span className="absolute left-5 top-5 rounded-full bg-primary px-3.5 py-1.5 text-[10px] uppercase tracking-[0.14em] text-primary-foreground">
              {w.tag}
            </span>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1a2fE6] to-transparent px-6 pb-6 pt-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="text-white">
                  <div className="font-display text-2xl leading-tight">{w.title}</div>
                  <div className="mt-1.5 text-sm text-white/75">{w.car}</div>
                </div>
                <div className="flex gap-2">
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
              </div>

              <div className="mt-5 flex gap-1.5">
                {list.map((item, idx) => (
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
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-white p-8 shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] sm:p-10">
            <div className="text-sm text-muted-foreground">
              Работа {Math.min(i, list.length - 1) + 1} из {list.length}
            </div>
            <h3 className="mt-4 font-display text-2xl leading-snug">{w.title}</h3>
            <div className="mt-3 flex items-center gap-2 text-sm text-primary">
              <Icon name="Car" size={16} />
              {w.car}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{w.text}</p>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-secondary p-5">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <Icon name="Wallet" size={14} /> Стоимость
                </div>
                <div className="mt-2.5 font-display text-xl leading-tight text-primary">
                  {w.price}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">под ключ, с документами</div>
              </div>
              <div className="rounded-xl bg-secondary p-5">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <Icon name="Clock" size={14} /> Срок работ
                </div>
                <div className="mt-2.5 font-display text-xl leading-tight text-primary">
                  {w.term}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">машина в боксе</div>
              </div>
            </div>

            <div className="mt-8 max-h-[300px] space-y-3 overflow-y-auto border-t border-border pt-6">
              {list.map((item, idx) => (
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
