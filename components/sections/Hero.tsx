import { hero } from "@/lib/content";
import Eyebrow from "@/components/primitives/Eyebrow";
import Button from "@/components/primitives/Button";
import Aurora from "@/components/Aurora";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Aurora />
      <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-ink md:text-7xl lg:text-[88px]">
          {hero.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">{hero.body}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="ghost">{hero.secondaryCta.label}</Button>
        </div>
      </div>
    </section>
  );
}
