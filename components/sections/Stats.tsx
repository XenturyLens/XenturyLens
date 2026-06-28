import { stats } from "@/lib/content";
import Section from "@/components/primitives/Section";
import Stat from "@/components/primitives/Stat";

export default function Stats() {
  return (
    <Section className="bg-surface-2">
      <div className="grid gap-12 sm:grid-cols-3">
        {stats.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    </Section>
  );
}
