import { work } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import ImageSlot from "@/components/primitives/ImageSlot";

export default function WorkGrid() {
  const [featured, ...rest] = work;
  return (
    <div className="space-y-16">
      <Reveal>
        <article>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Featured · Mobility</p>
          <ImageSlot label={featured.name} ratio="21/9" className="mt-5" />
          <h2 className="mt-6 font-display text-3xl tracking-[-0.03em] text-ink md:text-4xl">{featured.name}</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">{featured.blurb}</p>
        </article>
      </Reveal>
      <div className="grid gap-10 md:grid-cols-2">
        {rest.map((w, i) => (
          <Reveal key={w.slug} delay={i * 0.06}>
            <article className="group">
              <ImageSlot label={w.name} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1" />
              <h3 className="mt-5 font-display text-xl tracking-[-0.02em] text-ink">{w.name}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-grey">{w.meta}</p>
              <p className="mt-3 text-ink-soft">{w.blurb}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
