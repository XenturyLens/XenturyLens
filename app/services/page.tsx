import type { Metadata } from "next";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import ServiceList from "@/components/sections/ServiceList";
import ProcessSteps from "@/components/sections/ProcessSteps";

export const metadata: Metadata = {
  title: "Services",
  description: "How we build. One team, end to end.",
};

export default function ServicesPage() {
  return (
    <main>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>How we build</Eyebrow>
        <h1 className="mt-6 max-w-[16ch] font-display text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          How we build.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          One team, end to end — from the first question to the products that outlast us. No hand-offs, no dilution.
        </p>
      </Section>
      <Section className="pt-0"><ServiceList /></Section>
      <Section className="bg-surface-2">
        <Eyebrow>The process</Eyebrow>
        <div className="mt-12"><ProcessSteps /></div>
      </Section>
    </main>
  );
}
