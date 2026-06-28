import { people } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import ImageSlot from "@/components/primitives/ImageSlot";

export default function People() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {people.map((p, i) => (
        <Reveal key={`${p.name}-${i}`} delay={i * 0.05}>
          <div>
            <ImageSlot label={p.name} ratio="1/1" />
            <h3 className="mt-4 font-display text-lg tracking-[-0.02em] text-ink">{p.name}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-grey">{p.role}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
