import { services } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";

export default function ServiceList() {
  return (
    <div className="divide-y divide-border border-y border-border">
      {services.map((s, i) => (
        <Reveal key={s.no} delay={i * 0.04}>
          <div className="grid gap-4 py-10 md:grid-cols-[120px_1fr] md:py-12">
            <span className="font-mono text-sm text-grey">{s.no}</span>
            <div>
              <h3 className="font-display text-2xl tracking-[-0.02em] text-ink md:text-3xl">{s.title}</h3>
              <p className="mt-3 max-w-2xl text-ink-soft">{s.body}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
