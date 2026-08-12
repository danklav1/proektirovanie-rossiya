import Icon from '@/components/ui/icon';
import SectionHeading from './SectionHeading';

const REVIEWS = [
  {
    name: 'Артём Ковалёв',
    car: 'Kia Rio 1.6, такси',
    text: 'Катаю по 5 тысяч км в месяц. Комплект отбился за четыре месяца, дальше уже чистый плюс в кармане. Настроили так, что переход на газ вообще не чувствуется.',
    city: 'Екатеринбург',
  },
  {
    name: 'Ирина Мельникова',
    car: 'Skoda Octavia 1.8 TSI',
    text: 'Боялась ставить на турбо с прямым впрыском, отговаривали все. В «Газ-Оне» показали замеры до и после — мощность на месте, расход по деньгам упал вдвое.',
    city: 'Казань',
  },
  {
    name: 'Сергей Дубов',
    car: 'ГАЗель Next, доставка',
    text: 'Две машины в парке перевёл на газ. Документы сделали сами, я только приехал в ГИБДД поставить отметку. По топливу выходит минус 60 тысяч в месяц на парк.',
    city: 'Нижний Новгород',
  },
  {
    name: 'Дмитрий Хайруллин',
    car: 'Toyota Land Cruiser 200',
    text: 'Ставил на большой V8, расход был просто больной. Теперь заправка стоит как у соседского седана. Баллон убрали аккуратно, багажник почти не потерял.',
    city: 'Уфа',
  },
];

const Reviews = () => (
  <section className="relative border-y border-border bg-secondary/40 py-24 sm:py-32">
    <div className="container px-5 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <SectionHeading
          eyebrow="Отзывы"
          title={
            <>
              Говорят
              <br />
              <span className="text-primary">владельцы</span>
            </>
          }
        />
        <div className="flex flex-wrap items-center gap-8 lg:justify-end lg:pb-2">
          <div>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Icon key={i} name="Star" size={18} className="fill-primary text-primary" />
              ))}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">4.9 из 5 — Яндекс Карты</div>
          </div>
          <div className="border-l border-border pl-8">
            <div className="font-display text-3xl text-primary">2 400+</div>
            <div className="mt-1 text-sm text-muted-foreground">отзывов по сети</div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {REVIEWS.map((r) => (
          <article key={r.name} className="group rounded-xl border border-border bg-white shadow-[0_4px_24px_-8px_rgba(16,42,86,0.14)] p-8 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_-14px_rgba(16,42,86,0.28)]">
            <Icon name="Quote" size={26} className="text-primary/40" />
            <p className="mt-5 text-base leading-relaxed text-foreground/90">{r.text}</p>
            <div className="mt-7 flex items-center gap-4 border-t border-border pt-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/15 font-display text-lg text-primary">
                {r.name.charAt(0)}
              </div>
              <div>
                <div className="font-display text-base uppercase tracking-wide">{r.name}</div>
                <div className="text-xs text-muted-foreground">
                  {r.car} · {r.city}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
