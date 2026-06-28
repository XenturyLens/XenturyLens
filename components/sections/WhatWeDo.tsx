import { services } from "@/lib/content";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/primitives/Reveal";

export default function WhatWeDo() {
  return (
    <Section className="border-t border-border">
      <Eyebrow>What we do</Eyebrow>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        {services.map((s, i) => (
          <Reveal key={s.no} delay={i * 0.05}>
            <div className="h-full bg-surface p-8 md:p-10">
              <span className="font-mono text-xs text-grey">{s.no}</span>
              <h3 className="mt-4 font-display text-2xl tracking-[-0.02em] text-ink">{s.title}</h3>
              <p className="mt-3 text-ink-soft">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
