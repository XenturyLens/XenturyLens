import { process } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";

export default function ProcessSteps() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
      {process.map((p, i) => (
        <Reveal key={p.no} delay={i * 0.05}>
          <div className="h-full bg-surface p-8">
            <span className="font-mono text-xs text-grey">{p.no}</span>
            <h3 className="mt-4 font-display text-xl tracking-[-0.02em] text-ink">{p.title}</h3>
            <p className="mt-3 text-sm text-ink-soft">{p.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
