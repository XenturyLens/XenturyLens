import Link from "next/link";
import { work } from "@/lib/content";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/primitives/Reveal";
import ImageSlot from "@/components/primitives/ImageSlot";

export default function SelectedWork() {
  return (
    <Section>
      <div className="flex items-end justify-between">
        <Eyebrow>Selected work</Eyebrow>
        <Link href="/work" className="text-sm text-ink-soft hover:text-ink transition-colors">
          View all →
        </Link>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {work.slice(0, 2).map((w, i) => (
          <Reveal key={w.slug} delay={i * 0.06}>
            <Link href="/work" className="group block">
              <ImageSlot label={w.name} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1" />
              <h3 className="mt-5 font-display text-xl tracking-[-0.02em] text-ink">{w.name}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-grey">{w.meta}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
