import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import SectionHeading from './SectionHeading';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
};

const PLANS = [
  {
    name: 'Городской',
    price: '39 900',
    old: '46 000',
    lead: '4-цилиндровые атмосферные моторы до 2.0 л',
    features: [
      'Комплект Digitronic Maxi 2',
      'Тороидальный баллон 42 л в нишу запаски',
      'ВЗУ под лючок бензобака',
      'Настройка и обкатка',
      'Гарантия 2 года',
    ],
    accent: false,
  },
  {
    name: 'Оптимальный',
    price: '54 900',
    old: '63 000',
    lead: 'Самый частый выбор: седаны, кроссоверы, семейные авто',
    features: [
      'Комплект BRC Sequent или Landi Renzo',
      'Баллон 50–65 л на выбор',
      'Мультиклапан с классом А',
      'Пакет документов для ГИБДД под ключ',
      'Первое ТО бесплатно',
      'Гарантия 3 года',
    ],
    accent: true,
  },
  {
    name: 'Турбо и Direct',
    price: 'от 89 900',
    old: null,
    lead: 'Непосредственный впрыск, наддув, 6–8 цилиндров',
    features: [
      'Комплект Prins VSI-2.0 DI, 5 поколение',
      'Индивидуальная карта под мотор',
      'Усиленные магистрали и крепёж',
      'Замеры на стенде до и после',
      'Документы и регистрация',
      'Гарантия 3 года',
    ],
    accent: false,
  },
];

const EXTRA = [
  { label: 'Диагностика и подбор комплекта', price: 'Бесплатно' },
  { label: 'Пакет документов и регистрация в ГИБДД', price: '9 500 ₽' },
  { label: 'ТО газовой системы (фильтры, настройка)', price: '3 200 ₽' },
  { label: 'Переосвидетельствование баллона', price: '4 800 ₽' },
  { label: 'Перенос ГБО на другой автомобиль', price: 'от 18 000 ₽' },
  { label: 'Демонтаж с восстановлением салона', price: 'от 7 000 ₽' },
];

const Prices = () => (
  <section id="prices" className="relative scroll-mt-20 py-24 sm:py-32">
    <div className="container px-5 sm:px-8">
      <SectionHeading
        eyebrow="Цены"
        title={
          <>
            Смета <span className="text-primary">под ключ</span>,
            <br />
            без сюрпризов
          </>
        }
        description="В стоимость уже входят оборудование, работа, расходники и настройка. Цену фиксируем в заказ-наряде до начала монтажа."
      />

      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <article
            key={p.name}
            className={`relative flex flex-col rounded-2xl p-8 sm:p-10 ${
              p.accent
                ? 'bg-primary text-primary-foreground shadow-[0_24px_50px_-18px_rgba(4,96,205,0.6)]'
                : 'border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)]'
            }`}
          >
            {p.accent && (
              <span className="absolute right-8 top-8 border border-primary-foreground/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]">
                Хит
              </span>
            )}
            <h3 className="font-display text-2xl tracking-wide">{p.name}</h3>
            <p
              className={`mt-3 text-sm leading-relaxed ${
                p.accent ? 'opacity-80' : 'text-muted-foreground'
              }`}
            >
              {p.lead}
            </p>

            <div className="mt-8 flex items-end gap-3">
              <span className="font-display text-5xl leading-none">{p.price}</span>
              <span className="pb-1 font-display text-2xl">₽</span>
              {p.old && (
                <span
                  className={`pb-2 text-sm line-through ${
                    p.accent ? 'opacity-60' : 'text-muted-foreground'
                  }`}
                >
                  {p.old} ₽
                </span>
              )}
            </div>

            <ul className="mt-8 flex-1 space-y-3.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm leading-relaxed">
                  <Icon
                    name="Check"
                    size={16}
                    className={`mt-0.5 shrink-0 ${p.accent ? '' : 'text-primary'}`}
                  />
                  <span className={p.accent ? '' : 'text-muted-foreground'}>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => scrollTo('contacts')}
              variant={p.accent ? 'secondary' : 'outline'}
              size="lg"
              className={`mt-9 h-14 w-full rounded-lg font-display tracking-normal ${
                p.accent ? '' : 'border-border hover:border-primary hover:text-primary'
              }`}
            >
              Выбрать комплект
            </Button>
          </article>
        ))}
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {EXTRA.map((e) => (
          <div
            key={e.label}
            className="flex items-center justify-between gap-6 rounded-xl border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] px-6 py-5 transition-colors hover:bg-secondary"
          >
            <span className="text-sm text-muted-foreground">{e.label}</span>
            <span className="shrink-0 font-display text-lg tracking-wide text-primary">
              {e.price}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-8 flex items-start gap-2.5 text-sm text-muted-foreground">
        <Icon name="CreditCard" size={17} className="mt-0.5 shrink-0 text-primary" />
        Доступна рассрочка на 6 месяцев без переплаты и оплата от юрлица с НДС.
      </p>
    </div>
  </section>
);

export default Prices;