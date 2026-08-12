interface Props {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
}

const SectionHeading = ({ eyebrow, title, description, align = 'left' }: Props) => (
  <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
    <div
      className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}
    >
      <span className="h-px w-8 bg-primary" />
      <span className="text-[11px] uppercase tracking-[0.26em] text-primary">{eyebrow}</span>
    </div>
    <h2 className="mt-5 font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl">
      {title}
    </h2>
    {description && (
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>
    )}
  </div>
);

export default SectionHeading;
