import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionHeading from './SectionHeading';

const IMG =
  'https://cdn.poehali.dev/projects/d64e9949-6407-4a4a-9a06-e202827e2a46/files/9de17c16-2617-4cb8-9c6c-27394f1b16f9.jpg';

const KITS = [
  {
    key: 'brc',
    brand: 'BRC Sequent',
    country: 'Италия',
    gen: '4 поколение',
    lead: 'Эталон для атмосферных и турбированных моторов с распределённым впрыском.',
    points: [
      'Редуктор Genius MB с подогревом от системы охлаждения',
      'Форсунки BRC BlueBox — отклик как у бензиновых',
      'Автопереход на газ по температуре мотора',
      'Ресурс до 250 000 км без вскрытия',
    ],
    fit: 'Lada, Kia, Hyundai, Toyota, Volkswagen, Skoda',
  },
  {
    key: 'landi',
    brand: 'Landi Renzo Omegas',
    country: 'Италия',
    gen: '4 поколение',
    lead: 'Тонкая настройка под капризные ЭБУ и моторы с изменяемыми фазами.',
    points: [
      'Диагностика по OBD-II в реальном времени',
      'Корректная работа с адаптацией штатного ЭБУ',
      'Мягкий старт и переключение без провала',
      'Итальянская электроника с влагозащитой',
    ],
    fit: 'Mazda, Nissan, Ford, Renault, Chery, Haval',
  },
  {
    key: 'digitronic',
    brand: 'Digitronic Maxi 2',
    country: 'Италия / Турция',
    gen: '4 поколение',
    lead: 'Рабочая лошадка для такси и коммерческого пробега — ремонтопригодна и недорога.',
    points: [
      'Простая перенастройка в любом сервисе',
      'Запчасти есть в наличии по всей сети',
      'Устойчива к плохому газу с трассовых АГЗС',
      'Оптимальна при пробеге от 4 000 км в месяц',
    ],
    fit: 'Такси, каршеринг, Газель, УАЗ, микроавтобусы',
  },
  {
    key: 'direct',
    brand: 'Prins VSI-2.0 DI',
    country: 'Нидерланды',
    gen: '5 поколение',
    lead: 'Для моторов с непосредственным впрыском — TSI, GDI, TFSI, SkyActiv.',
    points: [
      'Сохраняет заводскую подачу бензина для смазки',
      'Держит турбонаддув без потери мощности',
      'Работает в паре со штатной диагностикой',
      'Официальная гарантия производителя',
    ],
    fit: 'VW TSI, Audi TFSI, Kia GDI, BMW, Mercedes',
  },
];

const Equipment = () => (
  <section
    id="equipment"
    className="relative scroll-mt-20 border-y border-border bg-card/40 py-24 sm:py-32"
  >
    <div className="container px-5 sm:px-8">
      <SectionHeading
        eyebrow="Оборудование"
        title={
          <>
            Ставим только то,
            <br />
            что <span className="text-primary">чиним сами</span>
          </>
        }
        description="Четыре линейки закрывают почти любой автомобиль на дорогах России. Мастер подбирает комплект под мотор, а не под то, что осталось на складе."
      />

      <Tabs defaultValue="brc" className="mt-14">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          {KITS.map((k) => (
            <TabsTrigger
              key={k.key}
              value={k.key}
              className="border border-border px-5 py-3 font-display text-sm uppercase tracking-[0.12em] text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {k.brand}
            </TabsTrigger>
          ))}
        </TabsList>

        {KITS.map((k) => (
          <TabsContent key={k.key} value={k.key} className="mt-10 animate-fade-in">
            <div className="grid gap-px border border-border bg-border lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-background p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
                    {k.gen}
                  </span>
                  <span className="border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {k.country}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-4xl uppercase leading-none">{k.brand}</h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{k.lead}</p>

                <ul className="mt-8 space-y-4">
                  {k.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm leading-relaxed">
                      <Icon name="Check" size={17} className="mt-0.5 shrink-0 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-border pt-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Чаще всего ставим на
                  </div>
                  <div className="mt-2 font-display text-lg uppercase tracking-wide text-foreground">
                    {k.fit}
                  </div>
                </div>
              </div>

              <div className="relative min-h-[280px] overflow-hidden bg-background">
                <img
                  src={IMG}
                  alt={`Оборудование ГБО ${k.brand}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  </section>
);

export default Equipment;
