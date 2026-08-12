import Icon from '@/components/ui/icon';
import SectionHeading from './SectionHeading';

const ADVANTAGES = [
  {
    icon: 'ShieldCheck',
    title: 'Гарантия 3 года',
    text: 'На работы и оборудование. Гарантия действует в любом центре сети «Газ-Он» — от Калининграда до Владивостока.',
  },
  {
    icon: 'FileCheck2',
    title: 'Регистрация в ГИБДД',
    text: 'Берём на себя весь пакет: испытательная лаборатория, протокол, свидетельство и отметка в СТС. Вам — только приехать.',
  },
  {
    icon: 'Timer',
    title: 'Один день в боксе',
    text: 'Машину сдаёте утром — забираете вечером уже настроенной. Легковые — 6–8 часов, коммерческий транспорт — до 2 дней.',
  },
  {
    icon: 'Cpu',
    title: 'Оборудование 4–5 поколения',
    text: 'Итальянские редукторы и форсунки BRC, Landi Renzo, Digitronic. Электроника не конфликтует со штатным ЭБУ.',
  },
  {
    icon: 'Wrench',
    title: 'Собственный сервис',
    text: 'Диагностика, перенастройка, переосвидетельствование баллона — всё в своих боксах, без посредников и «дружественных» СТО.',
  },
  {
    icon: 'Wallet',
    title: 'Рассрочка 0%',
    text: 'Комплект под ключ можно разбить на 6 платежей без переплаты. Часто платёж выходит меньше, чем экономия на топливе.',
  },
];

const About = () => (
  <section id="about" className="relative scroll-mt-20 py-24 sm:py-32">
    <div className="container px-5 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <SectionHeading
          eyebrow="О сети"
          title={
            <>
              Ставим газ так,
              <br />
              будто ставим <span className="text-primary">себе</span>
            </>
          }
        />
        <p className="text-base leading-relaxed text-muted-foreground lg:pb-2">
          «Газ-Он» вырос из одного бокса в 2014 году в федеральную сеть установочных центров.
          Мы не продаём «комплект в багажник» — мы отвечаем за машину целиком: подбираем оборудование
          под конкретный мотор, прописываем прошивку, проверяем состав смеси на стенде и сдаём
          автомобиль с документами, готовыми к техосмотру.
        </p>
      </div>

      <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {ADVANTAGES.map((a) => (
          <article
            key={a.title}
            className="group relative bg-background p-8 transition-colors duration-300 hover:bg-card"
          >
            <div className="flex h-12 w-12 items-center justify-center border border-border text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon name={a.icon} size={22} />
            </div>
            <h3 className="mt-6 font-display text-xl uppercase tracking-wide">{a.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default About;
