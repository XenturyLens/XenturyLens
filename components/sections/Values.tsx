import { values } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";

export default function Values() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {values.map((v, i) => (
        <Reveal key={v.title} delay={i * 0.05}>
          <div className="rounded-2xl border border-border p-8">
            <h3 className="font-display text-xl tracking-[-0.02em] text-ink">{v.title}</h3>
            <p className="mt-3 text-ink-soft">{v.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
