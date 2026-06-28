import Section from "@/components/primitives/Section";
import Button from "@/components/primitives/Button";

export default function CTA() {
  return (
    <Section className="border-t border-border">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-[18ch] font-display text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
          Let&apos;s build something that outlives the trend cycle.
        </h2>
        <Button href="/contact">Start a project →</Button>
      </div>
    </Section>
  );
}
