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
      <span className="rounded-full bg-secondary px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </span>
    </div>
    <h2 className="mt-5 font-display text-3xl leading-[1.12] sm:text-[2.6rem]">
      {title}
    </h2>
    {description && (
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>
    )}
  </div>
);

export default SectionHeading;