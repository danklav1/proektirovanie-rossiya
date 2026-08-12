import Icon from '@/components/ui/icon';
import SectionHeading from './SectionHeading';

const STEPS = [
  {
    n: '01',
    time: '20 минут',
    title: 'Диагностика и подбор',
    text: 'Мастер смотрит мотор, тип впрыска и свободное место под баллон. На выходе — точная смета без «вылезших» работ.',
    icon: 'Stethoscope',
  },
  {
    n: '02',
    time: '1 день',
    title: 'Монтаж комплекта',
    text: 'Ставим редуктор, рампу форсунок, баллон и ВЗУ. Магистрали убираем в защиту, проводку — в штатные косы.',
    icon: 'Wrench',
  },
  {
    n: '03',
    time: '1–2 часа',
    title: 'Настройка и обкатка',
    text: 'Прописываем карту газа на ноутбуке, катаем по городу и трассе, доводим состав смеси до заводского.',
    icon: 'SlidersHorizontal',
  },
  {
    n: '04',
    time: '5–10 дней',
    title: 'Документы и ГИБДД',
    text: 'Готовим протокол лаборатории, свидетельство о соответствии и вносим изменения в СТС. Работаем по 413-му приказу.',
    icon: 'FileCheck2',
  },
  {
    n: '05',
    time: 'Всегда',
    title: 'Сервис и гарантия',
    text: 'Первое ТО через 1000 км — бесплатно. Дальше обслуживание раз в 10 000 км в любом центре сети.',
    icon: 'LifeBuoy',
  },
];

const Process = () => (
  <section id="process" className="relative scroll-mt-20 py-24 sm:py-32">
    <div className="container px-5 sm:px-8">
      <SectionHeading
        eyebrow="Как проходит"
        title={
          <>
            От записи до отметки
            <br />
            в <span className="text-primary">СТС</span>
          </>
        }
        description="Пять шагов, за которые машина переезжает на газ. Каждый этап фиксируем в заказ-наряде — вы всегда видите, что уже сделано."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s) => (
          <article key={s.n} className="group relative rounded-xl border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] p-7 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_-14px_rgba(16,42,86,0.28)]">
            <div className="flex items-center justify-between">
              <span className="font-display text-5xl leading-none text-border transition-colors duration-300 group-hover:text-primary">
                {s.n}
              </span>
              <Icon name={s.icon} size={22} className="text-primary" />
            </div>
            <div className="mt-6 inline-block rounded-full bg-secondary px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
              {s.time}
            </div>
            <h3 className="mt-4 font-display text-lg leading-tight tracking-wide">
              {s.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Process;
