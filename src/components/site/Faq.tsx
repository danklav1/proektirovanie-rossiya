import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import SectionHeading from './SectionHeading';

const ITEMS = [
  {
    q: 'ГБО убивает двигатель?',
    a: 'Нет, если оборудование подобрано под мотор и настроено. Газ горит чище бензина: меньше нагара на поршнях и свечах, масло дольше остаётся чистым. Мы обязательно проверяем состояние клапанов и при необходимости ставим вариатор угла опережения зажигания — именно он снимает риск прогара на высоких оборотах.',
  },
  {
    q: 'Машина потеряет в мощности?',
    a: 'На оборудовании 4-го поколения потеря составляет 2–4% и на дороге не ощущается. На комплектах 5-го поколения для турбомоторов мощность сохраняется полностью. После установки мы катаем автомобиль и доводим карту до состояния, когда переход на газ не чувствуется вообще.',
  },
  {
    q: 'Сколько занимает регистрация в ГИБДД?',
    a: 'В среднем 5–10 дней. Мы готовим протокол испытательной лаборатории, заявление-декларацию и свидетельство о соответствии конструкции. Вам остаётся приехать в отделение на осмотр и получить обновлённое СТС. Всё сопровождение входит в пакет документов.',
  },
  {
    q: 'Багажник займёт баллон?',
    a: 'Для большинства легковых мы ставим тороидальный баллон в нишу запасного колеса — багажник остаётся свободным, запаску меняем на докатку или ремкомплект. Цилиндрический баллон большего объёма ставим только на коммерческий транспорт и по вашему согласию.',
  },
  {
    q: 'Что с гарантией на новый автомобиль?',
    a: 'По закону установка ГБО не лишает гарантии на автомобиль целиком — дилер может отказать только по узлам, связанным с топливной системой. Мы выдаём полный пакет документов и сертификаты на оборудование, чтобы вопросов у дилера не возникало.',
  },
  {
    q: 'Как часто обслуживать газовую систему?',
    a: 'Раз в 10 000 км — замена фильтров и проверка настроек, это около часа. Раз в 5 лет — переосвидетельствование баллона. Первое ТО через 1000 км после установки делаем бесплатно в любом центре сети.',
  },
  {
    q: 'Работаете с юрлицами и автопарками?',
    a: 'Да, это существенная часть наших заказов. Оформляем договор, работаем по безналу с НДС, даём объёмные скидки от 3 машин и можем выстроить график перевода парка так, чтобы техника не простаивала.',
  },
];

const Faq = () => (
  <section id="faq" className="relative scroll-mt-20 py-16 sm:py-24 lg:py-32">
    <div className="container px-5 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            eyebrow="Вопросы"
            title={
              <>
                Что спрашивают
                <br />
                <span className="text-primary">чаще всего</span>
              </>
            }
            description="Собрали то, о чём владельцы спрашивают в первые пять минут разговора."
          />
          <a
            href="tel:+79080048080"
            className="mt-9 inline-flex items-center gap-3 border border-border px-6 py-4 transition-colors hover:border-primary hover:text-primary"
          >
            <Icon name="PhoneCall" size={18} />
            <span className="font-display text-lg tracking-wide">8 (908) 004-80-80</span>
          </a>
        </div>

        <Accordion type="single" collapsible className="w-full border-t border-border">
          {ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`i${i}`} className="border-b border-border">
              <AccordionTrigger className="py-6 text-left font-display text-lg leading-snug tracking-wide hover:text-primary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default Faq;
